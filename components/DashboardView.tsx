'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Check, BookOpen, Award, Flame, Navigation, Target, ArrowRight, Brain, Sparkles, ChevronRight } from 'lucide-react';
import { INITIAL_ACTIVITIES } from '@/lib/data';
import { useApp } from '@/context/AppProvider';

export default function DashboardView() {
  const router = useRouter();
  const { questions, showToast } = useApp();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  // Heatmap Interaction State
  const [hoveredDay, setHoveredDay] = useState<{ dayIdx: number; solved: number } | null>(null);

  // Dynamic statistics
  const totalQuestions = questions.length;
  const completedQuestions = questions.filter(q => q.completed).length;
  const accuracyRate = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

  // Render mock Heatmap coordinates safely. 
  // We'll generate 65 columns x 7 rows to fully populate the Github-style contribution dashboard.
  const heatmapData = useMemo(() => {
    const data = [];
    const seed = [0, 1, 0, 2, 0, 3, 0, 1, 4, 1, 2, 0, 0, 2, 1, 3, 2, 1, 0];
    for (let i = 0; i < 52 * 7; i++) {
      const level = seed[i % seed.length];
      data.push({
        dayIdx: i,
        level, // 0 to 4 intensity scale
        solved: level === 0 ? 0 : level === 1 ? 1 : level === 2 ? 3 : level === 3 ? 5 : 8
      });
    }
    return data;
  }, []);

  const handleContinueLearning = () => {
    const item = questions.find((q) => !q.completed) || questions[0];
    if (item) {
      router.push(`/questions/${item.id}`);
      scrollToTop();
    }
  };

  const handleRecentActivityClick = (qCode: string) => {
    const found = questions.find((q) => q.code === qCode);
    if (found) {
      router.push(`/questions/${found.id}`);
      scrollToTop();
    } else {
      showToast('Đang chuẩn bị học liệu cho hoạt động này...');
    }
  };

  return (
    <div className="animate-fade-in w-full pb-16">
      
      {/* Welcome Header */}
      <section className="mb-8 max-w-[1280px] mx-auto px-4">
        <h1 className="text-2xl md:text-4xl font-extrabold text-brand-primary tracking-tight">
          Chào buổi sáng, Minh!
        </h1>
        <p className="text-slate-500 text-sm mt-1 font-normal">
          Sẵn sàng nâng cao kỹ năng lập trình và làm chủ tư duy hệ thống hôm nay chứ?
        </p>
      </section>

      {/* Stats Cards Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1280px] mx-auto px-4 mb-8">
        
        {/* Stat: Total Questions */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">TỔNG CÂU HỎI</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-brand-primary">{completedQuestions}</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-500 text-sm font-semibold">{totalQuestions}</span>
              <span className="text-xs text-emerald-500 font-bold ml-auto">+5 tuần này</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-4">
            <div className="bg-brand-primary h-full" style={{ width: `${(completedQuestions / totalQuestions) * 100}%` }}></div>
          </div>
        </div>

        {/* Stat: Streak tracker */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">CHUỖI HIỆN TẠI</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-3xl font-extrabold text-brand-primary">12</span>
              <Flame className="w-6 h-6 text-orange-500 animate-bounce fill-orange-200" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-4">
            Kỷ lục cá nhân: <span className="text-slate-800 font-bold">24 ngày liên tiếp</span>
          </p>
        </div>

        {/* Stat: Accuracy Meter */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">ĐỘ CHÍNH XÁC</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-brand-primary">{accuracyRate}%</span>
            </div>
          </div>
          <div className="flex gap-1.5 mt-4">
            <div className={`h-1 flex-1 rounded-full ${accuracyRate >= 25 ? 'bg-emerald-500' : 'bg-slate-100'}`} />
            <div className={`h-1 flex-1 rounded-full ${accuracyRate >= 50 ? 'bg-emerald-500' : 'bg-slate-100'}`} />
            <div className={`h-1 flex-1 rounded-full ${accuracyRate >= 75 ? 'bg-emerald-500' : 'bg-slate-100'}`} />
            <div className={`h-1 flex-1 rounded-full ${accuracyRate >= 95 ? 'bg-emerald-500' : 'bg-slate-100'}`} />
          </div>
        </div>

        {/* Continuing learning card highlights */}
        <div 
          onClick={handleContinueLearning}
          className="bg-brand-primary p-5 rounded-2xl flex flex-col justify-between group cursor-pointer hover:shadow-lg transition-all active:scale-[0.98]"
        >
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">TIẾP TỤC HỌC</span>
            <h3 className="font-bold text-brand-text-muted tracking-tight mt-1 truncate">Kiến trúc Hệ thống</h3>
          </div>
          <div className="flex items-center justify-between text-white mt-4">
            <span className="text-xs font-semibold text-slate-300 truncate max-w-[150px]">Luyện tập câu chưa hoàn thiện</span>
            <ArrowRight className="w-4 h-4 text-brand-cyan group-hover:translate-x-1.5 transition-transform" />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1280px] mx-auto px-4 mb-8">
        
        {/* Heat Map box (Github styles) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Hoạt động trong năm</h2>
              <p className="text-xs text-slate-400 mt-1">428 lần cam kết rèn luyện trong 2026</p>
            </div>
            
            {/* Live hovered status readout */}
            <div className="text-right h-8 select-none">
              {hoveredDay ? (
                <span className="text-xs bg-slate-50 border border-slate-100 px-3 py-1 rounded-full text-slate-600 font-medium animate-fade-in">
                  Ngày {hoveredDay.dayIdx + 1}: <strong className="text-brand-primary">{hoveredDay.solved} bài tập</strong> đã giải
                </span>
              ) : (
                <span className="text-xs text-slate-300 italic font-normal">Di chuột qua từng ô để xem chi tiết</span>
              )}
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <div className="grid grid-flow-col grid-rows-7 gap-1 min-w-[620px] max-w-full">
              {heatmapData.map((cell) => {
                const colors = {
                  0: 'bg-slate-100 hover:bg-slate-200',
                  1: 'bg-sky-100 hover:bg-sky-200',
                  2: 'bg-sky-300 hover:bg-sky-400',
                  3: 'bg-indigo-400 hover:bg-indigo-500',
                  4: 'bg-brand-primary hover:bg-black'
                }[cell.level];

                return (
                  <div
                    key={cell.dayIdx}
                    onMouseEnter={() => setHoveredDay({ dayIdx: cell.dayIdx, solved: cell.solved })}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`w-[11px] h-[11px] rounded-sm transition-all duration-150 cursor-pointer ${colors}`}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex justify-end items-center gap-2 mt-4 font-semibold text-[10px] text-slate-400 uppercase tracking-wider select-none">
            <span>Ít</span>
            <div className="w-2.5 h-2.5 bg-slate-100 rounded-sm" />
            <div className="w-2.5 h-2.5 bg-sky-100 rounded-sm" />
            <div className="w-2.5 h-2.5 bg-sky-300 rounded-sm" />
            <div className="w-2.5 h-2.5 bg-indigo-400 rounded-sm" />
            <div className="w-2.5 h-2.5 bg-brand-primary rounded-sm" />
            <span>Nhiều</span>
          </div>
        </div>

        {/* Progress Category breakdowns */}
        <div className="lg:col-span-1 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-6">Tiến độ theo danh mục</h2>
            
            <div className="space-y-4">
              {[
                { name: 'Frontend development', count: '45/60', pct: 75, col: 'bg-[#4f5e80]' },
                { name: 'Backend & APIs', count: '32/80', pct: 40, col: 'bg-brand-primary' },
                { name: 'DevOps & Clouds', count: '12/40', pct: 30, col: 'bg-[#FFC107]' },
                { name: 'Algorithms', count: '58/100', pct: 58, col: 'bg-emerald-500' }
              ].map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-600 truncate max-w-[190px]">{cat.name}</span>
                    <span className="text-slate-400 font-mono">{cat.count}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${cat.col} rounded-full`} style={{ width: `${cat.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/questions"
            onClick={() => {
              scrollToTop();
              showToast('Đã định hướng tới lộ trình học tập chi tiết!');
            }}
            className="w-full mt-6 border border-slate-200 text-brand-primary hover:bg-slate-50 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer block text-center"
          >
            Xem chi tiết roadmap
          </Link>
        </div>

      </div>

      {/* Activities Vertical timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1280px] mx-auto px-4">
        
        {/* Timeline block */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Hoạt động gần đây</h2>
          
          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
            {INITIAL_ACTIVITIES.map((act) => (
              <div key={act.id} className="relative group">
                {/* Node icon depending on action type */}
                <div className="absolute -left-[23px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-brand-primary flex items-center justify-center z-10 transition-transform group-hover:scale-125">
                  <div className="w-1.5 h-1.5 bg-brand-primary rounded-full" />
                </div>

                <div 
                  onClick={() => {
                    if (act.tags) {
                      handleRecentActivityClick('006');
                    } else {
                      showToast(`"${act.action}"`);
                    }
                  }}
                  className="bg-white border border-slate-200/80 p-5 rounded-2xl hover:border-brand-primary/50 shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  <span className="text-[10px] text-slate-400 font-bold block">{act.timeStr}</span>
                  <h4 className="font-bold text-sm text-brand-primary mt-1 group-hover:text-amber-600 transition-colors">{act.action}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal mt-1">{act.detail}</p>
                  
                  {act.tags && (
                    <div className="flex gap-1.5 mt-3 select-none">
                      {act.tags.map(t => (
                        <span key={t} className="text-[9px] font-bold text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded border border-slate-100">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Promo Suggestions block */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <h2 className="font-bold text-slate-805 text-sm uppercase tracking-wider invisible lg:visible select-none">Gợi ý hôm nay</h2>
          
          {/* Main challenge promotion design */}
          <div className="bg-brand-container p-6 rounded-2xl text-white relative overflow-hidden group shadow-sm flex flex-col justify-between min-h-[190px]">
            <div className="absolute top-0 right-0 p-4 opacity-15">
              <Sparkles className="w-20 h-20 text-sky-400" />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center border border-sky-500/10 mb-2">
                <Brain className="w-4 h-4 text-sky-400" />
              </div>
              <h3 className="font-bold text-sm text-brand-text-muted">Thử thách thuật toán</h3>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Dựa trên lịch sử các bài đã làm, hãy thách thức bản thân với bài toán duyệt cây nhị phân (Tree Traversal) để củng cố tư duy logic.
              </p>
            </div>

            <button
              onClick={() => showToast('Hãy giải quyết đề phỏng vấn Tree Traversal chuẩn phỏng vấn!')}
              className="mt-6 w-full bg-white text-brand-primary hover:bg-slate-50 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow"
              id="today_algorithm_challenge_btn"
            >
              Bắt đầu ngay
            </button>
          </div>

          {/* System design catalog item */}
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden relative group shadow-sm flex items-center gap-4 p-4 hover:border-brand-primary transition-all">
            <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0 relative">
              <img
                src="https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=200"
                alt="System design catalog cover image"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-[9px] font-bold text-sky-600 uppercase tracking-wider block">Cẩm nang kiến thức</span>
              <h3 className="font-bold text-xs text-slate-800 leading-snug group-hover:text-slate-650 transition-colors mt-0.5">
                Cẩm nang System Design nâng cao
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mt-1">Mới cập nhật: Scaling WebSockets</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
