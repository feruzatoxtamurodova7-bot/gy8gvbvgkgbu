/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  RotateCcw,
  CheckCircle2,
  Trash2,
  Volume2,
} from 'lucide-react';
import { Question, UserStats } from '../types.ts';
import { speakRussian, playSound } from '../utils/speech.ts';

interface MistakesReviewModalProps {
  stats: UserStats;
  onClose: () => void;
  onRemoveMistake: (questionId: string) => void;
  onRetakeAsQuiz: (questions: Question[]) => void;
}

export const MistakesReviewModal: React.FC<MistakesReviewModalProps> = ({
  stats,
  onClose,
  onRemoveMistake,
  onRetakeAsQuiz,
}) => {
  const mistakes = stats.savedMistakes;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[85dvh] overflow-hidden my-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between p-3.5 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Работа над ошибками ({mistakes.length})
              </h2>
              <p className="text-[10px] text-slate-500">
                Повторение неверных заданий из тестов
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Questions List */}
        <div className="p-3 overflow-y-auto space-y-2.5 flex-1">
          {mistakes.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-xs">
                Ошибок нет!
              </h3>
              <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                Все неверные вопросы были исправлены.
              </p>
            </div>
          ) : (
            mistakes.map((m, index) => {
              const formattedCorrect = Array.isArray(m.correctAnswer)
                ? m.correctAnswer.join(' ')
                : m.correctAnswer;

              return (
                <div
                  key={m.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-0.5">
                        <span className="font-bold text-rose-600 dark:text-rose-400">
                          #{index + 1}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>Уровень {m.level}</span>
                      </div>
                      <h4 className="font-semibold text-slate-900 dark:text-white text-xs leading-snug">
                        {m.prompt}
                      </h4>
                      {m.contextSentence && (
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 italic mt-0.5 line-clamp-2">
                          {m.contextSentence}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() =>
                          speakRussian(m.audioText || m.contextSentence || m.prompt)
                        }
                        className="p-1 rounded text-slate-400 hover:text-blue-600 transition-colors"
                        title="Озвучить"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          playSound('click');
                          onRemoveMistake(m.id);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-[11px] space-y-0.5">
                    <div>
                      <span className="text-slate-400 text-[10px]">Ответ: </span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        {formattedCorrect}
                      </strong>
                    </div>
                    <div className="text-[10px] text-slate-500 pt-0.5 border-t border-slate-100 dark:border-slate-800 leading-tight">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Правило:{' '}
                      </span>
                      {m.explanation}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {mistakes.length > 0 && (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
            <span className="text-[10px] text-slate-500">
              {mistakes.length} в базе
            </span>
            <button
              onClick={() => onRetakeAsQuiz(mistakes)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 active:scale-98 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer min-h-[36px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Пройти ошибки</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
