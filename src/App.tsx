/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Dumbbell,
  Filter,
  Trophy,
  Flame,
  Zap,
  TrendingUp,
  Sparkles,
  Crown,
  Share2,
  Download,
  Layers,
  CheckCircle2,
  BarChart3,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  Exercise,
  ExerciseCategory,
  WeightUnit,
  BarbellType,
  UserSubscription,
  PricingConfig,
  PRLogEntry,
  AthleteProfile,
  Language,
} from './types';
import {
  getStoredExercises,
  saveStoredExercises,
  getStoredSubscription,
  saveStoredSubscription,
  getStoredPricing,
  saveStoredPricing,
  getStoredUnit,
  saveStoredUnit,
  getStoredBarbell,
  saveStoredBarbell,
  getStoredAthleteProfile,
  saveStoredAthleteProfile,
} from './utils/storage';
import { formatWeight, calculatePercentage } from './utils/calculator';
import { getOverallAthleteSummary, calculateBMI } from './utils/strengthStandards';
import { TRANSLATIONS, getStoredLanguage, saveStoredLanguage } from './utils/i18n';
import { Header } from './components/Header';
import { ExerciseCard } from './components/ExerciseCard';
import { ExerciseDetailModal } from './components/ExerciseDetailModal';
import { QuickPercentageCalculator } from './components/QuickPercentageCalculator';
import { UpgradeModal } from './components/UpgradeModal';
import { CheckoutSettingsModal } from './components/CheckoutSettingsModal';
import { CustomExerciseModal } from './components/CustomExerciseModal';
import { DownloadAppModal } from './components/DownloadAppModal';
import { KiwifyWelcomeModal } from './components/KiwifyWelcomeModal';
import { AthleteProfileModal } from './components/AthleteProfileModal';
import { checkKiwifyUrlParams } from './utils/kiwify';
import { User, Award, Activity, HeartPulse } from 'lucide-react';

