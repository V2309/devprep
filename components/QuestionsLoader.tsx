'use client';

import { useEffect } from 'react';
import { useApp } from '@/context/AppProvider';
import type { Question } from '@/types/types';
import type { Category } from '@/components/HomeView';

interface QuestionsLoaderProps {
  initialQuestions: Question[];
  initialCategories: Category[];
  children: React.ReactNode;
}

/**
 * Client component dùng để sync dữ liệu từ DB (được fetch ở server)
 * vào AppContext khi vào route /questions.
 */
export default function QuestionsLoader({
  initialQuestions,
  initialCategories,
  children,
}: QuestionsLoaderProps) {
  const { setQuestions, setCategories } = useApp();

  useEffect(() => {
    setQuestions(initialQuestions);
    setCategories(initialCategories);
  }, []); // chỉ chạy một lần khi mount vào route

  return <>{children}</>;
}
