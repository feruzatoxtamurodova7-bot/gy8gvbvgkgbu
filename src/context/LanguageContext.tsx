/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppLanguage = 'ru' | 'uz';

const LANGUAGE_STORAGE_KEY = 'rki_app_language_preference';

export interface Translations {
  // Navigation & Header
  appTitle: string;
  appSubtitle: string;
  tabDashboard: string;
  tabQuizzes: string;
  tabFlashcards: string;
  tabProfile: string;
  tabGrammar: string;
  testingSession: string;
  switchLangRu: string;
  switchLangUz: string;
  toggleTheme: string;
  toggleFrameMobile: string;
  toggleFrameDesktop: string;
  levelNotDetermined: string;
  levelPrefix: string;
  rkiStandard: string;

  // Dashboard Hero & Quick Actions
  heroTitle: string;
  heroSubtitle: string;
  startPlacementTest: string;
  retakePlacementTest: string;
  viewCertificate: string;
  mistakesCountBadge: string;

  // Streak & Habit Tracker
  streakDaysSuccess: string;
  streakDays: string;
  streakBadge: string;
  streakGoodPace: string;
  streakKeepGoing: string;
  weekCalendarTitle: string;
  activeDaysCount: string;
  startToday: string;
  goalAchieved: string;

  // Daily XP Goal
  dailyGoalLabel: string;
  goalCompleted: string;
  leftXp: string;
  goalReachedTitle: string;

  // Daily Quests
  dailyQuestsTitle: string;
  questsDoneCount: string;
  questQuizTitle: string;
  questQuizSub: string;
  questFlashcardsTitle: string;
  questFlashcardsSub: string;
  questListeningTitle: string;
  questListeningSub: string;
  actionStart: string;
  actionLearn: string;
  actionListen: string;
  statusDone: string;

  // KPI Cards
  kpiLevel: string;
  kpiLevelHint: string;
  kpiXp: string;
  kpiXpHint: string;
  kpiQuizzes: string;
  kpiQuizzesCompleted: string;
  kpiMistakes: string;
  kpiMistakesPending: string;
  kpiMistakesAllCleared: string;

  // Hub sections
  hubTitle: string;
  hubQuizzesTitle: string;
  hubQuizzesDesc: string;
  hubGrammarTitle: string;
  hubGrammarDesc: string;
  hubFlashcardsTitle: string;
  hubFlashcardsDesc: string;

  // Catalog
  catalogTitle: string;
  catalogSubtitle: string;
  searchPlaceholder: string;
  allCategories: string;
  catCases: string;
  catVerbs: string;
  catListening: string;
  catVocab: string;
  catPlacement: string;
  catDialogues: string;
  questionsCount: string;
  minutesCount: string;
  startQuizBtn: string;
  noQuizzesFound: string;
  resetFilterBtn: string;

  // Flashcards View
  flashcardsTitle: string;
  flashcardsSubtitle: string;
  cardCounter: string;
  learnedCounter: string;
  tapToFlip: string;
  prevCard: string;
  nextCard: string;
  repeatCardBtn: string;
  knowCardBtn: string;
  emptyFlashcards: string;
  selectFilterHint: string;
  exampleLabel: string;
  uzbekTranslation: string;
  russianDefinition: string;

  // Profile View
  profileTitle: string;
  profileSubtitle: string;
  studentNameLabel: string;
  editName: string;
  saveName: string;
  cancelEdit: string;
  overallAccuracy: string;
  totalXp: string;
  currentStreak: string;
  testsPassed: string;
  achievementsTitle: string;
  achievementsSubtitle: string;
  interfaceLanguageTitle: string;
  interfaceLanguageDesc: string;

  // Quiz Runner & Result
  exitQuiz: string;
  exitQuizConfirm: string;
  listenAudio: string;
  normalSpeed: string;
  slowSpeed: string;
  checkAnswer: string;
  continueBtn: string;
  correctBanner: string;
  wrongBanner: string;
  ruleExplanation: string;
  quizResultTitle: string;
  quizScoreLabel: string;
  earnedXpLabel: string;
  retakeQuizBtn: string;
  reviewMistakesBtn: string;
  backToCatalogBtn: string;
  backToHomeBtn: string;

