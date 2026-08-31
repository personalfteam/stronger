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
        period: 'pagamento único / vitalício',
        tag: 'PAGUE 1 VEZ • ACESSO VITALÍCIO',
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-zinc-900 border border-amber-500/40 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-auto">
        
        {/* Sticky Header with prominent, easily clickable Close Button */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 px-4 py-3.5 sm:px-5 sm:py-4 text-zinc-950 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-950 text-amber-400 flex items-center justify-center shadow font-black shrink-0">
              <Crown className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg sm:text-xl font-black tracking-tight font-display text-zinc-950 uppercase leading-none">
                  StrongProgress PRO
                </h2>
                <span className="bg-zinc-950 text-amber-400 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                  Completo
                </span>
              </div>
              <p className="text-[11px] font-semibold text-zinc-900/90 leading-tight mt-0.5">
                Destrave todos os recursos e instalação no celular
              </p>
            </div>
          </div>
          
          {/* Prominent, high-contrast Close Button */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-950/20 hover:bg-zinc-950 text-zinc-950 hover:text-amber-400 flex items-center justify-center text-sm font-black transition-all shrink-0 ml-2 shadow-sm"
            title="Fechar (Esc)"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          
          {/* Plan Selector Grid */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
              Escolha seu Modelo de Acesso:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {/* Lifetime Plan */}
              <button
                type="button"
                onClick={() => setSelectedBilling('lifetime')}
                className={`relative text-left p-3 rounded-xl border transition-all ${
                  selectedBilling === 'lifetime'
                    ? 'bg-amber-500/10 border-amber-500 shadow-sm ring-1 ring-amber-500/50'
                    : 'bg-zinc-800/40 border-zinc-700 hover:border-zinc-600'
                }`}
              >
                <span className="absolute -top-2 right-2 bg-amber-500 text-zinc-950 text-[9px] font-black uppercase px-2 py-0.2 rounded-full shadow">
                  Recomendado
                </span>
                <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  ⭐ Vitalício
                </div>
                <div className="text-lg font-black text-zinc-100 mt-0.5 font-display">
                  R$ {pricing.lifetimePrice.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-[10px] text-amber-400 font-bold mt-1">
                  ✓ Sem mensalidade
                </div>
              </button>

              {/* Monthly Plan */}
              <button
                type="button"
                onClick={() => setSelectedBilling('monthly')}
                className={`relative text-left p-3 rounded-xl border transition-all ${
                  selectedBilling === 'monthly'
                    ? 'bg-amber-500/10 border-amber-500 shadow-sm ring-1 ring-amber-500/50'
                    : 'bg-zinc-800/40 border-zinc-700 hover:border-zinc-600'
                }`}
              >
                <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  🔄 Mensal
                </div>
                <div className="text-lg font-black text-zinc-100 mt-0.5 font-display">
                  R$ {pricing.monthlyPrice.toFixed(2).replace('.', ',')}
                  <span className="text-[10px] text-zinc-400 font-normal">/mês</span>
                </div>
                <div className="text-[10px] text-zinc-300 font-medium mt-1">
                  ✓ Cancele quando quiser
                </div>
              </button>
            </div>
          </div>

          {/* Main Action & Price Callout */}
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-amber-400">
                {priceInfo.tag}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black font-display text-zinc-100">
                  {priceInfo.value}
                </span>
                <span className="text-[11px] text-zinc-400">{priceInfo.period}</span>
              </div>
            </div>
            
            <a
              href={getActiveCheckoutUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-black text-xs uppercase tracking-wider hover:from-amber-400 hover:to-yellow-400 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <span>Ir para Pagamento Seguro</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Unlocked Benefits list */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              O que você desbloqueia:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
              {[
                '📱 Instalar App no Celular (Ícone na Tela + 100% Offline)',
                'Exercícios Ilimitados + Criar Novos Movimentos',
                'Histórico Completo de PRs & Gráficos de Evolução',
                'Padrões de Força Relativa (Iniciante ao Elite)',
                'Estimador de 1RM com Fórmulas Oficiais',
                'Definição e Acompanhamento de Metas de Carga',
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-1.5 text-zinc-300 text-[11px] leading-tight">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Magic Link / Activation Code Area */}
          <div className="pt-3 border-t border-zinc-800/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Já comprou? Ative com sua Chave ou Link Mágico:
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
                  placeholder="Cole sua Chave ou Link de Acesso"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-8 pr-3 py-1.5 text-zinc-100 text-xs focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl font-black text-xs uppercase tracking-wider shrink-0 transition-all shadow"
              >
                Ativar
              </button>
            </form>

            {activationMsg && (
              <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{activationMsg}</span>
              </div>
            )}

            {couponError && (
              <div className="p-2 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-medium">
                {couponError}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer with quick dismiss */}
        <div className="p-3 bg-zinc-950/80 border-t border-zinc-800/80 flex items-center justify-between text-xs shrink-0">
          <span className="text-zinc-500 text-[11px]">Pagamento 100% seguro via Kiwify</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg text-xs font-bold transition-colors"
          >
            Voltar / Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
