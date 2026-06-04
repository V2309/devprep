/**
 * Official TypeScript Types for DevPrep AI
 */

export type Difficulty = 'Dễ' | 'Trung bình' | 'Khó';
export type QuestionCategory = string;

export interface Question {
  id: string;
  code: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  successRate: number;
  completed: boolean;
  category: QuestionCategory;
  description: string;
  requirements: string[];
  codeSnippet: string;
  solution: {
    overview: string;
    steps: string[];
    codeSnippet: string;
  };
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  timestamp: string;
  text: string;
  upvotes: number;
  liked?: boolean;
}

export interface Article {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  readTime: string;
}

export interface Activity {
  id: string;
  timeStr: string;
  action: string;
  type: 'check' | 'book' | 'interactive';
  detail?: string;
  tags?: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
  github: string;
  bio: string;
  xp: number;
  streak: number;
  isAdmin?: boolean;
}

