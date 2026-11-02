/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, CheckSquare, Layers, User } from 'lucide-react';
import { UserStats } from '../types.ts';
import { playSound } from '../utils/speech.ts';
import { useLanguage } from '../context/LanguageContext.tsx';

interface MobileBottomNavProps {
  currentTab: 'dashboard' | 'quizzes' | 'profile' | 'flashcards' | 'grammar';
  onSelectTab: (tab: 'dashboard' | 'quizzes' | 'profile' | 'flashcards') => void;
  stats: UserStats;
  inQuizSession: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  stats,
  inQuizSession,
}) => {
  const { t } = useLanguage();

  // If user is actively taking a test, hide bottom tabs to prevent distraction
  if (inQuizSession) return null;

  const mistakesCount = stats.savedMistakes.length;

  const handleTabClick = (tab: 'dashboard' | 'quizzes' | 'profile' | 'flashcards') => {
    playSound('click');
    onSelectTab(tab);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom,0px)] shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-4 items-center h-16 px-2">
        {/* Tab 1: Главная */}
        <button
          onClick={() => handleTabClick('dashboard')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors relative cursor-pointer ${
            currentTab === 'dashboard'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Home className={`w-5 h-5 ${currentTab === 'dashboard' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[11px] mt-1 tracking-tight truncate max-w-[70px]">{t('tabDashboard')}</span>
          {mistakesCount > 0 && currentTab !== 'dashboard' && (
            <span className="absolute top-2 right-1/4 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        {/* Tab 2: Тесты */}
        <button
          onClick={() => handleTabClick('quizzes')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors relative cursor-pointer ${
            currentTab === 'quizzes'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <CheckSquare className={`w-5 h-5 ${currentTab === 'quizzes' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[11px] mt-1 tracking-tight truncate max-w-[70px]">{t('tabQuizzes')}</span>
        </button>

        {/* Tab 3: Карточки */}
        <button
          onClick={() => handleTabClick('flashcards')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors relative cursor-pointer ${
            currentTab === 'flashcards'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className={`w-5 h-5 ${currentTab === 'flashcards' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[11px] mt-1 tracking-tight truncate max-w-[70px]">{t('tabFlashcards')}</span>
        </button>

        {/* Tab 4: Профиль */}
        <button
          onClick={() => handleTabClick('profile')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors relative cursor-pointer ${
            currentTab === 'profile'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <User className={`w-5 h-5 ${currentTab === 'profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[11px] mt-1 tracking-tight truncate max-w-[70px]">{t('tabProfile')}</span>
        </button>
      </div>
    </nav>
  );
};
