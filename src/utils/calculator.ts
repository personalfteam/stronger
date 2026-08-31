import { PlateCount, PercentageRow } from '../types';

export const STANDARD_PLATES: { weight: number; color: string; textColor: string; borderColor?: string; label: string; height: string }[] = [
  { weight: 25, color: '#DC2626', textColor: '#FFFFFF', borderColor: '#B91C1C', label: '25kg', height: 'h-28' }, // Vermelho (IWF)
  { weight: 20, color: '#2563EB', textColor: '#FFFFFF', borderColor: '#1D4ED8', label: '20kg', height: 'h-28' }, // Azul
  { weight: 15, color: '#EAB308', textColor: '#000000', borderColor: '#CA8A04', label: '15kg', height: 'h-28' }, // Amarelo
  { weight: 10, color: '#16A34A', textColor: '#FFFFFF', borderColor: '#15803D', label: '10kg', height: 'h-28' }, // Verde
  { weight: 5, color: '#F4F4F5', textColor: '#18181B', borderColor: '#D4D4D8', label: '5kg', height: 'h-20' },   // Branco / Cinza claro
  { weight: 2.5, color: '#27272A', textColor: '#FAFAFA', borderColor: '#52525B', label: '2.5kg', height: 'h-16' }, // Preto / Fracionada
  { weight: 1.25, color: '#71717A', textColor: '#FAFAFA', borderColor: '#A1A1AA', label: '1.25k', height: 'h-12' }, // Prata / Fracionada
  { weight: 0.5, color: '#A1A1AA', textColor: '#09090B', borderColor: '#E4E4E7', label: '0.5k', height: 'h-10' },  // Fracionada mini
];

export const KG_TO_LBS = 2.20462;
export const LBS_TO_KG = 1 / KG_TO_LBS;

export function roundToNearest(val: number, step: number = 0.5): number {
  if (step <= 0) return Math.round(val * 10) / 10;
  return Math.round(val / step) * step;
}

export function formatWeight(valKg: number, unit: 'kg' | 'lbs', round: boolean = true): string {
  if (unit === 'lbs') {
    const lbs = valKg * KG_TO_LBS;
    return round ? `${Math.round(lbs)} lbs` : `${(Math.round(lbs * 10) / 10).toFixed(1)} lbs`;
  }
  return round ? `${roundToNearest(valKg, 0.5).toFixed(1).replace('.0', '')} kg` : `${(Math.round(valKg * 10) / 10).toFixed(1)} kg`;
}

/**
 * Calculates the plates needed PER SIDE for a given total target weight and barbell weight.
 */
export function calculatePlatesForBar(targetWeightKg: number, barWeightKg: number = 20): PlateCount[] {
  const loadTotal = targetWeightKg - barWeightKg;
  if (loadTotal <= 0) return [];

  let sideWeightRemaining = loadTotal / 2;
  const result: PlateCount[] = [];

  for (const plate of STANDARD_PLATES) {
    if (sideWeightRemaining >= plate.weight - 0.01) {
      const count = Math.floor((sideWeightRemaining + 0.001) / plate.weight);
      if (count > 0) {
        result.push({
          weight: plate.weight,
          color: plate.color,
          textColor: plate.textColor,
          borderColor: plate.borderColor,
          count: count,
          label: plate.label,
        });
        sideWeightRemaining -= count * plate.weight;
      }
    }
  }

  return result;
}

export function calculatePercentage(prKg: number, percentage: number, roundStep: number = 0.5): number {
  if (!prKg || prKg <= 0) return 0;
  const raw = (prKg * percentage) / 100;
  return roundToNearest(raw, roundStep);
}

export function getIntensityLabel(pct: number): { label: string; color: string; desc: string } {
  if (pct < 50) return { label: 'Técnica / Warm-up', color: 'text-zinc-400 bg-zinc-800/80 border-zinc-700', desc: 'Aquecimento e mobilidade' };
  if (pct <= 65) return { label: 'Velocidade & Ciclagem', color: 'text-emerald-400 bg-emerald-950/50 border-emerald-800/60', desc: 'Velocidade de barra e técnica com fluidez' };
  if (pct <= 75) return { label: 'Hipertrofia / Força Base', color: 'text-cyan-400 bg-cyan-950/50 border-cyan-800/60', desc: 'Séries de volume (4-6 repetições)' };
  if (pct <= 85) return { label: 'Força Submáxima', color: 'text-amber-400 bg-amber-950/50 border-amber-800/60', desc: 'Séries pesadas (2-3 repetições)' };
  if (pct <= 95) return { label: 'Pico de Força (Heavy)', color: 'text-orange-400 bg-orange-950/50 border-orange-800/60', desc: 'Quase carga máxima (1-2 reps)' };
  if (pct <= 100) return { label: '1RM Atual (100%)', color: 'text-rose-400 bg-rose-950/50 border-rose-800/60', desc: 'Seu recorde atual' };
  return { label: 'Novo PR Alvo (Overload)', color: 'text-purple-400 bg-purple-950/50 border-purple-800/60', desc: 'Tentativa de quebra de PR' };
}

export function generatePercentageLadder(prKg: number, barWeightKg: number = 20, isPro: boolean = false): PercentageRow[] {
  // Free tier has standard 50, 60, 70, 80, 90, 100%
  // Pro tier has 40, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110%
  const percentages = isPro
    ? [40, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110]
    : [50, 60, 70, 80, 90, 100];

  return percentages.map((pct) => {
    const weight = calculatePercentage(prKg, pct);
    const weightPerSide = Math.max(0, (weight - barWeightKg) / 2);
    const plates = calculatePlatesForBar(weight, barWeightKg);
    const intensity = getIntensityLabel(pct);

    let repsGuide = '1-2 reps';
    if (pct <= 60) repsGuide = '5-8 reps';
    else if (pct <= 70) repsGuide = '4-6 reps';
    else if (pct <= 80) repsGuide = '3-5 reps';
    else if (pct <= 90) repsGuide = '2-3 reps';
    else repsGuide = '1 rep';

    return {
      percentage: pct,
      weight,
      weightPerSide,
      repsGuide,
      intensityLabel: intensity.label,
      plates,
    };
  });
}

/**
 * Estimates 1RM from Reps and Weight using Epley formula.
 */
export function estimate1RM(weightKg: number, reps: number): {
  epley: number;
  brzycki: number;
  lander: number;
  average: number;
} {
  if (reps <= 1) {
    return { epley: weightKg, brzycki: weightKg, lander: weightKg, average: weightKg };
  }
  const epley = weightKg * (1 + 0.0333 * reps);
  const brzycki = weightKg * (36 / (37 - reps));
  const lander = (100 * weightKg) / (101.3 - 2.67123 * reps);
  const average = (epley + brzycki + lander) / 3;

  return {
    epley: roundToNearest(epley, 0.5),
    brzycki: roundToNearest(brzycki, 0.5),
    lander: roundToNearest(lander, 0.5),
    average: roundToNearest(average, 0.5),
  };
}
