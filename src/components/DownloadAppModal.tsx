import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  CheckCircle2,
  Apple,
  Chrome,
  Crown,
  Lock,
  ArrowDownToLine,
  ExternalLink,
  Monitor,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Exercise, WeightUnit, BarbellType, UserSubscription } from '../types';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercises: Exercise[];
  unit: WeightUnit;
  barbell: BarbellType;
  subscription: UserSubscription;
  onOpenUpgrade: () => void;
  deferredPrompt: any;
  onTriggerInstall: () => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onOpenUpgrade,
  deferredPrompt,
  onTriggerInstall,
}) => {
  const [installTriggered, setInstallTriggered] = useState(false);

  if (!isOpen) return null;

  const isPro = subscription.isActive;
  const isInsideIframe = typeof window !== 'undefined' && window.self !== window.top;

  const handleInstallClick = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    setInstallTriggered(true);

    if (deferredPrompt) {
      onTriggerInstall();
    } else if (isInsideIframe) {
      // Open in a standalone tab where Chrome/Edge can show the native install prompt
      window.open(window.location.href, '_blank');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-zinc-900 border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 px-4 py-3.5 sm:px-5 sm:py-4 text-zinc-950 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-950 text-amber-400 flex items-center justify-center shadow font-black shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg sm:text-xl font-black tracking-tight font-display text-zinc-950 uppercase leading-none">
                  Instalar App
                </h2>
                <span className="bg-zinc-950 text-amber-400 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                  {isPro ? 'PRO Ativo' : 'Exclusivo PRO'}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-zinc-900/90 leading-tight mt-0.5">
                Use em tela cheia e 100% offline no celular ou PC
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-950/20 hover:bg-zinc-950 text-zinc-950 hover:text-amber-400 flex items-center justify-center text-sm font-black transition-all shrink-0 ml-2"
            title="Fechar (Esc)"
          >
            ✕
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* IF NOT PRO: LOCKED STATE */}
          {!isPro ? (
            <div className="p-6 rounded-2xl bg-zinc-950 border border-amber-500/30 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-lg font-black uppercase text-zinc-100">
                  Recurso Exclusivo para Assinantes PRO
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  A instalação do aplicativo no celular ou computador com funcionamento 100% offline é liberada para assinantes do <strong>Plano Mensal</strong> ou <strong>Acesso Vitalício</strong>.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenUpgrade();
                  }}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl hover:from-amber-400 hover:to-yellow-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <Crown className="w-4 h-4" />
                  <span>Desbloquear Acesso PRO</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Direct Main Action Button */}
              <button
                onClick={handleInstallClick}
                className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 transition-all transform active:scale-98"
              >
                <ArrowDownToLine className="w-5 h-5 text-zinc-950" />
                <span>Instalar App Agora (PC / Celular)</span>
                {isInsideIframe && <ExternalLink className="w-4 h-4 text-zinc-950/80" />}
              </button>

              {/* PC Desktop Guide Card */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-amber-500/20 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Monitor className="w-4 h-4" />
                  <span>Como Instalar no Computador (Windows / Mac)</span>
                </div>
                <div className="text-xs text-zinc-300 space-y-2 leading-relaxed">
                  <p>
                    O aplicativo é um <strong>PWA Nativo</strong>. No Google Chrome, Edge ou Brave no PC:
                  </p>
                  <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl space-y-1.5 text-[11px] text-zinc-300">
                    <div className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">1.</span>
                      <span>
                        Olhe no <strong>canto direito da barra de endereços (onde fica o link do site)</strong>.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">2.</span>
                      <span>
                        Clique no ícone de <strong className="text-amber-400">computador com seta / botão "Instalar StrongProgress"</strong>.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">3.</span>
                      <span>
                        Ou clique nos <strong className="text-zinc-200">3 pontinhos do Chrome</strong> &gt; <strong className="text-amber-400">Salvar e Compartilhar &gt; Instalar StrongProgress</strong>.
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Ele criará um atalho oficial na sua Área de Trabalho e abrirá como aplicativo independente.
                  </p>
                </div>
              </div>

              {/* Mobile Quick Guide */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* iOS Instructions */}
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-zinc-200 font-bold text-xs">
                    <Apple className="w-4 h-4 text-zinc-400" />
                    <span>iPhone & iPad (Safari)</span>
                  </div>
                  <ol className="text-[11px] text-zinc-400 space-y-1.5 list-decimal list-inside leading-relaxed">
                    <li>Toque em <strong className="text-zinc-200">Compartilhar</strong> (ícone do quadrado).</li>
                    <li>Toque em <strong className="text-amber-400">"Adicionar à Tela de Início"</strong>.</li>
                    <li>Confirme em <strong className="text-zinc-200">"Adicionar"</strong>.</li>
                  </ol>
                </div>

                {/* Android Instructions */}
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-zinc-200 font-bold text-xs">
                    <Chrome className="w-4 h-4 text-amber-400" />
                    <span>Android (Chrome)</span>
                  </div>
                  <ol className="text-[11px] text-zinc-400 space-y-1.5 list-decimal list-inside leading-relaxed">
                    <li>Toque nos <strong className="text-zinc-200">3 pontinhos</strong> do navegador.</li>
                    <li>Selecione <strong className="text-amber-400">"Instalar aplicativo"</strong>.</li>
                    <li>Confirme a instalação.</li>
                  </ol>
                </div>
              </div>

              <div className="text-[11px] text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 p-2.5 rounded-xl text-center font-medium flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Funciona 100% offline no box de treino sem precisar de sinal de internet.</span>
              </div>
            </>
          )}

          {/* Footer Close */}
          <div className="pt-1 border-t border-zinc-800 text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
