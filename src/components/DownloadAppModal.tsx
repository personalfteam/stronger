import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  Laptop,
  CheckCircle2,
  HardDrive,
  Sparkles,
  Share2,
  Apple,
  Chrome,
  Crown,
  FileCode,
  ArrowDownToLine,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Exercise, WeightUnit, BarbellType, UserSubscription } from '../types';
import { generateStandaloneOfflineAppHtml } from '../utils/generateOfflineApp';

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
  exercises,
  unit,
  barbell,
  subscription,
  onOpenUpgrade,
  deferredPrompt,
  onTriggerInstall,
}) => {
  const [activeTab, setActiveTab] = useState<'pwa' | 'standalone' | 'backup'>('pwa');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const isPro = subscription.isActive;
  const exercisesWithPR = exercises.filter((e) => e.currentPR > 0).length;
  const totalLogs = exercises.reduce((acc, curr) => acc + (curr.history?.length || 0), 0);

  const handleDownloadStandaloneHtml = () => {
    const htmlContent = generateStandaloneOfflineAppHtml(exercises, unit, barbell, subscription);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StrongProgress-App-Offline-${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify(
      {
        version: '1.0',
        exportDate: new Date().toISOString(),
        exercises,
        unit,
        barbell,
        subscription,
      },
      null,
      2
    );
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `strongprogress-dados-navegador-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 p-5 text-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-zinc-950 text-amber-400 flex items-center justify-center shadow-lg font-black">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight font-display text-zinc-950 uppercase">
                  Baixar App StrongProgress
                </h2>
                <span className="bg-zinc-950 text-amber-400 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                  Exclusivo PRO
                </span>
              </div>
              <p className="text-xs font-semibold text-zinc-900/90">
                Instale no seu celular ou baixe o app com todos os seus 1RMs e dados locais.
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
                  O download do aplicativo instalável para celular/computador e a exportação com todos os dados salvos do navegador estão disponíveis para quem assina a <strong>Mensalidade</strong> ou possui o <strong>Acesso Vitalício</strong>.
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    onOpenUpgrade();
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl hover:from-amber-400 hover:to-yellow-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <Crown className="w-4 h-4" />
                  <span>Desbloquear Acesso PRO (Mensal ou Vitalício)</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* PRO Active Banner & Stored Data Snapshot */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Assinatura Ativa ({subscription.plan === 'lifetime' ? 'Vitalício' : 'Recorrente'})
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Seus dados salvos no navegador estão prontos para download e sincronização.
                    </div>
                  </div>
                </div>

                {/* Badges of current data */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold">
                    🏋️ <strong>{exercises.length}</strong> exercícios
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400 font-semibold">
                    ⚡ <strong>{exercisesWithPR}</strong> 1RMs
                  </span>
                </div>
              </div>

              {/* Tabs Switcher */}
              <div className="flex border-b border-zinc-800 gap-2">
                <button
                  onClick={() => setActiveTab('pwa')}
                  className={`pb-2.5 px-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
                    activeTab === 'pwa'
                      ? 'border-amber-500 text-amber-400'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>1. Instalar App no Celular / PC</span>
                </button>

                <button
                  onClick={() => setActiveTab('standalone')}
                  className={`pb-2.5 px-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
                    activeTab === 'standalone'
                      ? 'border-amber-500 text-amber-400'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <FileCode className="w-4 h-4" />
                  <span>2. Baixar App Offline (.HTML)</span>
                </button>

                <button
                  onClick={() => setActiveTab('backup')}
                  className={`pb-2.5 px-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
                    activeTab === 'backup'
                      ? 'border-amber-500 text-amber-400'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <HardDrive className="w-4 h-4" />
                  <span>3. Backup Dados (.JSON)</span>
                </button>
              </div>

              {/* TAB 1: PWA INSTALLATION */}
              {activeTab === 'pwa' && (
                <div className="space-y-4">
                  {/* If native install prompt available */}
                  {deferredPrompt && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/40 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-amber-300">
                          Instalação Automática Disponível
                        </h4>
                        <p className="text-xs text-zinc-400">
                          Instale o StrongProgress agora com 1 clique no seu dispositivo.
                        </p>
                      </div>
                      <button
                        onClick={onTriggerInstall}
                        className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                      >
                        Instalar Agora
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* iOS Instructions */}
                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                      <div className="flex items-center gap-2 text-zinc-200 font-bold text-sm">
                        <Apple className="w-4 h-4 text-zinc-400" />
                        <span>iPhone & iPad (Safari)</span>
                      </div>
                      <ol className="text-xs text-zinc-400 space-y-2 list-decimal list-inside leading-relaxed">
                        <li>
                          Toque no botão <strong className="text-zinc-200">Compartilhar</strong> (ícone com quadrado e seta para cima).
                        </li>
                        <li>
                          Role para baixo e toque em <strong className="text-amber-400">"Adicionar à Tela de Início"</strong>.
                        </li>
                        <li>
                          Confirme tocando em <strong className="text-zinc-200">"Adicionar"</strong> no canto superior direito.
                        </li>
                      </ol>
                      <div className="text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 p-2 rounded-lg font-medium">
                        ✓ O app abrirá em tela cheia com ícone dedicado e todos os seus 1RMs sincronizados.
                      </div>
                    </div>

                    {/* Android & Desktop Instructions */}
                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                      <div className="flex items-center gap-2 text-zinc-200 font-bold text-sm">
                        <Chrome className="w-4 h-4 text-amber-400" />
                        <span>Android & Computador (Chrome/Edge)</span>
                      </div>
                      <ol className="text-xs text-zinc-400 space-y-2 list-decimal list-inside leading-relaxed">
                        <li>
                          No celular: Toque nos <strong className="text-zinc-200">3 pontinhos</strong> do Chrome e escolha <strong className="text-amber-400">"Instalar aplicativo"</strong> ou "Adicionar à tela inicial".
                        </li>
                        <li>
                          No computador: Clique no <strong className="text-zinc-200">ícone de computador/instalar</strong> no canto direito da barra de endereço.
                        </li>
                      </ol>
                      <div className="text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 p-2 rounded-lg font-medium">
                        ✓ Funciona 100% offline no box de treino sem precisar de internet ou sinal 4G.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: STANDALONE PORTABLE OFFLINE HTML */}
              {activeTab === 'standalone' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-zinc-200">
                      <FileCode className="w-4 h-4 text-amber-400" />
                      <span>Aplicativo Portátil Autônomo (.HTML com seus 1RMs)</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Gera um arquivo único <strong>StrongProgress-App-Offline.html</strong> que contém todo o motor da calculadora, tabela de porcentagens, calculadora de anilhas e <strong>todos os seus {exercises.length} movimentos e {exercisesWithPR} recordes atuais já injetados</strong>.
                    </p>
                    <div className="text-[11px] text-zinc-400 space-y-1">
                      <div>• Você pode abrir este arquivo em qualquer celular, computador ou tablet dando dois cliques.</div>
                      <div>• Funciona eternamente mesmo sem internet, sem servidor e sem login.</div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleDownloadStandaloneHtml}
                        className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl hover:from-amber-400 hover:to-yellow-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                      >
                        <ArrowDownToLine className="w-4 h-4" />
                        <span>Baixar Aplicativo Portátil (.html com Dados)</span>
                      </button>
                    </div>

                    {downloadSuccess && (
                      <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Download concluído! Abra o arquivo .html em qualquer navegador para usar offline.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: BACKUP JSON */}
              {activeTab === 'backup' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-zinc-200">
                      <HardDrive className="w-4 h-4 text-amber-400" />
                      <span>Arquivo Bruto de Dados do Navegador (.JSON)</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Baixe o banco de dados em formato JSON para guardar em seu Google Drive, iCloud ou enviar para outro dispositivo.
                    </p>
                    <div className="p-3 rounded-xl bg-zinc-900 text-xs text-zinc-300 font-mono space-y-1">
                      <div>Total de Exercícios: {exercises.length}</div>
                      <div>Recordes com Carga: {exercisesWithPR}</div>
                      <div>Entradas de Histórico: {totalLogs}</div>
                      <div>Unidade Base: {unit.toUpperCase()} | Barra: {barbell}</div>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={handleExportJson}
                        className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs rounded-xl flex items-center gap-2 transition-all"
                      >
                        <Download className="w-4 h-4 text-amber-400" />
                        <span>Exportar Backup JSON</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Footer Note */}
          <div className="pt-4 border-t border-zinc-800 text-center">
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
