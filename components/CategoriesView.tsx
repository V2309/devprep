'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  Monitor as WinIcon,
  Database,
  Network,
  Brain,
  FolderPlus,
  Play,
  Plus,
  Edit,
  Trash2,
  X,
  Settings,
  BookOpen,
  Search,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { useApp } from '@/context/AppProvider';
import { addCategory, editCategory, deleteCategory } from '@/app/actions/categoryActions';

export interface CategoryData {
  name: string;
  description: string | null;
  techTags: string;
}

interface CategoriesViewProps {
  initialCategories: CategoryData[];
}

const getCategoryTheme = (name: string) => {
  const normalized = name.toLowerCase();
  if (normalized.includes('frontend')) {
    return {
      bg: 'bg-white border-slate-200/80 hover:border-sky-500/50',
      iconBg: 'bg-sky-50 text-sky-600',
      icon: <WinIcon className="w-5 h-5" />,
      badge: null,
      accent: 'sky',
    };
  } else if (normalized.includes('backend')) {
    return {
      bg: 'bg-white border-slate-200/80 hover:border-purple-500/50',
      iconBg: 'bg-purple-50 text-purple-600',
      icon: <Database className="w-5 h-5" />,
      badge: null,
      accent: 'purple',
    };
  } else if (normalized.includes('system design') || normalized.includes('hệ thống')) {
    return {
      bg: 'bg-white border-slate-200/80 hover:border-indigo-500/50',
      iconBg: 'bg-indigo-50 text-indigo-600',
      icon: <Network className="w-5 h-5" />,
      badge: null,
      accent: 'indigo',
    };
  } else if (
    normalized.includes('giải thuật') ||
    normalized.includes('dsa') ||
    normalized.includes('thuật toán') ||
    normalized.includes('cấu trúc dữ liệu')
  ) {
    return {
      bg: 'bg-white border-slate-200/80 hover:border-amber-500/50',
      iconBg: 'bg-amber-50 text-amber-600',
      icon: <Brain className="w-5 h-5" />,
      badge: 'Học nhiều nhất 🔥',
      accent: 'amber',
    };
  } else {
    return {
      bg: 'bg-white border-slate-200/80 hover:border-teal-500/50',
      iconBg: 'bg-teal-50 text-teal-600',
      icon: <FolderPlus className="w-5 h-5" />,
      badge: 'Chủ đề mới 🆕',
      accent: 'teal',
    };
  }
};

