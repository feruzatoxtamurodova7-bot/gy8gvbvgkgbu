/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  BookOpen,
  Award,
  Layers,
  CheckSquare,
} from 'lucide-react';
import { Quiz, UserStats } from '../types.ts';
import { QUIZZES_DATA } from '../data/quizzesData.ts';
import { DailyGoalTracker } from './DailyGoalTracker.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

interface DashboardProps {
  stats: UserStats;
  onStartQuiz: (quiz: Quiz) => void;
  onOpenMistakes: () => void;
  onOpenGrammar: () => void;
  onOpenFlashcards: () => void;
  onOpenQuizzes: () => void;
  onShowCertificate: () => void;
  onSelectTargetXp: (target: number) => void;
  onStartListening: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  onStartQuiz,
  onOpenMistakes,
  onOpenGrammar,
  onOpenFlashcards,
  onOpenQuizzes,
  onShowCertificate,
  onSelectTargetXp,
  onStartListening,
}) => {
  const { t } = useLanguage();

  // Calculate metrics
  const completedCount = Object.keys(stats.completedQuizzes).length;
  const mistakesCount = stats.savedMistakes.length;
  const placementQuiz = QUIZZES_DATA.find((q) => q.id === 'placement-test-rki')!;

  return (
    <div className="space-y-4 sm:space-y-6 pb-20">
      {/* Compact Hero Banner: Placement Test & Current Status */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white p-4 sm:p-6 shadow-sm">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-[10px] sm:text-xs font-medium text-blue-100 mb-2 border border-white/15">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>{t('rkiStandard')}</span>
          </div>

          <h1 className="text-base sm:text-2xl font-bold tracking-tight text-white mb-1.5 sm:mb-2">
            {t('heroTitle')}
          </h1>
          <p className="text-[11px] sm:text-xs text-blue-100/90 leading-relaxed mb-3 sm:mb-4">
            {t('heroSubtitle')}
          </p>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => onStartQuiz(placementQuiz)}
              className="w-full px-4 py-2.5 rounded-xl bg-white text-blue-900 font-semibold text-xs sm:text-sm hover:bg-blue-50 active:scale-98 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer min-h-[40px]"
            >
              <Award className="w-4 h-4 text-blue-700 shrink-0" />
              <span className="truncate">
                {stats.placementResult
                  ? t('retakePlacementTest')
                  : t('startPlacementTest')}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-700 shrink-0" />
            </button>

            <div className="flex items-center gap-2">
              {stats.placementResult && (
                <button
                  onClick={onShowCertificate}
                  className="flex-1 px-3 py-2 rounded-xl bg-blue-600/70 hover:bg-blue-600 border border-blue-400/30 text-white font-medium text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  <span className="truncate">{t('viewCertificate')} ({stats.placementResult.level})</span>
                </button>
              )}

              {mistakesCount > 0 && (
                <button
                  onClick={onOpenMistakes}
                  className="flex-1 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-300/30 text-amber-200 font-medium text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px]"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>{t('mistakesCountBadge')}: {mistakesCount}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Decorative circle */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-blue-500/20 blur-2xl pointer-events-none" />
      </div>

      {/* Daily Goals & Streaks Tracker (Motivation Hub) */}
      <DailyGoalTracker
        stats={stats}
        onOpenQuizzes={onOpenQuizzes}
        onOpenFlashcards={onOpenFlashcards}
        onStartListening={onStartListening}
        onSelectTargetXp={onSelectTargetXp}
      />

      {/* KPI Cards Grid (Compact 2x2 on Mobile) */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">
              {t('kpiLevel')}
            </span>
            <div className="p-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Award className="w-3 h-3" />
            </div>
          </div>
          <div className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
            {stats.placementResult ? stats.placementResult.level : t('levelNotDetermined')}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 truncate">
            {stats.placementResult
              ? `${stats.placementResult.score}/${stats.placementResult.total}`
              : t('kpiLevelHint')}
          </p>
        </div>

        <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">
              {t('kpiXp')}
            </span>
            <div className="p-1 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <TrendingUp className="w-3 h-3" />
            </div>
          </div>
          <div className="text-base sm:text-xl font-bold text-slate-900 dark:text-white tabular-nums">
            {stats.xp} XP
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 truncate">
            {t('kpiXpHint')}
          </p>
        </div>

        <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">
              {t('kpiQuizzes')}
            </span>
            <div className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
            </div>
          </div>
          <div className="text-base sm:text-xl font-bold text-slate-900 dark:text-white tabular-nums">
            {completedCount} / {QUIZZES_DATA.length}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 truncate">
            {Math.round((completedCount / QUIZZES_DATA.length) * 100)}% {t('kpiQuizzesCompleted')}
          </p>
        </div>

        <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">
              {t('kpiMistakes')}
            </span>
            <div className="p-1 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <RotateCcw className="w-3 h-3" />
            </div>
          </div>
          <div className="text-base sm:text-xl font-bold text-slate-900 dark:text-white tabular-nums">
            {mistakesCount}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 truncate">
            {mistakesCount > 0 ? t('kpiMistakesPending') : t('kpiMistakesAllCleared')}
          </p>
        </div>
      </div>

      {/* Main Educational Sections Hub Cards */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
          {t('hubTitle')}
        </h2>

        <div className="grid grid-cols-1 gap-2.5">
          {/* Quizzes Catalog Quick Link */}
          <div
            onClick={onOpenQuizzes}
            className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer group flex items-center justify-between shadow-2xs"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <CheckSquare className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-xs sm:text-sm truncate">
                  {t('hubQuizzesTitle')}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {QUIZZES_DATA.length} {t('hubQuizzesDesc')}
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </div>

          {/* Grammar Handbook Quick Link */}
          <div
            onClick={onOpenGrammar}
            className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer group flex items-center justify-between shadow-2xs"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-xs sm:text-sm truncate">
                  {t('hubGrammarTitle')}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {t('hubGrammarDesc')}
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </div>

          {/* Flashcards Vocabulary Quick Link */}
          <div
            onClick={onOpenFlashcards}
            className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer group flex items-center justify-between shadow-2xs"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors text-xs sm:text-sm truncate">
                  {t('hubFlashcardsTitle')}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {t('hubFlashcardsDesc')}
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </div>
        </div>
      </div>
    </div>
  );
};
