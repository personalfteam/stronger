import { AthleteProfile, Exercise, StrengthEvaluation, StrengthTier, GenderType } from '../types';

/**
 * Standard strength multipliers (relative to bodyweight in kg) by gender.
 * Based on recognized exercise physiology standards (Strength Level / ExRx / NSCA / IWF / IPF).
 */
interface StandardRatios {
  beginner: number; // Iniciante (< média)
  intermediate: number; // Intermediário (Média da população treinada)
  advanced: number; // Avançado (Acima da média)
  elite: number; // Elite (Competitivo / Top 5%)
}

const STANDARDS_MALE: Record<string, StandardRatios> = {
  'back-squat': { beginner: 1.15, intermediate: 1.5, advanced: 1.95, elite: 2.4 },
  'front-squat': { beginner: 0.95, intermediate: 1.25, advanced: 1.65, elite: 2.05 },
  'overhead-squat': { beginner: 0.75, intermediate: 1.05, advanced: 1.35, elite: 1.7 },
  'deadlift': { beginner: 1.35, intermediate: 1.85, advanced: 2.35, elite: 2.9 },
  'sumo-deadlift': { beginner: 1.35, intermediate: 1.85, advanced: 2.35, elite: 2.9 },
  'bench-press': { beginner: 0.85, intermediate: 1.2, advanced: 1.55, elite: 1.95 },
  'strict-press': { beginner: 0.55, intermediate: 0.75, advanced: 0.95, elite: 1.2 },
  'push-press': { beginner: 0.75, intermediate: 1.0, advanced: 1.25, elite: 1.55 },
  'push-jerk': { beginner: 0.85, intermediate: 1.15, advanced: 1.45, elite: 1.75 },
  'split-jerk': { beginner: 0.9, intermediate: 1.25, advanced: 1.55, elite: 1.9 },
  'clean-and-jerk': { beginner: 0.85, intermediate: 1.2, advanced: 1.55, elite: 1.95 },
  'snatch': { beginner: 0.65, intermediate: 0.95, advanced: 1.25, elite: 1.6 },
  'power-clean': { beginner: 0.75, intermediate: 1.05, advanced: 1.35, elite: 1.7 },
  'power-snatch': { beginner: 0.55, intermediate: 0.85, advanced: 1.1, elite: 1.4 },
  'thruster': { beginner: 0.7, intermediate: 0.95, advanced: 1.25, elite: 1.55 },
};

const STANDARDS_FEMALE: Record<string, StandardRatios> = {
  'back-squat': { beginner: 0.85, intermediate: 1.2, advanced: 1.6, elite: 2.0 },
  'front-squat': { beginner: 0.7, intermediate: 1.0, advanced: 1.35, elite: 1.7 },
  'overhead-squat': { beginner: 0.55, intermediate: 0.8, advanced: 1.1, elite: 1.4 },
  'deadlift': { beginner: 1.05, intermediate: 1.5, advanced: 1.95, elite: 2.45 },
  'sumo-deadlift': { beginner: 1.05, intermediate: 1.5, advanced: 1.95, elite: 2.45 },
  'bench-press': { beginner: 0.5, intermediate: 0.8, advanced: 1.1, elite: 1.4 },
  'strict-press': { beginner: 0.35, intermediate: 0.55, advanced: 0.75, elite: 0.95 },
  'push-press': { beginner: 0.5, intermediate: 0.75, advanced: 1.0, elite: 1.25 },
  'push-jerk': { beginner: 0.6, intermediate: 0.85, advanced: 1.15, elite: 1.45 },
  'split-jerk': { beginner: 0.65, intermediate: 0.95, advanced: 1.25, elite: 1.6 },
  'clean-and-jerk': { beginner: 0.6, intermediate: 0.9, advanced: 1.25, elite: 1.6 },
  'snatch': { beginner: 0.45, intermediate: 0.7, advanced: 1.0, elite: 1.3 },
  'power-clean': { beginner: 0.55, intermediate: 0.8, advanced: 1.1, elite: 1.4 },
  'power-snatch': { beginner: 0.4, intermediate: 0.65, advanced: 0.9, elite: 1.15 },
  'thruster': { beginner: 0.5, intermediate: 0.75, advanced: 1.05, elite: 1.35 },
};

