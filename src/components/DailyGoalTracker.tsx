import React from 'react';
import {
  Flame,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Headphones,
  CheckSquare,
  Layers,
  Calendar,
  Trophy,
} from 'lucide-react';
import { UserStats } from '../types.ts';
import { getDefaultDailyGoal, getTodayDateString } from '../utils/storage.ts';
import { useLanguage } from '../context/LanguageContext.tsx';

interface DailyGoalTrackerProps {
  stats: UserStats;
  onOpenQuizzes: () => void;
  onOpenFlashcards: () => void;
  onStartListening: () => void;
  onSelectTargetXp: (target: number) => void;
}

// Declension for "день" in Russian
function getStreakWordRu(num: number): string {
  const n = Math.abs(num) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return 'дней';
  if (n1 > 1 && n1 < 5) return 'дня';
  if (n1 === 1) return 'день';
  return 'дней';
}

// Helper to get 7 days of current week (Monday to Sunday)
function getCurrentWeekDates(lang: 'ru' | 'uz') {
  const now = new Date();
  const currentDay = now.getDay(); // 0 is Sunday, 1 is Monday...
  // Convert so Monday is index 0
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);

  const daysRu = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const daysUz = ['Du', 'Se', 'Chor', 'Pay', 'Jum', 'Sha', 'Yak'];
  const days = lang === 'uz' ? daysUz : daysRu;

  const todayStr = getTodayDateString();

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const isToday = dateStr === todayStr;
    const isPast = dateStr < todayStr;
    const isFuture = dateStr > todayStr;

    return {
      dayName: days[i],
      dateNum: d.getDate(),
      dateStr,
      isToday,
      isPast,
      isFuture,
    };
  });
}

