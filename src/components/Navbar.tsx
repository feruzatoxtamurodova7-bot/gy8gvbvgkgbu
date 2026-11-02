/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Flame, Moon, Sun, Award, BookmarkCheck } from 'lucide-react';
import { UserStats } from '../types.ts';
import { useLanguage } from '../context/LanguageContext.tsx';
import { LanguageSwitcher } from './LanguageSwitcher.tsx';

interface NavbarProps {
  currentTab: 'dashboard' | 'quizzes' | 'profile' | 'flashcards' | 'grammar';
  onSelectTab: (tab: 'dashboard' | 'quizzes' | 'profile' | 'flashcards') => void;
  stats: UserStats;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onStartPlacement: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  stats,
  theme,
  onToggleTheme,
  onStartPlacement,
}) => {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 text-left group focus:outline-none shrink-0 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              РКИ
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap block">
                {t('appTitle')}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 -mt-1 block">
                {t('appSubtitle')}
              </span>
            </div>
          </button>

          {/* Zone 2: 4 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-sm font-medium">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'dashboard'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {t('tabDashboard')}
            </button>
            <button
              onClick={() => onSelectTab('quizzes')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'quizzes'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {t('tabQuizzes')}
            </button>
            <button
              onClick={() => onSelectTab('flashcards')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'flashcards'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {t('tabFlashcards')}
            </button>
            <button
              onClick={() => onSelectTab('profile')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'profile'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {t('tabProfile')}
            </button>
          </nav>

          {/* Zone 3: 1 primary action with streak & theme toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Daily Streak Indicator */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-semibold tabular-nums"
              title="Дней подряд практики"
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{stats.streak} {stats.streak === 1 ? 'день' : stats.streak < 5 ? 'дня' : 'дней'}</span>
            </div>

            {/* Total XP Score */}
            <div
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold tabular-nums"
              title="Накопленный опыт"
            >
              <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{stats.xp} XP</span>
            </div>

            {/* Language Switcher RU / UZ */}
            <LanguageSwitcher variant="pills" />

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Переключить тему"
              title={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onStartPlacement}
              className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-500/20 whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>{stats.placementResult ? t('retakePlacementTest') : t('startPlacementTest')}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-200 dark:border-slate-800 text-xs font-medium">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-2 py-1 rounded ${
              currentTab === 'dashboard'
                ? 'text-blue-600 font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t('tabDashboard')}
          </button>
          <button
            onClick={() => onSelectTab('quizzes')}
            className={`px-2 py-1 rounded ${
              currentTab === 'quizzes'
                ? 'text-blue-600 font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t('tabQuizzes')}
          </button>
          <button
            onClick={() => onSelectTab('flashcards')}
            className={`px-2 py-1 rounded ${
              currentTab === 'flashcards'
                ? 'text-blue-600 font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t('tabFlashcards')}
          </button>
          <button
            onClick={() => onSelectTab('profile')}
            className={`px-2 py-1 rounded ${
              currentTab === 'profile'
                ? 'text-blue-600 font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t('tabProfile')}
          </button>
        </div>
      </div>
    </header>
  );
};