// Default generic movement multipliers if not in specific dictionary
const GENERIC_DEFAULT_MALE: StandardRatios = { beginner: 0.8, intermediate: 1.2, advanced: 1.6, elite: 2.0 };
const GENERIC_DEFAULT_FEMALE: StandardRatios = { beginner: 0.6, intermediate: 0.9, advanced: 1.3, elite: 1.65 };

/**
 * Calculates BMI and its sports classification
 */
export function calculateBMI(weightKg: number, heightCm: number): { bmi: number; classification: string } {
  if (!weightKg || !heightCm || heightCm <= 0) {
    return { bmi: 0, classification: 'Não informado' };
  }
  const heightMeters = heightCm / 100;
  const bmi = parseFloat((weightKg / (heightMeters * heightMeters)).toFixed(1));

  let classification = 'Eutrófico (Peso Saudável)';
  if (bmi < 18.5) classification = 'Abaixo do peso';
  else if (bmi < 24.9) classification = 'Peso Ideal / Atlético';
  else if (bmi < 29.9) classification = 'Sobrepeso / Estrutura Muscular Forte';
  else classification = 'Elevado / Hipertrofia Densa';

  return { bmi, classification };
}

/**
 * Evaluates an exercise 1RM against the athlete's body weight and gender.
 */
export function evaluateStrength(
  exerciseId: string,
  currentPRKg: number,
  profile: AthleteProfile
): StrengthEvaluation {
  const bw = Math.max(30, profile.bodyWeightKg || 75);
  const ratio = currentPRKg > 0 ? parseFloat((currentPRKg / bw).toFixed(2)) : 0;
  const isFemale = profile.gender === 'female';

  const lookupTable = isFemale ? STANDARDS_FEMALE : STANDARDS_MALE;
  const genericFallback = isFemale ? GENERIC_DEFAULT_FEMALE : GENERIC_DEFAULT_MALE;
  const std = lookupTable[exerciseId] || genericFallback;

  const beginnerKg = Math.round(std.beginner * bw);
  const intermediateKg = Math.round(std.intermediate * bw);
  const advancedKg = Math.round(std.advanced * bw);
  const eliteKg = Math.round(std.elite * bw);

  let tier: StrengthTier = 'iniciante';
  let tierLabel = 'Iniciante / Abaixo da Média';
  let tierColor = 'text-blue-400';
  let tierBg = 'bg-blue-500/10 border-blue-500/30 text-blue-400';
  let description = `Carga em fase de construção técnica. A meta para atingir a média (Intermediário) é de ${intermediateKg} kg (${std.intermediate}x peso corporal).`;
  let progressPercent = 20;

  if (currentPRKg === 0) {
    tierLabel = 'Sem Carga Registrada';
    tierColor = 'text-zinc-500';
    tierBg = 'bg-zinc-800/40 border-zinc-700 text-zinc-400';
    description = `Adicione seu recorde neste movimento para calcular o nível de força em relação aos ${bw} kg de peso corporal.`;
    progressPercent = 0;
  } else if (currentPRKg >= eliteKg) {
    tier = 'elite';
    tierLabel = '🏆 Nível Elite / Altíssima Performance';
    tierColor = 'text-amber-400';
    tierBg = 'bg-amber-500/20 border-amber-500/50 text-amber-300';
    description = `Nível excepcional! O aluno está no topo 5% dos atletas com ${ratio}x o peso corporal (${currentPRKg} kg). Força digna de competição.`;
    progressPercent = 100;
  } else if (currentPRKg >= advancedKg) {
    tier = 'avancado';
    tierLabel = '⭐ Acima da Média (Avançado)';
    tierColor = 'text-emerald-400';
    tierBg = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300';
    description = `Excelente! O aluno está nitidamente ACIMA DA MÉDIA com ${ratio}x o peso corporal. A carga de ${currentPRKg} kg demonstra ótima eficiência e força relativa.`;
    progressPercent = 75 + Math.min(24, Math.round(((currentPRKg - advancedKg) / (eliteKg - advancedKg)) * 25));
  } else if (currentPRKg >= intermediateKg) {
    tier = 'intermediario';
    tierLabel = '⚡ Na Média (Intermediário Sólido)';
    tierColor = 'text-cyan-400';
    tierBg = 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300';
    description = `Carga adequada e sólida! O aluno está na média esperada para praticantes regulares com ${ratio}x peso corporal. Próximo alvo (Acima da média): ${advancedKg} kg.`;
    progressPercent = 50 + Math.min(24, Math.round(((currentPRKg - intermediateKg) / (advancedKg - intermediateKg)) * 25));
  } else {
    tier = 'iniciante';
    tierLabel = '🥉 Iniciante / Em Desenvolvimento';
    tierColor = 'text-indigo-400';
    tierBg = 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300';
    description = `Carga inicial para o peso corporal de ${bw} kg (${ratio}x peso). Foco na evolução progressiva até a média intermediária de ${intermediateKg} kg.`;
    progressPercent = Math.min(49, Math.round((currentPRKg / intermediateKg) * 50));
  }

  const { bmi, classification } = calculateBMI(profile.bodyWeightKg, profile.heightCm);

  return {
    ratio,
    tier,
    tierLabel,
    tierColor,
    tierBg,
    description,
    bmi,
    bmiClassification: classification,
    standardBenchmark: {
      beginner: beginnerKg,
      intermediate: intermediateKg,
      advanced: advancedKg,
      elite: eliteKg,
    },
    progressPercent: Math.max(5, Math.min(100, progressPercent)),
  };
}

