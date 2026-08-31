import React, { useState } from 'react';
import { Check, Crown, ArrowRight, Settings, Key, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlanType, PricingConfig, UserSubscription } from '../types';
import { validateManualActivationCode } from '../utils/kiwify';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: UserSubscription;
  pricing: PricingConfig;
  onUpdateSubscription: (sub: UserSubscription) => void;
  onOpenSettings: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  subscription,
  pricing,
  onUpdateSubscription,
  onOpenSettings,
}) => {
  const [selectedBilling, setSelectedBilling] = useState<'lifetime' | 'monthly'>('lifetime');
  const [magicLinkInput, setMagicLinkInput] = useState('');
  const [activationMsg, setActivationMsg] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#10B981', '#3B82F6', '#FFFFFF'],
    });
  };

  const handleApplyMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateManualActivationCode(magicLinkInput, pricing);
    if (result.isActivated) {
      onUpdateSubscription({
        plan: result.plan,
        isActive: true,
        unlockedAt: new Date().toISOString(),
        promoCodeApplied: 'MAGIC_LINK_OR_KEY',
        source: result.source,
      });
      setActivationMsg(result.message);
      setCouponError('');
      triggerConfetti();
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setCouponError(result.message);
      setActivationMsg('');
    }
  };

  const getActiveCheckoutUrl = () => {
    if (selectedBilling === 'lifetime') return pricing.lifetimeCheckoutUrl || 'https://pay.kiwify.com.br/n3n2sqb';
    return pricing.monthlyCheckoutUrl || 'https://pay.kiwify.com.br/DL4VOlu';
  };

  const getActivePriceDisplay = () => {
    if (selectedBilling === 'lifetime') {
      return {
        value: `R$ ${pricing.lifetimePrice.toFixed(2).replace('.', ',')}`,
        period: 'pagamento único / acesso vitalício',
        tag: 'PAGUE 1 VEZ • ACESSO PARA SEMPRE',
      };
    }
    return {
      value: `R$ ${pricing.monthlyPrice.toFixed(2).replace('.', ',')}`,
      period: `/ mês`,
      tag: 'ASSINATURA MENSAL • CANCELE QUANDO QUISER',
    };
  };

  const priceInfo = getActivePriceDisplay();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Glowing Top Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 p-6 text-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-zinc-950 text-amber-400 flex items-center justify-center shadow-lg">
              <Crown className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight font-display text-zinc-950 uppercase">
                  StrongProgress PRO
                </h2>
                <span className="bg-zinc-950 text-amber-400 text-[11px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Alta Performance
                </span>
              </div>
              <p className="text-xs font-semibold text-zinc-900/90">
                Domine suas porcentagens e nunca mais erre uma carga no box.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-900 hover:text-zinc-950 hover:bg-black/10 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Plan Options Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 block">
              Escolha seu Modelo de Acesso:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Vitalício (Lifetime) */}
              <button
                type="button"
                onClick={() => setSelectedBilling('lifetime')}
                className={`relative text-left p-4.5 rounded-2xl border transition-all ${
                  selectedBilling === 'lifetime'
                    ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/50'
                    : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600'
                }`}
              >
                <span className="absolute -top-2.5 right-4 bg-amber-500 text-zinc-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow">
                  Mais Escolhido
                </span>
                <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                  ⭐ Pagamento Único
                </div>
                <div className="text-2xl font-black text-zinc-100 mt-1 font-display">
                  R$ {pricing.lifetimePrice.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-xs text-amber-400 font-bold mt-1.5 flex items-center gap-1">
                  <span>✓ Acesso Vitalício sem mensalidade</span>
                </div>
              </button>

              {/* Recorrência Mensal */}
              <button
                type="button"
                onClick={() => setSelectedBilling('monthly')}
                className={`relative text-left p-4.5 rounded-2xl border transition-all ${
                  selectedBilling === 'monthly'
                    ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/50'
                    : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600'
                }`}
              >
                <span className="absolute -top-2.5 right-4 bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                  Flexível
                </span>
                <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                  🔄 Assinatura Mensal
                </div>
                <div className="text-2xl font-black text-zinc-100 mt-1 font-display">
                  R$ {pricing.monthlyPrice.toFixed(2).replace('.', ',')}
                  <span className="text-xs text-zinc-400 font-normal"> /mês</span>
                </div>
                <div className="text-xs text-zinc-300 font-medium mt-1.5 flex items-center gap-1">
                  <span>✓ Cancele quando quiser</span>
                </div>
              </button>
            </div>
          </div>

          {/* Value Callout Box */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                {priceInfo.tag}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-display text-zinc-100">
                  {priceInfo.value}
                </span>
                <span className="text-xs text-zinc-400">{priceInfo.period}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={getActiveCheckoutUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-bold text-sm hover:from-amber-400 hover:to-yellow-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <span>Ir para Pagamento Seguro</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Features Comparison */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              O que você desbloqueia no StrongProgress PRO:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                '📱 Instalar App no Celular ou PC para uso 100% offline',
                'Exercícios Ilimitados + Criar Movimentos Personalizados',
                'Calculadora Visual de Anilhas Olímpicas (20kg / 15kg / 10kg)',
                'Tabela Completa de Porcentagens (40% a 115% com 1% precisão)',
                'Histórico Completo de PRs com Gráficos de Evolução',
                'Modo Box Rápido (Floor Mode) para consulta durante o WOD',
                'Construtor de Séries & Progressões Automáticas de Treino',
                'Estimador de 1RM com Fórmulas Epley, Brzycki e Lander',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-zinc-300">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Clean Magic Link Validation Form */}
          <div className="pt-3 border-t border-zinc-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Já comprou? Ative com seu Link Mágico ou Chave:
              </span>
              <button
                onClick={onOpenSettings}
                className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                title="Configurações de Checkout"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleApplyMagicLink} className="flex items-center gap-2 w-full">
              <div className="relative flex-1">
                <Key className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={magicLinkInput}
                  onChange={(e) => setMagicLinkInput(e.target.value)}
                  placeholder="Cole seu Link Mágico ou Chave de Acesso"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-zinc-100 text-xs focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl font-black text-xs uppercase tracking-wider shrink-0 transition-all shadow-md shadow-amber-500/20"
              >
                Ativar
              </button>
            </form>

            {activationMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{activationMsg}</span>
              </div>
            )}

            {couponError && (
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-medium">
                {couponError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
