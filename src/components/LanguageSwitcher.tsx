/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { playSound } from '../utils/speech.ts';

interface LanguageSwitcherProps {
  variant?: 'compact' | 'pills';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { language, setLanguage, toggleLanguage } = useLanguage();

  const handleSelect = (lang: 'ru' | 'uz') => {
    playSound('click');
    setLanguage(lang);
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={() => {
          playSound('click');
          toggleLanguage();
        }}
        className={`flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs font-bold cursor-pointer select-none ${className}`}
        title={language === 'ru' ? 'O‘zbek tiliga o‘tish' : 'Переключить на русский'}
        aria-label="Переключить язык / Tilni almashtirish"
      >
        <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span className="uppercase text-[11px] font-extrabold tracking-wide">
          {language === 'ru' ? '🇷🇺 RU' : '🇺🇿 UZ'}
        </span>
      </button>
    );
  }

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold ${className}`}
    >
      <button
        onClick={() => handleSelect('ru')}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
          language === 'ru'
            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <span>🇷🇺</span>
        <span>Русский</span>
      </button>

      <button
        onClick={() => handleSelect('uz')}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
          language === 'uz'
            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <span>🇺🇿</span>
        <span>O‘zbek</span>
      </button>
    </div>
  );
};
