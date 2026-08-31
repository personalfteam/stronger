import React from 'react';
import {
  Dumbbell,
  Crown,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  TrendingUp,
  Target,
  ShieldCheck,
  Smartphone,
  Layers,
  BarChart3,
  Award,
  Flame,
  AlertTriangle,
  Play,
  Scale,
  Users,
  Clock,
  HeartPulse,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BarbellType, Exercise, PricingConfig, UserSubscription } from '../types';
import { BARBELL_SPECS } from '../data/initialExercises';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenUpgrade: () => void;
  onOpenManual: () => void;
  subscription: UserSubscription;
  pricing: PricingConfig;
  exercises: Exercise[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onOpenUpgrade,
  onOpenManual,
  subscription,
  pricing,
  exercises,
}) => {
  const triggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#10B981', '#EAB308', '#FFFFFF'],
    });
  };

  const handleStartFree = () => {
    triggerConfetti();
    onEnterApp();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-amber-500 selection:text-zinc-950 font-sans pb-20">
      {/* TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-zinc-950 px-4 py-2 text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md">
        <Sparkles className="w-4 h-4 text-zinc-950 animate-pulse" />
        <span>Acesso Gratuito Liberado: Revolucione sua Força e LPO no CrossTraining</span>
        <button
          onClick={handleStartFree}
          className="ml-2 underline hover:no-underline font-black text-zinc-950 bg-black/10 px-2 py-0.5 rounded"
        >
          Acessar App Grátis &rarr;
        </button>
      </div>

      {/* NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleStartFree}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-zinc-950 shadow-lg shadow-amber-500/20 font-black">
              <Dumbbell className="w-6 h-6 transform -rotate-12" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-lg tracking-tight text-zinc-100 uppercase">
                  Strong<span className="text-amber-400">Progress</span>
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded font-black tracking-wider uppercase">
                  CrossTraining
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-medium">
                Potência • Porcentagens • Anilhas Olímpicas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenManual}
              className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-300 hover:text-amber-400 font-bold px-3 py-1.5 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Manual de Uso</span>
            </button>

            <button
              onClick={handleStartFree}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all transform hover:scale-105 active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Usar App Grátis</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 overflow-hidden border-b border-zinc-800/60 bg-radial-[at_50%_0%] from-amber-500/10 via-zinc-950 to-zinc-950">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider shadow-inner">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Desenvolvido para Atletas que Estagnaram nas Cargas</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-zinc-100 uppercase leading-[1.1]">
            Você treina pesado todos os dias, mas{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
              suas cargas não sobem há meses?
            </span>
          </h1>

          {/* Subtitle / Hook */}
          <p className="text-base sm:text-xl text-zinc-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Elimine de vez o <strong>achismo</strong> e os <strong>cálculos de cabeça</strong> no box. Descubra a metodologia visual de porcentagens e distribuição de anilhas olímpicas que destrava seus PRs de <strong>Snatch, Clean & Jerk e Agachamento</strong>.
          </p>

          {/* CTA Group */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStartFree}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-2xl shadow-amber-500/30 flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95 group"
            >
              <span>ACESSAR O APLICATIVO GRÁTIS AGORA</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenUpgrade}
              className="w-full sm:w-auto px-6 py-4 bg-zinc-900 hover:bg-zinc-800 border border-amber-500/30 hover:border-amber-500 text-amber-400 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Conhecer Versão PRO Completa</span>
            </button>
          </div>

          {/* Trust points */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Gratuito para Começar</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Sem necessidade de cadastro chato</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Funciona 100% Offline no Box</span>
            </div>
          </div>
        </div>

        {/* MOCKUP APP PREVIEW CARD */}
        <div className="max-w-4xl mx-auto mt-12 rounded-2xl bg-zinc-900 border border-amber-500/40 p-4 sm:p-6 shadow-2xl shadow-amber-500/10 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span className="text-xs text-zinc-400 font-mono ml-2">StrongProgress • Tablado Mode</span>
            </div>
            <span className="text-[11px] bg-emerald-950/80 border border-emerald-700 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full">
              ● Sistema Ativo & Calculando
            </span>
          </div>

          {/* Visual Barbell Preview */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-center space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-bold text-zinc-200">Exemplo de Montagem no Box: Back Squat (140 kg @ 85% = 119 kg)</span>
              <span className="text-amber-400 font-black">Barra Masculina 20kg</span>
            </div>
            
            {/* Visual representation of Plates */}
            <div className="py-6 flex items-center justify-center gap-1 overflow-x-auto">
              <div className="w-16 h-3 bg-zinc-600 rounded-l" />
              <div className="w-4 h-16 bg-blue-600 rounded-sm flex items-center justify-center text-[9px] font-black text-white shadow">20</div>
              <div className="w-4 h-16 bg-blue-600 rounded-sm flex items-center justify-center text-[9px] font-black text-white shadow">20</div>
              <div className="w-3.5 h-12 bg-emerald-600 rounded-sm flex items-center justify-center text-[8px] font-black text-white shadow">10</div>
              <div className="w-2.5 h-8 bg-zinc-100 rounded-sm flex items-center justify-center text-[7px] font-black text-zinc-950 shadow">2.5</div>
              <div className="w-24 h-4 bg-zinc-700 mx-2 rounded flex items-center justify-center text-[9px] font-bold text-zinc-300">BARRA 20KG</div>
              <div className="w-2.5 h-8 bg-zinc-100 rounded-sm flex items-center justify-center text-[7px] font-black text-zinc-950 shadow">2.5</div>
              <div className="w-3.5 h-12 bg-emerald-600 rounded-sm flex items-center justify-center text-[8px] font-black text-white shadow">10</div>
              <div className="w-4 h-16 bg-blue-600 rounded-sm flex items-center justify-center text-[9px] font-black text-white shadow">20</div>
              <div className="w-4 h-16 bg-blue-600 rounded-sm flex items-center justify-center text-[9px] font-black text-white shadow">20</div>
              <div className="w-16 h-3 bg-zinc-600 rounded-r" />
            </div>

            <div className="text-xs text-zinc-300 font-medium">
              Distribuição por lado: <strong className="text-amber-400">20kg + 20kg + 10kg + 2.5kg = 52.5kg/lado</strong> (+ Barra 20kg = 125kg)
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="text-zinc-500 text-[10px] uppercase font-bold">Aquecimento (60%)</div>
              <div className="text-lg font-black text-zinc-200 mt-0.5">84 kg</div>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="text-zinc-500 text-[10px] uppercase font-bold">Força Base (75%)</div>
              <div className="text-lg font-black text-zinc-200 mt-0.5">105 kg</div>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="text-amber-400 text-[10px] uppercase font-bold">Zona de Choque (90%)</div>
              <div className="text-lg font-black text-amber-400 mt-0.5">126 kg</div>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="text-zinc-500 text-[10px] uppercase font-bold">Novo Recorde (105%)</div>
              <div className="text-lg font-black text-zinc-200 mt-0.5">147 kg</div>
            </div>
          </div>
        </div>
      </section>

      {/* THE PAIN SECTION: POR QUE 87% DOS ATLETAS NÃO EVOLUEM? */}
      <section className="py-16 px-4 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-rose-400 bg-rose-950/60 border border-rose-800 px-3 py-1 rounded-full">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>O Grande Gargalo do Treinamento</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-display uppercase tracking-tight text-zinc-100">
            Por que você treina duro, mas suas cargas continuam travadas?
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            A maioria dos atletas comete 4 erros silenciosos todos os dias no box de CrossTraining que destroem qualquer possibilidade de bater novos recordes (PRs).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-black">
              01
            </div>
            <h3 className="text-base font-black text-zinc-100 uppercase tracking-wide">
              Cálculo de Cabeça no Meio do WOD
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Com os batimentos a 170 BPM e a adrenalina alta, é impossível calcular 78% de 115kg com a barra de 15kg sem errar. Você acaba colocando peso de menos (não gera adaptação de força) ou peso de mais (falha precoce e risco de lesão).
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-black">
              02
            </div>
            <h3 className="text-base font-black text-zinc-100 uppercase tracking-wide">
              Falta de Registro Centralizado de PRs
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Anotar cargas em bloco de notas do celular, no quadro do box ou tentar lembrar de cabeça faz você perder o histórico real. Sem dados precisos, você não tem clareza de onde está sua curva de força.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-black">
              03
            </div>
            <h3 className="text-base font-black text-zinc-100 uppercase tracking-wide">
              Confusão na Troca de Barras (20kg vs 15kg vs 10kg)
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Pegou uma barra diferente no box e perdeu 5 minutos tentando descobrir quantas anilhas de 10kg, 15kg e 5kg colocar de cada lado? Essa perda de foco desconcentra sua técnica no LPO.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-black">
              04
            </div>
            <h3 className="text-base font-black text-zinc-100 uppercase tracking-wide">
              Não Saber seu Nível Real de Força Relativa
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Levantar 100kg no Snatch pesando 70kg é nível Elite. Levantar 100kg pesando 110kg é intermediário. Sem calibrar com seu peso corporal, você não sabe onde estão suas fraquezas de força.
            </p>
          </div>
        </div>
      </section>

      {/* HOW WE DESIGNED THE STRONPROGRESS PLATFORM */}
      <section className="py-16 px-4 bg-zinc-900/40 border-y border-zinc-800">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>A Engenharia Por Trás do App</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-display uppercase tracking-tight text-zinc-100">
              Como pensamos em elevar o nível do CrossTraining através deste app
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              O StrongProgress não foi criado em uma sala de escritório teórica. Ele foi desenvolvido por atletas e coaches no chão do box para resolver exatamente o que você precisa entre uma série e outra.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1 */}
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-zinc-100 uppercase">
                1. Visão Imediata de Anilhas Oficiais
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Renderização gráfica das cores e posições das anilhas oficiais (25kg, 20kg, 15kg, 10kg, 5kg e fracionadas). Basta bater o olho na tela e montar a barra em 3 segundos.
              </p>
            </div>

            {/* Column 2 */}
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-zinc-100 uppercase">
                2. Matriz de Porcentagens de 40% a 115%
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tabela de alta precisão com 1% de granularidade. Se a planilha do seu coach manda trabalhar a 73% ou 88%, o peso e o carregamento da barra aparecem na hora.
              </p>
            </div>

            {/* Column 3 */}
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-zinc-100 uppercase">
                3. Modo Tablado (Floor Mode) 100% Offline
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tipografia gigante e alto contraste para você enxergar com o celular apoiado no chão ou no rack. Funciona sem sinal de internet no subsolo do box.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FREE VS PRO COMPARISON MATRIX */}
      <section className="py-16 px-4 max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-4xl font-black font-display uppercase tracking-tight text-zinc-100">
            Você começa 100% Grátis e evolui no seu tempo
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Acreditamos tanto na metodologia do StrongProgress que liberamos o núcleo do aplicativo gratuitamente para você testar no seu treino hoje mesmo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FREE CARD */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-400 bg-zinc-800 px-3 py-1 rounded-full">
                  Plano Inicial Gratuito
                </span>
                <span className="text-2xl font-black text-zinc-100">R$ 0,00</span>
              </div>

              <div>
                <h3 className="text-xl font-black text-zinc-100 uppercase">
                  Acesso Grátis Imediato
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Ideal para testar no próximo WOD e nunca mais errar contas de anilhas.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 text-xs">
                {[
                  'Cálculo visual de anilhas para os principais movimentos (Snatch, C&J, Squats, etc.)',
                  'Tabela de Porcentagens de 40% a 115% com 1 clique',
                  'Alternância entre barras de 20kg, 15kg e 10kg',
                  'Salvamento automático no seu dispositivo',
                  'Calculadora de Tablado (Floor Mode)',
                  'Manual Completo de Uso Integrado',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartFree}
              className="w-full py-4 px-6 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 border border-zinc-700"
            >
              <span>Entrar no App Grátis Agora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* PRO CARD */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-amber-500 shadow-2xl shadow-amber-500/10 space-y-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-yellow-500 text-zinc-950 text-[10px] font-black uppercase tracking-wider px-4 py-1 rounded-bl-xl shadow">
              Experiência Máxima
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>StrongProgress PRO</span>
                </span>
                <span className="text-xl font-black text-amber-400 font-display">
                  R$ {pricing.lifetimePrice.toFixed(2).replace('.', ',')}
                  <span className="text-xs text-zinc-400 font-normal"> /único</span>
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-zinc-100 uppercase">
                  Para Atletas & Coaches de Alta Performance
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Tudo do gratuito + recursos profissionais de evolução e instalação no celular.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 text-xs">
                {[
                  '📱 Instalar App no Celular ou PC (Ícone na Tela de Início + 100% Offline)',
                  'Exercícios Ilimitados + Criar Movimentos Personalizados',
                  'Gráficos Completos de Histórico de Evolução de Carga',
                  'Padrões Oficiais de Força Relativa (Iniciante até Nível Elite)',
                  'Estimador de 1RM com Fórmulas Epley, Brzycki e Lander',
                  'Definição de Metas de Carga (Target PR com progresso)',
                  'Exportação e Backup de Todos os Seus Treinos e PRs',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-zinc-200 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onOpenUpgrade}
              className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4 text-zinc-950" />
              <span>Desbloquear Acesso PRO Completo</span>
            </button>
          </div>
        </div>
      </section>

      {/* ATHLETE REVIEWS / SOCIAL PROOF */}
      <section className="py-16 px-4 max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-3xl font-black font-display uppercase tracking-tight text-zinc-100">
            Quem usa no box nunca mais volta a fazer contas de cabeça
          </h2>
          <p className="text-xs text-zinc-400">
            Veja o que atletas e coaches dizem sobre a experiência do StrongProgress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {'★★★★★'}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed italic">
              "Eu perdia um tempo absurdo no bloco de força tentando somar as anilhas de 15kg e 5kg na barra feminina. Com o StrongProgress eu só bato o olho na tela e monto a barra em 5 segundos. Bati meu PR de Clean em 2 semanas!"
            </p>
            <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">
                BM
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-200">Beatriz Moura</div>
                <div className="text-[10px] text-zinc-500">Atleta RX • CrossTraining</div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {'★★★★★'}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed italic">
              "Como Head Coach, passei a recomendar o StrongProgress para todos os alunos do box. Acabou a desculpa de treinar na carga errada. A precisão das porcentagens é o que constrói força de verdade."
            </p>
            <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">
                RC
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-200">Rodrigo Carvalho</div>
                <div className="text-[10px] text-zinc-500">Head Coach & Atleta LPO</div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {'★★★★★'}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed italic">
              "O modo tablado com as anilhas coloridas é genial. O app fica aberto no chão do box e mesmo de longe eu sei exatamente quanto peso colocar. Melhor ferramenta que já usei."
            </p>
            <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">
                LS
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-200">Lucas Silveira</div>
                <div className="text-[10px] text-zinc-500">Atleta Amador • São Paulo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL HIGH-CONVERTING CTA BANNER */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-zinc-950 text-center space-y-6 shadow-2xl shadow-amber-500/20">
          <div className="w-16 h-16 rounded-2xl bg-zinc-950 text-amber-400 flex items-center justify-center mx-auto shadow-xl">
            <Dumbbell className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black font-display uppercase tracking-tight text-zinc-950">
              Pronto para elevar o nível do seu treino hoje?
            </h2>
            <p className="text-sm font-semibold text-zinc-900/90 leading-relaxed">
              O aplicativo está pronto e configurado para você. Clique no botão abaixo para acessar gratuitamente em menos de 5 segundos.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStartFree}
              className="w-full sm:w-auto px-8 py-4 bg-zinc-950 hover:bg-black text-amber-400 hover:text-amber-300 font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 text-amber-400" />
              <span>ACESSAR APP GRÁTIS AGORA</span>
            </button>

            <button
              onClick={onOpenUpgrade}
              className="w-full sm:w-auto px-6 py-4 bg-zinc-900/20 hover:bg-zinc-900/30 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-2xl transition-all border border-zinc-950/30"
            >
              Comprar Versão PRO Vitalícia
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-12 text-center text-xs text-zinc-500 space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-4 text-zinc-400 font-medium">
          <button onClick={handleStartFree} className="hover:text-amber-400">
            Acessar Aplicativo
          </button>
          <span>•</span>
          <button onClick={onOpenManual} className="hover:text-amber-400">
            Manual de Uso
          </button>
          <span>•</span>
          <button onClick={onOpenUpgrade} className="hover:text-amber-400">
            Acesso PRO
          </button>
        </div>
        <p className="text-[11px] text-zinc-600">
          StrongProgress &copy; {new Date().getFullYear()} — Plataforma de Alta Performance em CrossTraining e LPO. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};
