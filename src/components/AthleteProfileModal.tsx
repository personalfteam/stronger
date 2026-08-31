import React, { useState } from 'react';
import {
  User,
  X,
  Scale,
  Ruler,
  TrendingUp,
  Award,
  Activity,
  Check,
  Save,
  HelpCircle,
  Dumbbell,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AthleteProfile, Exercise, GenderType, ExperienceLevel, WeightUnit } from '../types';
import {
  evaluateStrength,
  calculateBMI,
  getOverallAthleteSummary,
} from '../utils/strengthStandards';
import { formatWeight } from '../utils/calculator';

interface AthleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AthleteProfile;
  exercises: Exercise[];
  unit: WeightUnit;
  onSaveProfile: (profile: AthleteProfile) => void;
}

export const AthleteProfileModal: React.FC<AthleteProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  exercises,
  unit,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<AthleteProfile>({ ...profile });
  const [activeTab, setActiveTab] = useState<'profile' | 'benchmarks'>('profile');
  const [showSavedToast, setShowSavedToast] = useState(false);

  if (!isOpen) return null;

  const bmiInfo = calculateBMI(formData.bodyWeightKg, formData.heightCm);
  const summary = getOverallAthleteSummary(exercises, formData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 1200);
  };

  const keyBenchmarkExercises = [
    { id: 'back-squat', label: 'Back Squat (Agachamento)' },
    { id: 'deadlift', label: 'Deadlift (Levantamento Terra)' },
    { id: 'bench-press', label: 'Bench Press (Supino Reto)' },
    { id: 'clean-and-jerk', label: 'Clean & Jerk (Arremesso)' },
    { id: 'snatch', label: 'Snatch (Arranco)' },
    { id: 'strict-press', label: 'Strict Press (Desenvolvimento)' },
    { id: 'front-squat', label: 'Front Squat (Agachamento Frontal)' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-br from-zinc-800/90 to-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-inner">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-zinc-100 font-display">
                  Dados do Aluno & Avaliação de Força
                </h2>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Parâmetros corporais para calibrar se as cargas estão na média ou acima
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 flex items-center justify-center transition-colors border border-zinc-700/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/60 px-5 sm:px-6">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Perfil & Biometria</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('benchmarks')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'benchmarks'
                ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Diagnóstico de Cargas</span>
            <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.2 rounded-full border border-zinc-700">
              {summary.overallRating.split(' ')[0]}
            </span>
          </button>
        </div>

        <div className="p-5 sm:p-6 max-h-[72vh] overflow-y-auto space-y-6">
          {activeTab === 'profile' ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Live Status Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-zinc-950 to-zinc-900 border border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Peso Atual</span>
                  <div className="text-lg font-black text-zinc-100 font-display">
                    {formData.bodyWeightKg} kg
                  </div>
                  <span className="text-[10px] text-zinc-400">
                    ≈ {(formData.bodyWeightKg * 2.20462).toFixed(1)} lbs
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Altura & IMC</span>
                  <div className="text-lg font-black text-amber-400 font-display">
                    {bmiInfo.bmi > 0 ? bmiInfo.bmi : '--'}
                  </div>
                  <span className="text-[10px] text-zinc-400 truncate block">
                    {bmiInfo.classification}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Razão de Força</span>
                  <div className="text-lg font-black text-emerald-400 font-display">
                    {summary.averageRatio > 0 ? `${summary.averageRatio}x BW` : '--'}
                  </div>
                  <span className="text-[10px] text-zinc-400">
                    Média de carga / peso
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Status Geral</span>
                  <div className={`text-xs font-bold ${summary.overallColor} truncate font-display`}>
                    {summary.overallRating}
                  </div>
                  <span className="text-[10px] text-zinc-400">
                    {summary.aboveAverageCount} acima da média
                  </span>
                </div>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome do Aluno */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-zinc-300 block">
                    Nome do Aluno / Atleta:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Carlos Silva"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Sexo Biológico (para tabela de referências de força) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                    <span>Sexo Biológico:</span>
                    <span className="text-[10px] text-zinc-500 font-normal">Calibra as tabelas</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: 'male' })}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        formData.gender === 'male'
                          ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-sm'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      Masculino
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: 'female' })}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        formData.gender === 'female'
                          ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-sm'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      Feminino
                    </button>
                  </div>
                </div>

                {/* Nível Auto-declarado */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300 block">
                    Tempo de Prática:
                  </label>
                  <select
                    value={formData.experienceLevel || 'intermediario'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        experienceLevel: e.target.value as ExperienceLevel,
                      })
                    }
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="iniciante">Iniciante (menos de 6 meses)</option>
                    <option value="intermediario">Intermediário (6 meses a 2 anos)</option>
                    <option value="avancado">Avançado (2 a 5 anos)</option>
                    <option value="elite">Elite / Atleta Competitivo (5+ anos)</option>
                  </select>
                </div>

                {/* Peso Corporal (KG) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-amber-400" />
                      <span>Peso Corporal (kg):</span>
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono font-bold">
                      Fundamental
                    </span>
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="30"
                    max="250"
                    required
                    value={formData.bodyWeightKg}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bodyWeightKg: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="Ex: 78.5"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 font-mono font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Altura (CM) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <Ruler className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Altura (cm):</span>
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="100"
                    max="240"
                    value={formData.heightCm}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        heightCm: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Ex: 175"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Idade */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300 block">
                    Idade (anos):
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={formData.age || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        age: parseInt(e.target.value) || undefined,
                      })
                    }
                    placeholder="Ex: 28"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Observações / Metas do Aluno */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-zinc-300 block">
                    Observações & Objetivos do Aluno:
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Ex: Foco em subir o Snatch para 100kg e consolidar o Back Squat em 2x o peso corporal."
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Dados do Aluno</span>
                </button>
              </div>
            </form>
          ) : (
            /* Tab: Benchmarks & Cargas vs Médias */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-zinc-200">
                      Critérios de Referência de Força (Base: {formData.bodyWeightKg}kg de peso)
                    </span>
                  </div>
                  <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md font-mono">
                    {formData.gender === 'female' ? 'Tabela Feminina' : 'Tabela Masculina'}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Abaixo está o comparativo das cargas atuais de <strong>{formData.name}</strong> contra os padrões fisiológicos internacionais de força relativa ao peso corporal.
                </p>
              </div>

              {/* Table of Exercises */}
              <div className="space-y-2.5">
                {keyBenchmarkExercises.map((bm) => {
                  const ex = exercises.find((e) => e.id === bm.id);
                  const prKg = ex?.currentPR || 0;
                  const evalRes = evaluateStrength(bm.id, prKg, formData);

                  return (
                    <div
                      key={bm.id}
                      className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400 flex items-center justify-center font-bold text-xs">
                            <Dumbbell className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-zinc-100">{bm.label}</div>
                            <div className="text-[11px] text-zinc-400">
                              Carga Atual: <strong className="text-zinc-200">{prKg > 0 ? formatWeight(prKg, unit) : 'Sem carga'}</strong>
                              {prKg > 0 && (
                                <span className="ml-1.5 text-amber-400 font-mono font-semibold">
                                  ({evalRes.ratio}x Peso Corporal)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase border shrink-0 ${evalRes.tierBg}`}>
                          {evalRes.tierLabel.split(' ')[0]} {evalRes.tierLabel.split(' ')[1] || ''}
                        </div>
                      </div>

                      {/* Progress Bar with Milestones */}
                      <div className="space-y-1">
                        <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden flex border border-zinc-800">
                          <div
                            className={`h-full transition-all duration-500 ${
                              evalRes.tier === 'elite'
                                ? 'bg-amber-400'
                                : evalRes.tier === 'avancado'
                                ? 'bg-emerald-400'
                                : evalRes.tier === 'intermediario'
                                ? 'bg-cyan-400'
                                : 'bg-indigo-400'
                            }`}
                            style={{ width: `${evalRes.progressPercent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                          <span>Iniciante ({evalRes.standardBenchmark.beginner}kg)</span>
                          <span className="text-cyan-400 font-bold">Média ({evalRes.standardBenchmark.intermediate}kg)</span>
                          <span className="text-emerald-400 font-bold">Acima ({evalRes.standardBenchmark.advanced}kg)</span>
                          <span className="text-amber-400">Elite ({evalRes.standardBenchmark.elite}kg)</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-zinc-400 leading-snug pt-1">
                        {evalRes.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Legend & Note */}
              <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/60 text-[11px] text-zinc-400 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Como funciona a referência:</strong> A razão é calculada dividindo a carga máxima (1RM) pelo peso corporal do aluno ({formData.bodyWeightKg}kg). Atletas com razão acima de 1.5x a 2.0x no agachamento e terra são formalmente categorizados como <em>Acima da Média</em>.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Toast */}
        {showSavedToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-zinc-950 font-black text-xs px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
            <Check className="w-4 h-4" />
            <span>Dados do Aluno Salvos com Sucesso!</span>
          </div>
        )}
      </div>
    </div>
  );
};
