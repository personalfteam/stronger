import React, { useState } from 'react';
import { Calculator, Copy, Check, Dumbbell, Sparkles, Layers, ArrowRight, Save } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Exercise, WeightUnit, BarbellType, PRLogEntry } from '../types';
import {
  calculatePercentage,
  formatWeight,
  calculatePlatesForBar,
  KG_TO_LBS,
  LBS_TO_KG,
} from '../utils/calculator';
import { BARBELL_SPECS } from '../data/initialExercises';
import { BarbellVisualizer } from './BarbellVisualizer';

interface QuickPercentageCalculatorProps {
  exercises: Exercise[];
  unit: WeightUnit;
  barbell: BarbellType;
  isPro: boolean;
  onUpdatePR?: (id: string, newPR: number, log?: Partial<PRLogEntry>) => void;
  onOpenUpgrade: () => void;
}

export const QuickPercentageCalculator: React.FC<QuickPercentageCalculatorProps> = ({
  exercises,
  unit,
  barbell,
  isPro,
  onUpdatePR,
  onOpenUpgrade,
}) => {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(
    exercises[0]?.id || ''
  );
  const [customWeightInput, setCustomWeightInput] = useState<string>('');
  const [useCustomBase, setUseCustomBase] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<number>(60);
  const [copied, setCopied] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Ladder set sequence generator
  const [ladderSequence, setLadderSequence] = useState<string>('50, 60, 70, 80, 85');
  const [showLadderView, setShowLadderView] = useState<boolean>(false);

  const selectedExercise = exercises.find((e) => e.id === selectedExerciseId);

  const currentBarSpec = BARBELL_SPECS.find((b) => b.id === barbell) || BARBELL_SPECS[0];
  const barWeightKg = currentBarSpec.weightKg;

  // Compute Base 1RM
  const baseKg = useCustomBase
    ? unit === 'lbs'
      ? (parseFloat(customWeightInput) || 0) * LBS_TO_KG
      : parseFloat(customWeightInput) || 0
    : selectedExercise?.currentPR || 0;

  const targetKg = calculatePercentage(baseKg, percentage);
  const targetPlates = calculatePlatesForBar(targetKg, barWeightKg);
  const loadPerSideKg = Math.max(0, (targetKg - barWeightKg) / 2);

  const handleSaveAsPR = () => {
    if (!selectedExercise || !onUpdatePR || baseKg <= 0) return;
    onUpdatePR(selectedExercise.id, baseKg, {
      notes: `Salvo via Calculadora Rápida (${percentage}%: ${formatWeight(targetKg, unit)})`,
      date: new Date().toISOString().split('T')[0],
      reps: 1,
    });
    setSavedSuccess(true);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
    });
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Generate sequence items
  const sequencePercentages = ladderSequence
    .split(/[,-\s]+/)
    .map((s) => parseFloat(s.trim()))
    .filter((n) => !isNaN(n) && n > 0);

  const handleCopySummary = () => {
    let text = `🏋️ StrongProgress • Cargas Calculadas:\n`;
    text += `Movimento: ${useCustomBase ? 'Carga Personalizada' : selectedExercise?.name}\n`;
    text += `1RM Base: ${formatWeight(baseKg, unit)}\n`;
    text += `Alvo ${percentage}%: ${formatWeight(targetKg, unit)} (Barra ${barWeightKg}kg + ${formatWeight(loadPerSideKg, unit)} por lado)\n`;

    if (showLadderView && sequencePercentages.length > 0) {
      text += `\n📋 Progressão de Séries:\n`;
      sequencePercentages.forEach((p, idx) => {
        const wKg = calculatePercentage(baseKg, p);
        text += `Série ${idx + 1} (${p}%): ${formatWeight(wKg, unit)}\n`;
      });
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-100 flex items-center gap-2">
              <span>Calculadora de Porcentagem do WOD</span>
              <span className="bg-amber-500/20 text-amber-400 text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border border-amber-500/30">
                Floor Mode
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Escolha o exercício e a porcentagem prescrita pelo coach para ver a carga imediata.
            </p>
          </div>
        </div>

        <button
          onClick={handleCopySummary}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copiado para WhatsApp!' : 'Copiar Cargas'}</span>
        </button>
      </div>

      {/* Input Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1: Base Movement */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              1. Selecione o Exercício ou Digite 1RM:
            </label>
            <button
              onClick={() => setUseCustomBase(!useCustomBase)}
              className="text-[11px] text-amber-400 hover:underline font-semibold"
            >
              {useCustomBase ? 'Escolher da Lista' : 'Digitar Carga Avulsa'}
            </button>
          </div>

          {!useCustomBase ? (
            <div className="space-y-2">
              <select
                value={selectedExerciseId}
                onChange={(e) => setSelectedExerciseId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm font-bold text-zinc-100 focus:outline-none focus:border-amber-500"
              >
                {exercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} — 1RM: {formatWeight(ex.currentPR, unit)}
                  </option>
                ))}
              </select>

              {selectedExercise && (
                <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                  <span>1RM Cadastrado:</span>
                  <strong className="text-amber-400 font-mono text-sm">
                    {formatWeight(selectedExercise.currentPR, unit)}
                  </strong>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  placeholder={`Ex: 100 (${unit.toUpperCase()})`}
                  value={customWeightInput}
                  onChange={(e) => setCustomWeightInput(e.target.value)}
                  className="w-full bg-zinc-900 border border-amber-500 rounded-xl px-3 py-2 text-sm font-bold text-zinc-100 focus:outline-none"
                />
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase">
                  {unit}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] text-zinc-500">
                  Carga avulsa de referência para cálculo.
                </p>
                {selectedExercise && baseKg > 0 && onUpdatePR && (
                  <button
                    type="button"
                    onClick={handleSaveAsPR}
                    className={`text-[11px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 transition-all ${
                      savedSuccess
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30'
                    }`}
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Salvo no Exercício!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3 h-3" />
                        <span>Salvar no {selectedExercise.name}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Percentage Selector */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              2. Porcentagem Prescrita:
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="10"
                max="130"
                value={percentage}
                onChange={(e) => setPercentage(parseFloat(e.target.value) || 0)}
                className="w-16 bg-zinc-900 border border-amber-500 rounded px-2 py-0.5 text-center text-sm font-black font-display text-amber-400 focus:outline-none"
              />
              <span className="text-sm font-black text-amber-400">%</span>
            </div>
          </div>

          {/* Slider */}
          <input
            type="range"
            min="30"
            max="115"
            step="1"
            value={percentage}
            onChange={(e) => setPercentage(parseInt(e.target.value) || 60)}
            className="w-full accent-amber-400 h-2 bg-zinc-800 rounded-lg cursor-pointer"
          />

          {/* Quick Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {[50, 60, 65, 70, 75, 80, 85, 90, 95].map((pct) => (
              <button
                key={pct}
                onClick={() => setPercentage(pct)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  percentage === pct
                    ? 'bg-amber-500 text-zinc-950 shadow-md'
                    : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Calculated Metric Hero */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Carga Resultante para {percentage}% do 1RM:</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl sm:text-6xl font-black font-display text-zinc-100 tracking-tight leading-none">
              {formatWeight(targetKg, unit)}
            </span>
          </div>
          <div className="text-xs text-zinc-400 mt-1">
            Barra Olímpica de <strong>{barWeightKg}kg</strong> +{' '}
            <strong className="text-amber-400 font-mono">
              {formatWeight(loadPerSideKg, unit)} por lado
            </strong>
          </div>
        </div>

        {/* Quick Plate Summary Pills */}
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3.5 max-w-sm w-full">
          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Anilhas a colocar por lado:
          </div>
          {targetPlates.length === 0 ? (
            <div className="text-xs text-zinc-500 italic">
              Apenas o peso da barra ({barWeightKg}kg).
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {targetPlates.map((p, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-xs font-bold border"
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
        </div>
      </div>

      {/* Barbell Graphic Representation */}
      <BarbellVisualizer
        totalWeightKg={targetKg}
        barWeightKg={barWeightKg}
        plates={targetPlates}
        unit={unit}
      />

      {/* Toggle Multi-set Sequence / Ladder */}
      <div className="pt-2">
        <button
          onClick={() => setShowLadderView(!showLadderView)}
          className="text-xs font-bold text-zinc-400 hover:text-amber-400 flex items-center gap-1.5 transition-colors"
        >
          <Layers className="w-4 h-4" />
          <span>
            {showLadderView ? 'Ocultar Construtor de Séries do Treino' : 'Construir Séries Múltiplas do Treino (Ex: 50% -> 60% -> 70% -> 80%)'}
          </span>
        </button>

        {showLadderView && (
          <div className="mt-3 p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Sequência de Porcentagens (separadas por vírgula):
              </label>
              <span className="text-[11px] text-zinc-500">
                Ex: 50, 60, 70, 80, 85, 90
              </span>
            </div>

            <input
              type="text"
              value={ladderSequence}
              onChange={(e) => setLadderSequence(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono text-zinc-100 focus:border-amber-500 focus:outline-none"
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2">
              {sequencePercentages.map((pct, idx) => {
                const sKg = calculatePercentage(baseKg, pct);
                const sPerSide = Math.max(0, (sKg - barWeightKg) / 2);
                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-center"
                  >
                    <div className="text-[10px] text-zinc-400 font-bold uppercase">
                      Série {idx + 1} ({pct}%)
                    </div>
                    <div className="text-base font-black font-display text-amber-400 mt-0.5">
                      {formatWeight(sKg, unit)}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      +{formatWeight(sPerSide, unit)}/lado
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
