'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Search, ArrowRight, Code, Layers, BookOpen, Zap } from 'lucide-react';
import { ARTICLES } from '@/lib/data';
import { useApp } from '@/context/AppProvider';

export interface Category {
  name: string;
  description: string;
  techTags: string[];
}

export default function HomeView() {
  const router = useRouter();
  const { searchQuery, setSearchQuery, showToast, profile } = useApp();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const goToQuestions = () => {
    router.push('/questions');
    scrollToTop();
  };

  const quickLinks = [
    {
      href: '/categories',
      icon: <Layers className="w-5 h-5" />,
      iconBg: 'bg-sky-50 text-sky-600',
      border: 'hover:border-sky-400/50',
      title: 'Chủ đề học tập',
      desc: 'Khám phá Frontend, Backend, System Design và nhiều hơn nữa.',
      cta: 'Xem tất cả chủ đề',
    },
    {
      href: '/questions',
      icon: <BookOpen className="w-5 h-5" />,
      iconBg: 'bg-purple-50 text-purple-600',
      border: 'hover:border-purple-400/50',
      title: 'Câu hỏi phỏng vấn',
      desc: 'Luyện tập hàng trăm câu hỏi phỏng vấn thực chiến từ dễ đến khó.',
      cta: 'Bắt đầu ôn luyện',
    },
    {
      href: '/dashboard',
      icon: <Zap className="w-5 h-5" />,
      iconBg: 'bg-amber-50 text-amber-600',
      border: 'hover:border-amber-400/50',
      title: 'Tiến độ của bạn',
      desc: `Xin chào${profile.name ? `, ${profile.name.split(' ')[0]}` : ''}! Tiếp tục chuỗi ngày học tập hôm nay.`,
      cta: 'Xem Dashboard',
    },
  ];

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

      {/* Quick Navigation Cards */}
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {quickLinks.map((link, idx) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.07 }}
            >
              <Link
                href={link.href}
                onClick={scrollToTop}
                className={`flex flex-col justify-between bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group min-h-[160px] ${link.border}`}
                id={`home_quick_link_${idx}`}
              >
                <div>
                  <div className={`inline-flex p-2.5 rounded-xl mb-3 ${link.iconBg}`}>
                    {link.icon}
                  </div>
                  <h3 className="font-bold text-md text-brand-primary mb-1">{link.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{link.desc}</p>
                </div>
                <div className="flex items-center gap-1 mt-4 text-xs font-bold text-sky-600 group-hover:translate-x-1 transition-transform">
                  <span>{link.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Code Sandbox Mockup */}
        <div className="bg-brand-primary text-slate-100 p-6 rounded-2xl font-mono text-xs overflow-hidden relative shadow-lg group mb-16 max-w-lg">
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
      </div>

      {/* Latest Articles Row */}
      <section className="mt-4 pt-8 border-t border-slate-200 max-w-[1280px] mx-auto px-4">
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
    </div>
  );
}
