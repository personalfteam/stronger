import { Exercise, UserSubscription, PricingConfig, WeightUnit, BarbellType, AthleteProfile } from '../types';
import { INITIAL_EXERCISES } from '../data/initialExercises';

const STORAGE_KEYS = {
  EXERCISES: 'strongprogress_exercises_v1',
  SUBSCRIPTION: 'strongprogress_subscription_v1',
  PRICING_CONFIG: 'strongprogress_pricing_v1',
  UNIT: 'strongprogress_unit_v1',
  BARBELL: 'strongprogress_barbell_v1',
  ATHLETE_PROFILE: 'strongprogress_athlete_profile_v1',
};

export const DEFAULT_ATHLETE_PROFILE: AthleteProfile = {
  name: 'Aluno / Atleta',
  gender: 'male',
  bodyWeightKg: 78,
  heightCm: 175,
  age: 26,
  experienceLevel: 'intermediario',
  notes: 'Foco em evolução de cargas e consistência de movimentos básicos.',
};

export const DEFAULT_PRICING: PricingConfig = {
  monthlyPrice: 19.90,
  lifetimePrice: 149.90,
  monthlyCheckoutUrl: 'https://pay.kiwify.com.br/DL4VOlu',
  lifetimeCheckoutUrl: 'https://pay.kiwify.com.br/n3n2sqb',
  magicSecretKey: 'STRONGPRO',
};

export const DEFAULT_SUBSCRIPTION: UserSubscription = {
  plan: 'free',
  isActive: false,
};

export function getStoredExercises(): Exercise[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXERCISES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(INITIAL_EXERCISES));
      return INITIAL_EXERCISES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_EXERCISES;
  } catch (err) {
    console.error('Failed to load exercises from storage', err);
    return INITIAL_EXERCISES;
  }
}

export function saveStoredExercises(exercises: Exercise[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(exercises));
  } catch (err) {
    console.error('Failed to save exercises', err);
  }
}

export function getStoredSubscription(): UserSubscription {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
    if (!raw) return DEFAULT_SUBSCRIPTION;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SUBSCRIPTION;
  }
}

export function saveStoredSubscription(sub: UserSubscription): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(sub));
  } catch (err) {
    console.error('Failed to save subscription', err);
  }
}

export function getStoredPricing(): PricingConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRICING_CONFIG);
    if (!raw) return DEFAULT_PRICING;
    const parsed = JSON.parse(raw);
    const config = { ...DEFAULT_PRICING, ...parsed };
    if (!config.monthlyCheckoutUrl || config.monthlyCheckoutUrl.includes('pay.strongprogress.app')) {
      config.monthlyCheckoutUrl = DEFAULT_PRICING.monthlyCheckoutUrl;
    }
    if (!config.lifetimeCheckoutUrl || config.lifetimeCheckoutUrl.includes('pay.strongprogress.app')) {
      config.lifetimeCheckoutUrl = DEFAULT_PRICING.lifetimeCheckoutUrl;
    }
    if (!config.lifetimePrice || config.lifetimePrice < 100) {
      config.lifetimePrice = 149.90;
    }
    return config;
  } catch {
    return DEFAULT_PRICING;
  }
}

export function saveStoredPricing(pricing: PricingConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRICING_CONFIG, JSON.stringify(pricing));
  } catch (err) {
    console.error('Failed to save pricing config', err);
  }
}

export function getStoredUnit(): WeightUnit {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.UNIT);
    return (raw === 'lbs' ? 'lbs' : 'kg') as WeightUnit;
  } catch {
    return 'kg';
  }
}

export function saveStoredUnit(unit: WeightUnit): void {
  try {
    localStorage.setItem(STORAGE_KEYS.UNIT, unit);
  } catch (err) {
    console.error('Failed to save unit', err);
  }
}

export function getStoredBarbell(): BarbellType {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BARBELL);
    return (raw || 'mens_20kg') as BarbellType;
  } catch {
    return 'mens_20kg';
  }
}

export function saveStoredBarbell(barbell: BarbellType): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BARBELL, barbell);
  } catch (err) {
    console.error('Failed to save barbell', err);
  }
}

export function getStoredAthleteProfile(): AthleteProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATHLETE_PROFILE);
    if (!raw) return DEFAULT_ATHLETE_PROFILE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_ATHLETE_PROFILE, ...parsed };
  } catch {
    return DEFAULT_ATHLETE_PROFILE;
  }
}

export function saveStoredAthleteProfile(profile: AthleteProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ATHLETE_PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save athlete profile', err);
  }
}
