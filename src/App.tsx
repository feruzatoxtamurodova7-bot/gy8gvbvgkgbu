/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { MobileTopBar } from './components/MobileTopBar.tsx';
import { MobileBottomNav } from './components/MobileBottomNav.tsx';
import { MobileFrame } from './components/MobileFrame.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { QuizzesCatalog } from './components/QuizzesCatalog.tsx';
import { QuizRunner } from './components/QuizRunner.tsx';
import { QuizResult } from './components/QuizResult.tsx';
import { GrammarHandbook } from './components/GrammarHandbook.tsx';
import { FlashcardsView } from './components/FlashcardsView.tsx';
import { ProfileView } from './components/ProfileView.tsx';
import { PlacementCertificateModal } from './components/PlacementCertificateModal.tsx';
import { MistakesReviewModal } from './components/MistakesReviewModal.tsx';
import {
  Quiz,
  QuizSessionResult,
  UserStats,
  Question,
  CEFRLevel,
} from './types.ts';
import { QUIZZES_DATA } from './data/quizzesData.ts';
import {
  loadUserStats,
  recordQuizCompletion,
  savePlacementResult,
  removeResolvedMistake,
  updateDailyGoalTarget,
  recordFlashcardPractice,
  getThemePreference,
  setThemePreference,
} from './utils/storage.ts';
import { LanguageProvider } from './context/LanguageContext.tsx';

