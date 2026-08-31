import { Language } from '../types';

export interface Translations {
  appName: string;
  appSubtitle: string;
  freeVersion: string;
  proLifetime: string;
  proActive: string;
  studentData: string;
  saved: string;
  mensBar: string;
  womensBar: string;
  techBar: string;
  downloadApp: string;
  newExercise: string;
  unlockPro: string;
  proSubscription: string;
  settings: string;
  
  // Tabs
  tabCalculator: string;
  tabCatalog: string;
  tabEstimator: string;
  tabZones: string;
  
  // Student Banner
  studentTitle: string;
  female: string;
  male: string;
  yearsOld: string;
  weight: string;
  height: string;
  bmi: string;
  relativeStrength: string;
  movementsAboveAvg: string;
  editStudentData: string;
  
  // Quick Calculator
  quickCalcTitle: string;
  quickCalcDesc: string;
  baseWeight1RM: string;
  barbellWeight: string;
  weightPerSide: string;
  platesDistribution: string;
  percentageTitle: string;
  
  // Catalog
  catalogTitle: string;
  catalogSubtitle: string;
  allCategories: string;
  searchExercise: string;
  noPrSet: string;
  prSet: string;
  relativeBw: string;
  aboveAverage: string;
  average: string;
  elite: string;
  beginner: string;
  
  // Modals & Details
  exerciseDetails: string;
  platesAndPercentages: string;
  levelVsWeight: string;
  historyAndEvolution: string;
  updatePr: string;
  addPrLog: string;
  targetPr: string;
  
  // Language Selector
  selectLanguage: string;
  portuguese: string;
  english: string;
  spanish: string;
  french: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  pt: {
    appName: 'StrongProgress',
    appSubtitle: 'Calculadora Automática de Cargas e Porcentagens para CrossFit & LPO',
    freeVersion: 'Versão Gratuita',
    proLifetime: 'PRO Vitalício',
    proActive: 'PRO Ativo',
    studentData: 'Dados do Aluno',
    saved: 'Salvo',
    mensBar: 'Masc',
    womensBar: 'Fem',
    techBar: 'Técnica',
    downloadApp: 'Baixar App',
    newExercise: 'Novo Exercício',
    unlockPro: 'Desbloquear PRO',
    proSubscription: 'Assinatura PRO',
    settings: 'Configurações de Venda & Checkout',
    
    tabCalculator: 'Calculadora Rápida',
    tabCatalog: 'Catálogo & Recordes (PR)',
    tabEstimator: 'Estimador 1RM',
    tabZones: 'Zonas & Tabela RPE',
    
    studentTitle: 'Dados do Aluno',
    female: 'Feminino',
    male: 'Masculino',
    yearsOld: 'anos',
    weight: 'Peso',
    height: 'Altura',
    bmi: 'IMC',
    relativeStrength: 'Força Relativa',
    movementsAboveAvg: 'movimentos acima da média',
    editStudentData: 'Editar Dados / Avaliar Nível',
    
    quickCalcTitle: 'Calculadora Rápida de Tablado',
    quickCalcDesc: 'Digite a carga máxima (1RM) ou use os atalhos para ver as porcentagens e a montagem exata de anilhas em tempo real.',
    baseWeight1RM: 'Carga Base (1RM)',
    barbellWeight: 'Barra Olímpica',
    weightPerSide: 'Carga por Lado',
    platesDistribution: 'Distribuição de Anilhas na Barra',
    percentageTitle: 'Tabela de Porcentagens',
    
    catalogTitle: 'Catálogo de Movimentos & Recordes',
    catalogSubtitle: 'Acompanhe todos os seus PRs, evolução de carga e comparação por peso corporal.',
    allCategories: 'Todas as Categorias',
    searchExercise: 'Buscar exercício...',
    noPrSet: 'Sem PR registrado',
    prSet: '1RM Atual',
    relativeBw: 'do peso corporal',
    aboveAverage: 'Acima da Média',
    average: 'Na Média',
    elite: 'Nível Elite',
    beginner: 'Iniciante',
    
    exerciseDetails: 'Detalhes do Movimento',
    platesAndPercentages: 'Anilhas & %',
    levelVsWeight: 'Nível vs Peso do Aluno',
    historyAndEvolution: 'Histórico & Evolução',
    updatePr: 'Atualizar Recorde',
    addPrLog: 'Adicionar Registro',
    targetPr: 'Meta de Carga',
    
    selectLanguage: 'Idioma / Language',
    portuguese: 'Português',
    english: 'English',
    spanish: 'Español',
    french: 'Français',
  },
  
