/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Clock,
  Sparkles,
  HelpCircle,
  X,
  Check,
  AlertCircle,
  Undo2,
} from 'lucide-react';
import { Question, Quiz, QuizSessionResult } from '../types.ts';
import { speakRussian, stopSpeech, playSound } from '../utils/speech.ts';
import { useLanguage } from '../context/LanguageContext.tsx';

interface QuizRunnerProps {
  quiz: Quiz;
  onFinish: (result: QuizSessionResult) => void;
  onExit: () => void;
}

// Fisher-Yates array shuffler to ensure random option placement
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({
  quiz,
  onFinish,
  onExit,
}) => {
  const { language, t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [wordOrderAnswer, setWordOrderAnswer] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Results accumulator
  const [sessionAnswers, setSessionAnswers] = useState<
    QuizSessionResult['answers']
  >([]);

  const currentQuestion: Question = quiz.questions[currentIndex];

  // Initialize question state with randomized options
  useEffect(() => {
    setSelectedOption('');
    setIsAnswerSubmitted(false);
    setIsCorrect(false);

    // Randomize option order so correct answer is mixed in different positions
    if (currentQuestion.options) {
      setShuffledOptions(shuffleArray(currentQuestion.options));
    } else {
      setShuffledOptions([]);
    }

    if (currentQuestion.type === 'word_order' && currentQuestion.wordsBank) {
      // Shuffle words initially
      setAvailableWords(shuffleArray(currentQuestion.wordsBank));
      setWordOrderAnswer([]);
    }

    // Auto-speak audio prompt if listening type
    if (currentQuestion.type === 'listening' && currentQuestion.audioText) {
      handleSpeak(currentQuestion.audioText);
    }

    return () => {
      stopSpeech();
    };
  }, [currentIndex, currentQuestion]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle Audio Speech
  const handleSpeak = useCallback(
    async (text: string) => {
      setIsSpeaking(true);
      await speakRussian(text, speechRate);
      setIsSpeaking(false);
    },
    [speechRate]
  );

  // Word order mechanics
  const handleSelectWord = (word: string, index: number) => {
    if (isAnswerSubmitted) return;
    playSound('click');
    setWordOrderAnswer((prev) => [...prev, word]);
    setAvailableWords((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveWord = (word: string, index: number) => {
    if (isAnswerSubmitted) return;
    playSound('click');
    setAvailableWords((prev) => [...prev, word]);
    setWordOrderAnswer((prev) => prev.filter((_, i) => i !== index));
  };

  const handleResetWordOrder = () => {
    if (isAnswerSubmitted || !currentQuestion.wordsBank) return;
    setWordOrderAnswer([]);
    setAvailableWords(
      [...currentQuestion.wordsBank].sort(() => Math.random() - 0.5)
    );
  };

  // Submit Answer
  const handleSubmitAnswer = () => {
    if (isAnswerSubmitted) return;

    let correct = false;
    let finalAnswer: string | string[] = '';

    if (currentQuestion.type === 'word_order') {
      if (wordOrderAnswer.length === 0) return;
      finalAnswer = wordOrderAnswer;
      const expected = currentQuestion.correctAnswer as string[];
      correct =
        wordOrderAnswer.length === expected.length &&
        wordOrderAnswer.every((w, idx) => w === expected[idx]);
    } else {
      if (!selectedOption) return;
      finalAnswer = selectedOption;
      correct = selectedOption === currentQuestion.correctAnswer;
    }

    setIsCorrect(correct);
    setIsAnswerSubmitted(true);

    if (correct) {
      playSound('correct');
    } else {
      playSound('wrong');
    }

    // Save answer state
    setSessionAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        userAnswer: finalAnswer,
        isCorrect: correct,
        question: currentQuestion,
      },
    ]);
  };

  // Next Question or Finish
  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Calculate summary
      const score = sessionAnswers.filter((a) => a.isCorrect).length;
      const total = quiz.questions.length;
      const percentage = Math.round((score / total) * 100);

      onFinish({
        quizId: quiz.id,
        score,
        total,
        percentage,
        timeSpentSeconds: secondsElapsed,
        answers: sessionAnswers,
        date: new Date().toISOString().split('T')[0],
      });
    }
  };

  // Format Timer mm:ss
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round(
    ((currentIndex + 1) / quiz.questions.length) * 100
  );

  return (
    <div className="max-w-md mx-auto space-y-3.5 pb-24">
      {/* Quiz Header Bar */}
      <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title="Выйти из теста"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
              {quiz.title}
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <span>Вопрос {currentIndex + 1}/{quiz.questions.length}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {currentQuestion.level}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold tabular-nums text-slate-600 dark:text-slate-300 shrink-0">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
            <Clock className="w-3 h-3 text-slate-400" />
            <span className="text-[11px]">{formatTime(secondsElapsed)}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Active Question Card */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        {/* Prompt Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              {currentQuestion.type === 'listening'
                ? 'Аудирование'
                : currentQuestion.type === 'word_order'
                ? 'Конструктор фразы'
                : 'Грамматика'}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
              {currentQuestion.prompt}
            </h3>
          </div>

          {/* Russian Speech Audio Trigger & Speed Control */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() =>
                handleSpeak(
                  currentQuestion.audioText ||
                    currentQuestion.contextSentence ||
                    currentQuestion.prompt
                )
              }
              className={`p-2 rounded-xl transition-all flex items-center gap-1 text-xs font-medium cursor-pointer ${
                isSpeaking
                  ? 'bg-blue-600 text-white animate-pulse'
                  : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60'
              }`}
              title="Прослушать произношение"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Озвучить</span>
            </button>

            {/* Speed toggle (1.0x / 0.8x) */}
            <button
              onClick={() => setSpeechRate((r) => (r === 1.0 ? 0.8 : 1.0))}
              className="px-2 py-1 text-xs font-semibold rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Скорость речи"
            >
              {speechRate}x
            </button>
          </div>
        </div>

        {/* Context Sentence or Dialogue Block */}
        {currentQuestion.contextSentence && (
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-base sm:text-lg text-slate-800 dark:text-slate-200 font-medium whitespace-pre-line leading-relaxed">
            {currentQuestion.contextSentence}
          </div>
        )}

        {/* Listening Big Player Card (if type === 'listening') */}
        {currentQuestion.type === 'listening' && (
          <div className="p-5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-slate-800 border border-blue-200 dark:border-blue-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSpeak(currentQuestion.audioText!)}
                className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Volume2 className="w-6 h-6" />
              </button>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Нажмите для прослушивания русской фразы
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Рекомендуется прослушать 2 раза на нормальной и замедленной скорости
                </p>
              </div>
            </div>

            <button
              onClick={() => handleSpeak(currentQuestion.audioText!)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Повторить аудио
            </button>
          </div>
        )}

        {/* Multiple Choice & Fill Blank Interaction */}
        {(currentQuestion.type === 'multiple_choice' ||
          currentQuestion.type === 'fill_blank' ||
          currentQuestion.type === 'listening') &&
          shuffledOptions.length > 0 && (
            <div className="grid grid-cols-1 gap-2 sm:gap-2.5 pt-1">
              {shuffledOptions.map((option, index) => {
                const isSelected = selectedOption === option;
                const isTheCorrectOne =
                  isAnswerSubmitted && option === currentQuestion.correctAnswer;
                const isWrongSelection =
                  isAnswerSubmitted && isSelected && !isCorrect;

                let cardStyle =
                  'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 text-slate-800 dark:text-slate-200';

                if (isSelected && !isAnswerSubmitted) {
                  cardStyle =
                    'bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 text-blue-900 dark:text-blue-100 shadow-2xs';
                }

                if (isTheCorrectOne) {
                  cardStyle =
                    'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 dark:border-emerald-500 text-emerald-950 dark:text-emerald-100';
                } else if (isWrongSelection) {
                  cardStyle =
                    'bg-rose-50 dark:bg-rose-950/60 border-rose-600 dark:border-rose-500 text-rose-950 dark:text-rose-100';
                }

                return (
                  <button
                    key={option}
                    disabled={isAnswerSubmitted}
                    onClick={() => {
                      playSound('click');
                      setSelectedOption(option);
                    }}
                    className={`p-3 sm:p-3.5 rounded-xl border text-left font-medium transition-all flex items-center justify-between gap-2.5 cursor-pointer min-h-[44px] ${cardStyle} ${
                      isAnswerSubmitted ? 'cursor-default' : 'active:scale-98'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-sm sm:text-base">{option}</span>
                    </div>

                    {isTheCorrectOne && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isWrongSelection && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

        {/* Word Order Interaction */}
        {currentQuestion.type === 'word_order' && (
          <div className="space-y-4 pt-2">
            {/* Slot where assembled words appear */}
            <div className="min-h-20 p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 flex flex-wrap items-center gap-2">
              {wordOrderAnswer.length === 0 ? (
                <span className="text-xs sm:text-sm text-slate-400 italic">
                  Нажимайте на слова внизу, чтобы собрать предложение в правильном порядке...
                </span>
              ) : (
                wordOrderAnswer.map((word, idx) => (
                  <button
                    key={`${word}-${idx}`}
                    disabled={isAnswerSubmitted}
                    onClick={() => handleRemoveWord(word, idx)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium text-sm shadow-xs hover:bg-blue-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{word}</span>
                    {!isAnswerSubmitted && <X className="w-3 h-3 text-blue-200" />}
                  </button>
                ))
              )}
            </div>

            {/* Bank of remaining available words */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Банк доступных слов:</span>
                {!isAnswerSubmitted && wordOrderAnswer.length > 0 && (
                  <button
                    onClick={handleResetWordOrder}
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    <span>Сбросить</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {availableWords.map((word, idx) => (
                  <button
                    key={`${word}-${idx}`}
                    disabled={isAnswerSubmitted}
                    onClick={() => handleSelectWord(word, idx)}
                    className="px-3.5 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-slate-700/60 active:scale-95 transition-all shadow-2xs cursor-pointer"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Submit or Next Action Button (Full width on mobile for thumb ergonomics) */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          {!isAnswerSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={
                currentQuestion.type === 'word_order'
                  ? wordOrderAnswer.length === 0
                  : !selectedOption
              }
              className={`w-full sm:w-auto py-3.5 sm:py-2.5 px-6 rounded-xl font-bold sm:font-semibold text-base sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                (currentQuestion.type === 'word_order'
                  ? wordOrderAnswer.length > 0
                  : selectedOption)
                  ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-98 shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{t('checkAnswer')}</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full sm:w-auto py-3.5 sm:py-2.5 px-6 rounded-xl font-bold sm:font-semibold text-base sm:text-sm bg-blue-600 text-white hover:bg-blue-700 active:scale-98 transition-all shadow-xs shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>
                {currentIndex < quiz.questions.length - 1
                  ? (language === 'uz' ? 'Keyingi savol' : 'Следующий вопрос')
                  : (language === 'uz' ? 'Yakunlash va natijalarni ko‘rish' : 'Завершить и посмотреть итоги')}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Grammar Rule Explanation Box (Shows immediately upon submit) */}
        {isAnswerSubmitted && (
          <div
            className={`p-5 rounded-xl border transition-all ${
              isCorrect
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-100'
                : 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/80 text-rose-950 dark:text-rose-100'
            }`}
          >
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1.5 flex-1">
                <div className="font-bold text-sm sm:text-base">
                  {isCorrect ? t('correctBanner') : t('wrongBanner')}
                  {!isCorrect && (
                    <span className="block font-normal text-xs sm:text-sm mt-0.5">
                      {language === 'uz' ? 'To‘g‘ri javob' : 'Правильный ответ'}:{' '}
                      <strong>
                        {Array.isArray(currentQuestion.correctAnswer)
                           ? currentQuestion.correctAnswer.join(' ')
                          : currentQuestion.correctAnswer}
                      </strong>
                    </span>
                  )}
                </div>

                <div className="text-xs sm:text-sm leading-relaxed opacity-90 pt-1 border-t border-black/10 dark:border-white/10">
                  <span className="font-semibold block mb-0.5">
                    {t('ruleExplanation')}
                  </span>
                  {currentQuestion.explanation}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              {language === 'uz' ? 'Testni to‘xtatmoqchimisiz?' : 'Завершить тестирование?'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('exitQuizConfirm')}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {language === 'uz' ? 'Davom ettirish' : 'Продолжить тест'}
              </button>
              <button
                onClick={onExit}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors"
              >
                {language === 'uz' ? 'Chiqish' : 'Выйти'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
