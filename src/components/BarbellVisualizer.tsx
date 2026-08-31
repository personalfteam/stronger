import React from 'react';
import { PlateCount, WeightUnit } from '../types';
import { formatWeight } from '../utils/calculator';

interface BarbellVisualizerProps {
  totalWeightKg: number;
  barWeightKg: number;
  plates: PlateCount[];
  unit: WeightUnit;
}

export const BarbellVisualizer: React.FC<BarbellVisualizerProps> = ({
  totalWeightKg,
  barWeightKg,
  plates,
  unit,
}) => {
  const loadTotal = Math.max(0, totalWeightKg - barWeightKg);
  const loadPerSide = loadTotal / 2;

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 sm:p-5">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
            Montagem da Barra
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-amber-400 font-mono font-medium border border-zinc-700">
            Barra {barWeightKg}kg ({unit === 'lbs' ? `${Math.round(barWeightKg * 2.20462)} lbs` : ''})
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs text-zinc-400">Carga por lado: </span>
          <span className="text-sm font-bold text-zinc-100 font-mono">
            {formatWeight(loadPerSide, unit)}
          </span>
        </div>
      </div>

      {/* Barbell Graphic Representation */}
      <div className="relative py-6 px-2 flex items-center justify-center overflow-x-auto select-none">
        <div className="flex items-center min-w-[320px] max-w-full justify-center">
          {/* Left Plates (Mirrored) */}
          <div className="flex items-center justify-end flex-row-reverse gap-1 pr-1">
            {plates.map((plate, pIdx) =>
              Array.from({ length: plate.count }).map((_, cIdx) => (
                <div
                  key={`left-${pIdx}-${cIdx}`}
                  className="relative rounded-sm flex items-center justify-center font-bold text-[10px] shadow-md border"
                  style={{
                    backgroundColor: plate.color,
                    color: plate.textColor,
                    borderColor: plate.borderColor || 'rgba(0,0,0,0.3)',
                    height: getPlatePixelHeight(plate.weight),
                    width: getPlatePixelWidth(plate.weight),
                  }}
                  title={`Anilha ${plate.label}`}
                >
                  <span className="rotate-90 origin-center leading-none text-[9px] tracking-tighter whitespace-nowrap">
                    {plate.label}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Left Collar */}
          <div className="w-2.5 h-16 bg-zinc-400 border border-zinc-600 rounded-sm shadow-inner" />

          {/* Left Sleeve Stop */}
          <div className="w-3.5 h-10 bg-zinc-500 border-y border-zinc-700" />

          {/* Barbell Center Shaft (Knurling) */}
          <div className="relative flex-1 min-w-[90px] sm:min-w-[140px] max-w-[200px] h-4 bg-gradient-to-b from-zinc-400 via-zinc-200 to-zinc-500 rounded-sm border border-zinc-600 shadow flex items-center justify-center">
            {/* Center knurl grip marks */}
            <div className="w-12 h-full bg-zinc-400/50 border-x border-zinc-500/80" />
            <div className="absolute -top-5 text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
              BARRA {barWeightKg}KG
            </div>
          </div>

          {/* Right Sleeve Stop */}
          <div className="w-3.5 h-10 bg-zinc-500 border-y border-zinc-700" />

          {/* Right Collar */}
          <div className="w-2.5 h-16 bg-zinc-400 border border-zinc-600 rounded-sm shadow-inner" />

          {/* Right Plates */}
          <div className="flex items-center justify-start gap-1 pl-1">
            {plates.map((plate, pIdx) =>
              Array.from({ length: plate.count }).map((_, cIdx) => (
                <div
                  key={`right-${pIdx}-${cIdx}`}
                  className="relative rounded-sm flex items-center justify-center font-bold text-[10px] shadow-md border"
                  style={{
                    backgroundColor: plate.color,
                    color: plate.textColor,
                    borderColor: plate.borderColor || 'rgba(0,0,0,0.3)',
                    height: getPlatePixelHeight(plate.weight),
                    width: getPlatePixelWidth(plate.weight),
                  }}
                  title={`Anilha ${plate.label}`}
                >
                  <span className="-rotate-90 origin-center leading-none text-[9px] tracking-tighter whitespace-nowrap">
                    {plate.label}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Textual Breakdown Pills */}
      <div className="mt-3 pt-3 border-t border-zinc-800/80">
        <div className="text-xs text-zinc-400 mb-2 font-medium">
          Anilhas por lado ({loadPerSide.toFixed(1)}kg):
        </div>
        {plates.length === 0 ? (
          <div className="text-xs text-zinc-500 italic">
            {totalWeightKg <= barWeightKg
              ? 'Apenas o peso da barra (sem anilhas adicionais).'
              : 'Nenhuma anilha padrão necessária.'}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {plates.map((p, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm border"
                style={{
                  backgroundColor: `${p.color}20`,
                  borderColor: p.color,
                  color: p.color === '#F4F4F5' ? '#FFFFFF' : p.color,
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: p.color }}
                />
                <span className="text-zinc-200">
                  {p.count}x {p.label}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function getPlatePixelHeight(weightKg: number): string {
  switch (weightKg) {
    case 25:
      return '92px';
    case 20:
      return '92px';
    case 15:
      return '92px';
    case 10:
      return '92px';
    case 5:
      return '70px';
    case 2.5:
      return '56px';
    case 1.25:
      return '44px';
    case 0.5:
      return '36px';
    default:
      return '60px';
  }
}

function getPlatePixelWidth(weightKg: number): string {
  switch (weightKg) {
    case 25:
      return '22px';
    case 20:
      return '19px';
    case 15:
      return '16px';
    case 10:
      return '14px';
    case 5:
      return '12px';
    case 2.5:
      return '10px';
    case 1.25:
      return '8px';
    case 0.5:
      return '6px';
    default:
      return '12px';
  }
}
