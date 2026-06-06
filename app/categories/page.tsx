import { getCategories } from '@/app/actions/categoryActions';
import CategoriesView from '@/components/CategoriesView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chủ đề học tập | DevPrep AI',
  description:
    'Khám phá tất cả các chủ đề phỏng vấn: Frontend, Backend, System Design, Cấu trúc dữ liệu & Giải thuật. Chọn lộ trình phù hợp và bắt đầu luyện tập ngay.',
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return <CategoriesView initialCategories={categories} />;
}
