/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Volume2,
  RotateCw,
  Check,
  ChevronLeft,
  ChevronRight,
  Globe,
  Layers,
} from 'lucide-react';
import { FLASHCARDS_DATA } from '../data/flashcardsData.ts';
import { Flashcard, CEFRLevel } from '../types.ts';
import { speakRussian, playSound } from '../utils/speech.ts';
import { useLanguage } from '../context/LanguageContext.tsx';

interface FlashcardsViewProps {
  onPracticeCard?: () => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ onPracticeCard }) => {
  const { language, t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [translationLang, setTranslationLang] = useState<'uz' | 'ru'>('uz');
  const [knownIds, setKnownIds] = useState<Set<string>>(new Set());
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | 'ALL'>('ALL');

  // Filter flashcards
  const filteredCards = FLASHCARDS_DATA.filter((c) =>
    selectedLevel === 'ALL' ? true : c.level === selectedLevel
  );

  const safeIndex = Math.min(currentIndex, Math.max(0, filteredCards.length - 1));
  const currentCard: Flashcard | undefined = filteredCards[safeIndex];

  const handleFlip = () => {
    playSound('click');
    setIsFlipped((prev) => !prev);
  };

  const handleNext = () => {
    if (safeIndex < filteredCards.length - 1) {
      playSound('click');
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (safeIndex > 0) {
      playSound('click');
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleMarkKnown = () => {
    if (!currentCard) return;
    playSound('correct');
    setKnownIds((prev) => new Set([...prev, currentCard.id]));
    onPracticeCard?.();
    handleNext();
  };

  const handleMarkReview = () => {
    if (!currentCard) return;
    playSound('click');
    setKnownIds((prev) => {
      const copy = new Set(prev);
      copy.delete(currentCard.id);
      return copy;
    });
    onPracticeCard?.();
    handleNext();
  };

  return (
    <div className="max-w-md mx-auto space-y-3.5 pb-20">
      {/* Title & Language Switcher */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">
            {t('flashcardsTitle')}
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {t('flashcardsSubtitle')}
          </p>
        </div>

        {/* Translation Language Toggle (Uzbek / Russian) */}
        <div className="flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-semibold">
            <button
              onClick={() => setTranslationLang('uz')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                translationLang === 'uz'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              O‘zb
            </button>
            <button
              onClick={() => setTranslationLang('ru')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                translationLang === 'ru'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Rus
            </button>
          </div>
        </div>
      </div>

      {/* Level Filters (Horizontal touch scroller) */}
      <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto text-[11px] font-semibold">
        {(['ALL', 'A1', 'A2', 'B1', 'B2'] as const).map((lvl) => (
          <button
            key={lvl}
            onClick={() => {
              setSelectedLevel(lvl);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
              selectedLevel === lvl
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {lvl === 'ALL' ? (language === 'uz' ? 'Barchasi' : 'Все') : lvl}
          </button>
        ))}
      </div>

      {currentCard ? (
        <div className="space-y-3">
          {/* Card Counter & Mastery Tally */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
            <span>
              {t('cardCounter')} {safeIndex + 1} / {filteredCards.length}
            </span>
            <span className="tabular-nums">
              {t('learnedCounter')}: {knownIds.size} / {FLASHCARDS_DATA.length}
            </span>
          </div>

          {/* Interactive Flashcard Element (Optimized for 1-screen mobile fit) */}
          <div
            onClick={handleFlip}
            className="group relative min-h-[220px] sm:min-h-[280px] rounded-2xl p-4 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer flex flex-col justify-between select-none"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Уровень {currentCard.level}
                </span>
                <span aria-hidden="true" className="text-slate-300">
                  ·
                </span>
                <span className="text-[10px] text-slate-500">{currentCard.category}</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakRussian(currentCard.wordRu);
                }}
                className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors cursor-pointer"
                title="Озвучить русское слово"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Middle Content (Switches Front/Back) */}
            <div className="py-3 text-center space-y-2">
              {!isFlipped ? (
                <>
                  <div className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {currentCard.stressMark}
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 italic">
                    {currentCard.partOfSpeech}
                  </div>
                </>
              ) : (
                <div className="space-y-2 max-w-sm mx-auto text-left">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">
                      {translationLang === 'uz' ? 'Tarjimasi (O‘zbekcha)' : 'Русское значение'}
                    </div>
                    <div className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                      {translationLang === 'uz'
                        ? currentCard.translationUz
                        : currentCard.definitionRu}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 leading-relaxed">
                    <span className="font-semibold block text-slate-500 text-[10px] mb-0.5">
                      {translationLang === 'uz' ? 'Ruscha izohi (Значение):' : 'O‘zbekcha tarjimasi:'}
                    </span>
                    {translationLang === 'uz' ? currentCard.definitionRu : currentCard.translationUz}
                  </div>

                  <div className="text-[11px] text-slate-800 dark:text-slate-200 bg-blue-50/60 dark:bg-blue-950/40 p-2.5 rounded-lg border border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
                    <div>
                      <span className="font-semibold block text-blue-600 dark:text-blue-400 text-[10px]">
                        Пример:
                      </span>
                      «{currentCard.exampleRu}»
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakRussian(currentCard.exampleRu);
                      }}
                      className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 transition-colors ml-1.5 shrink-0 cursor-pointer"
                      title="Озвучить пример"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Hint */}
            <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <RotateCw className="w-3 h-3" />
              <span>{t('tapToFlip')}</span>
            </div>
          </div>

          {/* Action and Navigation Controls */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={handlePrev}
              disabled={safeIndex === 0}
              className={`p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-colors ${
                safeIndex === 0
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
              }`}
              title={t('prevCard')}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 flex-1 justify-center">
              <button
                onClick={handleMarkReview}
                className="py-2 px-3 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer min-h-[38px]"
              >
                {t('repeatCardBtn')}
              </button>
              <button
                onClick={handleMarkKnown}
                className="py-2 px-4 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white transition-all shadow-xs flex items-center gap-1 cursor-pointer min-h-[38px]"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{t('knowCardBtn')}</span>
              </button>
            </div>

            <button
              onClick={handleNext}
              disabled={safeIndex === filteredCards.length - 1}
              className={`p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-colors ${
                safeIndex === filteredCards.length - 1
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
              }`}
              title="Следующая карточка"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <Layers className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
          <h3 className="font-semibold text-slate-900 dark:text-white text-xs">
            Нет карточек для выбранного уровня
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Выберите «Все» в фильтре выше.
          </p>
        </div>
      )}
    </div>
  );
};
