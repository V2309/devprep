import { z } from 'zod';

export const CategorySchema = z.object({
  name: z.string().min(1, 'Tên chủ đề không được trống').max(50, 'Tên chủ đề quá dài'),
  description: z.string().optional(),
  techTags: z.string().min(1, 'Vui lòng cung cấp ít nhất một thẻ công nghệ'),
});

export const QuestionSchema = z.object({
  code: z.string().min(1, 'Mã định danh không được trống').max(20, 'Mã định danh quá dài'),
  title: z.string().min(1, 'Tiêu đề câu hỏi không được trống').max(200, 'Tiêu đề quá dài'),
  categoryName: z.string().min(1, 'Vui lòng chọn một chủ đề'),
  difficulty: z.enum(['Dễ', 'Trung bình', 'Khó'], {
    message: 'Độ khó không hợp lệ',
  }),
  tags: z.string().min(1, 'Vui lòng cung cấp ít nhất một thẻ tags'),
  answer: z.string().min(1, 'Đáp án không được trống'),
  completed: z.boolean().optional(),
});