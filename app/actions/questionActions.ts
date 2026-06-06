'use server';

import { prisma } from '@/lib/prisma';
import { QuestionSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';

export async function getQuestions() {
  try {
    return await prisma.question.findMany({
      orderBy: { code: 'asc' },
    });
  } catch (error) {
    console.error('Failed to get questions:', error);
    return [];
  }
}

export async function getQuestionById(id: string) {
  try {
    return await prisma.question.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error(`Failed to get question by ID ${id}:`, error);
    return null;
  }
}

export async function addQuestion(data: {
  code: string;
  title: string;
  categoryName: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  tags: string;
  answer: string;
}) {
  const result = QuestionSchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues.map((e) => e.message).join(', '),
    };
  }

  try {
    const newQuestion = await prisma.question.create({
      data: {
        code: result.data.code,
        title: result.data.title,
        categoryName: result.data.categoryName,
        difficulty: result.data.difficulty,
        tags: result.data.tags,
        answer: result.data.answer,
        completed: false,
      },
    });

    revalidatePath('/questions');
    revalidatePath('/dashboard');
    return { success: true, data: newQuestion };
  } catch (error: any) {
    console.error('Failed to add question:', error);
    if (error.code === 'P2002') {
      return { success: false, error: 'Mã định danh đã tồn tại' };
    }
    return { success: false, error: 'Lỗi hệ thống khi thêm câu hỏi' };
  }
}

export async function editQuestion(
  id: string,
  data: {
    code: string;
    title: string;
    categoryName: string;
    difficulty: 'Dễ' | 'Trung bình' | 'Khó';
    tags: string;
    answer: string;
  }
) {
  const result = QuestionSchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues.map((e) => e.message).join(', '),
    };
  }

  try {
    const updatedQuestion = await prisma.question.update({
      where: { id },
      data: {
        code: result.data.code,
        title: result.data.title,
        categoryName: result.data.categoryName,
        difficulty: result.data.difficulty,
        tags: result.data.tags,
        answer: result.data.answer,
      },
    });

    revalidatePath('/questions');
    revalidatePath(`/questions/${id}`);
    revalidatePath('/dashboard');
    return { success: true, data: updatedQuestion };
  } catch (error: any) {
    console.error(`Failed to edit question ${id}:`, error);
    if (error.code === 'P2002') {
      return { success: false, error: 'Mã định danh đã tồn tại' };
    }
    return { success: false, error: 'Lỗi hệ thống khi sửa câu hỏi' };
  }
}

export async function deleteQuestion(id: string) {
  try {
    const deleted = await prisma.question.delete({
      where: { id },
    });
    revalidatePath('/questions');
    revalidatePath('/dashboard');
    return { success: true, data: deleted };
  } catch (error) {
    console.error(`Failed to delete question ${id}:`, error);
    return { success: false, error: 'Lỗi hệ thống khi xóa câu hỏi' };
  }
}

export async function toggleQuestionComplete(id: string) {
  try {
    const question = await prisma.question.findUnique({
      where: { id },
    });
    if (!question) {
      return { success: false, error: 'Không tìm thấy câu hỏi' };
    }

    const updated = await prisma.question.update({
      where: { id },
      data: {
        completed: !question.completed,
      },
    });

    revalidatePath('/questions');
    revalidatePath(`/questions/${id}`);
    revalidatePath('/dashboard');
    return { success: true, data: updated };
  } catch (error) {
    console.error(`Failed to toggle complete status for question ${id}:`, error);
    return { success: false, error: 'Lỗi hệ thống khi cập nhật trạng thái' };
  }
}
