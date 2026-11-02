/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2';

export type QuizCategory =
  | 'placement'
  | 'cases'
  | 'verbs'
  | 'vocabulary'
  | 'listening'
  | 'dialogues';

export type QuestionType =
  | 'multiple_choice'
  | 'fill_blank'
  | 'word_order'
  | 'listening';

export interface Question {
  id: string;
  type: QuestionType;
  level: CEFRLevel;
  category: QuizCategory;
  prompt: string;
  contextSentence?: string;
  options?: string[];
  correctAnswer: string | string[]; // string for choice/fill, string[] of ordered tokens for word_order
  explanation: string;
  audioText?: string;
  hint?: string;
  wordsBank?: string[]; // for word_order puzzles
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  level: CEFRLevel | 'ALL';
  category: QuizCategory;
  badge: string;
  questions: Question[];
  estimatedMinutes: number;
}

export interface QuizSessionResult {
  quizId: string;
  score: number;
  total: number;
  percentage: number;
  timeSpentSeconds: number;
  answers: {
    questionId: string;
    userAnswer: string | string[];
    isCorrect: boolean;
    question: Question;
  }[];
  date: string;
}

export interface DailyGoalProgress {
  targetXp: number; // 15 | 30 | 50 (default 30)
  todayXp: number;
  todayDate: string; // YYYY-MM-DD
  tasks: {
    quizDone: boolean;
    flashcardsCount: number; // target: 5
    listeningDone: boolean;
  };
  weeklyActiveDates: string[]; // list of active dates in YYYY-MM-DD
}

export interface UserStats {
  xp: number;
  streak: number;
  lastActiveDate: string;
  completedQuizzes: Record<
    string,
    {
      bestScore: number;
      total: number;
      attempts: number;
      lastDate: string;
    }
  >;
  savedMistakes: Question[];
  placementResult?: {
    level: CEFRLevel;
    score: number;
    total: number;
    date: string;
  };
  dailyGoal?: DailyGoalProgress;
}

export interface GrammarRule {
  id: string;
  title: string;
  category: 'cases' | 'verbs' | 'syntax' | 'phonetics';
  caseNameRu?: string;
  questionsRu?: string;
  summary: string;
  prepositions?: string[];
  tableHeaders: string[];
  tableRows: {
    genderOrType: string;
    endings: string;
    example: string;
    note?: string;
  }[];
  commonMistakes: string[];
  associatedQuizId?: string;
}

export interface Flashcard {
  id: string;
  wordRu: string;
  stressMark: string; // word with stress marked e.g. "здра́вствуйте"
  partOfSpeech: string;
  level: CEFRLevel;
  category: string;
  definitionRu: string;
  translationEn: string;
  translationUz: string;
  exampleRu: string;
}