export default function CategoriesView({ initialCategories }: CategoriesViewProps) {
  const router = useRouter();
  const { profile, handleSelectCategory, showToast, setSearchQuery } = useApp();
  const isAdmin = profile.isAdmin || false;

  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<CategoryData[]>(initialCategories);
  const [isPending, startTransition] = useTransition();

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);

  // Form states
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catTags, setCatTags] = useState('');
  const [formError, setFormError] = useState('');

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description ?? '').toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleBentoClick = (cat: CategoryData) => {
    handleSelectCategory(cat.name);
    setSearchQuery('');
    router.push('/questions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Add ---
  const handleOpenAdd = () => {
    setCatName('');
    setCatDesc('');
    setCatTags('');
    setFormError('');
    setShowAddModal(true);
  };

  const submitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!catName.trim() || !catDesc.trim()) {
      setFormError('Vui lòng nhập tên chủ đề và mô tả!');
      return;
    }
    if (categories.some((c) => c.name.toLowerCase() === catName.trim().toLowerCase())) {
      setFormError('Tên chủ đề này đã tồn tại rồi!');
      return;
    }
    startTransition(async () => {
      const res = await addCategory({
        name: catName.trim(),
        description: catDesc.trim(),
        techTags: catTags.trim(),
      });
      if (res.success && res.data) {
        setCategories((prev) => [...prev, res.data as CategoryData]);
        showToast(`Đã thêm thành công chủ đề "${catName.trim()}"!`, 'success');
        setShowAddModal(false);
      } else {
        setFormError(res.error ?? 'Lỗi khi thêm chủ đề');
      }
    });
  };

  // --- Edit ---
  const handleOpenEdit = (cat: CategoryData, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatDesc(cat.description ?? '');
    setCatTags(cat.techTags);
    setFormError('');
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setFormError('');
    if (!catName.trim() || !catDesc.trim()) {
      setFormError('Vui lòng nhập đầy đủ tên chủ đề và mô tả!');
      return;
    }
    if (
      catName.trim().toLowerCase() !== editingCategory.name.toLowerCase() &&
      categories.some((c) => c.name.toLowerCase() === catName.trim().toLowerCase())
    ) {
      setFormError('Tên chủ đề này đã trùng với một chủ đề khác!');
      return;
    }
    startTransition(async () => {
      const res = await editCategory(editingCategory.name, {
        name: catName.trim(),
        description: catDesc.trim(),
        techTags: catTags.trim(),
      });
      if (res.success && res.data) {
        setCategories((prev) =>
          prev.map((c) => (c.name === editingCategory.name ? (res.data as CategoryData) : c)),
        );
        showToast(`Đã cập nhật chủ đề "${catName.trim()}"!`, 'success');
        setEditingCategory(null);
      } else {
        setFormError(res.error ?? 'Lỗi khi sửa chủ đề');
      }
    });
  };

  // --- Delete ---
  const handleDelete = (cat: CategoryData, e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa chủ đề "${cat.name}" cùng toàn bộ các câu hỏi thuộc chủ đề này? Hành vi này không thể đảo ngược.`,
      )
    ) {
      startTransition(async () => {
        const res = await deleteCategory(cat.name);
        if (res.success) {
          setCategories((prev) => prev.filter((c) => c.name !== cat.name));
          showToast(`Đã xóa chủ đề "${cat.name}" thành công!`, 'success');
        } else {
          showToast(res.error ?? 'Lỗi khi xóa chủ đề', 'error');
        }
      });
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingCategory(null);
    setFormError('');
  };

  return (
    <div className="animate-fade-in w-full pb-20">
      {/* Page Header */}
      <section className="py-12 md:py-16 max-w-[1280px] mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-sky-600 text-xs font-bold uppercase tracking-widest mb-3">
              <Layers className="w-4 h-4" />
              <span>Chủ đề học tập</span>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand-primary leading-tight"
            >
              Khám phá các{' '}
              <span className="text-sky-600 underline decoration-wavy decoration-brand-cyan underline-offset-4">
                chủ đề
              </span>{' '}
              phỏng vấn
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 text-sm mt-3 max-w-xl leading-relaxed"
            >
              Chọn chủ đề bạn muốn luyện tập. Mỗi chủ đề được xây dựng với hàng chục câu hỏi
              phỏng vấn thực chiến từ dễ đến khó.
            </motion.p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {isAdmin && (
              <button
                onClick={handleOpenAdd}
                disabled={isPending}
                className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-60"
                id="add_category_btn"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm chủ đề</span>
              </button>
            )}
            <a
              href="/questions"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-xs font-bold text-brand-primary flex items-center gap-1 hover:underline cursor-pointer"
            >
              Tất cả câu hỏi <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative max-w-md group mb-8">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Lọc nhanh chủ đề..."
            className="w-full bg-white border border-slate-200 py-3 pl-10 pr-4 focus:outline-none focus:border-brand-primary rounded-xl shadow-sm text-sm font-medium text-slate-800 focus:ring-4 focus:ring-sky-500/5 transition-all"
            id="category_filter_input"
          />
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 mb-8 text-sm text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-slate-300" />
            <span>
              <span className="font-bold text-brand-primary">{filteredCategories.length}</span> chủ
              đề
              {searchTerm && ` (tìm thấy cho "${searchTerm}")`}
            </span>
          </div>
          {isAdmin && (
            <span className="bg-rose-100 text-rose-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full select-none">
              ADMIN VIEW
            </span>
          )}
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <FolderPlus className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium text-sm">Không tìm thấy chủ đề nào.</p>
            {isAdmin && (
              <button
                onClick={handleOpenAdd}
                className="mt-4 text-xs text-sky-600 font-bold underline cursor-pointer"
              >
                Thêm chủ đề đầu tiên →
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCategories.map((cat, idx) => {
              const theme = getCategoryTheme(cat.name);
              const tags = cat.techTags
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean);

              return (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleBentoClick(cat)}
                  className={`bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between min-h-[200px] ${theme.bg}`}
                  id={`category_card_${cat.name.replace(/\s+/g, '_').toLowerCase()}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${theme.iconBg}`}>{theme.icon}</div>
                        <h2 className="font-bold text-md text-brand-primary">{cat.name}</h2>
                      </div>
                      {theme.badge && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded uppercase tracking-wider">
                          {theme.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-xs md:text-sm leading-relaxed line-clamp-3">
                      {cat.description ?? 'Chưa có mô tả.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4 border-t border-slate-50 pt-3">
                    <div className="flex flex-wrap gap-1 max-w-[70%]">
                      {tags.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded text-[10px] font-semibold border border-slate-100"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {isAdmin ? (
                      <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={(e) => handleOpenEdit(cat, e)}
                          title="Chỉnh sửa chủ đề"
                          disabled={isPending}
                          className="p-1.5 bg-slate-50 hover:bg-sky-50 rounded-lg text-slate-500 hover:text-sky-600 transition-colors border border-slate-200 hover:border-sky-100 cursor-pointer disabled:opacity-40"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(cat, e)}
                          title="Xóa chủ đề"
                          disabled={isPending}
                          className="p-1.5 bg-slate-50 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors border border-slate-200 hover:border-rose-100 cursor-pointer disabled:opacity-40"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-sky-600 group-hover:translate-x-1 transition-transform flex items-center gap-0.5 select-none">
                        Vào học <Play className="w-2.5 h-2.5 fill-current" />
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Add / Edit Modal */}
      {(showAddModal || editingCategory) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-slate-100 relative max-h-[85vh] overflow-y-auto animate-fade-in text-left">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-brand-primary mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Settings className="w-5 h-5 text-sky-600" />
              <span>{showAddModal ? 'Thêm chủ đề học tập mới' : 'Chỉnh sửa chủ đề học tập'}</span>
            </h3>

            <form onSubmit={showAddModal ? submitAdd : submitEdit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Tên chủ đề
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: DevOps, Cloud, Mobile Native..."
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3.5 text-xs font-medium rounded-xl text-slate-800 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Mô tả ngắn gọn
                </label>
                <textarea
                  required
                  placeholder="Nhập phạm vi kỹ thuật của chủ đề này..."
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 text-xs font-medium rounded-xl text-slate-800 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Công nghệ gắn thẻ{' '}
                  <span className="text-slate-400 normal-case font-normal">(phân cách bằng dấu phẩy)</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: iOS, Swift, Flutter, Android"
                  value={catTags}
                  onChange={(e) => setCatTags(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3.5 text-xs font-medium rounded-xl text-slate-800 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              {formError && (
                <p className="text-xs text-rose-600 font-medium bg-rose-50 px-3 py-2 rounded-lg border border-rose-100">
                  {formError}
                </p>
              )}

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition-all border border-slate-200 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 bg-brand-primary hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer disabled:opacity-60"
                >
                  {isPending ? 'Đang xử lý...' : showAddModal ? 'Tạo mới' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
