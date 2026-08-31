import React, { useState } from 'react';
import { Star, Lock, ChevronRight, Edit2, Check, Sparkles, TrendingUp } from 'lucide-react';
import { Exercise, WeightUnit, AthleteProfile } from '../types';
import { calculatePercentage, formatWeight, KG_TO_LBS, LBS_TO_KG } from '../utils/calculator';
import { evaluateStrength } from '../utils/strengthStandards';

interface ExerciseCardProps {
  exercise: Exercise;
  unit: WeightUnit;
  athleteProfile?: AthleteProfile;
  isPro: boolean;
  onSelect: (exercise: Exercise) => void;
  onUpdatePR: (id: string, newPR: number) => void;
  onToggleFavorite: (id: string) => void;
  onOpenUpgrade: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  unit,
  athleteProfile,
  isPro,
  onSelect,
  onUpdatePR,
  onToggleFavorite,
  onOpenUpgrade,
}) => {
  const isLocked = !isPro && !exercise.isFreeAvailable;
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<string>(
    unit === 'lbs'
      ? Math.round(exercise.currentPR * KG_TO_LBS).toString()
      : exercise.currentPR.toString()
  );

  const displayPR =
    unit === 'lbs'
      ? Math.round(exercise.currentPR * KG_TO_LBS)
      : exercise.currentPR;

  const handleSavePR = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(editValue) || 0;
    const finalKg = unit === 'lbs' ? num * LBS_TO_KG : num;
    onUpdatePR(exercise.id, Math.max(0, finalKg));
    setIsEditing(false);
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'lpo':
        return { label: 'LPO / Levantamento Olímpico', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
      case 'powerlifting':
        return { label: 'Força / Powerlifting', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'gymnastics':
        return { label: 'Ginástica / Benchmark', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
      case 'dumbbell_kb':
        return { label: 'Dumbbell & KB', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      default:
        return { label: 'Personalizado', bg: 'bg-zinc-700/20 text-zinc-300 border-zinc-700' };
    }
  };

  const badge = getCategoryBadge(exercise.category);

  // Strength Standard Evaluation if athleteProfile is provided
  const strengthEval = athleteProfile
    ? evaluateStrength(exercise.id, exercise.currentPR, athleteProfile)
    : null;

  // Key rapid percentages: 60%, 70%, 80%, 90%
  const previewPercentages = [60, 70, 80, 90];

  return (
    <div
      className={`relative group bg-zinc-900/80 border rounded-2xl p-4 sm:p-5 transition-all duration-200 ${
        isLocked
          ? 'border-zinc-800/60 opacity-75'
          : 'border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-900 shadow-md hover:shadow-xl hover:shadow-black/40'
      }`}
    >
      {/* Locked Overlay for Free Tier */}
      {isLocked && (
        <div
          onClick={onOpenUpgrade}
          className="absolute inset-0 z-20 bg-zinc-950/85 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center p-4 cursor-pointer text-center group/lock"
        >
          <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 border border-amber-500/40 group-hover/lock:scale-110 transition-transform">
            <Lock className="w-5 h-5" />
          </div>
          <div className="text-sm font-bold text-zinc-200">Disponível no Plano PRO</div>
          <div className="text-xs text-amber-400 font-semibold mt-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Toque para desbloquear</span>
          </div>
        </div>
      )}

      {/* Top Meta */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge.bg}`}>
            {badge.label}
          </span>
          {exercise.history.length > 0 && (
            <span className="text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded font-mono">
              {exercise.history.length} {exercise.history.length === 1 ? 'registro' : 'registros'}
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(exercise.id);
          }}
          className={`p-1.5 rounded-lg transition-colors ${
            exercise.isFavorite
              ? 'text-amber-400 hover:text-amber-300'
              : 'text-zinc-600 hover:text-zinc-400'
          }`}
          title="Favoritar exercício"
        >
          <Star className={`w-4 h-4 ${exercise.isFavorite ? 'fill-amber-400' : ''}`} />
        </button>
      </div>

      {/* Exercise Title */}
      <div className="mb-3 cursor-pointer" onClick={() => !isLocked && onSelect(exercise)}>
        <h3 className="text-base sm:text-lg font-bold text-zinc-100 group-hover:text-amber-400 transition-colors">
          {exercise.name}
        </h3>
        {exercise.portugueseName && (
          <p className="text-xs text-zinc-400 truncate">{exercise.portugueseName}</p>
        )}
      </div>

      {/* PR / 1RM Section */}
      <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 mb-3.5 space-y-2">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-0.5">
              Carga Máxima (1RM)
            </span>
            {isEditing ? (
              <form onSubmit={handleSavePR} className="flex items-center gap-1.5 mt-1">
                <input
                  type="number"
                  step="0.5"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  autoFocus
                  className="w-24 bg-zinc-900 border border-amber-500 rounded px-2 py-1 text-sm font-bold text-zinc-100 focus:outline-none"
                />
                <span className="text-xs text-zinc-400 uppercase font-mono">{unit}</span>
                <button
                  type="submit"
                  className="p-1 bg-amber-500 text-zinc-950 rounded hover:bg-amber-400"
                >
                  <Check className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black font-display text-amber-400 tracking-tight leading-none">
                  {displayPR > 0 ? displayPR : '--'}
                </span>
                <span className="text-xs font-bold text-zinc-400 uppercase font-mono">
                  {unit}
                </span>
              </div>
            )}
          </div>

          {!isEditing && (
            <button
              onClick={() => {
                setEditValue(displayPR.toString());
                setIsEditing(true);
              }}
              className="p-1.5 text-zinc-500 hover:text-amber-400 hover:bg-zinc-800 rounded-lg transition-colors"
              title="Editar 1RM diretamente"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Strength Evaluation relative to Student */}
        {strengthEval && exercise.currentPR > 0 && (
          <div className="pt-2 border-t border-zinc-900 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-300">
              <TrendingUp className="w-3 h-3 text-amber-400 shrink-0" />
              <span>
                <strong className="text-zinc-100 font-mono">{strengthEval.ratio}x</strong> peso ({athleteProfile?.bodyWeightKg}kg)
              </span>
            </div>
            <span
              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border truncate max-w-[130px] ${strengthEval.tierBg}`}
              title={strengthEval.description}
            >
              {strengthEval.tier === 'avancado'
                ? 'Acima da Média'
                : strengthEval.tier === 'elite'
                ? 'Elite'
                : strengthEval.tier === 'intermediario'
                ? 'Na Média'
                : 'Iniciante'}
            </span>
          </div>
        )}
      </div>

      {/* Quick Percentage Pills (Automatic Real-time calculation) */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
          <span>Porcentagens Rápidas:</span>
          {exercise.currentPR > 0 && (
            <span className="text-[10px] text-zinc-500">Auto calculadas</span>
          )}
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {previewPercentages.map((pct) => {
            const calculatedKg = calculatePercentage(exercise.currentPR, pct);
            const formatted = formatWeight(calculatedKg, unit);
            return (
              <div
                key={pct}
                onClick={() => !isLocked && onSelect(exercise)}
                className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-1.5 text-center cursor-pointer hover:border-amber-500/40 hover:bg-zinc-800/40 transition-colors"
              >
                <div className="text-[10px] text-zinc-400 font-bold">{pct}%</div>
                <div className="text-xs font-black text-zinc-200 font-mono">
                  {exercise.currentPR > 0 ? formatted : '-'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Details Trigger */}
      <button
        onClick={() => !isLocked && onSelect(exercise)}
        className="w-full mt-3.5 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-xs font-bold text-zinc-400 hover:text-amber-400 transition-colors"
      >
        <span>Ver Tabela Completa & Anilhas</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