  en: {
    appName: 'StrongProgress',
    appSubtitle: 'Barbell Loading & Percentage Calculator for CrossFit & Olympic Weightlifting',
    freeVersion: 'Free Version',
    proLifetime: 'PRO Lifetime',
    proActive: 'PRO Active',
    studentData: 'Athlete Profile',
    saved: 'Saved',
    mensBar: 'Men',
    womensBar: 'Women',
    techBar: 'Tech',
    downloadApp: 'Install App',
    newExercise: 'New Exercise',
    unlockPro: 'Unlock PRO',
    proSubscription: 'PRO Membership',
    settings: 'Checkout & Sales Settings',
    
    tabCalculator: 'Quick Floor Calculator',
    tabCatalog: 'Movements & PRs',
    tabEstimator: '1RM Estimator',
    tabZones: 'Zones & RPE Table',
    
    studentTitle: 'Athlete Profile',
    female: 'Female',
    male: 'Male',
    yearsOld: 'years old',
    weight: 'Bodyweight',
    height: 'Height',
    bmi: 'BMI',
    relativeStrength: 'Relative Strength',
    movementsAboveAvg: 'movements above average',
    editStudentData: 'Edit Profile / Evaluate Level',
    
    quickCalcTitle: 'Quick Floor & Plate Calculator',
    quickCalcDesc: 'Enter your 1 Rep Max or use quick buttons to calculate instant percentages and visual barbell plate breakdown.',
    baseWeight1RM: 'Target 1RM Weight',
    barbellWeight: 'Olympic Barbell',
    weightPerSide: 'Weight per Side',
    platesDistribution: 'Barbell Plate Breakdown',
    percentageTitle: 'Percentage Table',
    
    catalogTitle: 'Exercise Catalog & PR Tracker',
    catalogSubtitle: 'Track your personal records, percentage progressions, and bodyweight strength standards.',
    allCategories: 'All Categories',
    searchExercise: 'Search movement...',
    noPrSet: 'No PR recorded',
    prSet: 'Current 1RM',
    relativeBw: 'of bodyweight',
    aboveAverage: 'Above Average',
    average: 'Average',
    elite: 'Elite Tier',
    beginner: 'Beginner',
    
    exerciseDetails: 'Exercise Overview',
    platesAndPercentages: 'Plates & %',
    levelVsWeight: 'Strength Standards vs BW',
    historyAndEvolution: 'History & Logs',
    updatePr: 'Update PR',
    addPrLog: 'Add New Entry',
    targetPr: 'Goal Weight',
    
    selectLanguage: 'Language',
    portuguese: 'Português',
    english: 'English',
    spanish: 'Español',
    french: 'Français',
  },
  
  es: {
    appName: 'StrongProgress',
    appSubtitle: 'Calculadora Automática de Cargas y Porcentajes para CrossFit y Halterofilia',
    freeVersion: 'Versión Gratuita',
    proLifetime: 'PRO Vitalicio',
    proActive: 'PRO Activo',
    studentData: 'Perfil del Atleta',
    saved: 'Guardado',
    mensBar: 'Masc',
    womensBar: 'Fem',
    techBar: 'Técnica',
    downloadApp: 'Instalar App',
    newExercise: 'Nuevo Ejercicio',
    unlockPro: 'Desbloquear PRO',
    proSubscription: 'Suscripción PRO',
    settings: 'Configuración de Ventas',
    
    tabCalculator: 'Calculadora Rápida',
    tabCatalog: 'Catálogo y Récords (PR)',
    tabEstimator: 'Estimador 1RM',
    tabZones: 'Zonas y Tabla RPE',
    
    studentTitle: 'Perfil del Atleta',
    female: 'Femenino',
    male: 'Masculino',
    yearsOld: 'años',
    weight: 'Peso',
    height: 'Altura',
    bmi: 'IMC',
    relativeStrength: 'Fuerza Relativa',
    movementsAboveAvg: 'movimientos sobre la media',
    editStudentData: 'Editar Datos / Evaluar Nivel',
    
    quickCalcTitle: 'Calculadora Rápida de Barra y Discos',
    quickCalcDesc: 'Ingresa tu 1RM para calcular porcentajes instantáneos y montaje exacto de discos en la barra.',
    baseWeight1RM: 'Carga Base (1RM)',
    barbellWeight: 'Barra Olímpica',
    weightPerSide: 'Carga por Lado',
    platesDistribution: 'Distribución de Discos en la Barra',
    percentageTitle: 'Tabla de Porcentajes',
    
    catalogTitle: 'Catálogo de Movimientos y PRs',
    catalogSubtitle: 'Monitorea tus marcas personales, progresión y comparación por peso corporal.',
    allCategories: 'Todas las Categorías',
    searchExercise: 'Buscar ejercicio...',
    noPrSet: 'Sin récord registrado',
    prSet: '1RM Actual',
    relativeBw: 'del peso corporal',
    aboveAverage: 'Sobre la Media',
    average: 'En la Media',
    elite: 'Nivel Élite',
    beginner: 'Principiante',
    
    exerciseDetails: 'Detalles del Ejercicio',
    platesAndPercentages: 'Discos y %',
    levelVsWeight: 'Nivel vs Peso Corporal',
    historyAndEvolution: 'Historial y Registros',
    updatePr: 'Actualizar Récord',
    addPrLog: 'Agregar Registro',
    targetPr: 'Meta de Carga',
    
    selectLanguage: 'Idioma',
    portuguese: 'Português',
    english: 'English',
    spanish: 'Español',
    french: 'Français',
  },
  
