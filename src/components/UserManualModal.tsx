import React, { useState } from 'react';
import {
  BookOpen,
  Dumbbell,
  Calculator,
  TrendingUp,
  Smartphone,
  CheckCircle2,
  ChevronRight,
  Layers,
  Sparkles,
  Trophy,
  Target,
  Zap,
  Play,
  Monitor,
  Apple,
  Chrome,
  Flame,
  Scale,
  Award,
  ArrowRight,
  HelpCircle,
  User,
} from 'lucide-react';
import { Language } from '../types';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onOpenDownloadApp: () => void;
  onOpenAthleteProfile: () => void;
}

export const UserManualModal: React.FC<UserManualModalProps> = ({
  isOpen,
  onClose,
  language,
  onOpenDownloadApp,
  onOpenAthleteProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'start' | 'calc' | 'evolve' | 'install'>('start');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 p-5 text-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 text-amber-400 flex items-center justify-center shadow-lg font-black">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight font-display text-zinc-950 uppercase">
                  Manual de Uso & Guia Rápido
                </h2>
                <span className="bg-zinc-950 text-amber-400 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                  Guia Oficial
                </span>
              </div>
              <p className="text-xs font-semibold text-zinc-900/90">
                Aprenda a preencher dados, calcular anilhas, acompanhar sua evolução e instalar no celular.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-900 hover:text-zinc-950 hover:bg-black/10 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold transition-all"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-zinc-800 bg-zinc-950/60 p-2 gap-1.5 scrollbar-thin">
          <button
            onClick={() => setActiveTab('start')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'start'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>1. Preenchimento & Cargas</span>
          </button>

          <button
            onClick={() => setActiveTab('calc')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'calc'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>2. Anilhas & Porcentagens</span>
          </button>

          <button
            onClick={() => setActiveTab('evolve')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'evolve'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>3. Como Evoluir no App</span>
          </button>

          <button
            onClick={() => setActiveTab('install')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'install'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>4. Baixar / Instalar App</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6">
          {/* TAB 1: PREENCHIMENTO & CARGAS */}
          {activeTab === 'start' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-100 uppercase tracking-wide">
                    Como Preencher seus Dados e Cargas Máximas (1RM)
                  </h3>
                  <p className="text-xs text-zinc-400">
                    O aplicativo calcula todas as porcentagens a partir da sua carga de 1RM (1 Repetição Máxima).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <Zap className="w-4 h-4" />
                    <span>Passo 1: Selecionar o Movimento</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    No catálogo inicial, clique no card do exercício desejado (ex: <strong>Back Squat, Snatch, Clean & Jerk, Deadlift</strong>). Você também pode usar a barra de busca ou filtrar por categorias (LPO, Força, Powerlifting).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <Target className="w-4 h-4" />
                    <span>Passo 2: Digitar seu Recorde (1RM)</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Clique no campo de carga e digite o peso total alcançado. O app salva automaticamente no seu dispositivo e atualiza a tabela inteira na hora!
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <Scale className="w-4 h-4" />
                    <span>Passo 3: Escolher a Barra Olímpica</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    No topo da tela, você pode alternar entre a barra de <strong>20kg (Masculina)</strong>, <strong>15kg (Feminina)</strong> ou <strong>10kg (Técnica)</strong>. A calculadora ajusta os pesos de cada lado automaticamente.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <User className="w-4 h-4 text-amber-400" />
                    <span>Passo 4: Configurar Perfil do Aluno</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Clique em <strong>"Dados do Aluno"</strong> no topo para cadastrar seu peso corporal, altura e gênero. Isso ativa a comparação de força relativa e os níveis atléticos.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAthleteProfile();
                    }}
                    className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 mt-1"
                  >
                    <span>Abrir Perfil do Aluno agora</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                <span><strong>Salvamento Automático:</strong> Todos os seus PRs, notas e treinos ficam salvos no seu aparelho sem perigo de perder nada!</span>
              </div>
            </div>
          )}

          {/* TAB 2: ANILHAS & PORCENTAGENS */}
          {activeTab === 'calc' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-100 uppercase tracking-wide">
                    Como Usar a Calculadora de Anilhas e Porcentagens no Box
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Nunca mais perca tempo somando anilhas de cabeça durante o WOD ou bloco de força.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>Distribuição Visual de Cores Oficiais das Anilhas Olímpicas</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-red-950/40 border border-red-800/60 flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-red-600 shrink-0" />
                    <span className="text-zinc-200 font-bold">25 kg (Vermelha)</span>
                  </div>
                  <div className="p-2 rounded-xl bg-blue-950/40 border border-blue-800/60 flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-600 shrink-0" />
                    <span className="text-zinc-200 font-bold">20 kg (Azul)</span>
                  </div>
                  <div className="p-2 rounded-xl bg-yellow-950/40 border border-yellow-800/60 flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-yellow-500 shrink-0" />
                    <span className="text-zinc-200 font-bold">15 kg (Amarela)</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 shrink-0" />
                    <span className="text-zinc-200 font-bold">10 kg (Verde)</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-400">
                  O app também calcula as fracionadas de <strong>5kg, 2.5kg, 2kg, 1.5kg, 1kg e 0.5kg</strong> com precisão cirúrgica de cada lado da barra.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                    📊 Tabela de Porcentagens Rápidas (40% a 115%)
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Quando o coach pedir <strong>"3x5 a 75%"</strong> ou <strong>"1 repetição a 92%"</strong>, abra a tabela instantânea para ver o peso exato e exatamente quais anilhas colocar de cada lado.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                    ⚡ Calculadora de Tablado (Floor Mode)
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Na aba <strong>"Calculadora Rápida"</strong>, você pode digitar qualquer número avulso ou usar os botões de incremento (+1kg, +2.5kg, +5kg) para consultar sem precisar alterar seu PR fixo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COMO EVOLUIR NO APP */}
          {activeTab === 'evolve' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm">
                  3
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-100 uppercase tracking-wide">
                    Como Acompanhar sua Evolução e Superar Recordes
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Ferramentas avançadas para atletas que buscam evolução contínua e resultados de alta performance.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <Trophy className="w-4 h-4" />
                    <span>1. Histórico de PRs & Gráfico de Evolução</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Dentro de cada exercício, clique na aba <strong>"Histórico & Registros"</strong>. Você pode registrar cada novo teste com data e observações. O gráfico traça sua curva de ganho de força ao longo das semanas.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <Award className="w-4 h-4" />
                    <span>2. Padrões de Força Relativa (Strength Standards)</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Descubra seu nível em cada movimento comparado ao seu peso corporal: <strong>Iniciante, Na Média, Acima da Média, Avançado ou Nível Elite</strong>. O sistema mostra quanto falta para subir de faixa!
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <Flame className="w-4 h-4" />
                    <span>3. Estimador de 1RM por Repetições</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Fez 5 repetições com 100kg e quer saber seu 1RM teórico? Vá na aba <strong>"Estimador 1RM"</strong> para calcular sua carga máxima estimada pelas fórmulas consagradas de <strong>Epley, Brzycki e Lander</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <Target className="w-4 h-4" />
                    <span>4. Definição de Metas (Target PR)</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Estipule uma meta de carga para cada levantamento. O app calcula exatamente quantos quilos faltam para atingir o objetivo e mantém seu foco na evolução constante.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INSTALAR NO CELULAR & PC */}
          {activeTab === 'install' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm">
                  4
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-100 uppercase tracking-wide">
                    Como Instalar no Celular e Usar 100% Offline no Box
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Tenha o ícone do aplicativo na tela inicial do seu celular, abrindo em tela cheia e sem precisar de sinal de internet.
                  </p>
                </div>
              </div>

              {/* Action Button to trigger Download Modal */}
              <button
                onClick={() => {
                  onClose();
                  onOpenDownloadApp();
                }}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <Smartphone className="w-4 h-4" />
                <span>Abrir Tela de Instalação do App</span>
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* iOS */}
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-zinc-200 font-bold text-xs">
                    <Apple className="w-4 h-4 text-zinc-400" />
                    <span>iPhone & iPad</span>
                  </div>
                  <ol className="text-[11px] text-zinc-400 space-y-1.5 list-decimal list-inside leading-relaxed">
                    <li>Abra no <strong className="text-zinc-200">Safari</strong>.</li>
                    <li>Toque em <strong className="text-zinc-200">Compartilhar</strong> (ícone do quadrado).</li>
                    <li>Selecione <strong className="text-amber-400">"Adicionar à Tela de Início"</strong>.</li>
                  </ol>
                </div>

                {/* Android */}
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-zinc-200 font-bold text-xs">
                    <Chrome className="w-4 h-4 text-amber-400" />
                    <span>Android (Chrome)</span>
                  </div>
                  <ol className="text-[11px] text-zinc-400 space-y-1.5 list-decimal list-inside leading-relaxed">
                    <li>Abra no <strong className="text-zinc-200">Google Chrome</strong>.</li>
                    <li>Toque nos <strong className="text-zinc-200">3 pontinhos</strong> do canto superior.</li>
                    <li>Selecione <strong className="text-amber-400">"Instalar aplicativo"</strong>.</li>
                  </ol>
                </div>

                {/* PC */}
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-zinc-200 font-bold text-xs">
                    <Monitor className="w-4 h-4 text-zinc-300" />
                    <span>Computador (PC/Mac)</span>
                  </div>
                  <ol className="text-[11px] text-zinc-400 space-y-1.5 list-decimal list-inside leading-relaxed">
                    <li>Abra no <strong className="text-zinc-200">Chrome ou Edge</strong>.</li>
                    <li>Clique no ícone de <strong className="text-amber-400">Instalar</strong> na barra de endereços.</li>
                    <li>Abra como app de Área de Trabalho.</li>
                  </ol>
                </div>
              </div>

              <div className="text-[11px] text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 p-2.5 rounded-xl text-center font-medium flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>O StrongProgress roda offline sem depender de sinal 4G ou Wi-Fi no box.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Close */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
          <span className="text-[11px] text-zinc-400">
            Dúvidas? Acesse o manual sempre que precisar pelo botão <strong>Manual de Uso</strong> no topo.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-bold transition-all"
          >
            Entendido, fechar
          </button>
        </div>
      </div>
    </div>
  );
};
