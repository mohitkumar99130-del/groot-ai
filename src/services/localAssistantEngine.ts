import { GROOT_INTENTS, AssistantIntent } from '../knowledge/assistantIntents';
import { generateTemplateResponse, AssistantAppContext, AssistantResponseOutput } from '../knowledge/responseTemplates';

// Normalize Hindi, Hinglish, and English text
export function normalizeQuery(raw: string): string {
  if (!raw) return '';
  return raw
    .toLowerCase()
    .trim()
    .replace(/[?,।!.;:()]/g, ' ')
    .replace(/\s+/g, ' ');
}

// Token scoring & fuzzy matcher for farmer queries
export function matchIntent(userQuery: string): { intent: AssistantIntent; score: number } {
  const normQuery = normalizeQuery(userQuery);
  const queryTokens = normQuery.split(' ').filter(t => t.length > 0);

  let bestIntent: AssistantIntent | null = null;
  let bestScore = 0;

  for (const item of GROOT_INTENTS) {
    let score = 0;

    // Exact example match
    for (const ex of item.examples) {
      const normEx = normalizeQuery(ex);
      if (normQuery === normEx) {
        return { intent: item, score: 1.0 };
      }
      if (normQuery.includes(normEx) || normEx.includes(normQuery)) {
        score += 0.6;
      }
    }

    // Keyword matching
    for (const kw of item.keywords) {
      const normKw = normalizeQuery(kw);
      if (normQuery.includes(normKw)) {
        score += 0.4;
      }
      for (const token of queryTokens) {
        if (token === normKw) {
          score += 0.5;
        } else if (token.includes(normKw) || normKw.includes(token)) {
          if (normKw.length > 3) score += 0.25;
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestIntent = item;
    }
  }

  if (!bestIntent || bestScore < 0.3) {
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