  fr: {
    appName: 'StrongProgress',
    appSubtitle: 'Calculateur Automatique de Barres et Pourcentages pour CrossFit & Haltérophilie',
    freeVersion: 'Version Gratuite',
    proLifetime: 'PRO À Vie',
    proActive: 'PRO Actif',
    studentData: 'Profil Athlète',
    saved: 'Enregistré',
    mensBar: 'Hommes',
    womensBar: 'Femmes',
    techBar: 'Tech',
    downloadApp: 'Installer l’App',
    newExercise: 'Nouvel Exercice',
    unlockPro: 'Débloquer PRO',
    proSubscription: 'Abonnement PRO',
    settings: 'Paramètres de Vente',
    
    tabCalculator: 'Calculateur Rapide',
    tabCatalog: 'Catalogue & Records (PR)',
    tabEstimator: 'Estimateur 1RM',
    tabZones: 'Zones & Table RPE',
    
    studentTitle: 'Profil Athlète',
    female: 'Femme',
    male: 'Homme',
    yearsOld: 'ans',
    weight: 'Poids de Corps',
    height: 'Taille',
    bmi: 'IMC',
    relativeStrength: 'Force Relative',
    movementsAboveAvg: 'mouvements au-dessus de la moyenne',
    editStudentData: 'Modifier Profil / Évaluer Niveau',
    
    quickCalcTitle: 'Calculateur Rapide de Disques',
    quickCalcDesc: 'Entrez votre 1RM pour voir les pourcentages instantanés et le chargement visuel de la barre.',
    baseWeight1RM: 'Charge 1RM',
    barbellWeight: 'Barre Olympique',
    weightPerSide: 'Charge par Côté',
    platesDistribution: 'Répartition des Disques',
    percentageTitle: 'Tableau des Pourcentages',
    
    catalogTitle: 'Catalogue d’Exercices & Records',
    catalogSubtitle: 'Suivez vos records personnels, pourcentages et ratios par rapport au poids de corps.',
    allCategories: 'Toutes les Catégories',
    searchExercise: 'Rechercher un exercice...',
    noPrSet: 'Aucun PR enregistré',
    prSet: '1RM Actuel',
    relativeBw: 'du poids de corps',
    aboveAverage: 'Au-dessus de la Moyenne',
    average: 'Dans la Moyenne',
    elite: 'Niveau Élite',
    beginner: 'Débutant',
    
    exerciseDetails: 'Détails du Mouvement',
    platesAndPercentages: 'Disques & %',
    levelVsWeight: 'Niveau vs Poids de Corps',
    historyAndEvolution: 'Historique & Progression',
    updatePr: 'Mettre à Jour PR',
    addPrLog: 'Ajouter une Entrée',
    targetPr: 'Objectif de Charge',
    
    selectLanguage: 'Langue',
    portuguese: 'Português',
    english: 'English',
    spanish: 'Español',
    french: 'Français',
  }
};

export const LANGUAGE_LABELS: Record<Language, { label: string; flag: string }> = {
  pt: { label: 'Português', flag: '🇧🇷' },
  en: { label: 'English', flag: '🇺🇸' },
  es: { label: 'Español', flag: '🇪🇸' },
  fr: { label: 'Français', flag: '🇫🇷' },
};

export function getStoredLanguage(): Language {
  try {
    const saved = localStorage.getItem('strong_app_lang');
    if (saved === 'en' || saved === 'es' || saved === 'fr' || saved === 'pt') {
      return saved as Language;
    }
  } catch (e) {
    console.error('Failed to read language from localStorage', e);
  }
  return 'pt';
}

export function saveStoredLanguage(lang: Language): void {
  try {
    localStorage.setItem('strong_app_lang', lang);
  } catch (e) {
    console.error('Failed to save language to localStorage', e);
  }
}
