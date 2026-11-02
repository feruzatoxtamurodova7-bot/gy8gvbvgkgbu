/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Award,
  Sparkles,
  FileText,
  Volume2,
} from 'lucide-react';
import { Quiz, QuizSessionResult, CEFRLevel } from '../types.ts';
import { playSound, speakRussian } from '../utils/speech.ts';
import { useLanguage } from '../context/LanguageContext.tsx';

interface QuizResultProps {
  quiz: Quiz;
  result: QuizSessionResult;
  onRetake: () => void;
  onReviewMistakes: () => void;
  onBackToDashboard: () => void;
  onShowCertificate?: () => void;
}

export const QuizResult: React.FC<QuizResultProps> = ({
  quiz,
  result,
  onRetake,
  onReviewMistakes,
  onBackToDashboard,
  onShowCertificate,
}) => {
  const { language, t } = useLanguage();
  const isPass = result.percentage >= 70;
  const isPlacement = quiz.category === 'placement';

  // Calculate Level for placement test
  const calculateAssignedLevel = (score: number): CEFRLevel => {
    if (score >= 14) return 'B2';
    if (score >= 10) return 'B1';
    if (score >= 6) return 'A2';
    return 'A1';
  };

  const assignedLevel = isPlacement ? calculateAssignedLevel(result.score) : null;

  useEffect(() => {
    if (isPass) {
      playSound('complete');
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  }, [isPass]);

  const mistakes = result.answers.filter((a) => !a.isCorrect);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins} мин ${secs} сек`;
  };

  return (
    <div className="max-w-md mx-auto space-y-4 pb-24">
      {/* Top Hero Result Card */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs text-center space-y-3">
        <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
          {isPlacement ? (
            <Award className="w-6 h-6" />
          ) : isPass ? (
            <Trophy className="w-6 h-6 text-amber-500" />
          ) : (
            <RotateCcw className="w-6 h-6 text-blue-600" />
          )}
        </div>

        <div>
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            {isPlacement ? 'Диагностика РКИ' : 'Тест завершен'}
          </span>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            {quiz.title}
          </h1>
        </div>

        {/* Score & Assigned Level */}
        <div className="py-2">
          <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
            {result.score} / {result.total}
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'uz' ? 'Aniqlik' : 'Точность'}: {result.percentage}% · {language === 'uz' ? 'Vaqt' : 'Время'}: {formatTime(result.timeSpentSeconds)}
          </div>

          {assignedLevel && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 font-bold text-xs sm:text-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'uz' ? 'Berilgan daraja' : 'Присвоенный уровень'}: {assignedLevel}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          {isPlacement && onShowCertificate && (
            <button
              onClick={onShowCertificate}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-blue-600 text-white hover:bg-blue-700 active:scale-98 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
            >
              <FileText className="w-4 h-4" />
              <span>{language === 'uz' ? 'Sertifikatni ko‘rish' : 'Посмотреть сертификат'}</span>
            </button>
          )}

          {mistakes.length > 0 && (
            <button
              onClick={onReviewMistakes}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{language === 'uz' ? `Xatolarni tahlil qilish (${mistakes.length})` : `Разобрать ошибки (${mistakes.length})`}</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onRetake}
              className="flex-1 py-2 px-3 rounded-xl font-medium text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all flex items-center justify-center gap-1 cursor-pointer min-h-[38px]"
            >
              <span>{t('retakeQuizBtn')}</span>
            </button>

            <button
              onClick={onBackToDashboard}
              className="flex-1 py-2 px-3 rounded-xl font-medium text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all flex items-center justify-center gap-1 cursor-pointer min-h-[38px]"
            >
              <span>{t('backToCatalogBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Question by Question Detailed Review */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          Разбор заданий ({result.answers.length})
        </h2>

        <div className="space-y-2">
          {result.answers.map((item, idx) => {
            const userAnswerFormatted = Array.isArray(item.userAnswer)
              ? item.userAnswer.join(' ')
              : item.userAnswer;
            const correctAnswerFormatted = Array.isArray(item.question.correctAnswer)
              ? item.question.correctAnswer.join(' ')
              : item.question.correctAnswer;

            return (
              <div
                key={item.questionId}
                className={`p-3.5 rounded-xl border transition-all bg-white dark:bg-slate-900 ${
                  item.isCorrect
                    ? 'border-emerald-200 dark:border-emerald-900/60'
                    : 'border-rose-200 dark:border-rose-900/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="mt-0.5 shrink-0">
                      {item.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <span className="font-semibold">Вопрос {idx + 1}</span>
                        <span aria-hidden="true">·</span>
                        <span>Уровень {item.question.level}</span>
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white text-xs mt-0.5 leading-snug">
                        {item.question.prompt}
                      </h3>
                      {item.question.contextSentence && (
                        <p className="text-[10px] text-slate-500 italic mt-0.5 line-clamp-2">
                          {item.question.contextSentence}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      speakRussian(
                        item.question.audioText ||
                          item.question.contextSentence ||
                          item.question.prompt
                      )
                    }
                    className="p-1 rounded text-slate-400 hover:text-blue-600 transition-colors shrink-0"
                    title="Озвучить"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-slate-400">Ваш ответ:</span>
                    <span
                      className={`font-semibold ${
                        item.isCorrect
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400 line-through'
                      }`}
                    >
                      {userAnswerFormatted || '(нет ответа)'}
                    </span>
                  </div>

                  {!item.isCorrect && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-slate-400">Правильный ответ:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {correctAnswerFormatted}
                      </span>
                    </div>
                  )}

                  <div className="text-[10px] text-slate-500 pt-0.5 leading-tight">
                    <strong className="text-slate-700 dark:text-slate-300">
                      Правило:{' '}
                    </strong>
                    {item.question.explanation}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
