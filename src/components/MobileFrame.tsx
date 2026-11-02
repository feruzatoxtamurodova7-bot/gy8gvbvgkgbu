/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, Smartphone, Monitor } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  isMobileFrameMode: boolean;
  onToggleFrameMode: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  isMobileFrameMode,
  onToggleFrameMode,
}) => {
  const [currentTime, setCurrentTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // If mobile frame mode is disabled, render as clean full-screen responsive container
  if (!isMobileFrameMode) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col">
        {/* Floating Switcher Toolbar */}
        <div className="fixed top-3 right-3 z-50 hidden sm:flex items-center gap-1.5 p-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-800 shadow-md text-xs font-medium">
          <button
            onClick={onToggleFrameMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold cursor-pointer hover:bg-blue-100 transition-colors"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobil ramkaga o‘tish</span>
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center sm:p-2 sm:py-3 transition-colors overflow-hidden">
      {/* Desktop Mode Toggle Bar */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-[390px] mb-2 px-1 text-xs text-slate-500 dark:text-slate-400 shrink-0">
        <div className="flex items-center gap-1.5 font-medium">
          <Smartphone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="text-[11px]">Mobil ilova (390 × 844 px)</span>
        </div>

        <button
          onClick={onToggleFrameMode}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors shadow-2xs cursor-pointer text-[11px]"
        >
          <Monitor className="w-3 h-3" />
          <span>Keng ekran</span>
        </button>
      </div>

      {/* Realistic Smartphone Shell (Auto-scales within screen height) */}
      <div className="relative w-full h-[100dvh] sm:h-full sm:max-h-[min(844px,96dvh)] sm:max-w-[390px] bg-black sm:rounded-[44px] sm:p-2.5 sm:shadow-2xl sm:ring-1 sm:ring-slate-800/40 flex flex-col overflow-hidden">
        {/* Smartphone Inner Screen */}
        <div className="relative w-full h-full bg-white dark:bg-slate-900 sm:rounded-[36px] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
          {/* iOS / Smartphone Status Bar */}
          <div className="h-9 px-5 pt-1 flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white shrink-0 select-none bg-white dark:bg-slate-900 z-50 border-b border-transparent">
            {/* Clock */}
            <span className="tabular-nums text-[12px]">{currentTime}</span>

            {/* Dynamic Island / Camera Notch */}
            <div className="w-20 h-4 bg-black rounded-full mx-auto" />

            {/* Status Icons */}
            <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Scrollable Viewport inside the phone */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col scroll-smooth">
            {children}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="hidden sm:block h-4 shrink-0 bg-white dark:bg-slate-900 z-50 pb-1">
            <div className="w-28 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};