/**
 * Calculates overall athlete strength summary across benchmark lifts.
 */
export function getOverallAthleteSummary(
  exercises: Exercise[],
  profile: AthleteProfile
): {
  totalLiftedKg: number;
  averageRatio: number;
  aboveAverageCount: number;
  eliteCount: number;
  onAverageCount: number;
  beginnerCount: number;
  overallRating: string;
  overallColor: string;
} {
  const benchmarkIds = ['back-squat', 'deadlift', 'bench-press', 'clean-and-jerk', 'snatch', 'strict-press'];
  const benchmarkExercises = exercises.filter((e) => benchmarkIds.includes(e.id) && e.currentPR > 0);

  if (benchmarkExercises.length === 0) {
    return {
      totalLiftedKg: 0,
      averageRatio: 0,
      aboveAverageCount: 0,
      eliteCount: 0,
      onAverageCount: 0,
      beginnerCount: 0,
      overallRating: 'Aguardando Cargas',
      overallColor: 'text-zinc-400',
    };
  }

  let totalLiftedKg = 0;
  let ratioSum = 0;
  let aboveAverageCount = 0;
  let eliteCount = 0;
  let onAverageCount = 0;
  let beginnerCount = 0;

  benchmarkExercises.forEach((ex) => {
    totalLiftedKg += ex.currentPR;
    const evaluation = evaluateStrength(ex.id, ex.currentPR, profile);
    ratioSum += evaluation.ratio;

    if (evaluation.tier === 'elite') eliteCount++;
    else if (evaluation.tier === 'avancado') aboveAverageCount++;
    else if (evaluation.tier === 'intermediario') onAverageCount++;
    else beginnerCount++;
  });

  const averageRatio = parseFloat((ratioSum / benchmarkExercises.length).toFixed(2));

  let overallRating = 'Intermediário (Na Média)';
  let overallColor = 'text-cyan-400';

  if (eliteCount >= 2 || (aboveAverageCount + eliteCount) / benchmarkExercises.length >= 0.7) {
    overallRating = 'Atleta de Alta Performance (Acima da Média)';
    overallColor = 'text-amber-400';
  } else if ((aboveAverageCount + eliteCount + onAverageCount) / benchmarkExercises.length >= 0.6) {
    overallRating = 'Forte e Bem Condicionado (Sólido)';
    overallColor = 'text-emerald-400';
  } else if (beginnerCount > onAverageCount) {
    overallRating = 'Em Construção de Base';
    overallColor = 'text-indigo-400';
  }

  return {
    totalLiftedKg,
    averageRatio,
    aboveAverageCount,
    eliteCount,
    onAverageCount,
    beginnerCount,
    overallRating,
    overallColor,
  };
}
