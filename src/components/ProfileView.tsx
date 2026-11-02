/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  User,
  Award,
  Flame,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  Sparkles,
  FileText,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Edit3,
  Check,
  Trophy,
} from 'lucide-react';
import { UserStats, CEFRLevel, Quiz } from '../types.ts';
import { QUIZZES_DATA } from '../data/quizzesData.ts';
import { useLanguage } from '../context/LanguageContext.tsx';
import { LanguageSwitcher } from './LanguageSwitcher.tsx';

interface ProfileViewProps {
  stats: UserStats;
  onShowCertificate: () => void;
  onStartPlacement: () => void;
  onOpenMistakes: () => void;
  onOpenGrammar: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  stats,
  onShowCertificate,
  onStartPlacement,
  onOpenMistakes,
  onOpenGrammar,
}) => {
  const { language, t } = useLanguage();

  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('rki_student_name') || (language === 'uz' ? 'RKI talabasi' : 'Студент РКИ');
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const completedQuizzesList = Object.values(stats.completedQuizzes);
  const completedCount = completedQuizzesList.length;

  // Calculate overall accuracy
  let totalScore = 0;
  let totalQuestions = 0;
  completedQuizzesList.forEach((q) => {
    totalScore += q.bestScore;
    totalQuestions += q.total;
  });
  const overallAccuracy =
    totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

  const handleSaveName = () => {
    const trimmed = tempName.trim() || 'Студент РКИ';
    setUserName(trimmed);
    localStorage.setItem('rki_student_name', trimmed);
    setIsEditingName(false);
  };

  // Achievements evaluation
  const achievements = [
    {
      id: 'first_step',
      title: language === 'uz' ? 'Ilk qadamlar' : 'Первые шаги',
      desc: language === 'uz' ? 'Birinchi testingizni topshiring' : 'Пройдите ваш первый тест',
      unlocked: completedCount >= 1,
      icon: '🌱',
    },
    {
      id: 'placement_done',
      title: language === 'uz' ? 'RKI attestatsiyasi' : 'Аттестация РКИ',
      desc: language === 'uz' ? 'Darajani aniqlash testidan o‘ting' : 'Пройдите тест на определение уровня',
      unlocked: Boolean(stats.placementResult),
      icon: '🎓',
    },
    {
      id: 'streak_3',
      title: language === 'uz' ? 'Zarbdor sur’at' : 'Ударный темп',
      desc: language === 'uz' ? 'Ketma-ket 3 kunlik darslar seriyasi' : 'Серия занятий от 3 дней подряд',
      unlocked: stats.streak >= 3,
      icon: '🔥',
    },
    {
      id: 'accuracy_80',
      title: language === 'uz' ? 'A’lochi' : 'Отличник',
      desc: language === 'uz' ? 'Javoblar aniqligi kamida 80%' : 'Общая точность ответов от 80%',
      unlocked: overallAccuracy >= 80 && completedCount >= 2,
      icon: '⭐',
    },
    {
      id: 'master_b1',
      title: language === 'uz' ? 'Ishonchli daraja' : 'Уверенный уровень',
      desc: language === 'uz' ? 'B1 yoki B2 darajasiga erishing' : 'Достигните уровня B1 или B2',
      unlocked:
        stats.placementResult?.level === 'B1' ||
        stats.placementResult?.level === 'B2',
      icon: '🏆',
    },
  ];

  return (
    <div className="max-w-md mx-auto space-y-4 pb-24">
      {/* Profile Card Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3.5">
        <div className="flex items-center gap-3.5">
          {/* Avatar Icon */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            {isEditingName ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="px-2 py-1 text-sm font-bold rounded-lg border border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none w-full"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="p-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                  {userName}
                </h1>
                <button
                  onClick={() => {
                    setTempName(userName);
                    setIsEditingName(true);
                  }}
                  className="p-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                  title={t('editName')}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {stats.placementResult
                  ? `${t('kpiLevel')} ${stats.placementResult.level}`
                  : t('levelNotDetermined')}
              </span>
              <span aria-hidden="true">·</span>
              <span>{language === 'uz' ? 'Rus tilini o‘rganmoqda' : 'Изучает русский язык'}</span>
            </div>
          </div>
        </div>

        {/* Quick Streak & XP Strip */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-500">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">{t('currentStreak')}</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {stats.streak} {language === 'uz' ? 'kun' : 'дн.'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">{t('totalXp')}</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {stats.xp} XP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interface Language Switcher Card (Explicit Settings in Profile) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-bold text-slate-900 dark:text-white">
              {t('interfaceLanguageTitle')}
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {t('interfaceLanguageDesc')}
            </p>
          </div>
          <LanguageSwitcher variant="pills" />
        </div>
      </div>

      {/* Official Certificate Spotlight Card */}
      {stats.placementResult ? (
        <div className="p-4 rounded-2xl bg-linear-to-r from-amber-500/10 via-amber-500/5 to-blue-500/10 border border-amber-300 dark:border-amber-700/60 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">
                {stats.placementResult.level}
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Сертификат уровня {stats.placementResult.level}
                </h3>
                <span className="text-[10px] text-slate-500">
                  Результат: {stats.placementResult.score}/{stats.placementResult.total} баллов
                </span>
              </div>
            </div>

            <button
              onClick={onShowCertificate}
              className="px-2.5 py-1.5 rounded-lg bg-amber-600 text-white font-semibold text-xs hover:bg-amber-700 transition-colors flex items-center gap-1 cursor-pointer shadow-xs shrink-0"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Открыть</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Пройдите аттестацию на уровень (РКИ)
            </h3>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            15 вопросов для определения вашего уровня от A1 до B2 с выдачей именного сертификата.
          </p>
          <button
            onClick={onStartPlacement}
            className="w-full py-2 px-3 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all cursor-pointer min-h-[38px]"
          >
            Начать тест на уровень
          </button>
        </div>
      )}

      {/* Progress & Analytics Breakdown */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-0.5">
          Статистика обучения
        </h2>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-400 block">Пройдено тестов</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
              {completedCount} из {QUIZZES_DATA.length}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-400 block">Средняя точность</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {overallAccuracy}%
            </span>
          </div>
        </div>

        {/* Mistakes Review Row */}
        <div
          onClick={onOpenMistakes}
          className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 hover:border-rose-300 transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1 rounded-md bg-rose-500 text-white">
              <RotateCcw className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Банк ошибок ({stats.savedMistakes.length})
              </span>
              <span className="text-[10px] text-slate-500">
                {stats.savedMistakes.length > 0
                  ? 'Вопросы, требующие повторения'
                  : 'Все ошибки устранены!'}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Grammar Handbook Shortcut */}
        <div
          onClick={onOpenGrammar}
          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-blue-400 transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1 rounded-md bg-indigo-500 text-white">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Справочник 6 падежей
              </span>
              <span className="text-[10px] text-slate-500">
                Таблицы окончаний и грамматические правила
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Badges & Achievements Grid */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-0.5">
            Достижения и медали
          </h2>
          <span className="text-[10px] font-semibold text-slate-400 tabular-nums">
            {achievements.filter((a) => a.unlocked).length} / {achievements.length}
          </span>
        </div>

        <div className="space-y-1.5">
          {achievements.map((item) => (
            <div
              key={item.id}
              className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                item.unlocked
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
                  : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {item.desc}
                  </p>
                </div>
              </div>

              {item.unlocked ? (
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
              ) : (
                <span className="text-[10px] text-slate-400 font-medium">Закрыто</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
