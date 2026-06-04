'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useApp } from '@/context/AppProvider';
import QuestionDetailView from '@/components/QuestionDetailView';

export default function QuestionDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const { getQuestionById } = useApp();
  const question = getQuestionById(id);

  if (!question) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-xl font-bold text-brand-primary mb-2">Không tìm thấy câu hỏi</h1>
        <p className="text-sm text-slate-500 mb-6">Câu hỏi với ID &quot;{id}&quot; không tồn tại.</p>
        <Link
          href="/questions"
          className="text-sm font-semibold text-brand-primary hover:underline"
        >
          Quay lại thư viện
        </Link>
      </div>
    );
  }

  return <QuestionDetailView question={question} />;
}
