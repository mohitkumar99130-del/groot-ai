export type CropCategory = 
  | 'cereal' 
  | 'pulse' 
  | 'oilseed' 
  | 'cash_crop' 
  | 'vegetable' 
  | 'fruit' 
  | 'millet' 
  | 'spice';

export interface CropVariety {
  id: string; // e.g. "rice_basmati_1121"
  cropFamilyId: string; // e.g. "rice"
  cropName: string; // e.g. "Rice / Paddy"
  cropHindi: string; // e.g. "धान / चावल"
  varietyName: string; // e.g. "Pusa 1121 Basmati"
  varietyHindi: string; // e.g. "पूसा 1121 बासमती"
  category: CropCategory;
  grainType: string; // e.g. "Extra Long Slender Aromatic"
  grainTypeHindi: string; // e.g. "लंबा दाना सुगंधित बासमती"
  durationDays: number; // e.g. 135-145 days
  waterRequirement: 'Low' | 'Medium' | 'High' | 'Standing Water / Flooded';
  waterRequirementHindi: string;
  optimalNpkPerAcre: {
    nitrogenKg: number;
    phosphorusKg: number;
    potassiumKg: number;
    zincKg?: number;
  };
  targetYieldQuintalPerAcre: number; // e.g. 20-25 quintals/acre
  commonPests: string[];
  commonPestsHindi: string[];
  recommendedFertilizerSummary: string;
  recommendedFertilizerSummaryHindi: string;
  simpleAudioHi: string;
  simpleAudioEn: string;
  iconEmoji: string;
}

export interface CropFamily {
  id: string; // e.g. "rice"
  name: string; // e.g. "Rice / Paddy"
  nameHindi: string; // e.g. "धान / चावल"
  category: CropCategory;
  iconEmoji: string;
  description: string;
  descriptionHindi: string;
  varieties: CropVariety[];
}
