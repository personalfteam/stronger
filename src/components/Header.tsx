import React, { useState } from 'react';
import { Dumbbell, Crown, Sparkles, Scale, Settings, Plus, Download, Smartphone, Lock, User, Activity, Globe, Check } from 'lucide-react';
import { WeightUnit, BarbellType, UserSubscription, AthleteProfile, Language } from '../types';
import { BARBELL_SPECS } from '../data/initialExercises';
import { TRANSLATIONS, LANGUAGE_LABELS } from '../utils/i18n';

interface HeaderProps {
  unit: WeightUnit;
  onToggleUnit: (unit: WeightUnit) => void;
  barbell: BarbellType;
  onChangeBarbell: (barbell: BarbellType) => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  athleteProfile?: AthleteProfile;
  onOpenAthleteProfile: () => void;
  subscription: UserSubscription;
  onOpenUpgrade: () => void;
  onOpenDownloadApp: () => void;
  onOpenCustomExercise: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  unit,
  onToggleUnit,
  barbell,
  onChangeBarbell,
  language,
  onSelectLanguage,
  athleteProfile,
  onOpenAthleteProfile,
  subscription,
  onOpenUpgrade,
  onOpenDownloadApp,
  onOpenCustomExercise,
  onOpenSettings,
}) => {
  const isPro = subscription.isActive;
  const t = TRANSLATIONS[language] || TRANSLATIONS.pt;
  const [isLangOpen, setIsLangOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 shadow-lg shadow-amber-500/20 font-black">
            <Dumbbell className="w-6 h-6 rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-wider font-display uppercase bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                {t.appName}
              </h1>
              {isPro ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Crown className="w-3 h-3" />
                  {subscription.plan === 'lifetime' ? t.proLifetime : t.proActive}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-400 border border-zinc-700">
                  {t.freeVersion}
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Global Controls & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 rounded-xl text-xs text-zinc-200 transition-all shadow-sm"
              title={t.selectLanguage}
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-sm">{LANGUAGE_LABELS[language].flag}</span>
              <span className="font-bold text-[11px] uppercase tracking-wider hidden sm:inline">
                {language}
              </span>
            </button>

            {isLangOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLangOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-44 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                    {t.selectLanguage}
                  </div>
                  {(Object.keys(LANGUAGE_LABELS) as Language[]).map((langKey) => {
                    const isSelected = language === langKey;
                    return (
                      <button
                        key={langKey}
                        type="button"
                        onClick={() => {
                          onSelectLanguage(langKey);
                          setIsLangOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-amber-500/15 text-amber-400 font-bold'
                            : 'text-zinc-300 hover:bg-zinc-800/80'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{LANGUAGE_LABELS[langKey].flag}</span>
                          <span>{LANGUAGE_LABELS[langKey].label}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Athlete / Student Profile Button */}
          <button
            type="button"
            onClick={onOpenAthleteProfile}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 rounded-xl text-xs text-zinc-200 transition-all shadow-sm group"
            title={t.studentData}
          >
            <div className="w-5 h-5 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center font-black group-hover:scale-105 transition-transform">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="text-left flex items-center gap-1.5">
              <span className="font-bold text-zinc-100 max-w-[90px] sm:max-w-[120px] truncate">
                {athleteProfile?.name || t.studentData}
              </span>
              {athleteProfile?.bodyWeightKg && (
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                  {athleteProfile.bodyWeightKg}kg
                </span>
              )}
            </div>
          </button>

          {/* Auto-Save & Persistence Indicator */}
          <div
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900/90 border border-zinc-800 rounded-xl text-[11px] text-zinc-400"
            title="Saved"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">{t.saved}</span>
          </div>

          {/* Unit Toggle (KG / LBS) */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-0.5">
            <button
              onClick={() => onToggleUnit('kg')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                unit === 'kg'
                  ? 'bg-amber-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              KG
            </button>
            <button
              onClick={() => onToggleUnit('lbs')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                unit === 'lbs'
                  ? 'bg-amber-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              LBS
            </button>
          </div>

          {/* Barbell Selector */}
          <div className="relative">
            <select
              value={barbell}
              onChange={(e) => onChangeBarbell(e.target.value as BarbellType)}
              className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-medium rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
            >
              {BARBELL_SPECS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.weightKg}kg ({b.id === 'mens_20kg' ? t.mensBar : b.id === 'womens_15kg' ? t.womensBar : t.techBar})
                </option>
              ))}
            </select>
          </div>

          {/* Baixar / Instalar App (PRO Feature) */}
          <button
            onClick={onOpenDownloadApp}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isPro
                ? 'bg-gradient-to-r from-amber-500/15 to-yellow-500/15 hover:from-amber-500/25 hover:to-yellow-500/25 border border-amber-500/50 text-amber-300 shadow-sm shadow-amber-500/10'
                : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300'
            }`}
            title={t.downloadApp}
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="inline">{t.downloadApp}</span>
            {!isPro && (
              <span className="text-[9px] px-1 py-0.2 bg-amber-500/20 text-amber-400 rounded font-black border border-amber-500/30">
                PRO
              </span>
            )}
          </button>

          {/* New Exercise Button */}
          <button
            onClick={onOpenCustomExercise}
            className="flex items-center gap-1 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded-xl text-xs font-semibold text-zinc-200 transition-all"
            title={t.newExercise}
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{t.newExercise}</span>
          </button>

          {/* Upgrade / PRO Button */}
          {!isPro ? (
            <button
              onClick={onOpenUpgrade}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-amber-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.unlockPro}</span>
            </button>
          ) : (
            <button
              onClick={onOpenUpgrade}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-amber-500/40 text-amber-400 rounded-xl text-xs font-bold transition-all"
            >
              <Crown className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.proSubscription}</span>
            </button>
          )}

          {/* Settings / Links Gear */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-zinc-400 hover:text-zinc-100 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all"
            title={t.settings}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
