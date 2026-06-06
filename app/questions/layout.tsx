import { getCategories } from '@/app/actions/categoryActions';
import { getQuestions } from '@/app/actions/questionActions';
import type { Question, Difficulty } from '@/types/types';
import type { Category } from '@/components/HomeView';
import QuestionsLoader from '@/components/QuestionsLoader';

/**
 * Layout riêng cho route /questions và /questions/[id].
 * Fetch categories + questions từ DB ở server, truyền xuống client QuestionsLoader
 * để sync vào AppContext — không ảnh hưởng trang home.
 */
export default async function QuestionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dbCategories, dbQuestions] = await Promise.all([
    getCategories(),
    getQuestions(),
  ]);

  // Map Category: techTags CSV string → string[]
  const initialCategories: Category[] = dbCategories.map((cat) => ({
    name: cat.name,
    description: cat.description ?? '',
    techTags: cat.techTags
      ? cat.techTags.split(',').map((t) => t.trim()).filter(Boolean)
      : [],
  }));

  // Map Question: DB shape → UI type
  const initialQuestions: Question[] = dbQuestions.map((q) => ({
    id: q.id,
    code: q.code,
    title: q.title,
    category: q.categoryName,
    difficulty: q.difficulty as Difficulty,
    tags: q.tags,
    answer: q.answer,
    completed: q.completed,
  }));

  return (
    <QuestionsLoader
      initialQuestions={initialQuestions}
      initialCategories={initialCategories}
    >
      {children}
    </QuestionsLoader>
  );
}
