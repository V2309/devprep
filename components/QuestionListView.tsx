'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Search, ChevronRight, CheckCircle2, Circle, ChevronLeft, Plus, Edit2, Trash2, X, Settings, Sparkles, Eye } from 'lucide-react';
import { Question, Difficulty, QuestionCategory } from '@/types/types';
import { useApp } from '@/context/AppProvider';

export default function QuestionListView() {
  const router = useRouter();
  const {
    questions,
    handleToggleComplete,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    handleSelectCategory,
    showToast,
    categories,
    profile,
    handleAddQuestion,
    handleEditQuestion,
    handleDeleteQuestion,
  } = useApp();
  const isAdmin = profile.isAdmin || false;
  const categoryNames = categories.map((c) => c.name);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  // Filters State
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Todo' | 'Done'>('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal active states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Question Form attributes states
  const [qTitle, setQTitle] = useState('');
  const [qCode, setQCode] = useState('');
  const [qCategory, setQCategory] = useState('');
  const [qDifficulty, setQDifficulty] = useState<Difficulty>('Dễ');
  const [qTags, setQTags] = useState('');
  const [qAnswer, setQAnswer] = useState('');

  // Interactive Tooltip active state
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);

  // Toggle difficulty checklist
  const handleDifficultyToggle = (difficulty: Difficulty) => {
    setSelectedDifficulties(prev => 
      prev.includes(difficulty) 
        ? prev.filter(d => d !== difficulty) 
        : [...prev, difficulty]
    );
    setCurrentPage(1);
  };

  // Filter computation
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      // 1. Category filter
      if (selectedCategory !== 'All' && q.category !== selectedCategory) {
        return false;
      }
      // 2. Difficulty filter
      if (selectedDifficulties.length > 0 && !selectedDifficulties.includes(q.difficulty)) {
        return false;
      }
      // 3. Status filter
      if (selectedStatus === 'Todo' && q.completed) return false;
      if (selectedStatus === 'Done' && !q.completed) return false;
      // 4. Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = q.title.toLowerCase().includes(query);
        const matchesTags = q.tags.toLowerCase().includes(query);
        const matchesAnswer = q.answer.toLowerCase().includes(query);
        if (!matchesTitle && !matchesTags && !matchesAnswer) return false;
      }
      return true;
    });
  }, [questions, selectedCategory, selectedDifficulties, selectedStatus, searchQuery]);

  // Statistics calculation based on active categories
  const statistics = useMemo(() => {
    const subset = selectedCategory === 'All' 
      ? questions 
      : questions.filter(q => q.category === selectedCategory);
    
    const total = subset.length;
    const completed = subset.filter(q => q.completed).length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, rate };
  }, [questions, selectedCategory]);

  const handleRowClick = (q: Question) => {
    router.push(`/questions/${q.id}`);
    scrollToTop();
  };

  const categoriesList = ['All', ...categoryNames];

  const handleOpenAdd = () => {
    setQTitle('');
    const nextNum = questions.length + 1;
    setQCode(`FE-${nextNum < 10 ? '0' + nextNum : nextNum}`);
    setQCategory(selectedCategory !== 'All' ? selectedCategory : (categoryNames[0] || 'Frontend'));
    setQDifficulty('Dễ');
    setQTags('React, Performance');
    setQAnswer('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (q: Question, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingQuestion(q);
    setQTitle(q.title);
    setQCode(q.code);
    setQCategory(q.category);
    setQDifficulty(q.difficulty);
    setQTags(q.tags);
    setQAnswer(q.answer);
  };

  const submitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qTitle.trim() || !qAnswer.trim()) {
      showToast('Vui lòng nhập đầy đủ tiêu đề và đáp án!', 'error');
      return;
    }
    const newQ: Question = {
      id: `q_${Date.now()}`,
      code: qCode.trim() || `QA-${Date.now().toString().slice(-4)}`,
      title: qTitle.trim(),
      category: qCategory,
      difficulty: qDifficulty,
      tags: qTags.trim(),
      completed: false,
      answer: qAnswer.trim()
    };
    handleAddQuestion(newQ);
    showToast(`Đã thêm thành công câu hỏi mới "${qTitle.trim()}"!`, 'success');
    setShowAddModal(false);
  };

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;
    if (!qTitle.trim() || !qAnswer.trim()) {
      showToast('Vui lòng nhập đầy đủ tiêu đề và đáp án!', 'error');
      return;
    }
    const updatedQ: Question = {
      ...editingQuestion,
      code: qCode.trim(),
      title: qTitle.trim(),
      category: qCategory,
      difficulty: qDifficulty,
      tags: qTags.trim(),
      answer: qAnswer.trim()
    };
    handleEditQuestion(updatedQ);
    showToast(`Đã cập nhật câu hỏi "${qTitle.trim()}" thành công!`, 'success');
    setEditingQuestion(null);
  };

  const handleDelete = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có chắc chắn muốn xóa câu hỏi "${title}" không? Hành vi này không thể đảo ngược.`)) {
      handleDeleteQuestion(id);
      showToast(`Đã xóa câu hỏi "${title}"!`, 'success');
    }
  };

  return (
    <div className="animate-fade-in w-full pb-16">
      
      {/* Breadcrumb & Category Title */}
      <header className="mb-8 max-w-[1280px] mx-auto px-4">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
          <Link href="/" onClick={scrollToTop} className="hover:text-brand-primary cursor-pointer">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
          <span className="text-slate-800 font-medium select-none">
            {selectedCategory === 'All' ? 'Tất cả chủ đề' : selectedCategory}
          </span>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-brand-primary tracking-tight flex items-center gap-2">
              <span>{selectedCategory === 'All' ? 'Thư viện câu hỏi phỏng vấn' : `Lộ trình ${selectedCategory}`}</span>
              {isAdmin && (
                <span className="bg-rose-100 text-rose-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full select-none">
                  ADMIN VIEW
                </span>
              )}
            </h1>
            <p className="text-slate-500 text-sm mt-1.5 max-w-2xl leading-relaxed">
              Lưu giữ tư duy kiến trúc và kỹ năng thực thi dưới con mắt của nhà tuyển dụng. Nhấn dấu tích để lưu tiến độ ôn luyện.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {isAdmin && (
              <button
                onClick={handleOpenAdd}
                className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                id="add_new_question_btn"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm câu hỏi mới</span>
              </button>
            )}

            {/* Statistics highlight card */}
            <div className="bg-white border border-slate-250/60 p-4 rounded-xl shadow-sm flex items-center divide-x divide-slate-100 max-w-sm self-start">
              <div className="px-4 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tổng số</p>
                <p className="text-lg font-bold text-slate-800">{statistics.total}</p>
              </div>
              <div className="px-4 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hoàn thành</p>
                <p className="text-lg font-bold text-emerald-600">{statistics.completed}</p>
              </div>
              <div className="px-4 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tỷ lệ</p>
                <p className="text-lg font-bold text-sky-600">{statistics.rate}%</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Horizontal Category Pill Filter Bar */}
      <div className="max-w-[1280px] mx-auto px-4 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                handleSelectCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all border ${
                selectedCategory === cat
                  ? 'bg-brand-primary text-white border-brand-primary'
                  : 'bg-white text-slate-500 border-slate-200 hover:text-slate-800 hover:border-slate-350'
              }`}
            >
              {cat === 'All' ? 'Tất cả câu hỏi' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1280px] mx-auto px-4">
        
        {/* Sidebar Filters */}
        <aside className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Search bar specifically for list */}
          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Tìm kiếm nhanh</h3>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Ví dụ: Closures, JS..."
                className="w-full bg-slate-50 border border-slate-200 py-2 pl-9 pr-4 text-xs font-medium rounded-lg text-slate-800 focus:outline-none focus:border-brand-primary"
                id="sidebar_questions_search"
              />
            </div>
          </div>

          {/* Difficulty Filter checklist */}
          <section className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Độ khó</h3>
            <div className="flex flex-col gap-2.5">
              {(['Dễ', 'Trung bình', 'Khó'] as Difficulty[]).map((level) => {
                const count = questions.filter(q => q.difficulty === level && (selectedCategory === 'All' || q.category === selectedCategory)).length;
                return (
                  <label 
                    key={level} 
                    className="flex items-center gap-3 cursor-pointer group py-0.5 select-none"
                    id={`filter_diff_${level.toLowerCase().replace(/\s+/g, '')}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedDifficulties.includes(level)}
                      onChange={() => handleDifficultyToggle(level)}
                      className="rounded border-slate-350 text-brand-primary focus:ring-brand-primary w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs font-medium text-slate-600 group-hover:text-brand-primary transition-colors">{level}</span>
                    <span className="ml-auto text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                      {count}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Completion Status Radios */}
          <section className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Trạng thái</h3>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Tất cả', value: 'All' },
                { label: 'Chưa học', value: 'Todo' },
                { label: 'Đã hoàn thành', value: 'Done' }
              ].map((status) => (
                <label 
                  key={status.value} 
                  className="flex items-center gap-3 cursor-pointer group py-0.5 select-none"
                  id={`filter_status_${status.value.toLowerCase()}`}
                >
                  <input
                    type="radio"
                    name="status_filter"
                    checked={selectedStatus === status.value}
                    onChange={() => {
                      setSelectedStatus(status.value as any);
                      setCurrentPage(1);
                    }}
                    className="text-brand-primary focus:ring-brand-primary w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-600 group-hover:text-brand-primary transition-colors">{status.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Prompt card layout */}
          <div className="bg-brand-container p-5 rounded-2xl relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 bg-sky-500/10 w-24 h-24 rounded-full blur-xl pointer-events-none" />
            <h4 className="text-xs font-bold text-brand-text-muted uppercase tracking-wider mb-1">Thử thách mới</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-4">
              Tham gia kỳ thi thử Mock Interview tuần này để nhận được đánh giá chi tiết từ AI và sửa đổi code.
            </p>
            <button 
              onClick={() => showToast("Hãy giải đề thi thử Mid-level React đã khởi chạy!", "info")}
              className="w-full bg-white text-brand-primary hover:bg-slate-50 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow"
              id="sidebar_mock_contest_btn"
            >
              Bắt đầu ngay
            </button>
          </div>
        </aside>

        {/* Main Questions List */}
        <div className="lg:col-span-9 flex flex-col gap-4">
          
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 px-6 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none border-b border-slate-100 mb-1">
            <span className="col-span-1">STT</span>
            <span className={isAdmin ? "col-span-4" : "col-span-5"}>Tiêu đề câu hỏi / Chủ đề</span>
            <span className="col-span-2">Độ khó</span>
            <span className="col-span-2">Thẻ tags</span>
            <span className={isAdmin ? "col-span-1 text-right" : "col-span-2 text-right"}>Hành động</span>
            {isAdmin && <span className="col-span-2 text-right">Quản lý</span>}
          </div>

          {/* Empty state when query matched nothing */}
          {filteredQuestions.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-xs">
              <span className="text-3xl">🧩</span>
              <h3 className="font-bold text-slate-700 mt-3 text-sm">Không tìm thấy câu hỏi phù hợp</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Hãy thử làm sạch bộ lọc hoặc nhập từ khóa tìm kiếm chung hơn để tiếp tục ôn luyện.
              </p>
              <button
                onClick={() => {
                  setSelectedDifficulties([]);
                  setSelectedStatus('All');
                  setSearchQuery('');
                  handleSelectCategory('All');
                }}
                className="mt-4 px-4 py-1.5 bg-brand-primary text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-all cursor-pointer"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredQuestions.map((q) => {
                
                // Color mapping logic representing diff metrics
                const diffStyles = {
                  'Dễ': 'bg-emerald-50 text-emerald-700 border-emerald-100',
                  'Trung bình': 'bg-amber-50 text-amber-700 border-amber-100',
                  'Khó': 'bg-rose-50 text-rose-700 border-rose-105'
                }[q.difficulty];

                const isTooltipActive = activeTooltipId === q.id;
                return (
                  <div
                    key={q.id}
                    className={`bg-white border rounded-2xl p-5 hover:border-brand-primary/65 hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col gap-4 ${
                      isTooltipActive ? 'ring-2 ring-brand-primary/20 border-brand-primary/65' : 'border-slate-200/80'
                    }`}
                    id={`question_item_${q.code}`}
                    onClick={() => setActiveTooltipId(isTooltipActive ? null : q.id)}
                  >
                    <div className="flex flex-col md:grid md:grid-cols-12 items-start md:items-center gap-4 w-full">
                      
                      {/* Left: serial counter index */}
                      <div className="hidden md:block col-span-1 font-mono text-xs text-slate-400 select-none">
                        {q.code}
                      </div>

                      {/* Completed toggle checkbox & interactive Title */}
                      <div className="col-span-5 flex items-start gap-3 w-full">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Avoid triggering details or tooltip toggle
                            handleToggleComplete(q.id);
                          }}
                          className="pt-0.5 text-slate-350 hover:text-emerald-500 transition-colors cursor-pointer rounded-full"
                          title={q.completed ? "Đánh dấu là chưa làm" : "Đánh dấu là đã hoàn thành"}
                          id={`complete_checkbox_${q.code}`}
                        >
                          {q.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>
                        
                        <div className="flex-1">
                          <h3 className="font-bold text-sm text-brand-primary group-hover:text-sky-600 transition-colors leading-snug">
                            {q.title}
                          </h3>
                          <span className="mt-1 text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                            Chủ đề: {q.category}
                          </span>
                        </div>
                      </div>

                      {/* Middle: Difficulty Tag */}
                      <div className="col-span-2 pt-1 md:pt-0">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border ${diffStyles}`}>
                          {q.difficulty}
                        </span>
                      </div>

                      {/* Technology Chips */}
                      <div className="col-span-2 flex flex-wrap gap-1">
                        {q.tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                          <span key={tag} className="text-[10px] font-bold text-slate-550 border-slate-100 text-slate-500 bg-slate-50 px-2 py-0.5 rounded border">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Right: Actions / Management (Details + Admin tools if admin) */}
                      <div className="col-span-2 flex items-center justify-end gap-1.5 w-full md:w-auto" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(q);
                          }}
                          className="p-1.5 bg-slate-50 hover:bg-brand-primary hover:text-white rounded-lg text-slate-500 hover:border-brand-primary/50 transition-all border border-slate-200 shadow-sm cursor-pointer"
                          title="Xem chi tiết câu hỏi"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        
                        {isAdmin && (
                          <>
                            <button
                              onClick={(e) => handleOpenEdit(q, e)}
                              title="Chỉnh sửa câu hỏi"
                              className="p-1.5 bg-slate-50 hover:bg-sky-50 rounded-lg text-slate-500 hover:text-sky-600 border border-slate-200 hover:border-sky-100 transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => handleDelete(q.id, q.title, e)}
                              title="Xóa câu hỏi"
                              className="p-1.5 bg-slate-50 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 border border-slate-200 border-rose-100/10 hover:border-rose-100 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>

                    </div>

                    {/* Quick Answer Tooltip/Popover Container */}
                    {isTooltipActive && (
                      <div 
                        className="w-full mt-2 p-5 bg-white text-slate-800 rounded-xl relative border border-slate-200 shadow-xl cursor-default animate-fade-in text-left"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Up pointing arrow */}
                        <div className="absolute -top-1.5 left-20 w-3 h-3 bg-white border-t border-l border-slate-200 rotate-45" />
                        
                        <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100 text-slate-400 select-none">
                          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Đáp án ôn luyện nhanh</span>
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700 font-medium">
                          {q.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Simple Pagination */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-205 text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-brand-primary text-white font-bold text-xs select-none">
              1
            </button>
            <button onClick={() => showToast("Chuyển trang phỏng vấn...", "info")} className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-205 text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors text-xs font-semibold">
              2
            </button>
            <button onClick={() => showToast("Chuyển trang phỏng vấn...", "info")} className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-205 text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors text-xs font-semibold">
              3
            </button>
            <span className="text-slate-300 px-1 text-xs select-none">...</span>
            <button onClick={() => showToast("Chuyển trang phỏng vấn...", "info")} className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-250 text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors text-xs font-semibold">
              12
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-205 text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Admin Modal Popup for Add/Edit Interview Questions */}
      {(showAddModal || editingQuestion) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl border border-slate-100 relative max-h-[88vh] overflow-y-auto animate-fade-in text-left">
            <button 
              onClick={() => { setShowAddModal(false); setEditingQuestion(null); }}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-lg font-bold text-brand-primary mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Settings className="w-5 h-5 text-sky-600" />
              <span>{showAddModal ? 'Thêm câu hỏi tuyển dụng mới' : `Chỉnh sửa câu hỏi phỏng vấn: ${qCode}`}</span>
            </h3>
            
            <form onSubmit={showAddModal ? submitAdd : submitEdit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                <div className="col-span-12 md:col-span-8 space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Tiêu đề câu hỏi</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Tìm hiểu cơ chế hoạt động của Virtual DOM"
                    value={qTitle}
                    onChange={(e) => setQTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3.5 text-xs font-medium rounded-xl text-slate-800 focus:outline-brand-primary"
                  />
                </div>

                <div className="col-span-12 md:col-span-4 space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Mã định danh (Code)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: FE-05"
                    value={qCode}
                    onChange={(e) => setQCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3.5 text-xs font-mono rounded-xl text-slate-800 focus:outline-brand-primary"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Chủ đề (Category)</label>
                  <select
                    value={qCategory}
                    onChange={(e) => setQCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3.5 text-xs font-semibold rounded-xl text-slate-800 focus:outline-brand-primary"
                  >
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Độ khó (Difficulty)</label>
                  <select
                    value={qDifficulty}
                    onChange={(e) => setQDifficulty(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3.5 text-xs font-semibold rounded-xl text-slate-800 focus:outline-brand-primary"
                  >
                    <option value="Dễ">Dễ</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Khó">Khó</option>
                  </select>
                </div>

              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Thành phần công nghệ tags (Cách nhau bằng dấu phẩy)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: React, Virtual DOM, Core JS"
                  value={qTags}
                  onChange={(e) => setQTags(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3.5 text-xs font-medium rounded-xl text-slate-800 focus:outline-brand-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Đáp án bài tập phỏng vấn</label>
                <textarea
                  required
                  placeholder="Nhập chi tiết đáp án cho câu hỏi..."
                  value={qAnswer}
                  onChange={(e) => setQAnswer(e.target.value)}
                  rows={6}
                  className="w-full bg-slate-50 border border-slate-200 p-3 font-mono text-xs rounded-xl text-slate-805 text-slate-800 focus:outline-brand-primary"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingQuestion(null); }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all border border-slate-200 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-primary hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  {showAddModal ? 'Thêm câu hỏi' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