export default function App() {
  // State
  const [language, setLanguage] = useState<Language>(getStoredLanguage);
  const [exercises, setExercises] = useState<Exercise[]>(getStoredExercises);
  const [subscription, setSubscription] = useState<UserSubscription>(getStoredSubscription);
  const [pricing, setPricing] = useState<PricingConfig>(getStoredPricing);
  const [unit, setUnit] = useState<WeightUnit>(getStoredUnit);
  const [barbell, setBarbell] = useState<BarbellType>(getStoredBarbell);
  const [athleteProfile, setAthleteProfile] = useState<AthleteProfile>(getStoredAthleteProfile);

  const t = TRANSLATIONS[language] || TRANSLATIONS.pt;

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    saveStoredLanguage(lang);
    showSaveNotification(lang === 'pt' ? 'Idioma alterado para Português' : lang === 'en' ? 'Language changed to English' : lang === 'es' ? 'Idioma cambiado a Español' : 'Langue changée en Français');
  };

  // PWA Install prompt state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'pr_desc' | 'pr_asc' | 'favorites'>('favorites');
  const [activeMainView, setActiveMainView] = useState<'catalog' | 'calculator'>('catalog');

  // Modals
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isCustomOpen, setIsCustomOpen] = useState<boolean>(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState<boolean>(false);
  const [isKiwifyWelcomeOpen, setIsKiwifyWelcomeOpen] = useState<boolean>(false);
  const [isAthleteProfileOpen, setIsAthleteProfileOpen] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
  });

  const showSaveNotification = (msg: string) => {
    setSaveToast({ message: msg, visible: true });
    setTimeout(() => {
      setSaveToast((prev) => ({ ...prev, visible: false }));
    }, 3200);
  };

  // Check Kiwify Magic Links or return query params on startup
  useEffect(() => {
    const activation = checkKiwifyUrlParams(pricing);
    if (activation && activation.isActivated) {
      const newSub: UserSubscription = {
        plan: activation.plan,
        isActive: true,
        unlockedAt: new Date().toISOString(),
        buyerName: activation.buyerName,
        buyerEmail: activation.buyerEmail,
        source: activation.source,
      };
      setSubscription(newSub);
      saveStoredSubscription(newSub);

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#F59E0B', '#10B981', '#EAB308', '#FFFFFF'],
      });

      setIsKiwifyWelcomeOpen(true);

      // Clean URL params cleanly
      try {
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
        console.error('Could not clean URL history', e);
      }
    }
  }, [pricing]);

  // Listen for beforeinstallprompt event for PWA installation
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleTriggerInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
      setDeferredPrompt(null);
    }
  };

  // Save changes to localStorage
  useEffect(() => {
    saveStoredExercises(exercises);
  }, [exercises]);

  useEffect(() => {
    saveStoredSubscription(subscription);
  }, [subscription]);

  useEffect(() => {
    saveStoredPricing(pricing);
  }, [pricing]);

  const handleToggleUnit = (newUnit: WeightUnit) => {
    setUnit(newUnit);
    saveStoredUnit(newUnit);
  };

  const handleChangeBarbell = (newBarbell: BarbellType) => {
    setBarbell(newBarbell);
    saveStoredBarbell(newBarbell);
  };

  // Handlers for exercises
  const handleUpdatePR = (id: string, newPR: number, log?: Partial<PRLogEntry>) => {
    let targetName = '';
    let updatedList: Exercise[] = [];

    setExercises((prev) => {
      updatedList = prev.map((ex) => {
        if (ex.id !== id) return ex;

        targetName = ex.name;
        const isNewRecord = newPR > ex.currentPR;
        const newHistory = [...ex.history];

        if (newPR > 0) {
          newHistory.push({
            id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            weight: newPR,
            date: log?.date || new Date().toISOString().split('T')[0],
            reps: log?.reps || 1,
            notes: log?.notes || (isNewRecord ? 'Novo recorde registrado!' : 'Carga de referência atualizada'),
          });
        }

        return {
          ...ex,
          currentPR: newPR,
          lastUpdated: new Date().toISOString(),
          history: newHistory,
        };
      });

      // Synchronous immediate save to guarantee permanence
      saveStoredExercises(updatedList);
      return updatedList;
    });

    // Update the selected exercise in open modal with full updated state
    setSelectedExercise((prev) => {
      if (!prev || prev.id !== id) return prev;
      const found = updatedList.find((e) => e.id === id);
      return found || prev;
    });

    showSaveNotification(
      `Carga de ${targetName || 'exercício'} salva com sucesso no histórico!`
    );
  };

  const handleDeleteHistoryLog = (exerciseId: string, logId: string) => {
    let updatedList: Exercise[] = [];
    setExercises((prev) => {
      updatedList = prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        const newHistory = ex.history.filter((h) => h.id !== logId);
        const latestMax =
          newHistory.length > 0
            ? Math.max(...newHistory.map((h) => h.weight))
            : ex.currentPR;
        return {
          ...ex,
          currentPR: latestMax,
          history: newHistory,
        };
      });
      saveStoredExercises(updatedList);
      return updatedList;
    });

    setSelectedExercise((prev) => {
      if (!prev || prev.id !== exerciseId) return prev;
      const found = updatedList.find((e) => e.id === exerciseId);
      return found || prev;
    });

    showSaveNotification('Registro de histórico removido.');
  };

  const handleToggleFavorite = (id: string) => {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, isFavorite: !ex.isFavorite } : ex))
    );
  };

  const handleAddExercise = (newEx: Exercise) => {
    setExercises((prev) => [newEx, ...prev]);
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.6 },
    });
  };

  const handleDeleteExercise = (id: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  };

  const handleSaveAthleteProfile = (updatedProfile: AthleteProfile) => {
    setAthleteProfile(updatedProfile);
    saveStoredAthleteProfile(updatedProfile);
    showSaveNotification(`Dados de ${updatedProfile.name} salvos com sucesso!`);
  };

  // Filtered & Sorted exercises
  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        ex.name.toLowerCase().includes(q) ||
        (ex.portugueseName && ex.portugueseName.toLowerCase().includes(q)) ||
        ex.category.toLowerCase().includes(q);

      // Category
      const matchesCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'favorites' && ex.isFavorite) ||
        ex.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [exercises, searchQuery, selectedCategory]);

  const sortedExercises = useMemo(() => {
    const list = [...filteredExercises];
    if (sortBy === 'favorites') {
      return list.sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return b.currentPR - a.currentPR;
      });
    }
    if (sortBy === 'pr_desc') {
      return list.sort((a, b) => b.currentPR - a.currentPR);
    }
    if (sortBy === 'pr_asc') {
      return list.sort((a, b) => a.currentPR - b.currentPR);
    }
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredExercises, sortBy]);

  // Overall Stats
  const totalPRsCount = exercises.filter((e) => e.currentPR > 0).length;
  const heaviestExercise = useMemo(() => {
    let top = exercises[0];
    for (const ex of exercises) {
      if (ex.currentPR > (top?.currentPR || 0)) top = ex;
    }
    return top;
  }, [exercises]);

  const averagePR = useMemo(() => {
    const withPr = exercises.filter((e) => e.currentPR > 0);
    if (withPr.length === 0) return 0;
    const sum = withPr.reduce((acc, curr) => acc + curr.currentPR, 0);
    return Math.round(sum / withPr.length);
  }, [exercises]);

  const athleteSummary = useMemo(() => {
    return getOverallAthleteSummary(exercises, athleteProfile);
  }, [exercises, athleteProfile]);

  const athleteBmi = useMemo(() => {
    return calculateBMI(athleteProfile.bodyWeightKg, athleteProfile.heightCm);
  }, [athleteProfile.bodyWeightKg, athleteProfile.heightCm]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-400 selection:text-zinc-950">
      {/* Top Header */}
      <Header
        unit={unit}
        onToggleUnit={handleToggleUnit}
        barbell={barbell}
        onChangeBarbell={handleChangeBarbell}
        language={language}
        onSelectLanguage={handleSelectLanguage}
        athleteProfile={athleteProfile}
        onOpenAthleteProfile={() => setIsAthleteProfileOpen(true)}
        subscription={subscription}
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
        onOpenDownloadApp={() => setIsDownloadOpen(true)}
        onOpenCustomExercise={() => setIsCustomOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Athletic Hero Banner with Stats */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5" />
                <span>Performance & Progressão Automática</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black font-display uppercase tracking-tight text-zinc-100">
                {t.appName}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                {t.appSubtitle}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
              <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-center min-w-[100px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  1RMs
                </span>
                <span className="text-2xl sm:text-3xl font-black font-display text-amber-400">
                  {totalPRsCount}
                </span>
                <span className="text-[10px] text-zinc-500 block">PRs</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-center min-w-[100px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Max PR
                </span>
                <span className="text-2xl sm:text-3xl font-black font-display text-zinc-100">
                  {heaviestExercise ? formatWeight(heaviestExercise.currentPR, unit) : '--'}
                </span>
                <span className="text-[10px] text-zinc-500 truncate block max-w-[90px] mx-auto">
                  {heaviestExercise?.name.split(' ')[0]}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-center min-w-[100px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  AVG 1RM
                </span>
                <span className="text-2xl sm:text-3xl font-black font-display text-emerald-400">
                  {averagePR > 0 ? formatWeight(averagePR, unit) : '--'}
                </span>
                <span className="text-[10px] text-zinc-500 block">score</span>
              </div>
            </div>
          </div>

          {/* Quick View Switcher (Catálogo de Exercícios vs Floor Calculator) */}
          <div className="mt-6 pt-5 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              <button
                onClick={() => setActiveMainView('catalog')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                  activeMainView === 'catalog'
                    ? 'bg-amber-500 text-zinc-950 shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Dumbbell className="w-4 h-4" />
                <span>{t.tabCatalog}</span>
              </button>

              <button
                onClick={() => setActiveMainView('calculator')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                  activeMainView === 'calculator'
                    ? 'bg-amber-500 text-zinc-950 shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>{t.tabCalculator}</span>
              </button>
            </div>

            {/* Free vs Pro Upgrade & Download App Pills */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDownloadOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  subscription.isActive
                    ? 'bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300'
                    : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300'
                }`}
                title={t.downloadApp}
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.downloadApp}</span>
                {!subscription.isActive && (
                  <span className="text-[9px] px-1 py-0.2 bg-amber-500/20 text-amber-400 rounded font-black border border-amber-500/30">
                    PRO
                  </span>
                )}
              </button>

              {!subscription.isActive ? (
                <div
                  onClick={() => setIsUpgradeOpen(true)}
                  className="cursor-pointer flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300 font-semibold bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-2 rounded-xl border border-amber-500/30 transition-all"
                >
                  <Crown className="w-4 h-4" />
                  <span>{t.unlockPro}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/40 px-3.5 py-2 rounded-xl border border-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.proActive}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Student Biometrics & Strength Standard Overview Card */}
        <section className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-zinc-900/90 via-zinc-900/70 to-zinc-950 border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-zinc-100 font-display">
                  {t.studentTitle}: {athleteProfile.name}
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {athleteProfile.gender === 'female' ? t.female : t.male} • {athleteProfile.age || 28} {t.yearsOld}
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {athleteSummary.overallRating}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 flex items-center gap-3 flex-wrap">
                <span>{t.weight}: <strong className="text-zinc-200">{athleteProfile.bodyWeightKg} kg</strong></span>
                <span>•</span>
                <span>{t.height}: <strong className="text-zinc-200">{athleteProfile.heightCm} cm</strong></span>
                <span>•</span>
                <span>{t.bmi}: <strong className="text-amber-400">{athleteBmi.bmi > 0 ? athleteBmi.bmi : '--'}</strong></span>
                <span>•</span>
                <span>{t.relativeStrength}: <strong className="text-emerald-400">{athleteSummary.averageRatio}x BW</strong></span>
                <span>•</span>
                <span>{athleteSummary.aboveAverageCount} {t.movementsAboveAvg}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAthleteProfileOpen(true)}
            className="w-full md:w-auto px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-amber-500/40 hover:border-amber-500 text-amber-300 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 shadow-sm"
          >
            <Activity className="w-4 h-4 text-amber-400" />
            <span>{t.editStudentData}</span>
          </button>
        </section>

        {/* VIEW 1: QUICK FLOOR CALCULATOR */}
        {activeMainView === 'calculator' && (
          <section className="space-y-6">
            <QuickPercentageCalculator
              exercises={exercises}
              unit={unit}
              barbell={barbell}
              isPro={subscription.isActive}
              onUpdatePR={handleUpdatePR}
              onOpenUpgrade={() => setIsUpgradeOpen(true)}
            />
          </section>
        )}

        {/* VIEW 2: FULL EXERCISE CATALOG & 1RM TRACKER */}
        {activeMainView === 'catalog' && (
          <section className="space-y-6">
            {/* Search & Category Filter Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar exercício (Ex: Snatch, Clean, Back Squat, Terra...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-semibold hidden sm:inline">
                  Ordenar:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500"
                >
                  <option value="favorites">⭐ Favoritos & Carga</option>
                  <option value="pr_desc">⚡ Maior Carga (1RM)</option>
                  <option value="pr_asc">📉 Menor Carga (1RM)</option>
                  <option value="name">🔤 Nome (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: 'all', label: 'Todos os Movimentos' },
                { id: 'favorites', label: '⭐ Meus Favoritos' },
                { id: 'lpo', label: '🏋️ LPO (Olímpico)' },
                { id: 'powerlifting', label: '💪 Força & Powerlifting' },
                { id: 'gymnastics', label: '🤸 Ginástica com Carga' },
                { id: 'dumbbell_kb', label: '🔔 Halteres & KB' },
                { id: 'custom', label: '✨ Personalizados' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500 text-zinc-950 shadow-md'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Exercise Cards Grid */}
            {sortedExercises.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                <div className="w-12 h-12 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center mx-auto">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-zinc-300">
                  Nenhum exercício encontrado
                </h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Tente alterar os termos de busca ou adicione um novo movimento personalizado.
                </p>
                <button
                  onClick={() => setIsCustomOpen(true)}
                  className="px-4 py-2 bg-amber-500 text-zinc-950 font-bold text-xs rounded-xl hover:bg-amber-400"
                >
                  + Criar Exercício Personalizado
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {sortedExercises.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    unit={unit}
                    athleteProfile={athleteProfile}
                    isPro={subscription.isActive}
                    onSelect={(ex) => {
                      setSelectedExercise(ex);
                      setIsDetailOpen(true);
                    }}
                    onUpdatePR={handleUpdatePR}
                    onToggleFavorite={handleToggleFavorite}
                    onOpenUpgrade={() => setIsUpgradeOpen(true)}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-zinc-800/80 bg-zinc-950 py-6 text-center text-xs text-zinc-500 space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => {
              if (!subscription.isActive) {
                setIsUpgradeOpen(true);
              } else {
                setIsDownloadOpen(true);
              }
            }}
            className="hover:text-amber-300 flex items-center gap-1 font-bold text-amber-400"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.downloadApp}</span>
          </button>
          <span>•</span>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="hover:text-zinc-300 font-semibold text-zinc-400"
          >
            Links de Checkout & Preços
          </button>
        </div>
        <p className="text-[11px] text-zinc-600">
          StrongProgress • Calculadora de Cargas & Porcentagens para Atletas e Coaches de CrossFit e LPO.
        </p>
      </footer>

      {/* Modals */}
      <ExerciseDetailModal
        exercise={selectedExercise}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedExercise(null);
        }}
        unit={unit}
        barbell={barbell}
        athleteProfile={athleteProfile}
        isPro={subscription.isActive}
        onUpdatePR={handleUpdatePR}
        onDeleteHistoryLog={handleDeleteHistoryLog}
        onDeleteExercise={handleDeleteExercise}
        onOpenUpgrade={() => {
          setIsDetailOpen(false);
          setIsUpgradeOpen(true);
        }}
        onOpenProfile={() => {
          setIsAthleteProfileOpen(true);
        }}
      />

      <AthleteProfileModal
        isOpen={isAthleteProfileOpen}
        onClose={() => setIsAthleteProfileOpen(false)}
        profile={athleteProfile}
        onSaveProfile={handleSaveAthleteProfile}
        exercises={exercises}
      />

      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        subscription={subscription}
        pricing={pricing}
        onUpdateSubscription={(sub) => setSubscription(sub)}
        onOpenSettings={() => {
          setIsUpgradeOpen(false);
          setIsSettingsOpen(true);
        }}
      />

      <CheckoutSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        pricing={pricing}
        onSavePricing={(newP) => setPricing(newP)}
      />

      <CustomExerciseModal
        isOpen={isCustomOpen}
        onClose={() => setIsCustomOpen(false)}
        unit={unit}
        onAddExercise={handleAddExercise}
      />

      <DownloadAppModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        exercises={exercises}
        unit={unit}
        barbell={barbell}
        subscription={subscription}
        onOpenUpgrade={() => {
          setIsDownloadOpen(false);
          setIsUpgradeOpen(true);
        }}
        deferredPrompt={deferredPrompt}
        onTriggerInstall={handleTriggerInstall}
      />

      <KiwifyWelcomeModal
        isOpen={isKiwifyWelcomeOpen}
        onClose={() => setIsKiwifyWelcomeOpen(false)}
        subscription={subscription}
        onOpenDownload={() => {
          setIsKiwifyWelcomeOpen(false);
          setIsDownloadOpen(true);
        }}
      />

      {/* Floating Auto-Save Confirmation Toast */}
      {saveToast.visible && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short bg-zinc-900 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-100">{saveToast.message}</div>
            <div className="text-[10px] text-zinc-400">Salvo no armazenamento permanente do seu navegador.</div>
          </div>
        </div>
      )}
    </div>
  );
}
