/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Clock,
  HelpCircle,
  ArrowRight,
  Search,
} from 'lucide-react';
import { CEFRLevel, Quiz, QuizCategory, UserStats } from '../types.ts';
import { QUIZZES_DATA } from '../data/quizzesData.ts';
import { useLanguage } from '../context/LanguageContext.tsx';

interface QuizzesCatalogProps {
  stats: UserStats;
  onStartQuiz: (quiz: Quiz) => void;
}

export const QuizzesCatalog: React.FC<QuizzesCatalogProps> = ({
  stats,
  onStartQuiz,
}) => {
  const { language, t } = useLanguage();
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter quizzes
  const filteredQuizzes = QUIZZES_DATA.filter((quiz) => {
    // Search filter
    if (
      searchQuery &&
      !quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !quiz.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    // Level filter
    if (selectedLevel !== 'ALL' && quiz.level !== 'ALL' && quiz.level !== selectedLevel) {
      return false;
    }
    // Category filter
    if (selectedCategory !== 'ALL' && quiz.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-md mx-auto space-y-3.5 pb-24">
      {/* Header & Search */}
      <div className="space-y-2">
        <div>
          <h1 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">
            {t('catalogTitle')}
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {t('catalogSubtitle')}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Level Filters (Interactive Segmented Control) */}
      <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto text-[11px] font-semibold">
        {(['ALL', 'A1', 'A2', 'B1', 'B2'] as const).map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedLevel === lvl
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {lvl === 'ALL'
              ? (language === 'uz' ? 'Barchasi' : 'Все')
              : lvl === 'A1'
              ? `A1 ${language === 'uz' ? 'Boshlang‘ich' : 'Элементарный'}`
              : lvl === 'A2'
              ? `A2 ${language === 'uz' ? 'Asosiy' : 'Базовый'}`
              : lvl === 'B1'
              ? `B1 ${language === 'uz' ? 'O‘rta' : 'Первый'}`
              : `B2 ${language === 'uz' ? 'Yuqori' : 'Продвинутый'}`}
          </button>
        ))}
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[11px]">
        {(
          [
            { key: 'ALL', label: language === 'uz' ? 'Barcha mavzular' : 'Все темы' },
            { key: 'placement', label: language === 'uz' ? 'Diagnostika' : 'Диагностика' },
            { key: 'cases', label: language === 'uz' ? 'Kelishiklar' : 'Падежи' },
            { key: 'verbs', label: language === 'uz' ? 'Fe’llar' : 'Глаголы' },
            { key: 'listening', label: language === 'uz' ? 'Audio' : 'Аудио' },
            { key: 'dialogues', label: language === 'uz' ? 'Sintaksis' : 'Синтаксис' },
          ] as const
        ).map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key as QuizCategory | 'ALL')}
            className={`px-2.5 py-1 rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedCategory === cat.key
                ? 'bg-blue-600 text-white font-medium shadow-2xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Quizzes List Cards Grid (1 column on mobile to fit nicely) */}
      <div className="grid grid-cols-1 gap-3">
        {filteredQuizzes.map((quiz) => {
          const completed = stats.completedQuizzes[quiz.id];
          const hasPassed = completed && completed.bestScore / completed.total >= 0.7;

          return (
            <div
              key={quiz.id}
              className="flex flex-col justify-between p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-2xs group"
            >
              <div>
                {/* Clean unboxed metadata separator */}
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 mb-1.5">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {quiz.level === 'ALL' ? 'A1-B2' : quiz.level}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{quiz.badge}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {quiz.estimatedMinutes} {t('minutesCount')}
                  </span>
                </div>

                <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                  {quiz.title}
                </h2>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3 line-clamp-2">
                  {quiz.description}
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="text-slate-400">
                    {quiz.questions.length} {t('questionsCount')}
                  </span>
                  {completed && (
                    <span
                      className={`font-semibold tabular-nums ${
                        hasPassed
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {language === 'uz' ? 'Natija' : 'Рекорд'}: {completed.bestScore}/{completed.total} (
                      {Math.round((completed.bestScore / completed.total) * 100)}%)
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onStartQuiz(quiz)}
                  className="w-full py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 active:scale-98 cursor-pointer shadow-2xs min-h-[40px]"
                >
                  <span>{completed ? (language === 'uz' ? 'Qayta topshirish' : 'Пройти снова') : t('startQuizBtn')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="text-center py-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <HelpCircle className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
          <h3 className="font-semibold text-slate-900 dark:text-white text-xs">
            {t('noQuizzesFound')}
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {language === 'uz'
              ? 'Qidiruv so‘zini yoki daraja filtrini o‘zgartirib ko‘ring.'
              : 'Попробуйте изменить поисковый запрос или фильтр уровня.'}
          </p>
        </div>
      )}
    </div>
  );
};