export const DailyGoalTracker: React.FC<DailyGoalTrackerProps> = ({
  stats,
  onOpenQuizzes,
  onOpenFlashcards,
  onStartListening,
  onSelectTargetXp,
}) => {
  const { language, t } = useLanguage();

  const dailyGoal = stats.dailyGoal || getDefaultDailyGoal();
  const todayXp = dailyGoal.todayXp || 0;
  const targetXp = dailyGoal.targetXp || 30;
  const percentage = Math.min(100, Math.round((todayXp / targetXp) * 100));
  const isGoalReached = todayXp >= targetXp;

  const weekDays = getCurrentWeekDates(language);
  const activeDatesSet = new Set(dailyGoal.weeklyActiveDates || [getTodayDateString()]);

  const tasks = dailyGoal.tasks || {
    quizDone: false,
    flashcardsCount: 0,
    listeningDone: false,
  };

  const completedTasksCount =
    (tasks.quizDone ? 1 : 0) +
    (tasks.flashcardsCount >= 5 ? 1 : 0) +
    (tasks.listeningDone ? 1 : 0);

  const streakText =
    language === 'uz'
      ? `${stats.streak} kun ketma-ket!`
      : `${stats.streak} ${getStreakWordRu(stats.streak)} подряд!`;

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm p-3.5 sm:p-5 space-y-4">
      {/* 1. Top Section: Streak Status Banner */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-xs shrink-0 animate-pulse">
            <Flame className="w-6 h-6 fill-amber-100 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tabular-nums">
                {streakText}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300">
                {t('streakBadge')}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {stats.streak >= 3 ? t('streakGoodPace') : t('streakKeepGoing')}
            </p>
          </div>
        </div>

        {isGoalReached && (
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800 shrink-0">
            <Trophy className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t('goalAchieved')}</span>
          </div>
        )}
      </div>

      {/* 2. 7-Day Habit Streak Calendar */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 px-0.5">
          <span className="flex items-center gap-1 font-semibold text-[11px] text-slate-700 dark:text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            {t('weekCalendarTitle')}
          </span>
          <span className="text-[10px]">
            {activeDatesSet.size > 0 ? `${activeDatesSet.size} ${t('activeDaysCount')}` : t('startToday')}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {weekDays.map((d) => {
            const hasActivity = activeDatesSet.has(d.dateStr);

            return (
              <div
                key={d.dateStr}
                className={`flex flex-col items-center justify-center py-1.5 sm:py-2 rounded-xl transition-all ${
                  d.isToday
                    ? 'ring-2 ring-blue-500/80 bg-blue-50/50 dark:bg-blue-950/30'
                    : 'bg-slate-50 dark:bg-slate-800/50'
                }`}
              >
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mb-0.5">
                  {d.dayName}
                </span>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                    hasActivity
                      ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-2xs'
                      : d.isToday
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : d.isPast
                      ? 'text-slate-400 dark:text-slate-600'
                      : 'text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {hasActivity ? (
                    <Flame className="w-3.5 h-3.5 fill-white text-white" />
                  ) : (
                    <span>{d.dateNum}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Daily XP Goal & Progress Bar */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {t('dailyGoalLabel')}
            </span>
            <div className="flex items-center gap-1 ml-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-semibold">
              {[15, 30, 50].map((val) => (
                <button
                  key={val}
                  onClick={() => onSelectTargetXp(val)}
                  className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                    targetXp === val
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title={`${t('dailyGoalLabel')} ${val} XP`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs font-bold tabular-nums text-slate-700 dark:text-slate-300">
            <span className={isGoalReached ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-blue-600 dark:text-blue-400 font-extrabold'}>
              {todayXp}
            </span>
            {' '}/ {targetXp} XP
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isGoalReached
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
          <span>{percentage}% {t('goalCompleted')}</span>
          {isGoalReached ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {t('goalReachedTitle')}
            </span>
          ) : (
            <span>{t('leftXp')} {Math.max(0, targetXp - todayXp)} XP</span>
          )}
        </div>
      </div>

      {/* 4. Daily Quests Checklist (3 actionable micro-tasks) */}
      <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400 px-0.5">
          <span>{t('dailyQuestsTitle')}</span>
          <span className="text-[10px] font-normal text-slate-400">
            {completedTasksCount} {t('questsDoneCount')}
          </span>
        </div>

        <div className="space-y-1.5">
          {/* Task 1: Grammar Test */}
          <div className="flex items-center justify-between p-2 sm:p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  tasks.quizDone
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                    : 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                }`}
              >
                {tasks.quizDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <CheckSquare className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {t('questQuizTitle')}
                </div>
                <div className="text-[10px] text-slate-400 truncate">{t('questQuizSub')}</div>
              </div>
            </div>

            {tasks.quizDone ? (
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                {t('statusDone')}
              </span>
            ) : (
              <button
                onClick={onOpenQuizzes}
                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-medium text-[11px] transition-all flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>{t('actionStart')}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Task 2: Flashcards Practice */}
          <div className="flex items-center justify-between p-2 sm:p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  tasks.flashcardsCount >= 5
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {tasks.flashcardsCount >= 5 ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Layers className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {t('questFlashcardsTitle')}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {tasks.flashcardsCount >= 5
                    ? `5 / 5 ${t('goalCompleted')}`
                    : `${tasks.flashcardsCount} / 5 (${t('questFlashcardsSub')})`}
                </div>
              </div>
            </div>

            {tasks.flashcardsCount >= 5 ? (
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                {t('statusDone')}
              </span>
            ) : (
              <button
                onClick={onOpenFlashcards}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-medium text-[11px] transition-all flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>{t('actionLearn')}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Task 3: Listening Dialogue */}
          <div className="flex items-center justify-between p-2 sm:p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  tasks.listeningDone
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                    : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                }`}
              >
                {tasks.listeningDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Headphones className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {t('questListeningTitle')}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {t('questListeningSub')}
                </div>
              </div>
            </div>

            {tasks.listeningDone ? (
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                {t('statusDone')}
              </span>
            ) : (
              <button
                onClick={onStartListening}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-medium text-[11px] transition-all flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>{t('actionListen')}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
