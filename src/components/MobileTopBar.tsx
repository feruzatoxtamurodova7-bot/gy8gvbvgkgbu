/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Flame, Moon, Sun, Award, Smartphone, Monitor, ChevronLeft } from 'lucide-react';
import { UserStats } from '../types.ts';
import { useLanguage } from '../context/LanguageContext.tsx';
import { LanguageSwitcher } from './LanguageSwitcher.tsx';

interface MobileTopBarProps {
  currentTab: 'dashboard' | 'quizzes' | 'grammar' | 'flashcards' | 'profile';
  stats: UserStats;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isMobileFrameMode: boolean;
  onToggleFrameMode: () => void;
  inQuizSession: boolean;
  onBackFromQuiz?: () => void;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  currentTab,
  stats,
  theme,
  onToggleTheme,
  isMobileFrameMode,
  onToggleFrameMode,
  inQuizSession,
  onBackFromQuiz,
}) => {
  const { t } = useLanguage();

  const getTabTitle = () => {
    if (inQuizSession) return t('testingSession');
    switch (currentTab) {
      case 'dashboard':
        return t('tabDashboard');
      case 'quizzes':
        return t('tabQuizzes');
      case 'profile':
        return t('tabProfile');
      case 'grammar':
        return t('tabGrammar');
      case 'flashcards':
        return t('tabFlashcards');
      default:
        return t('appTitle');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-2.5 sm:px-3 py-2 transition-colors">
      <div className="flex items-center justify-between gap-1.5 max-w-md mx-auto">
        {/* Left Slot: Back Button or Brand Badge */}
        <div className="flex items-center gap-2 min-w-0">
          {inQuizSession && onBackFromQuiz ? (
            <button
              onClick={onBackFromQuiz}
              className="p-1 -ml-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              aria-label="Назад"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
              РКИ
            </div>
          )}

          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">
              {getTabTitle()}
            </h1>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block -mt-0.5 truncate">
              {stats.placementResult ? `${t('levelPrefix')} ${stats.placementResult.level}` : t('rkiStandard')}
            </span>
          </div>
        </div>

        {/* Right Slot: Streak, Theme Toggle & Frame Toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Streak Badge */}
          <div
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-[11px] font-semibold tabular-nums"
            title="Серия дней"
          >
            <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>{stats.streak}</span>
          </div>

          {/* XP Badge */}
          <div
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[11px] font-semibold tabular-nums"
            title="Баллы XP"
          >
            <Award className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <span>{stats.xp}</span>
          </div>

          {/* Language Switcher RU / UZ */}
          <LanguageSwitcher variant="compact" />

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={t('toggleTheme')}
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-600" />
            )}
          </button>

          {/* Frame View Toggle (Mobile / Fullscreen) */}
          <button
            onClick={onToggleFrameMode}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isMobileFrameMode ? 'To‘liq ekranga o‘tish' : 'Mobil korpus rejimiga o‘tish'}
          >
            {isMobileFrameMode ? (
              <Monitor className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            ) : (
              <Smartphone className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
