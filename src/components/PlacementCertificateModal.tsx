/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Printer,
  Award,
  ShieldCheck,
} from 'lucide-react';
import { CEFRLevel, UserStats } from '../types.ts';

interface PlacementCertificateModalProps {
  stats: UserStats;
  onClose: () => void;
}

export const PlacementCertificateModal: React.FC<
  PlacementCertificateModalProps
> = ({ stats, onClose }) => {
  const [studentName, setStudentName] = useState('Студент РКИ');
  const [isEditingName, setIsEditingName] = useState(false);

  const placement = stats.placementResult || {
    level: 'A2' as CEFRLevel,
    score: 8,
    total: 15,
    date: new Date().toISOString().split('T')[0],
  };

  const levelDescriptions: Record<CEFRLevel, { title: string; desc: string }> = {
    A1: {
      title: 'A1 — Элементарный (Elementary)',
      desc: 'Понимание и использование базовых повседневных фраз, приветствий и простых предложений.',
    },
    A2: {
      title: 'A2 — Базовый (Basic / Waystage)',
      desc: 'Уверенное общение в стандартных жизненных ситуациях: магазин, транспорт, кафе и ориентация в городе.',
    },
    B1: {
      title: 'B1 — Первый сертификационный (Intermediate)',
      desc: 'Владение падежами, видами глаголов и синтаксисом. Достаточно для учебы в вузе.',
    },
    B2: {
      title: 'B2 — Второй сертификационный (Upper-Intermediate)',
      desc: 'Свободное владение сложными грамматическими конструкциями и чтение оригинальной литературы.',
    },
  };

  const currentLevelInfo = levelDescriptions[placement.level];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden print:border-none print:shadow-none my-auto">
        {/* Modal Top Control Bar (Hidden during print) */}
        <div className="flex items-center justify-between p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 print:hidden">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Award className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="truncate">Сертификат РКИ</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <Printer className="w-3 h-3" />
              <span>Печать</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div className="p-4 sm:p-6 text-center space-y-4 relative bg-linear-to-b from-amber-50/40 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
          {/* Ornate Inner Border */}
          <div className="border-2 border-double border-amber-600/30 dark:border-amber-500/20 rounded-xl p-4 sm:p-6 space-y-4 relative">
            {/* Header Badge */}
            <div className="flex flex-col items-center space-y-1.5">
              <div className="w-12 h-12 rounded-full bg-linear-to-tr from-amber-500 to-amber-300 text-slate-900 flex items-center justify-center shadow-md ring-2 ring-amber-100 dark:ring-amber-950">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Международный стандарт РКИ
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight font-serif">
                Сертификат Достижений
              </h2>
            </div>

            {/* Recipient Name */}
            <div className="py-1.5 border-b border-t border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
                Выдан на имя:
              </span>
              {isEditingName ? (
                <div className="flex items-center justify-center gap-1.5 max-w-xs mx-auto">
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="text-base font-bold text-center border-b border-blue-600 dark:text-white bg-transparent outline-none w-full"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="p-1 text-emerald-600 font-bold text-xs"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => setIsEditingName(true)}
                  className="text-base sm:text-lg font-bold text-blue-900 dark:text-blue-300 cursor-pointer hover:underline"
                  title="Нажмите, чтобы изменить имя"
                >
                  {studentName} ✏️
                </div>
              )}
            </div>

            {/* Level Award Box */}
            <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 space-y-1">
              <span className="text-[10px] font-semibold text-amber-800 dark:text-amber-300 uppercase">
                Уровень владения:
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
                {placement.level}
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {currentLevelInfo.title}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                {currentLevelInfo.desc}
              </p>
            </div>

            {/* Footer Metadata */}
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="text-left">
                <span className="block text-slate-400">Результат:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                  {placement.score}/{placement.total} (
                  {Math.round((placement.score / placement.total) * 100)}%)
                </span>
              </div>

              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Верифицировано</span>
              </div>

              <div className="text-right">
                <span className="block text-slate-400">Дата:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {placement.date}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