  // Certificate Modal
  certificateTitle: string;
  certificateSubtitle: string;
  issuedTo: string;
  levelConfirmed: string;
  downloadOrPrint: string;
  closeBtn: string;
}

export const TRANSLATIONS: Record<AppLanguage, Translations> = {
  ru: {
    appTitle: 'Русский Язык',
    appSubtitle: 'Тесты и Практика',
    tabDashboard: 'Главная',
    tabQuizzes: 'Тесты',
    tabFlashcards: 'Карточки',
    tabProfile: 'Профиль',
    tabGrammar: 'Справочник падежей',
    testingSession: 'Тестирование',
    switchLangRu: 'Русский',
    switchLangUz: 'O‘zbekcha',
    toggleTheme: 'Сменить тему',
    toggleFrameMobile: 'Мобильный вид',
    toggleFrameDesktop: 'Широкий экран',
    levelNotDetermined: 'Не определен',
    levelPrefix: 'Уровень',
    rkiStandard: 'Стандарт РКИ (A1 — B2)',

    heroTitle: 'Изучение Русского Языка',
    heroSubtitle: 'Тестирование, 6 падежей, глаголы движения, аудирование с русской озвучкой и разбор правил.',
    startPlacementTest: 'Пройти тест на определение уровня',
    retakePlacementTest: 'Пересдать тест на уровень',
    viewCertificate: 'Сертификат',
    mistakesCountBadge: 'Ошибки',

    streakDaysSuccess: 'дней подряд!',
    streakDays: 'дней',
    streakBadge: 'Серия 🔥',
    streakGoodPace: 'Отличный темп! Сохраняйте огонь активности.',
    streakKeepGoing: 'Занимайтесь каждый день, чтобы не потерять темп.',
    weekCalendarTitle: 'Неделя занятий',
    activeDaysCount: 'дн. активно',
    startToday: 'Начните сегодня',
    goalAchieved: 'Выполнено',

    dailyGoalLabel: 'Цель на день:',
    goalCompleted: 'выполнено',
    leftXp: 'Осталось:',
    goalReachedTitle: 'Цель дня достигнута! 🎉',

    dailyQuestsTitle: 'Ежедневные задания',
    questsDoneCount: 'из 3 выполнено',
    questQuizTitle: 'Пройти любой тест',
    questQuizSub: '+15 XP за сдачу теста',
    questFlashcardsTitle: 'Повторить 5 карточек',
    questFlashcardsSub: 'Повторите словарный запас (+10 XP)',
    questListeningTitle: 'Аудирование (диалоги)',
    questListeningSub: 'Прослушать русскую речь (+10 XP)',
    actionStart: 'Пройти',
    actionLearn: 'Учить',
    actionListen: 'Слушать',
    statusDone: '✓ Сделано',

    kpiLevel: 'Уровень',
    kpiLevelHint: 'Пройдите тест',
    kpiXp: 'Опыт',
    kpiXpHint: '+10 за верный ответ',
    kpiQuizzes: 'Тесты',
    kpiQuizzesCompleted: 'пройдено',
    kpiMistakes: 'Ошибки',
    kpiMistakesPending: 'Ждут повторения',
    kpiMistakesAllCleared: 'Все закрыты!',

    hubTitle: 'Учебные разделы',
    hubQuizzesTitle: 'Каталог тестов и упражнений',
    hubQuizzesDesc: 'Тесты по падежам, глаголам и аудированию',
    hubGrammarTitle: 'Интерактивный справочник падежей',
    hubGrammarDesc: 'Таблицы 6 падежей, окончания, предлоги и примеры',
    hubFlashcardsTitle: 'Словарный тренажер (Карточки)',
    hubFlashcardsDesc: 'Слова с ударениями, озвучкой и переводом',

    catalogTitle: 'Каталог тестов и упражнений',
    catalogSubtitle: 'Выберите тему для отработки грамматики и проверки знаний',
    searchPlaceholder: 'Поиск теста по названию или теме...',
    allCategories: 'Все категории',
    catCases: 'Падежи',
    catVerbs: 'Глаголы',
    catListening: 'Аудирование',
    catVocab: 'Словарный запас',
    catPlacement: 'Определение уровня',
    catDialogues: 'Диалоги',
    questionsCount: 'вопросов',
    minutesCount: 'мин',
    startQuizBtn: 'Начать тест',
    noQuizzesFound: 'Тестов по выбранным критериям не найдено',
    resetFilterBtn: 'Сбросить фильтры',

    flashcardsTitle: 'Словарный тренажер',
    flashcardsSubtitle: 'Флеш-карточки с ударениями и переводом',
    cardCounter: 'Карточка',
    learnedCounter: 'Выучено',
    tapToFlip: 'Нажмите для переворота',
    prevCard: 'Назад',
    nextCard: 'Вперед',
    repeatCardBtn: 'Повторить',
    knowCardBtn: 'Знаю!',
    emptyFlashcards: 'Нет карточек для выбранного уровня',
    selectFilterHint: 'Выберите «Все» в фильтре выше.',
    exampleLabel: 'Пример:',
    uzbekTranslation: 'Tarjimasi (O‘zbekcha)',
    russianDefinition: 'Русское значение',

    profileTitle: 'Личный профиль',
    profileSubtitle: 'Статистика обучения, достижения и сертификаты',
    studentNameLabel: 'Имя студента:',
    editName: 'Изменить',
    saveName: 'Сохранить',
    cancelEdit: 'Отмена',
    overallAccuracy: 'Точность ответов',
    totalXp: 'Всего опыта',
    currentStreak: 'Серия дней',
    testsPassed: 'Пройдено тестов',
    achievementsTitle: 'Достижения и награды',
    achievementsSubtitle: 'Открывайте новые медали за регулярную учебу',
    interfaceLanguageTitle: 'Язык интерфейса',
    interfaceLanguageDesc: 'Переключение языка приложения между русским и узбекским',

    exitQuiz: 'Завершить',
    exitQuizConfirm: 'Вы уверены, что хотите выйти из теста? Текущий прогресс будет потерян.',
    listenAudio: 'Слушать',
    normalSpeed: '1.0x',
    slowSpeed: '0.8x',
    checkAnswer: 'Проверить ответ',
    continueBtn: 'Продолжить',
    correctBanner: 'Правильно! Отличная работа!',
    wrongBanner: 'Неверно. Обратите внимание на правило:',
    ruleExplanation: 'Грамматический разбор:',
    quizResultTitle: 'Результаты тестирования',
    quizScoreLabel: 'Правильных ответов:',
    earnedXpLabel: 'Получено опыта:',
    retakeQuizBtn: 'Пересдать тест',
    reviewMistakesBtn: 'Работа над ошибками',
    backToCatalogBtn: 'К каталогу тестов',
    backToHomeBtn: 'На главную',

    certificateTitle: 'Сертификат уровня РКИ',
    certificateSubtitle: 'Подтверждение владения русским языком',
    issuedTo: 'Выдан студенту:',
    levelConfirmed: 'Подтвержденный уровень владения:',
    downloadOrPrint: 'Печать / PDF',
    closeBtn: 'Закрыть',
  },

  uz: {
    appTitle: 'Rus Tili',
    appSubtitle: 'Testlar va Amaliyot',
    tabDashboard: 'Bosh sahifa',
    tabQuizzes: 'Testlar',
    tabFlashcards: 'Lug‘at',
    tabProfile: 'Profil',
    tabGrammar: 'Kelishiklar qo‘llanmasi',
    testingSession: 'Test jarayoni',
    switchLangRu: 'Русский',
    switchLangUz: 'O‘zbekcha',
    toggleTheme: 'Mavzuni almashtirish',
    toggleFrameMobile: 'Mobil ko‘rinish',
    toggleFrameDesktop: 'Katta ekran',
    levelNotDetermined: 'Aniqlanmagan',
    levelPrefix: 'Daraja',
    rkiStandard: 'RKI standarti (A1 — B2)',

    heroTitle: 'Rus Tilini O‘rganish',
    heroSubtitle: 'Testlar, 6 ta kelishik, harakat fe’llari, ruscha audio tinglash va har bir qoida tahlili.',
    startPlacementTest: 'Darajani aniqlash testini topshirish',
    retakePlacementTest: 'Daraja testini qayta topshirish',
    viewCertificate: 'Sertifikat',
    mistakesCountBadge: 'Xatolar',

    streakDaysSuccess: 'kun ketma-ket!',
    streakDays: 'kun',
    streakBadge: 'Seriya 🔥',
    streakGoodPace: 'Ajoyib sur’at! Mashg‘ulotlar davomiyligini saqlang.',
    streakKeepGoing: 'Seriyani yo‘qotmaslik uchun har kuni shug‘ullaning.',
    weekCalendarTitle: 'Haftalik mashg‘ulotlar',
    activeDaysCount: 'kun faol',
    startToday: 'Bugun boshlang',
    goalAchieved: 'Bajarildi',

    dailyGoalLabel: 'Kunlik maqsad:',
    goalCompleted: 'bajarildi',
    leftXp: 'Qoldi:',
    goalReachedTitle: 'Kunlik maqsadga erishildi! 🎉',

    dailyQuestsTitle: 'Kunlik vazifalar',
    questsDoneCount: 'tadan 3 tasi bajarildi',
    questQuizTitle: 'Istalgan testni yechish',
    questQuizSub: 'Testni topshirganlik uchun +15 XP',
    questFlashcardsTitle: '5 ta kartochkani takrorlash',
    questFlashcardsSub: 'Lug‘at boyligini mustahkamlash (+10 XP)',
    questListeningTitle: 'Tinglab tushunish (dialoglar)',
    questListeningSub: 'Ruscha nutqni tinglash (+10 XP)',
    actionStart: 'Boshlash',
    actionLearn: 'O‘rganish',
    actionListen: 'Tinglash',
    statusDone: '✓ Bajarildi',

    kpiLevel: 'Daraja',
    kpiLevelHint: 'Testdan o‘ting',
    kpiXp: 'Tajriba (XP)',
    kpiXpHint: 'To‘g‘ri javob uchun +10',
    kpiQuizzes: 'Testlar',
    kpiQuizzesCompleted: 'o‘tildi',
    kpiMistakes: 'Xatolar',
    kpiMistakesPending: 'Takrorlash kutilmoqda',
    kpiMistakesAllCleared: 'Hammasi to‘g‘ri!',

    hubTitle: 'O‘quv bo‘limlari',
    hubQuizzesTitle: 'Testlar va mashqlar katalogi',
    hubQuizzesDesc: 'Kelishiklar, fe’llar va tinglash bo‘yicha testlar',
    hubGrammarTitle: 'Kelishiklar bo‘yicha interaktiv qo‘llanma',
    hubGrammarDesc: '6 ta kelishik jadvallari, qo‘shimchalar, old qo‘shimchalar va misollar',
    hubFlashcardsTitle: 'Lug‘at trenajyori (Kartochkalar)',
    hubFlashcardsDesc: 'Urg‘ulari, audio talaffuzi va tarjimasi bilan so‘zlar',

    catalogTitle: 'Testlar va mashqlar katalogi',
    catalogSubtitle: 'Grammatikani mustahkamlash va bilimlarni tekshirish uchun mavzuni tanlang',
    searchPlaceholder: 'Test nomi yoki mavzusi bo‘yicha qidirish...',
    allCategories: 'Barcha toifalar',
    catCases: 'Kelishiklar',
    catVerbs: 'Fe’llar',
    catListening: 'Tinglash',
    catVocab: 'Lug‘at boyligi',
    catPlacement: 'Darajani aniqlash',
    catDialogues: 'Dialoglar',
    questionsCount: 'ta savol',
    minutesCount: 'daqiqa',
    startQuizBtn: 'Testni boshlash',
    noQuizzesFound: 'Tanlangan mezonlar bo‘yicha testlar topilmadi',
    resetFilterBtn: 'Filtrlarni tozalash',

    flashcardsTitle: 'Lug‘at trenajyori',
    flashcardsSubtitle: 'Urg‘u belgilari va tarjimasi bilan flesh-kartochkalar',
    cardCounter: 'Kartochka',
    learnedCounter: 'O‘rganildi',
    tapToFlip: 'Aylantirish uchun bosing',
    prevCard: 'Oldingi',
    nextCard: 'Keyingi',
    repeatCardBtn: 'Takrorlash',
    knowCardBtn: 'Bilaman!',
    emptyFlashcards: 'Tanlangan daraja uchun kartochkalar mavjud emas',
    selectFilterHint: 'Yuqoridagi filtrdan «Barchasi»ni tanlang.',
    exampleLabel: 'Misol:',
    uzbekTranslation: 'Tarjimasi (O‘zbekcha)',
    russianDefinition: 'Ruscha ma’nosi',

    profileTitle: 'Shaxsiy profil',
    profileSubtitle: 'O‘qish statistikasi, yutuqlar va sertifikatlar',
    studentNameLabel: 'Talaba ismi:',
    editName: 'O‘zgartirish',
    saveName: 'Saqlash',
    cancelEdit: 'Bekor qilish',
    overallAccuracy: 'Javoblar aniqligi',
    totalXp: 'Jami tajriba (XP)',
    currentStreak: 'Kunlar seriyasi',
    testsPassed: 'Topshirilgan testlar',
    achievementsTitle: 'Yutuqlar va medallar',
    achievementsSubtitle: 'Muntazam o‘qish orqali yangi nishonlarni oching',
    interfaceLanguageTitle: 'Interfeys tili',
    interfaceLanguageDesc: 'Ilova tilini rus tili va o‘zbek tili o‘rtasida almashtirish',

    exitQuiz: 'Chiqish',
    exitQuizConfirm: 'Testdan chiqmoqchimisiz? Hozirgi natijalar saqlanmaydi.',
    listenAudio: 'Tinglash',
    normalSpeed: '1.0x',
    slowSpeed: '0.8x',
    checkAnswer: 'Javobni tekshirish',
    continueBtn: 'Davom etish',
    correctBanner: 'To‘g‘ri! Ajoyib natija!',
    wrongBanner: 'Noto‘g‘ri. Qoidaga e’tibor bering:',
    ruleExplanation: 'Grammatik qoida tahlili:',
    quizResultTitle: 'Test natijalari',
    quizScoreLabel: 'To‘g‘ri javoblar:',
    earnedXpLabel: 'Olingan tajriba (XP):',
    retakeQuizBtn: 'Testni qayta topshirish',
    reviewMistakesBtn: 'Xatolar ustida ishlash',
    backToCatalogBtn: 'Testlar katalogiga',
    backToHomeBtn: 'Bosh sahifaga',

    certificateTitle: 'RKI daraja sertifikati',
    certificateSubtitle: 'Rus tilini bilish darajasi tasdig‘i',
    issuedTo: 'Talabaga berildi:',
    levelConfirmed: 'Tasdiqlangan bilim darajasi:',
    downloadOrPrint: 'Chop etish / PDF',
    closeBtn: 'Yopish',
  },
};

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  toggleLanguage: () => void;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'ru' || saved === 'uz') return saved;
      return 'ru'; // Default to Russian as per standard RKI immersion
    } catch {
      return 'ru';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      document.documentElement.lang = language;
    } catch (e) {
      console.error('Failed to save language preference', e);
    }
  }, [language]);

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'ru' ? 'uz' : 'ru'));
  };

  const t = (key: keyof Translations): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.ru;
    return dict[key] || TRANSLATIONS.ru[key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
