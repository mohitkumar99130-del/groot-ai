import { GROOT_INTENTS, AssistantIntent } from '../knowledge/assistantIntents';
import { generateTemplateResponse, AssistantAppContext, AssistantResponseOutput } from '../knowledge/responseTemplates';

// Clean text for matching Hindi, Hinglish, and English
export function normalizeQuery(raw: string): string {
  if (!raw) return '';
  return raw
    .toLowerCase()
    .trim()
    .replace(/[?,।!.;:()—_]/g, ' ')
    .replace(/\s+/g, ' ');
}

// Token scoring & multi-tier matcher
export function matchIntent(userQuery: string): { intent: AssistantIntent; score: number } {
  const normQuery = normalizeQuery(userQuery);
  const queryTokens = normQuery.split(' ').filter(t => t.length > 0);

  if (!normQuery) {
    return {
      intent: { intent: 'UNKNOWN', category: 'general', examples: [], keywords: [] },
      score: 0
    };
  }

  let bestIntent: AssistantIntent | null = null;
  let bestScore = 0;

  for (const item of GROOT_INTENTS) {
    let score = 0;

    // 1. Exact Example Match (High Priority)
    for (const ex of item.examples) {
      const normEx = normalizeQuery(ex);
      if (normQuery === normEx) {
        return { intent: item, score: 2.0 };
      }
      if (normQuery.includes(normEx)) {
        score += 1.2;
      } else if (normEx.includes(normQuery) && normQuery.length > 4) {
        score += 0.8;
      }
    }

    // 2. Keyword Match
    for (const kw of item.keywords) {
      const normKw = normalizeQuery(kw);
      if (normQuery.includes(normKw)) {
        score += 0.6;
      }
      for (const token of queryTokens) {
        if (token === normKw) {
          score += 0.5;
        } else if (token.length > 3 && normKw.length > 3) {
          if (token.includes(normKw) || normKw.includes(token)) {
            score += 0.3;
          }
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestIntent = item;
    }
  }

  // Fallback to unknown if confidence is below threshold
  if (!bestIntent || bestScore < 0.35) {
    const unknownIntent: AssistantIntent = {
      intent: 'UNKNOWN',
      category: 'general',
      examples: [],
      keywords: []
    };
    return { intent: unknownIntent, score: 0 };
  }

  return { intent: bestIntent, score: bestScore };
}

// Main assistant query processor
export function processAssistantQuery(
  userQuery: string, 
  context: AssistantAppContext
): AssistantResponseOutput {
  const { intent } = matchIntent(userQuery);
  return generateTemplateResponse(intent.intent, context);
}
