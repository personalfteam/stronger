import React, { useState } from 'react';
import {
  X,
  Trophy,
  Calculator,
  History,
  TrendingUp,
  Plus,
  Trash2,
  Share2,
  Calendar,
  Sparkles,
  Check,
  Zap,
  User,
  Award,
  Scale,
  Ruler,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Exercise, WeightUnit, BarbellType, PRLogEntry, AthleteProfile } from '../types';
import {
  calculatePercentage,
  formatWeight,
  generatePercentageLadder,
  calculatePlatesForBar,
  estimate1RM,
  KG_TO_LBS,
  LBS_TO_KG,
} from '../utils/calculator';
import { evaluateStrength } from '../utils/strengthStandards';
import { BARBELL_SPECS } from '../data/initialExercises';
import { BarbellVisualizer } from './BarbellVisualizer';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
  unit: WeightUnit;
  barbell: BarbellType;
  athleteProfile?: AthleteProfile;
  isPro: boolean;
  onUpdatePR: (id: string, newPR: number, log?: Partial<PRLogEntry>) => void;
  onDeleteHistoryLog?: (exerciseId: string, logId: string) => void;
  onDeleteExercise?: (id: string) => void;
  onOpenUpgrade: () => void;
  onOpenProfile?: () => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  isOpen,
  onClose,
  unit,
  barbell,
  athleteProfile,
  isPro,
  onUpdatePR,
  onDeleteHistoryLog,
  onDeleteExercise,
  onOpenUpgrade,
  onOpenProfile,
}) => {
  if (!isOpen || !exercise) return null;

  const [activeTab, setActiveTab] = useState<'ladder' | 'interactive' | 'analysis' | 'history' | 'estimator'>('ladder');
  const [customPct, setCustomPct] = useState<number>(70);
  const [newPrInput, setNewPrInput] = useState<string>(
    unit === 'lbs'
      ? Math.round(exercise.currentPR * KG_TO_LBS).toString()
      : exercise.currentPR.toString()
  );
  const [newPrDate, setNewPrDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [newPrReps, setNewPrReps] = useState<number>(1);
  const [newPrNotes, setNewPrNotes] = useState<string>('');
  const [showAddPrForm, setShowAddPrForm] = useState<boolean>(false);

  // Estimator State
  const [estWeight, setEstWeight] = useState<string>('80');
  const [estReps, setEstReps] = useState<number>(5);

  const currentBarSpec = BARBELL_SPECS.find((b) => b.id === barbell) || BARBELL_SPECS[0];
  const barWeightKg = currentBarSpec.weightKg;

  const ladder = generatePercentageLadder(exercise.currentPR, barWeightKg, isPro);

  // Custom % load
  const customTargetKg = calculatePercentage(exercise.currentPR, customPct);
  const customPlates = calculatePlatesForBar(customTargetKg, barWeightKg);

  const displayPR =
    unit === 'lbs'
      ? Math.round(exercise.currentPR * KG_TO_LBS)
      : exercise.currentPR;

  const handleSaveNewPR = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newPrInput) || 0;
    const finalKg = unit === 'lbs' ? val * LBS_TO_KG : val;

    if (finalKg > exercise.currentPR) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#EAB308', '#FFFFFF'],
      });
    }

    onUpdatePR(exercise.id, finalKg, {
      date: newPrDate,
      reps: newPrReps,
      notes: newPrNotes,
    });

    setShowAddPrForm(false);
    setNewPrNotes('');
  };

  const handleQuickAdjustPR = (diffKg: number) => {
    const nextKg = Math.max(0, exercise.currentPR + diffKg);
    onUpdatePR(exercise.id, nextKg);
    setNewPrInput(
      unit === 'lbs'
        ? Math.round(nextKg * KG_TO_LBS).toString()
        : nextKg.toString()
    );
  };

  // Estimator calculation
  const estWeightNum = parseFloat(estWeight) || 0;
  const estWeightKg = unit === 'lbs' ? estWeightNum * LBS_TO_KG : estWeightNum;
  const estimates = estimate1RM(estWeightKg, estReps);

  const handleApplyEstimate = () => {
    onUpdatePR(exercise.id, estimates.epley, {
      notes: `Estimado a partir de ${estReps} reps com ${estWeight}${unit} (Fórmula Epley)`,
      reps: 1,
      date: new Date().toISOString().split('T')[0],
    });
    confetti({
      particleCount: 70,
      spread: 60,
    });
    setActiveTab('ladder');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-8 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-6 bg-zinc-950 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-zinc-100 tracking-tight">
                {exercise.name}
              </h2>
              {exercise.isCustom && (
                <span className="text-[10px] bg-zinc-800 text-amber-400 px-2 py-0.5 rounded-full font-bold uppercase">
                  Personalizado
                </span>
              )}
            </div>
            {exercise.portugueseName && (
              <p className="text-xs text-zinc-400">{exercise.portugueseName}</p>
            )}
            <p className="text-xs text-zinc-500 max-w-xl hidden sm:block">
              {exercise.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* PR Box in Header */}
            <div className="bg-zinc-900 border border-amber-500/30 rounded-xl px-4 py-2 text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                1RM Atual
              </span>
              <div className="flex items-baseline gap-1 justify-end">
                <span className="text-2xl sm:text-3xl font-black font-display text-zinc-100">
                  {displayPR > 0 ? displayPR : '--'}
                </span>
                <span className="text-xs font-bold text-zinc-400 uppercase font-mono">
                  {unit}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick 1RM Adjust Toolbar */}
        <div className="px-4 sm:px-6 py-2.5 bg-zinc-950/60 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400 font-semibold mr-1">Ajuste rápido de 1RM:</span>
            <button
              onClick={() => handleQuickAdjustPR(-5)}
              className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded font-mono font-bold"
            >
              -5kg
            </button>
            <button
              onClick={() => handleQuickAdjustPR(-2.5)}
              className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded font-mono font-bold"
            >
              -2.5kg
            </button>
            <button
              onClick={() => handleQuickAdjustPR(+2.5)}
              className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-amber-400 rounded font-mono font-bold"
            >
              +2.5kg
            </button>
            <button
              onClick={() => handleQuickAdjustPR(+5)}
              className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-amber-400 rounded font-mono font-bold"
            >
              +5kg
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddPrForm(!showAddPrForm)}
              className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 rounded-lg font-bold flex items-center gap-1 transition-all"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Registrar Novo PR</span>
            </button>
          </div>
        </div>

        {/* New PR Form Accordion */}
        {showAddPrForm && (
          <div className="p-4 bg-zinc-950 border-b border-amber-500/30">
            <form onSubmit={handleSaveNewPR} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] text-zinc-400 font-bold uppercase block mb-1">
                  Nova Carga ({unit.toUpperCase()})
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={newPrInput}
                  onChange={(e) => setNewPrInput(e.target.value)}
                  className="w-full bg-zinc-900 border border-amber-500 rounded-lg px-3 py-1.5 text-sm font-bold text-zinc-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 font-bold uppercase block mb-1">
                  Data
                </label>
                <input
                  type="date"
                  value={newPrDate}
                  onChange={(e) => setNewPrDate(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 font-bold uppercase block mb-1">
                  Repetições
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={newPrReps}
                  onChange={(e) => setNewPrReps(parseInt(e.target.value) || 1)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-[11px] text-zinc-400 font-bold uppercase block mb-1">
                  Observações / Sensação (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Fácil, sem cinto, campeonato..."
                  value={newPrNotes}
                  onChange={(e) => setNewPrNotes(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none"
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-bold text-xs rounded-lg shadow-md hover:from-amber-400 hover:to-yellow-400"
                >
                  Salvar Recorde
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/40 px-4 sm:px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ladder')}
            className={`py-3 px-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'ladder'
                ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Porcentagens</span>
          </button>

          <button
            onClick={() => setActiveTab('interactive')}
            className={`py-3 px-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'interactive'
                ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Calculadora & Anilhas</span>
          </button>

          <button
            onClick={() => setActiveTab('analysis')}
            className={`py-3 px-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'analysis'
                ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Nível vs Peso do Aluno</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'history'
                ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Histórico ({exercise.history.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('estimator')}
            className={`py-3 px-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'estimator'
                ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Estimador 1RM</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: PERCENTAGE LADDER */}
          {activeTab === 'ladder' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
                <div>
                  Progressão baseada em 1RM de{' '}
                  <strong className="text-zinc-200">
                    {displayPR} {unit}
                  </strong>{' '}
                  na barra de <strong>{barWeightKg}kg</strong>.
                </div>
                {!isPro && (
                  <button
                    onClick={onOpenUpgrade}
                    className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ver tabela completa 40%-115% no PRO</span>
                  </button>
                )}
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/60">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Porcentagem</th>
                      <th className="py-3 px-4">Carga Total</th>
                      <th className="py-3 px-4">Por Lado (Barra {barWeightKg}k)</th>
                      <th className="py-3 px-4">Anilhas Sugeridas</th>
                      <th className="py-3 px-4">Zona / Intensidade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 font-mono">
                    {ladder.map((row) => (
                      <tr
                        key={row.percentage}
                        className={`hover:bg-zinc-900/80 transition-colors ${
                          row.percentage === 100 ? 'bg-amber-500/10 font-bold' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-sans font-bold">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs ${
                              row.percentage === 100
                                ? 'bg-amber-500 text-zinc-950 font-black'
                                : row.percentage > 100
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                : 'bg-zinc-800 text-zinc-200'
                            }`}
                          >
                            {row.percentage}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm font-bold text-zinc-100">
                          {formatWeight(row.weight, unit)}
                        </td>
                        <td className="py-3 px-4 text-zinc-300">
                          {formatWeight(row.weightPerSide, unit)}
                        </td>
                        <td className="py-3 px-4 font-sans">
                          {row.plates.length === 0 ? (
                            <span className="text-zinc-500 italic text-[11px]">
                              Apenas a barra
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {row.plates.map((p, pIdx) => (
                                <span
                                  key={pIdx}
                                  className="px-1.5 py-0.5 rounded text-[10px] font-bold border"
                                  style={{
                                    backgroundColor: `${p.color}25`,
                                    borderColor: p.color,
                                    color: p.color === '#F4F4F5' ? '#FFF' : p.color,
                                  }}
                                >
                                  {p.count}x {p.label}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 font-sans text-xs">
                          <span className="text-zinc-400">{row.intensityLabel}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE CALCULATOR & BARBELL */}
          {activeTab === 'interactive' && (
            <div className="space-y-6">
              {/* Dial / Slider */}
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Definir Porcentagem Solicitada pelo Treinador:
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black font-display text-amber-400">
                      {customPct}%
                    </span>
                    <span className="text-xs text-zinc-400 font-sans">do seu 1RM</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="20"
                  max="120"
                  step="1"
                  value={customPct}
                  onChange={(e) => setCustomPct(parseInt(e.target.value) || 70)}
                  className="w-full accent-amber-400 h-2 bg-zinc-800 rounded-lg cursor-pointer"
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[50, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setCustomPct(pct)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        customPct === pct
                          ? 'bg-amber-500 text-zinc-950 shadow'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>

                {/* Target Calculated Metric */}
                <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">
                      Carga Alvo para {customPct}%:
                    </span>
                    <div className="text-4xl font-black font-display text-zinc-100">
                      {formatWeight(customTargetKg, unit)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">
                      Carga de cada lado da barra:
                    </span>
                    <div className="text-2xl font-bold font-mono text-amber-400">
                      {formatWeight(Math.max(0, (customTargetKg - barWeightKg) / 2), unit)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Barbell Visualizer */}
              <BarbellVisualizer
                totalWeightKg={customTargetKg}
                barWeightKg={barWeightKg}
                plates={customPlates}
                unit={unit}
              />
            </div>
          )}

          {/* TAB 3: STRENGTH STANDARDS & STUDENT ANALYSIS */}
          {activeTab === 'analysis' && (
            <div className="space-y-5">
              {athleteProfile ? (
                (() => {
                  const evalResult = evaluateStrength(exercise.id, exercise.currentPR, athleteProfile);
                  return (
                    <div className="space-y-4">
                      {/* Top Bio Header */}
                      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-zinc-100">{athleteProfile.name}</span>
                              <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full font-mono">
                                {athleteProfile.gender === 'female' ? 'Feminino' : 'Masculino'}
                              </span>
                            </div>
                            <div className="text-xs text-zinc-400 flex items-center gap-3 mt-0.5">
                              <span>Peso: <strong className="text-zinc-200">{athleteProfile.bodyWeightKg} kg</strong></span>
                              <span>Altura: <strong className="text-zinc-200">{athleteProfile.heightCm} cm</strong></span>
                              {evalResult.bmi > 0 && <span>IMC: <strong className="text-amber-400">{evalResult.bmi}</strong></span>}
                            </div>
                          </div>
                        </div>

                        {onOpenProfile && (
                          <button
                            type="button"
                            onClick={onOpenProfile}
                            className="text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-xl font-bold transition-colors"
                          >
                            Editar Dados do Aluno
                          </button>
                        )}
                      </div>

                      {/* Main Strength Diagnosis Box */}
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-zinc-950 to-zinc-900 border border-zinc-800 space-y-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">
                              Classificação do Aluno em {exercise.name}
                            </span>
                            <div className="text-lg sm:text-xl font-black text-zinc-100 mt-1 font-display flex items-center gap-2">
                              <span>{evalResult.tierLabel}</span>
                            </div>
                          </div>

                          <div className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase border ${evalResult.tierBg}`}>
                            {evalResult.ratio > 0 ? `${evalResult.ratio}x Peso Corporal` : 'Sem Carga'}
                          </div>
                        </div>

                        {/* Progress Meter with Tiers */}
                        <div className="space-y-2">
                          <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden flex border border-zinc-800">
                            <div
                              className={`h-full transition-all duration-500 ${
                                evalResult.tier === 'elite'
                                  ? 'bg-amber-400'
                                  : evalResult.tier === 'avancado'
                                  ? 'bg-emerald-400'
                                  : evalResult.tier === 'intermediario'
                                  ? 'bg-cyan-400'
                                  : 'bg-indigo-400'
                              }`}
                              style={{ width: `${evalResult.progressPercent}%` }}
                            />
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px]">
                            <div className={`p-2 rounded-xl border ${evalResult.tier === 'iniciante' ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300 font-bold' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}>
                              <div className="font-bold">Iniciante</div>
                              <div className="font-mono text-zinc-300 mt-0.5">{evalResult.standardBenchmark.beginner} kg</div>
                            </div>
                            <div className={`p-2 rounded-xl border ${evalResult.tier === 'intermediario' ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 font-bold' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}>
                              <div className="font-bold">Na Média</div>
                              <div className="font-mono text-zinc-300 mt-0.5">{evalResult.standardBenchmark.intermediate} kg</div>
                            </div>
                            <div className={`p-2 rounded-xl border ${evalResult.tier === 'avancado' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-bold' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}>
                              <div className="font-bold">Acima da Média</div>
                              <div className="font-mono text-zinc-300 mt-0.5">{evalResult.standardBenchmark.advanced} kg</div>
                            </div>
                            <div className={`p-2 rounded-xl border ${evalResult.tier === 'elite' ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-bold' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}>
                              <div className="font-bold">Elite</div>
                              <div className="font-mono text-zinc-300 mt-0.5">{evalResult.standardBenchmark.elite} kg</div>
                            </div>
                          </div>
                        </div>

                        {/* Detailed Diagnostic Text */}
                        <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
                          {evalResult.description}
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="p-6 text-center text-zinc-400">
                  <User className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                  <p className="text-sm font-bold">Perfil do Aluno não configurado</p>
                  <p className="text-xs text-zinc-500 mt-1">Configure o peso e altura para calcular as médias de força.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PR HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Linha do Tempo de Recordes Pessoais:
                </h4>
                <button
                  onClick={() => setShowAddPrForm(true)}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Registro</span>
                </button>
              </div>

              {exercise.history.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-zinc-950/60 border border-zinc-800 text-zinc-500 text-xs">
                  Nenhum histórico registrado ainda. Toque em "Registrar Novo PR" para começar seu diário de cargas!
                </div>
              ) : (
                <div className="space-y-2.5">
                  {exercise.history
                    .slice()
                    .reverse()
                    .map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-4 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold shrink-0">
                            <Trophy className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-black font-display text-zinc-100">
                                {formatWeight(item.weight, unit)}
                              </span>
                              {item.reps && item.reps > 1 && (
                                <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-mono">
                                  {item.reps} reps
                                </span>
                              )}
                              {item.weight === exercise.currentPR && (
                                <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1.5 py-0.2 rounded uppercase font-black">
                                  Atual 1RM
                                </span>
                              )}
                            </div>
                            {item.notes && (
                              <p className="text-xs text-zinc-400 mt-0.5">{item.notes}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right text-xs text-zinc-400 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                            <span>{item.date}</span>
                          </div>
                          {onDeleteHistoryLog && item.id && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Excluir o registro de ${formatWeight(item.weight, unit)} de ${item.date}?`)) {
                                  onDeleteHistoryLog(exercise.id, item.id);
                                }
                              }}
                              className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 p-1.5 rounded-lg hover:bg-zinc-900 transition-all"
                              title="Remover este registro histórico"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ESTIMATOR 1RM */}
          {activeTab === 'estimator' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                  Calcular 1RM com Base em Repetições (Ex: 3RM, 5RM)
                </h4>
                <p className="text-xs text-zinc-400 mb-4">
                  Se você realizou uma série pesada de múltiplas repetições (ex: 5 repetições com 100kg), nós calculamos a sua carga máxima teórica (1 repetição).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-400 block mb-1">
                      Carga Utilizada ({unit.toUpperCase()}):
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={estWeight}
                      onChange={(e) => setEstWeight(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-400 block mb-1">
                      Repetições Executadas (1-12 reps):
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="15"
                      value={estReps}
                      onChange={(e) => setEstReps(parseInt(e.target.value) || 1)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Estimates Output */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-zinc-950 border border-amber-500/40 text-center">
                  <div className="text-[10px] uppercase font-bold text-amber-400">
                    Fórmula Epley (Padrão)
                  </div>
                  <div className="text-3xl font-black font-display text-zinc-100 mt-1">
                    {formatWeight(estimates.epley, unit)}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-zinc-400">
                    Fórmula Brzycki
                  </div>
                  <div className="text-2xl font-bold font-display text-zinc-300 mt-1">
                    {formatWeight(estimates.brzycki, unit)}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-zinc-400">
                    Média Científica
                  </div>
                  <div className="text-2xl font-bold font-display text-zinc-300 mt-1">
                    {formatWeight(estimates.average, unit)}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleApplyEstimate}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-yellow-400 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Aplicar {formatWeight(estimates.epley, unit)} como novo 1RM</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs">
          {exercise.isCustom && onDeleteExercise ? (
            <button
              onClick={() => {
                if (confirm(`Tem certeza que deseja excluir o exercício "${exercise.name}"?`)) {
                  onDeleteExercise(exercise.id);
                  onClose();
                }
              }}
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Excluir Exercício</span>
            </button>
          ) : (
            <div className="text-zinc-500 text-[11px]">
              StrongProgress • Alta Performance
            </div>
          )}

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