const FRAME_MODE_KEY = 'rki_is_mobile_frame_mode';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<
    'dashboard' | 'quizzes' | 'profile' | 'flashcards' | 'grammar'
  >('dashboard');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [lastResult, setLastResult] = useState<{
    quiz: Quiz;
    result: QuizSessionResult;
  } | null>(null);

  const [stats, setStats] = useState<UserStats>(loadUserStats);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Default to Mobile View mode as requested!
  const [isMobileFrameMode, setIsMobileFrameMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(FRAME_MODE_KEY);
    return saved !== null ? saved === 'true' : true;
  });

  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showMistakesModal, setShowMistakesModal] = useState(false);

  // Initialize theme from storage
  useEffect(() => {
    const pref = getThemePreference();
    setTheme(pref);
    setThemePreference(pref);
  }, []);

  const handleToggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setThemePreference(newTheme);
  };

  const handleToggleFrameMode = () => {
    setIsMobileFrameMode((prev) => {
      const next = !prev;
      localStorage.setItem(FRAME_MODE_KEY, String(next));
      return next;
    });
  };

  // Start any standard quiz
  const handleStartQuiz = (quiz: Quiz) => {
    setLastResult(null);
    setActiveQuiz(quiz);
  };

  // Start diagnostic test
  const handleStartPlacement = () => {
    const placement = QUIZZES_DATA.find((q) => q.id === 'placement-test-rki');
    if (placement) {
      handleStartQuiz(placement);
    }
  };

  // Finish quiz session
  const handleFinishQuiz = (result: QuizSessionResult) => {
    if (!activeQuiz) return;

    const mistakes = result.answers
      .filter((a) => !a.isCorrect)
      .map((a) => a.question);

    let updatedStats = recordQuizCompletion(
      activeQuiz.id,
      result.score,
      result.total,
      mistakes,
      activeQuiz.category
    );

    // If placement test, determine and save CEFR level
    if (activeQuiz.category === 'placement') {
      let level: CEFRLevel = 'A1';
      if (result.score >= 14) level = 'B2';
      else if (result.score >= 10) level = 'B1';
      else if (result.score >= 6) level = 'A2';

      updatedStats = savePlacementResult(level, result.score, result.total);
    }

    setStats(updatedStats);
    setLastResult({
      quiz: activeQuiz,
      result,
    });
    setActiveQuiz(null);
  };

  // Retake current quiz
  const handleRetakeQuiz = () => {
    if (lastResult) {
      handleStartQuiz(lastResult.quiz);
    }
  };

  // Retake only mistakes
  const handleReviewMistakesFromQuiz = () => {
    if (!lastResult) return;
    const missedQuestions = lastResult.result.answers
      .filter((a) => !a.isCorrect)
      .map((a) => a.question);

    if (missedQuestions.length > 0) {
      const customQuiz: Quiz = {
        id: `mistakes-session-${Date.now()}`,
        title: `Работа над ошибками: ${lastResult.quiz.title}`,
        description: 'Повторное решение вопросов, в которых были совершены ошибки.',
        level: 'ALL',
        category: 'placement',
        badge: 'Работа над ошибками',
        questions: missedQuestions,
        estimatedMinutes: Math.max(2, Math.round(missedQuestions.length * 1.2)),
      };
      handleStartQuiz(customQuiz);
    }
  };

  // Retake all saved mistakes
  const handleRetakeAllMistakes = (questions: Question[]) => {
    setShowMistakesModal(false);
    const customQuiz: Quiz = {
      id: `all-mistakes-${Date.now()}`,
      title: 'Генеральная работа над ошибками',
      description: 'Все накопленные неверные ответы из вашей личной базы знаний.',
      level: 'ALL',
      category: 'placement',
      badge: 'Банк ошибок',
      questions,
      estimatedMinutes: Math.max(3, Math.round(questions.length * 1.2)),
    };
    handleStartQuiz(customQuiz);
  };

  const handleRemoveMistake = (questionId: string) => {
    const updated = removeResolvedMistake(questionId);
    setStats(updated);
  };

  const handleSelectTargetXp = (target: number) => {
    const updated = updateDailyGoalTarget(target);
    setStats(updated);
  };

  const handlePracticeCard = () => {
    const updated = recordFlashcardPractice(1);
    setStats(updated);
  };

  const handleStartListening = () => {
    const listeningQuiz =
      QUIZZES_DATA.find((q) => q.category === 'listening') || QUIZZES_DATA[0];
    if (listeningQuiz) {
      handleStartQuiz(listeningQuiz);
    }
  };

  return (
    <MobileFrame
      isMobileFrameMode={isMobileFrameMode}
      onToggleFrameMode={handleToggleFrameMode}
    >
      <div className="flex-1 flex flex-col min-h-full">
        {/* Mobile Top App Bar (shown in mobile frame mode or small screens) */}
        {isMobileFrameMode ? (
          <MobileTopBar
            currentTab={currentTab}
            stats={stats}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            isMobileFrameMode={isMobileFrameMode}
            onToggleFrameMode={handleToggleFrameMode}
            inQuizSession={Boolean(activeQuiz || lastResult)}
            onBackFromQuiz={() => {
              setActiveQuiz(null);
              setLastResult(null);
            }}
          />
        ) : (
          <Navbar
            currentTab={currentTab}
            onSelectTab={(tab) => {
              setActiveQuiz(null);
              setLastResult(null);
              setCurrentTab(tab);
            }}
            stats={stats}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            onStartPlacement={handleStartPlacement}
          />
        )}

        {/* Main Content Area */}
        <main className={`flex-1 w-full mx-auto px-2.5 sm:px-6 lg:px-8 pt-3 sm:pt-6 ${isMobileFrameMode ? 'max-w-md' : 'max-w-7xl'}`}>
          {activeQuiz ? (
            <QuizRunner
              quiz={activeQuiz}
              onFinish={handleFinishQuiz}
              onExit={() => setActiveQuiz(null)}
            />
          ) : lastResult ? (
            <QuizResult
              quiz={lastResult.quiz}
              result={lastResult.result}
              onRetake={handleRetakeQuiz}
              onReviewMistakes={handleReviewMistakesFromQuiz}
              onBackToDashboard={() => setLastResult(null)}
              onShowCertificate={() => setShowCertificateModal(true)}
            />
          ) : currentTab === 'dashboard' ? (
            <Dashboard
              stats={stats}
              onStartQuiz={handleStartQuiz}
              onOpenMistakes={() => setShowMistakesModal(true)}
              onOpenGrammar={() => setCurrentTab('grammar')}
              onOpenFlashcards={() => setCurrentTab('flashcards')}
              onOpenQuizzes={() => setCurrentTab('quizzes')}
              onShowCertificate={() => setShowCertificateModal(true)}
              onSelectTargetXp={handleSelectTargetXp}
              onStartListening={handleStartListening}
            />
          ) : currentTab === 'quizzes' ? (
            <QuizzesCatalog
              stats={stats}
              onStartQuiz={handleStartQuiz}
            />
          ) : currentTab === 'profile' ? (
            <ProfileView
              stats={stats}
              onShowCertificate={() => setShowCertificateModal(true)}
              onStartPlacement={handleStartPlacement}
              onOpenMistakes={() => setShowMistakesModal(true)}
              onOpenGrammar={() => setCurrentTab('grammar')}
            />
          ) : currentTab === 'grammar' ? (
            <GrammarHandbook onStartQuiz={handleStartQuiz} />
          ) : (
            <FlashcardsView onPracticeCard={handlePracticeCard} />
          )}
        </main>

        {/* Mobile Bottom Navigation (Visible in mobile mode or small screens) */}
        {isMobileFrameMode && (
          <MobileBottomNav
            currentTab={currentTab}
            onSelectTab={(tab) => {
              setActiveQuiz(null);
              setLastResult(null);
              setCurrentTab(tab);
            }}
            stats={stats}
            inQuizSession={Boolean(activeQuiz)}
          />
        )}

        {/* Printable Certificate Modal */}
        {showCertificateModal && (
          <PlacementCertificateModal
            stats={stats}
            onClose={() => setShowCertificateModal(false)}
          />
        )}

        {/* Mistakes Review Modal */}
        {showMistakesModal && (
          <MistakesReviewModal
            stats={stats}
            onClose={() => setShowMistakesModal(false)}
            onRemoveMistake={handleRemoveMistake}
            onRetakeAsQuiz={handleRetakeAllMistakes}
          />
        )}
      </div>
    </MobileFrame>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
