import React from 'react';
import { Crown, Sparkles, CheckCircle2, Smartphone, ArrowRight, ShieldCheck } from 'lucide-react';
import { UserSubscription } from '../types';

interface KiwifyWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: UserSubscription;
  onOpenDownload: () => void;
}

export const KiwifyWelcomeModal: React.FC<KiwifyWelcomeModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onOpenDownload,
}) => {
  if (!isOpen) return null;

  const isLifetime = subscription.plan === 'lifetime';
  const planLabel = isLifetime ? 'Acesso Vitalício (Para Sempre)' : 'Assinatura PRO Ativa';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-zinc-900 border-2 border-amber-500 rounded-3xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in duration-300">
        {/* Top Celebration Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 p-6 text-zinc-950 text-center relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 opacity-15 rotate-12">
            <Crown className="w-36 h-36 text-zinc-950" />
          </div>
          
          <div className="w-16 h-16 rounded-2xl bg-zinc-950 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-xl">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>

          <span className="inline-block px-3 py-1 bg-zinc-950 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full mb-2 shadow">
            🎉 Kiwify • Pagamento Confirmado!
          </span>

          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-display text-zinc-950">
            {subscription.buyerName ? `Bem-vindo, ${subscription.buyerName}!` : 'Seja Bem-vindo ao StrongProgress PRO!'}
          </h2>
          <p className="text-xs font-bold text-zinc-900/90 mt-1 max-w-sm mx-auto">
            Seu {planLabel} foi ativado com sucesso. Todas as funcionalidades e o direito de instalar o app estão 100% liberados!
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Status Card */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-emerald-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Status: {isLifetime ? 'Vitalício Liberado' : 'Mensalidade Ativa'}
                </div>
                <div className="text-[11px] text-zinc-400">
                  {subscription.buyerEmail ? `Vinculado a: ${subscription.buyerEmail}` : 'Ativação automática via Link Mágico Kiwify'}
                </div>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-black uppercase">
              100% PRO
            </span>
          </div>

          {/* Unlocked Highlights */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">
              O que você acaba de desbloquear:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                '📱 Instalar App no Celular (PWA Offline)',
                '🏋️ Catálogo Completo de LPO & CrossFit',
                '🎨 Calculadora Visual de Anilhas & Barras',
                '📊 Tabela Completa de Porcentagens',
                '📈 Histórico de Recordes & Evolução',
                '⚡ Estimador 1RM & Zonas RPE',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-zinc-200">
                  <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 text-[10px] font-bold">
                    ✓
                  </div>
                  <span className="font-medium text-[11px]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Action: Install App Button */}
          <div className="pt-2 space-y-3">
            <button
              onClick={() => {
                onClose();
                onOpenDownload();
              }}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2.5 transition-all transform active:scale-95"
            >
              <Smartphone className="w-5 h-5 text-zinc-950" />
              <span>Instalar / Baixar App no Celular ou PC</span>
              <ArrowRight className="w-4 h-4 text-zinc-950" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              Acessar Painel do App Agora
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Seus recordes e treinos ficam salvos com segurança.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
