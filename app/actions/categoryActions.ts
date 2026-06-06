'use server';

import { prisma } from '@/lib/prisma';
import { CategorySchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';

export async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error('Failed to get categories:', error);
    return [];
  }
}

export async function addCategory(data: {
  name: string;
  description?: string;
  techTags: string;
}) {
  const result = CategorySchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues.map((e) => e.message).join(', '),
    };
  }

  try {
    const newCategory = await prisma.category.create({
      data: {
        name: result.data.name,
        description: result.data.description,
        techTags: result.data.techTags,
      },
    });

    revalidatePath('/questions');
    revalidatePath('/dashboard');
    revalidatePath('/categories');
    return { success: true, data: newCategory };
  } catch (error: any) {
    console.error('Failed to add category:', error);
    if (error.code === 'P2002') {
      return { success: false, error: 'Tên chủ đề đã tồn tại' };
    }
    return { success: false, error: 'Lỗi hệ thống khi thêm chủ đề' };
  }
}

export async function editCategory(
  oldName: string,
  data: {
    name: string;
    description?: string;
    techTags: string;
  }
) {
  const result = CategorySchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues.map((e) => e.message).join(', '),
    };
  }

  try {
    // If the category name changed, we also need to update related questions categoryName.
    // However, categoryName relates to name in prisma. Cascade action or direct transactional update is needed.
    // In schema.prisma, Question relates fields categoryName to references name. SQLite does not support editing referenced PK, so we do it as a transaction or rename name.
    // In SQLite/Prisma, if categoryName relates to references name, if we update Category name, references name will update if we have referential actions.
    // But since name is @id in Category, updating it is supported.
    const updatedCategory = await prisma.category.update({
      where: { name: oldName },
      data: {
        name: result.data.name,
        description: result.data.description,
        techTags: result.data.techTags,
      },
    });

    revalidatePath('/questions');
    revalidatePath('/dashboard');
    revalidatePath('/categories');
    return { success: true, data: updatedCategory };
  } catch (error: any) {
    console.error(`Failed to edit category ${oldName}:`, error);
    if (error.code === 'P2002') {
      return { success: false, error: 'Tên chủ đề đã tồn tại' };
    }
    return { success: false, error: 'Lỗi hệ thống khi sửa chủ đề' };
  }
}

export async function deleteCategory(name: string) {
  try {
    const deleted = await prisma.category.delete({
      where: { name },
    });
    revalidatePath('/questions');
    revalidatePath('/dashboard');
    revalidatePath('/categories');
    return { success: true, data: deleted };
  } catch (error) {
    console.error(`Failed to delete category ${name}:`, error);
    return { success: false, error: 'Lỗi hệ thống khi xóa chủ đề' };
  }
}
