/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question, UserStats, CEFRLevel, DailyGoalProgress } from '../types.ts';

const STATS_STORAGE_KEY = 'rki_learning_user_stats';
const THEME_STORAGE_KEY = 'rki_theme_preference';

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDefaultDailyGoal(): DailyGoalProgress {
  const today = getTodayDateString();
  return {
    targetXp: 30,
    todayXp: 0,
    todayDate: today,
    tasks: {
      quizDone: false,
      flashcardsCount: 0,
      listeningDone: false,
    },
    weeklyActiveDates: [today],
  };
}

const DEFAULT_STATS: UserStats = {
  xp: 0,
  streak: 1,
  lastActiveDate: getTodayDateString(),
  completedQuizzes: {},
  savedMistakes: [],
  dailyGoal: getDefaultDailyGoal(),
};

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    const today = getTodayDateString();

    if (!raw) {
      saveUserStats(DEFAULT_STATS);
      return DEFAULT_STATS;
    }

    const parsed = JSON.parse(raw);
    let dailyGoal: DailyGoalProgress = parsed.dailyGoal || getDefaultDailyGoal();

    // Check if new day has started
    if (dailyGoal.todayDate !== today) {
      dailyGoal = {
        targetXp: dailyGoal.targetXp || 30,
        todayXp: 0,
        todayDate: today,
        tasks: {
          quizDone: false,
          flashcardsCount: 0,
          listeningDone: false,
        },
        weeklyActiveDates: dailyGoal.weeklyActiveDates || [today],
      };
    }

    // Streak continuity check
    let streak = parsed.streak || 1;
    if (parsed.lastActiveDate && parsed.lastActiveDate !== today) {
      const lastDate = new Date(parsed.lastActiveDate);
      const currDate = new Date(today);
      const diffDays = Math.floor(
        (currDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // If more than 1 day skipped, reset streak
      if (diffDays > 1) {
        streak = 1;
      }
    }

    const loadedStats: UserStats = {
      ...DEFAULT_STATS,
      ...parsed,
      streak: Math.max(1, streak),
      completedQuizzes: parsed.completedQuizzes || {},
      savedMistakes: parsed.savedMistakes || [],
      dailyGoal,
    };

    return loadedStats;
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to save stats to localStorage', err);
  }
}

export function updateDailyGoalTarget(targetXp: number): UserStats {
  const stats = loadUserStats();
  const updatedDailyGoal: DailyGoalProgress = {
    ...(stats.dailyGoal || getDefaultDailyGoal()),
    targetXp,
  };
  const updated: UserStats = {
    ...stats,
    dailyGoal: updatedDailyGoal,
  };
  saveUserStats(updated);
  return updated;
}

export function recordFlashcardPractice(count: number = 1): UserStats {
  const stats = loadUserStats();
  const today = getTodayDateString();
  const earnedXp = count * 2; // +2 XP per card practiced

  const currentGoal = stats.dailyGoal || getDefaultDailyGoal();
  const activeDates = new Set(currentGoal.weeklyActiveDates || []);
  activeDates.add(today);

  const updatedDailyGoal: DailyGoalProgress = {
    ...currentGoal,
    todayXp: (currentGoal.todayXp || 0) + earnedXp,
    todayDate: today,
    tasks: {
      ...currentGoal.tasks,
      flashcardsCount: (currentGoal.tasks.flashcardsCount || 0) + count,
    },
    weeklyActiveDates: Array.from(activeDates),
  };

  const updated: UserStats = {
    ...stats,
    xp: (stats.xp || 0) + earnedXp,
    lastActiveDate: today,
    dailyGoal: updatedDailyGoal,
  };

  saveUserStats(updated);
  return updated;
}

export function recordQuizCompletion(
  quizId: string,
  score: number,
  total: number,
  mistakes: Question[],
  category?: string
): UserStats {
  const stats = loadUserStats();
  const today = getTodayDateString();

  // Streak logic
  let streak = stats.streak;
  if (stats.lastActiveDate && stats.lastActiveDate !== today) {
    const lastDate = new Date(stats.lastActiveDate);
    const currDate = new Date(today);
    const diffDays = Math.floor(
      (currDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      streak += 1;
    } else if (diffDays > 1) {
      streak = 1;
    }
  }

  // XP calculation: 10 XP per correct question + 5 bonus for test completion
  const earnedXp = score * 10 + 5;
  const newXp = (stats.xp || 0) + earnedXp;

  // Update quiz records
  const currentRecord = stats.completedQuizzes[quizId];
  const updatedQuizRecord = {
    bestScore: currentRecord ? Math.max(currentRecord.bestScore, score) : score,
    total,
    attempts: (currentRecord?.attempts || 0) + 1,
    lastDate: today,
  };

  // Merge mistakes (avoid duplicate ids)
  const existingMistakeIds = new Set(stats.savedMistakes.map((m) => m.id));
  const newSavedMistakes = [...stats.savedMistakes];

  mistakes.forEach((m) => {
    if (!existingMistakeIds.has(m.id)) {
      newSavedMistakes.push(m);
      existingMistakeIds.add(m.id);
    }
  });

  // Daily goal updates
  const currentGoal = stats.dailyGoal || getDefaultDailyGoal();
  const activeDates = new Set(currentGoal.weeklyActiveDates || []);
  activeDates.add(today);

  const isListeningQuiz = category === 'listening' || quizId.includes('listening');

  const updatedDailyGoal: DailyGoalProgress = {
    ...currentGoal,
    todayXp: (currentGoal.todayXp || 0) + earnedXp,
    todayDate: today,
    tasks: {
      ...currentGoal.tasks,
      quizDone: true,
      listeningDone: currentGoal.tasks.listeningDone || isListeningQuiz,
    },
    weeklyActiveDates: Array.from(activeDates),
  };

  const updatedStats: UserStats = {
    ...stats,
    xp: newXp,
    streak: Math.max(1, streak),
    lastActiveDate: today,
    completedQuizzes: {
      ...stats.completedQuizzes,
      [quizId]: updatedQuizRecord,
    },
    savedMistakes: newSavedMistakes,
    dailyGoal: updatedDailyGoal,
  };

  saveUserStats(updatedStats);
  return updatedStats;
}

export function removeResolvedMistake(questionId: string): UserStats {
  const stats = loadUserStats();
  const updatedMistakes = stats.savedMistakes.filter((m) => m.id !== questionId);
  const updated = {
    ...stats,
    savedMistakes: updatedMistakes,
  };
  saveUserStats(updated);
  return updated;
}

export function savePlacementResult(
  level: CEFRLevel,
  score: number,
  total: number
): UserStats {
  const stats = loadUserStats();
  const updated: UserStats = {
    ...stats,
    placementResult: {
      level,
      score,
      total,
      date: new Date().toISOString().split('T')[0],
    },
    xp: (stats.xp || 0) + 50, // 50 bonus XP for placement test!
  };
  saveUserStats(updated);
  return updated;
}

export function getThemePreference(): 'light' | 'dark' {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function setThemePreference(theme: 'light' | 'dark'): void {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}
