'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Search, ArrowRight, Monitor as WinIcon, Database, Network, Brain, Code, Play, Plus, Edit, Trash2, FolderPlus, X, Settings } from 'lucide-react';
import { ARTICLES } from '@/lib/data';
import { QuestionCategory } from '@/types/types';
import { useApp } from '@/context/AppProvider';

export interface Category {
  name: string;
  description: string;
  techTags: string[];
}

export default function HomeView() {
  const router = useRouter();
  const {
    searchQuery,
    setSearchQuery,
    showToast,
    categories,
    profile,
    handleSelectCategory,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
  } = useApp();
  const isAdmin = profile.isAdmin || false;
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const goToQuestions = () => {
    router.push('/questions');
    scrollToTop();
  };
  // Modal toggle state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form states for Category Add/Edit
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catTags, setCatTags] = useState('');

  const handleBentoClick = (category: QuestionCategory) => {
    handleSelectCategory(category);
    setSearchQuery('');
    router.push('/questions');
    scrollToTop();
  };

  const handleOpenAdd = () => {
    setCatName('');
    setCatDesc('');
    setCatTags('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (cat: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatDesc(cat.description);
    setCatTags(cat.techTags.join(', '));
  };

  const submitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim() || !catDesc.trim()) {
      showToast('Vui lòng nhập tên chủ đề và mô tả!', 'error');
      return;
    }
    if (categories.some(c => c.name.toLowerCase() === catName.trim().toLowerCase())) {
      showToast('Tên chủ đề này đã tồn tại rồi!', 'error');
      return;
    }
    const tags = catTags.split(',').map(t => t.trim()).filter(Boolean);
    handleAddCategory(catName.trim(), catDesc.trim(), tags);
    showToast(`Đã thêm thành công chủ đề "${catName.trim()}"!`, 'success');
    setShowAddModal(false);
  };

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    if (!catName.trim() || !catDesc.trim()) {
      showToast('Vui lòng nhập đầy đủ tên chủ đề và mô tả!', 'error');
      return;
    }
    if (catName.trim().toLowerCase() !== editingCategory.name.toLowerCase() && 
        categories.some(c => c.name.toLowerCase() === catName.trim().toLowerCase())) {
      showToast('Tên chủ đề này đã trùng với một chủ đề khác!', 'error');
      return;
    }
    const tags = catTags.split(',').map(t => t.trim()).filter(Boolean);
    handleEditCategory(editingCategory.name, catName.trim(), catDesc.trim(), tags);
    showToast(`Đã cập nhật chủ đề "${catName.trim()}" và các câu hỏi liên quan!`, 'success');
    setEditingCategory(null);
  };

  const handleDelete = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có chắc chắn muốn xóa chủ đề "${name}" cùng toàn bộ các câu hỏi thuộc chủ đề này? Hành vi này không thể đảo ngược.`)) {
      handleDeleteCategory(name);
      showToast(`Đã xóa chủ đề "${name}" thành công!`, 'success');
    }
  };

  // Helper theme finder for visually stunning bento mapping
  const getCategoryTheme = (name: string) => {
    const normalized = name.toLowerCase();
    if (normalized.includes('frontend')) {
      return {
        bg: 'bg-white border-slate-200/80 hover:border-sky-500/50',
        iconBg: 'bg-sky-50 text-sky-600',
        icon: <WinIcon className="w-5 h-5" />,
        badge: null
      };
    } else if (normalized.includes('backend')) {
      return {
        bg: 'bg-white border-slate-200/80 hover:border-purple-500/50',
        iconBg: 'bg-purple-50 text-purple-600',
        icon: <Database className="w-5 h-5" />,
        badge: null
      };
    } else if (normalized.includes('system design') || normalized.includes('hệ thống')) {
      return {
        bg: 'bg-white border-slate-200/80 hover:border-indigo-500/50',
        iconBg: 'bg-indigo-50 text-indigo-600',
        icon: <Network className="w-5 h-5" />,
        badge: null
      };
    } else if (normalized.includes('giải thuật') || normalized.includes('dsa') || normalized.includes('thuật toán') || normalized.includes('cấu trúc dữ liệu')) {
      return {
        bg: 'bg-white border-slate-200/80 hover:border-amber-500/50',
        iconBg: 'bg-amber-50 text-amber-600',
        icon: <Brain className="w-5 h-5" />,
        badge: 'Học nhiều nhất 🔥'
      };
    } else {
      return {
        bg: 'bg-white border-slate-200/80 hover:border-teal-500/50',
        iconBg: 'bg-teal-55 bg-teal-50 text-teal-650 text-teal-600',
        icon: <FolderPlus className="w-5 h-5" />,
        badge: 'Chủ đề mới 🆕'
      };
    }
  };

  return (
    <div className="animate-fade-in w-full pb-16">
      {/* High-Impact Hero Segment */}
      <section className="text-center py-16 md:py-24 max-w-4xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-extrabold tracking-tight text-brand-primary leading-tight mb-6"
        >
          Chinh phục mọi cuộc phỏng vấn <br className="hidden md:block" /> 
          với <span className="text-sky-600 underline decoration-wavy decoration-brand-cyan underline-offset-4">cấu trúc</span> và <span className="text-slate-800">tư duy đột phá</span>.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-md md:text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
        >
          Hệ thống ôn luyện dành riêng cho các kỹ sư phần mềm, tập trung vào tư duy logic và kiến trúc hệ thống hiện đại.
        </motion.p>

        {/* Hero Interactive Search Bar */}
        <div className="max-w-xl mx-auto relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                goToQuestions();
              }
            }}
            placeholder="Tìm kiếm chủ đề, câu hỏi, ví dụ: Virtual DOM..."
            className="w-full bg-white border border-slate-200 py-4 pl-12 pr-16 focus:outline-none focus:border-brand-primary rounded-xl shadow-sm group-hover:shadow-md transition-all text-sm font-medium text-slate-800 focus:ring-4 focus:ring-sky-500/5"
            id="hero_search_input"
          />
          <div className="absolute inset-y-2 right-2 flex gap-2">
            <button
              onClick={goToQuestions}
              className="bg-brand-primary text-white px-4 rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      </section>

      {/* Main Multi-Column Bento / Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1280px] mx-auto px-4">
        
        {/* Left Column: Progress Quick-View (Logged-in User context) */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-brand-primary">Tiến độ của bạn</h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                LEVEL 4
              </span>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-slate-500">Cấu trúc dữ liệu & Giải thuật</span>
                  <span className="text-slate-800 font-bold">12/45</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-primary h-full transition-all duration-700" style={{ width: '26%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-slate-500">Frontend Development</span>
                  <span className="text-slate-800 font-bold">28/30</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all duration-700" style={{ width: '93%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-slate-500">System Design</span>
                  <span className="text-slate-800 font-bold">5/20</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full transition-all duration-700" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>

            {/* Micro indicators */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <Link
                href="/dashboard"
                onClick={scrollToTop}
                className="p-3 bg-slate-50 rounded-xl text-center cursor-pointer hover:bg-slate-100 transition-colors block"
                id="home_streak_card"
              >
                <span className="block font-bold text-xl text-brand-primary">15</span>
                <span className="text-xs text-slate-500 font-medium">Chuỗi ngày 🔥</span>
              </Link>
              <Link
                href="/dashboard"
                onClick={scrollToTop}
                className="p-3 bg-slate-50 rounded-xl text-center cursor-pointer hover:bg-slate-100 transition-colors block"
                id="home_xp_card"
              >
                <span className="block font-bold text-xl text-brand-primary">452</span>
                <span className="text-xs text-slate-500 font-medium">XP Hôm nay ⭐️</span>
              </Link>
            </div>
          </div>

          {/* Quick Code Sandbox Mockup */}
          <div className="bg-brand-primary text-slate-100 p-6 rounded-2xl font-mono text-xs overflow-hidden relative shadow-lg group">
            <div className="flex gap-2 mb-4 opacity-70">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>
            <div className="text-emerald-300 font-semibold mb-2 select-none flex items-center gap-1.5">
              <span>●</span> Last session: Merge Sort
            </div>
            <div className="text-slate-400 mt-2 select-none">// Time Complexity: O(n log n)</div>
            <div className="text-brand-text-muted mt-1">
              <span className="text-cyan-400">const</span> <span className="text-sky-300">merge</span> = (left, right) =&gt; &#123;
              <br />
              &nbsp;&nbsp;<span className="text-slate-500">// Logic ghép đôi mảng tối ưu</span>
              <br />
              &nbsp;&nbsp;<span className="text-brand-cyan">return</span> result;
              <br />
              &#125;
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12 transition-transform duration-300 group-hover:rotate-6">
              <Code className="w-40 h-40 text-white" />
            </div>
          </div>
        </aside>

        {/* Right Column: Roadmap Cards Bento Grid */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xl text-brand-primary flex items-center gap-2">
              <span>Lộ trình học tập</span>
              {isAdmin && (
                <span className="bg-rose-100 text-rose-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full select-none">
                  ADMIN VIEW
                </span>
              )}
            </h2>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <button
                  onClick={handleOpenAdd}
                  className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                  id="add_category_btn"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm chủ đề</span>
                </button>
              )}
              <Link
                href="/questions"
                onClick={scrollToTop}
                className="text-xs font-bold text-brand-primary flex items-center gap-1 hover:underline cursor-pointer"
              >
                Xem tất cả <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat) => {
              const theme = getCategoryTheme(cat.name);
              // Maintain bento sizes but dynamically generated
              const isWide = cat.name.toLowerCase().includes('system design') || cat.name.toLowerCase().includes('giải thuật') || cat.name.toLowerCase().includes('cấu trúc dữ liệu');
              
              return (
                <div 
                  key={cat.name}
                  onClick={() => handleBentoClick(cat.name)}
                  className={`bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between min-h-[220px] ${
                    theme.bg
                  } ${isWide ? 'md:col-span-2' : ''}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${theme.iconBg}`}>
                          {theme.icon}
                        </div>
                        <h3 className="font-bold text-md text-brand-primary">{cat.name}</h3>
                      </div>
                      
                      {theme.badge && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded uppercase tracking-wider">
                          {theme.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-xs md:text-sm leading-relaxed line-clamp-3">
                      {cat.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 border-t border-slate-50 pt-3">
                    <div className="flex flex-wrap gap-1 max-w-[70%]">
                      {cat.techTags.map((tech) => (
                        <span key={tech} className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded text-[10px] font-semibold border border-slate-100">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Admin Action Buttons on Category bento */}
                    {isAdmin ? (
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleOpenEdit(cat, e)}
                          title="Chỉnh sửa chủ đề"
                          className="p-1.5 bg-slate-50 hover:bg-sky-50 rounded-lg text-slate-500 hover:text-sky-600 transition-colors border border-slate-200 hover:border-sky-100 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(cat.name, e)}
                          title="Xóa chủ đề"
                          className="p-1.5 bg-slate-50 hover:bg-rose-55 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors border border-slate-200 border-rose-100/10 hover:border-rose-100 cursor-pointer"
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
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Latest Articles Row */}
      <section className="mt-16 pt-16 border-t border-slate-200 max-w-[1280px] mx-auto px-4">
        <h2 className="font-bold text-xl text-brand-primary mb-8">Bài viết mới nhất</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((article) => (
            <article 
              key={article.id} 
              onClick={() => showToast(`Đang mở bài viết: "${article.title}"`, 'info')}
              className="group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] w-full rounded-2xl bg-slate-100 mb-4 overflow-hidden border border-slate-200/50">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex items-center gap-3 text-xs mb-2">
                  <span className="text-sky-600 font-bold uppercase tracking-wider">{article.category}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-400 font-medium">{article.readTime}</span>
                </div>
                <h4 className="font-bold text-md text-brand-primary group-hover:text-sky-600 transition-colors leading-snug">
                  {article.title}
                </h4>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {article.description}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-brand-primary font-bold mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Đọc bài viết</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Modal Add/Edit Category Form Popup */}
      {(showAddModal || editingCategory) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-slate-100 relative max-h-[85vh] overflow-y-auto animate-fade-in text-left">
            <button 
              onClick={() => { setShowAddModal(false); setEditingCategory(null); }}
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
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Tên chủ đề / Lộ trình</label>
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
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Mô tả ngắn gọn</label>
                <textarea
                  required
                  placeholder="Nhập phạm vi kỹ thuật của lộ trình học tập này..."
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 text-xs font-medium rounded-xl text-slate-800 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Công nghệ gắn thẻ (Ngăn cách nhiều công nghệ bằng dấu phẩy)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: iOS, Swift, Flutter, Android"
                  value={catTags}
                  onChange={(e) => setCatTags(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3.5 text-xs font-medium rounded-xl text-slate-800 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingCategory(null); }}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition-all border border-slate-200 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-primary hover:bg-slate-800 text-white font-bold rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  {showAddModal ? 'Tạo mới' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
