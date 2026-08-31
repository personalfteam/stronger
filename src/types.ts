export type Language = 'pt' | 'en' | 'es' | 'fr';

export type ExerciseCategory = 
  | 'lpo' // Levantamento de Peso Olímpico
  | 'powerlifting' // Força & Powerlifting
  | 'gymnastics' // Ginástica com Carga
  | 'dumbbell_kb' // Dumbbell & Kettlebell
  | 'custom'; // Personalizados

export interface PRLogEntry {
  id: string;
  weight: number; // in kg (internal canonical)
  date: string; // ISO date string (YYYY-MM-DD)
  reps?: number; // default 1
  notes?: string;
  rpe?: number; // 1-10
}

export interface Exercise {
  id: string;
  name: string;
  portugueseName?: string;
  category: ExerciseCategory;
  description: string;
  currentPR: number; // in kg (0 if not set)
  targetPR?: number;
  lastUpdated?: string;
  history: PRLogEntry[];
  isFavorite?: boolean;
  isCustom?: boolean;
  isFreeAvailable?: boolean; // In free tier, only certain benchmark movements are unlocked
}

export type WeightUnit = 'kg' | 'lbs';

export type BarbellType = 'mens_20kg' | 'womens_15kg' | 'technique_10kg' | 'dumbbells';

export interface BarbellSpec {
  id: BarbellType;
  name: string;
  weightKg: number;
  weightLbs: number;
  description: string;
}

export interface PlateCount {
  weight: number; // per plate in kg
  color: string;
  textColor: string;
  borderColor?: string;
  count: number; // pairs (count * 2 total on bar, or count on one side)
  label: string;
}

export type GenderType = 'male' | 'female';
export type ExperienceLevel = 'iniciante' | 'intermediario' | 'avancado' | 'elite';

export interface AthleteProfile {
  name: string; // Nome do aluno / atleta
  gender: GenderType; // Sexo biológico para padrões de força
  bodyWeightKg: number; // Peso corporal em kg (padrão base)
  heightCm: number; // Altura em cm
  age?: number; // Idade
  experienceLevel?: ExperienceLevel;
  notes?: string;
  updatedAt?: string;
}

export type StrengthTier = 'iniciante' | 'intermediario' | 'avancado' | 'elite';

export interface StrengthEvaluation {
  ratio: number; // e.g. 1.65 (PR / BodyWeight)
  tier: StrengthTier;
  tierLabel: string; // e.g. "Acima da Média"
  tierColor: string; // e.g. "text-emerald-400"
  tierBg: string; // e.g. "bg-emerald-500/10 border-emerald-500/30"
  description: string;
  bmi: number; // IMC
  bmiClassification: string;
  standardBenchmark: {
    beginner: number; // in kg
    intermediate: number; // in kg (média)
    advanced: number; // in kg (acima da média)
    elite: number; // in kg
  };
  progressPercent: number; // 0 to 100 on standard curve
}

export type PlanType = 'free' | 'subscription_monthly' | 'lifetime';

export interface PricingConfig {
  monthlyPrice: number; // e.g. 19.90
  lifetimePrice: number; // e.g. 149.90
  monthlyCheckoutUrl: string; // e.g. https://pay.kiwify.com.br/DL4VOlu
  lifetimeCheckoutUrl: string;
  yearlyPrice?: number;
  yearlyCheckoutUrl?: string;
  magicSecretKey?: string; // Secret key for magic link validation (e.g. STRONGPRO)
}

export interface UserSubscription {
  plan: PlanType;
  isActive: boolean;
  unlockedAt?: string;
  promoCodeApplied?: string;
  buyerEmail?: string;
  buyerName?: string;
  source?: 'kiwify' | 'mercadopago' | 'manual' | 'promo';
}

export interface PercentageRow {
  percentage: number;
  weight: number;
  weightPerSide: number;
  repsGuide?: string;
  intensityLabel?: string;
  plates: PlateCount[];
}
