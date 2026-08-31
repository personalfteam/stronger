import React, { useState } from 'react';
import { Plus, X, Dumbbell } from 'lucide-react';
import { Exercise, ExerciseCategory, WeightUnit } from '../types';
import { LBS_TO_KG } from '../utils/calculator';

interface CustomExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: WeightUnit;
  onAddExercise: (exercise: Exercise) => void;
}

export const CustomExerciseModal: React.FC<CustomExerciseModalProps> = ({
  isOpen,
  onClose,
  unit,
  onAddExercise,
}) => {
  const [name, setName] = useState('');
  const [portugueseName, setPortugueseName] = useState('');
  const [category, setCategory] = useState<ExerciseCategory>('lpo');
  const [description, setDescription] = useState('');
  const [initialPr, setInitialPr] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const prNum = parseFloat(initialPr) || 0;
    const finalKg = unit === 'lbs' ? prNum * LBS_TO_KG : prNum;

    const newExercise: Exercise = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      portugueseName: portugueseName.trim() || undefined,
      category,
      description: description.trim() || 'Movimento personalizado do atleta.',
      currentPR: Math.max(0, finalKg),
      isCustom: true,
      isFreeAvailable: true,
      isFavorite: true,
      history:
        finalKg > 0
          ? [
              {
                id: `log-${Date.now()}`,
                weight: finalKg,
                date: new Date().toISOString().split('T')[0],
                notes: 'Carga inicial cadastrada',
                reps: 1,
              },
            ]
          : [],
    };

    onAddExercise(newExercise);
    onClose();
    setName('');
    setPortugueseName('');
    setDescription('');
    setInitialPr('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-100">
                Adicionar Novo Exercício
              </h3>
              <p className="text-xs text-zinc-400">
                Cadastre um movimento ou complex específico do seu box.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 rounded-full w-8 h-8 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
              Nome do Movimento *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Complex Clean + Front Squat + Jerk"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 font-semibold focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExerciseCategory)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
              >
                <option value="lpo">LPO / Levantamento Olímpico</option>
                <option value="powerlifting">Força / Powerlifting</option>
                <option value="gymnastics">Ginástica com Carga</option>
                <option value="dumbbell_kb">Dumbbell & Kettlebell</option>
                <option value="custom">Outros / Complex</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                Carga 1RM Atual ({unit.toUpperCase()})
              </label>
              <input
                type="number"
                step="0.5"
                placeholder="Ex: 85"
                value={initialPr}
                onChange={(e) => setInitialPr(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm font-bold text-amber-400 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
              Nome em Português / Apelido (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Puxada Pesada + Agachamento"
              value={portugueseName}
              onChange={(e) => setPortugueseName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
              Descrição ou Dica Técnica (Opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Executar sem soltar a barra entre o clean e o jerk."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-xs font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-bold text-xs hover:from-amber-400 hover:to-yellow-400 flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Exercício</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
