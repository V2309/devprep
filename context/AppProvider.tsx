'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { INITIAL_QUESTIONS } from '@/lib/data';
import type { Question, QuestionCategory, UserProfile } from '@/types/types';
import type { Category } from '@/components/HomeView';
import type { ToastType } from '@/components/Toast';

interface ToastState {
  message: string;
  type: ToastType;
}

interface AppContextValue {
  questions: Question[];
  selectedCategory: QuestionCategory | 'All';
  setSelectedCategory: (category: QuestionCategory | 'All') => void;
  categories: Category[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoggedIn: boolean;
  profile: UserProfile;
  toast: ToastState | null;
  showToast: (message: string, type?: ToastType) => void;
  dismissToast: () => void;
  handleToggleComplete: (id: string) => void;
  handleLoginSuccess: (email: string, name: string) => void;
  handleRegisterSuccess: (email: string, name: string) => void;
  handleLogout: () => void;
  handleUpdateProfile: (updated: UserProfile) => void;
  handleSelectCategory: (category: QuestionCategory | 'All') => void;
  handleAddCategory: (name: string, description: string, techTags: string[]) => void;
  handleEditCategory: (oldName: string, newName: string, description: string, techTags: string[]) => void;
  handleDeleteCategory: (name: string) => void;
  handleAddQuestion: (newQuestion: Question) => void;
  handleEditQuestion: (updatedQuestion: Question) => void;
  handleDeleteQuestion: (id: string) => void;
  getQuestionById: (id: string) => Question | undefined;
  completedQuestionsCount: number;
}

const AppContext = createContext<AppContextValue | null>(null);

const INITIAL_CATEGORIES: Category[] = [
  {
    name: 'Frontend',
    description:
      'Tối ưu hiệu năng và kiến trúc ứng dụng hiện đại. Thích ứng sâu sắc các thiết kế SPA.',
    techTags: ['React', 'Vue', 'TypeScript'],
  },
  {
    name: 'Backend',
    description:
      'Xử lý phân tán, tối ưu hóa database, REST/GraphQL APIs và cấu trúc bảo mật.',
    techTags: ['Node.js', 'Go', 'Redis'],
  },
  {
    name: 'System Design',
    description:
      'Phân tích các hệ thống quy mô hàng triệu người dùng: Load Balancer, Microservices, Caching Strategies, Database Replication.',
    techTags: ['Load Balancer', 'Microservices', 'Caching'],
  },
  {
    name: 'Cấu trúc dữ liệu & Giải thuật',
    description:
      'Luyện tập tư duy sắc bén giải quyết vấn đề qua 500+ bài tập phỏng vấn chọn lọc từ cơ bản đến nâng cao.',
    techTags: ['Arrays', 'Trees', 'Graphs', 'Dynamic'],
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | 'All'>('All');
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Hoàng Minh (Admin)',
    email: 'admin@devprep.com',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
    role: 'Senior System Administrator',
    github: 'https://github.com/hoangminh-dev',
    bio: 'Quản trị viên và người sáng lập DevPrep AI. Thích xây dựng hệ thống bền bỉ, tối ưu và giúp lập trình viên thành công.',
    xp: 680,
    streak: 28,
    isAdmin: true,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const handleToggleComplete = useCallback(
    (id: string) => {
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id === id) {
            const nextCompleted = !q.completed;
            showToast(
              nextCompleted
                ? `Đã hoàn thành: "${q.title}" (+10 XP) 🏆`
                : `Bỏ đánh dấu hoàn thành: "${q.title}"`,
              nextCompleted ? 'success' : 'info',
            );
            if (nextCompleted) {
              setProfile((p) => ({ ...p, xp: p.xp + 10 }));
            } else {
              setProfile((p) => ({ ...p, xp: Math.max(0, p.xp - 10) }));
            }
            return { ...q, completed: nextCompleted };
          }
          return q;
        }),
      );
    },
    [showToast],
  );

  const handleLoginSuccess = useCallback((email: string, name: string) => {
    setIsLoggedIn(true);
    const isAdmin =
      email.toLowerCase() === 'admin@devprep.com' || email.toLowerCase().includes('admin');
    setProfile((p) => ({
      ...p,
      name: isAdmin ? 'Admin Manager' : name,
      email,
      role: isAdmin ? 'System Administrator' : 'Developer',
      isAdmin,
      avatar: isAdmin
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    }));
  }, []);

  const handleRegisterSuccess = useCallback((email: string, name: string) => {
    setIsLoggedIn(true);
    const isAdmin = email.toLowerCase().includes('admin');
    setProfile((p) => ({
      ...p,
      name: isAdmin ? 'Admin Manager' : name,
      email,
      role: isAdmin ? 'System Administrator' : 'Developer',
      isAdmin,
      avatar: isAdmin
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
      xp: 10,
      streak: 1,
    }));
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    router.push('/');
  }, [router]);

  const handleUpdateProfile = useCallback((updated: UserProfile) => {
    setProfile(updated);
  }, []);

  const handleSelectCategory = useCallback((category: QuestionCategory | 'All') => {
    setSelectedCategory(category);
  }, []);

  const handleAddCategory = useCallback(
    (name: string, description: string, techTags: string[]) => {
      setCategories((prev) => [...prev, { name, description, techTags }]);
    },
    [],
  );

  const handleEditCategory = useCallback(
    (oldName: string, newName: string, description: string, techTags: string[]) => {
      setCategories((prev) =>
        prev.map((c) => (c.name === oldName ? { name: newName, description, techTags } : c)),
      );
      setQuestions((prev) =>
        prev.map((q) => (q.category === oldName ? { ...q, category: newName } : q)),
      );
      setSelectedCategory((current) => (current === oldName ? newName : current));
    },
    [],
  );

  const handleDeleteCategory = useCallback((name: string) => {
    setCategories((prev) => prev.filter((c) => c.name !== name));
    setQuestions((prev) => prev.filter((q) => q.category !== name));
    setSelectedCategory((current) => (current === name ? 'All' : current));
  }, []);

  const handleAddQuestion = useCallback((newQuestion: Question) => {
    setQuestions((prev) => [newQuestion, ...prev]);
  }, []);

  const handleEditQuestion = useCallback((updatedQuestion: Question) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q)),
    );
  }, []);

  const handleDeleteQuestion = useCallback((id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }, []);

  const getQuestionById = useCallback(
    (id: string) => questions.find((q) => q.id === id),
    [questions],
  );

  const completedQuestionsCount = questions.filter((q) => q.completed).length;

  const value: AppContextValue = {
    questions,
    selectedCategory,
    setSelectedCategory,
    categories,
    searchQuery,
    setSearchQuery,
    isLoggedIn,
    profile,
    toast,
    showToast,
    dismissToast,
    handleToggleComplete,
    handleLoginSuccess,
    handleRegisterSuccess,
    handleLogout,
    handleUpdateProfile,
    handleSelectCategory,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleAddQuestion,
    handleEditQuestion,
    handleDeleteQuestion,
    getQuestionById,
    completedQuestionsCount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}
