/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { GRAMMAR_RULES } from '../data/grammarData.ts';
import { GrammarRule, Quiz } from '../types.ts';
import { QUIZZES_DATA } from '../data/quizzesData.ts';
import { speakRussian } from '../utils/speech.ts';

interface GrammarHandbookProps {
  onStartQuiz: (quiz: Quiz) => void;
}

export const GrammarHandbook: React.FC<GrammarHandbookProps> = ({ onStartQuiz }) => {
  const [selectedRuleId, setSelectedRuleId] = useState<string>(GRAMMAR_RULES[0].id);

  const currentRule: GrammarRule =
    GRAMMAR_RULES.find((r) => r.id === selectedRuleId) || GRAMMAR_RULES[0];

  const associatedQuiz = currentRule.associatedQuizId
    ? QUIZZES_DATA.find((q) => q.id === currentRule.associatedQuizId)
    : null;

  return (
    <div className="max-w-md mx-auto space-y-3.5 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">
          Справочник по русской грамматике
        </h1>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
          Сводные таблицы 6 падежей, окончания и предлоги с озвучкой
        </p>
      </div>

      {/* Rules Selector Pills / Tabs (Smooth horizontal touch scroll) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {GRAMMAR_RULES.map((rule) => (
          <button
            key={rule.id}
            onClick={() => setSelectedRuleId(rule.id)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-xs ${
              selectedRuleId === rule.id
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>{rule.title}</span>
          </button>
        ))}
      </div>

      {/* Active Rule Details Container */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        {/* Title and summary */}
        <div className="flex flex-col gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] text-blue-600 dark:text-blue-400 font-semibold mb-0.5">
              <span>{currentRule.caseNameRu || 'Раздел'}</span>
              {currentRule.questionsRu && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{currentRule.questionsRu}</span>
                </>
              )}
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {currentRule.title}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              {currentRule.summary}
            </p>
          </div>

          {associatedQuiz && (
            <button
              onClick={() => onStartQuiz(associatedQuiz)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px] w-full"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Тест по этой теме</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Prepositions Box (if exists) */}
        {currentRule.prepositions && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              Предлоги:
            </span>
            {currentRule.prepositions.map((prep) => (
              <span
                key={prep}
                className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-[11px] font-mono font-bold text-blue-700 dark:text-blue-300 border border-slate-200 dark:border-slate-700 shadow-2xs"
              >
                {prep}
              </span>
            ))}
          </div>
        )}

        {/* Structured Table (Mobile-friendly horizontal scroll) */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-slate-400 font-medium px-0.5 block">
            Таблица окончаний (проведите влево/вправо):
          </span>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 -mx-1 sm:mx-0">
            <table className="w-full text-left text-xs min-w-[360px]">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  {currentRule.tableHeaders.map((head, i) => (
                    <th key={i} className="py-2.5 px-3 whitespace-nowrap text-[11px]">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {currentRule.tableRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white text-[11px]">
                      {row.genderOrType}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400 text-xs whitespace-nowrap">
                      {row.endings}
                    </td>
                    <td className="py-2.5 px-3 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span>{row.example}</span>
                        <button
                          onClick={() => speakRussian(row.example)}
                          className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer shrink-0"
                          title="Озвучить"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-[10px] text-slate-500 dark:text-slate-400 max-w-[130px]">
                      {row.note || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Common Mistakes */}
        {currentRule.commonMistakes && currentRule.commonMistakes.length > 0 && (
          <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 dark:text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Частые ошибки:</span>
            </div>
            <ul className="text-[11px] text-amber-900 dark:text-amber-200/90 space-y-1 list-disc list-inside">
              {currentRule.commonMistakes.map((mistake, i) => (
                <li key={i}>{mistake}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
