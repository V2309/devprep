'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Code as CodeIcon, Terminal, Send, ThumbsUp, ArrowLeft, Check, CheckCircle2 } from 'lucide-react';
import { Question, Comment } from '@/types/types';
import { INITIAL_COMMENTS } from '@/lib/data';
import { useApp } from '@/context/AppProvider';

interface QuestionDetailProps {
  question: Question;
}

export default function QuestionDetailView({ question }: QuestionDetailProps) {
  const { handleToggleComplete, showToast } = useApp();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  // Solutions Disclosure State
  const [showSolution, setShowSolution] = useState(false);
  
  // Comments Live State
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [newCommentText, setNewCommentText] = useState('');

  // Post comment handler
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: Comment = {
      id: `live-${Date.now()}`,
      authorName: 'Minh (Bạn)',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
      timestamp: 'Vừa xong',
      text: newCommentText,
      upvotes: 0,
      liked: false
    };

    setComments(prev => [newComment, ...prev]);
    setNewCommentText('');
    showToast('Đã đăng bình luận thảo luận thành công!');
  };

  // Upvote commentator triggers
  const handleLikeComment = (id: string) => {
    setComments(prev => 
      prev.map(c => {
        if (c.id === id) {
          const liked = !c.liked;
          return {
            ...c,
            liked,
            upvotes: liked ? c.upvotes + 1 : c.upvotes - 1
          };
        }
        return c;
      })
    );
  };

  // Difficulty specific styles
  const diffStyles = {
    'Dễ': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Trung bình': 'bg-amber-50 text-amber-700 border-amber-100',
    'Khó': 'bg-rose-50 text-rose-700 border-rose-100'
  }[question.difficulty];

  return (
    <div className="animate-fade-in w-full pb-16">
      
      {/* Top Breadcrumb & Actions Bar */}
      <header className="mb-8 max-w-[1280px] mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <nav className="flex items-center gap-1.5 text-xs text-slate-400">
            <Link href="/" onClick={scrollToTop} className="hover:text-brand-primary cursor-pointer">
              Trang chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href="/questions"
              onClick={scrollToTop}
              className="hover:text-brand-primary cursor-pointer"
            >
              Lộ trình {question.category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-medium truncate max-w-[150px] md:max-w-none">
              {question.title}
            </span>
          </nav>

          <Link
            href="/questions"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-primary cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Quay lại thư viện
          </Link>
        </div>

        {/* Title, Category and Difficulty highlights */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-extrabold text-brand-primary tracking-tight">
              {question.title}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${diffStyles}`}>
                {question.difficulty}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                {question.category}
              </span>
              {question.tags.map(t => (
                <span key={t} className="px-2 py-0.5 bg-slate-50 text-slate-400 text-xs font-mono rounded border border-slate-100">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              handleToggleComplete(question.id);
              showToast(question.completed ? "Đã gỡ trạng thái hoàn thành" : "Đã đánh dấu câu hỏi hoàn thành!");
            }}
            className={`cursor-pointer px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
              question.completed
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-250 hover:bg-emerald-100'
                : 'bg-white border border-slate-205 text-slate-600 hover:border-brand-primary'
            }`}
            id="detail_mark_complete_btn"
          >
            {question.completed ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                Đã hoàn thành
              </>
            ) : (
              'Đánh dấu hoàn thành'
            )}
          </button>
        </div>
      </header>

      {/* Two-Column Grid of Coding Workzone */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1280px] mx-auto px-4 items-start">
        
        {/* Left Column: Problem statement blueprint */}
        <section className="bg-white border border-slate-200/80 p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-md md:text-lg font-bold text-brand-primary">Mô tả vấn đề</h2>
          </div>

          <div className="text-slate-600 text-sm leading-relaxed space-y-4 font-normal">
            <p>{question.description}</p>
            
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider pt-2">Yêu cầu phỏng vấn:</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-500">
              {question.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>

            <div className="p-4 bg-slate-50 border-l-4 border-brand-primary rounded-r-xl my-6">
              <p className="italic text-xs text-slate-500">
                &ldquo;Hiểu sâu sắc kỹ thuật phản xạ là chiếc chìa khóa để kiến thiết nên các giải pháp kỹ thuật có giá trị bền vững và tính mở rộng tuyệt vời.&rdquo;
              </p>
            </div>

            {/* Display Input code mockup */}
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Mô tả cấu trúc:</h3>
            <div className="bg-brand-primary text-slate-300 p-4 rounded-xl font-mono text-xs overflow-x-auto shadow-inner relative max-h-72">
              <pre><code>{question.codeSnippet}</code></pre>
            </div>
          </div>
        </section>

        {/* Right Column: Interactive Solution disclosure terminal */}
        <section className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
            
            {/* Terminal Tab bar */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-100 select-none">
              <div className="flex gap-2 items-center text-slate-600">
                <CodeIcon className="w-4 h-4" />
                <span className="font-semibold text-xs tracking-tight">Giải pháp &amp; Tài liệu</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
              </div>
            </div>

            {/* Terminal Body */}
            <div className="p-8 min-h-[380px] flex flex-col items-center justify-center text-center bg-white" id="solution_box_area">
              {!showSolution ? (
                <motion.div 
                  initial={{ scale: 0.96 }}
                  animate={{ scale: 1 }}
                  className="max-w-sm flex flex-col items-center"
                >
                  <div className="w-16 h-16 bg-slate-55 text-slate-700 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-5 shadow-sm">
                    <Terminal className="w-8 h-8 text-brand-primary" />
                  </div>
                  <h3 className="font-bold text-md text-brand-primary mb-2">Sẵn sàng phân tích giải pháp?</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    Mở khóa đề án giải đáp chuẩn chỉ, bóc tách thuật toán và các mô hình viết code hiệu quả nhất được chấm điểm bởi chuyên gia.
                  </p>
                  <button
                    onClick={() => {
                      setShowSolution(true);
                      showToast("Đã mở khóa tài liệu giải thích phỏng vấn!");
                    }}
                    className="cursor-pointer bg-brand-primary text-white px-8 py-3 rounded-xl font-bold text-xs hover:bg-slate-800 transition-all shadow-md hover:shadow-lg active:scale-95"
                    id="reveal_solution_btn"
                  >
                    Xem lời giải
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full text-left"
                >
                  <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 rounded-xl flex items-start gap-3 border border-emerald-100">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider">Đã hiển thị lời giải chi tiết</h4>
                      <p className="text-[11px] text-emerald-700 mt-1">Lược dịch tư duy và định hướng cách thức thuyết trình trước mặt nhà tuyển dụng.</p>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Tổng quan giải pháp:</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{question.solution.overview}</p>

                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Quy trình thực thi:</h3>
                  <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-500 mb-6 font-normal">
                    {question.solution.steps.map((st, sIdx) => (
                      <li key={sIdx}>{st}</li>
                    ))}
                  </ol>

                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Lời giải đề xuất:</h3>
                  <div className="bg-brand-primary text-slate-300 p-4 rounded-xl font-mono text-xs overflow-x-auto shadow-inner relative max-h-72 mb-4">
                    <pre><code>{question.solution.codeSnippet}</code></pre>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Discussion List & Interactive Chat Area */}
      <section className="mt-12 pt-12 border-t border-slate-200 max-w-[1280px] mx-auto px-4">
        
        {/* Discussion header */}
        <div className="flex items-center justify-between mb-8 select-none">
          <h2 className="font-bold text-lg text-brand-primary flex items-center gap-2">
            <span>Cộng đồng Thảo luận</span>
            <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-100">
              {comments.length} đóng góp
            </span>
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span>Xếp theo:</span>
            <select className="bg-white border border-slate-200 rounded px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer">
              <option>Mới nhất</option>
              <option>Nhiều tương tác</option>
            </select>
          </div>
        </div>

        {/* Dynamic New Comment Box */}
        <form onSubmit={handlePostComment} className="flex gap-4 mb-8">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-100 select-none">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
              alt="My Avatar"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1">
            <textarea
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Chia sẻ giải pháp, thắc mắc hoặc tư duy của bạn về chủ đề này..."
              className="w-full bg-white border border-slate-205 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary p-4 text-xs font-normal rounded-xl text-slate-800 transition-all min-h-[90px]"
              id="comment_textarea"
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                className="cursor-pointer px-5 py-2 bg-brand-primary text-white font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-slate-800 transition-all shadow"
                id="post_comment_btn"
              >
                Gửi bình luận <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        </form>

        {/* Comments Feed Thread */}
        <div className="space-y-4">
          <AnimatePresence>
            {comments.map((c) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-4 p-5 bg-white border border-slate-200/80 rounded-2xl hover:bg-slate-50/50 hover:border-slate-250 transition-all"
                id={`comment_row_${c.id}`}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 flex-shrink-0 select-none">
                  <img
                    src={c.authorAvatar}
                    alt={c.authorName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 justify-between">
                    <span className="font-bold text-xs text-slate-800">{c.authorName}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{c.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{c.text}</p>
                  
                  {/* Interactive upvotes segment */}
                  <div className="flex items-center gap-4 mt-3">
                    <button
                      onClick={() => handleLikeComment(c.id)}
                      className={`cursor-pointer flex items-center gap-1 text-[11px] font-bold transition-all ${
                        c.liked 
                          ? 'text-sky-600 font-bold bg-sky-50 px-2 py-0.5 rounded-full' 
                          : 'text-slate-400 hover:text-brand-primary'
                      }`}
                      id={`comment_like_btn_${c.id}`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${c.liked ? 'fill-current' : ''}`} />
                      <span>{c.upvotes}</span>
                    </button>
                    <button 
                      onClick={() => showToast(`Tính năng bình luận thảo luận đang tải...`)}
                      className="text-slate-400 hover:text-brand-primary text-[11px] font-semibold cursor-pointer"
                    >
                      Trả lời
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Load more button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => showToast("Đang tải thêm bình luận cũ hơn...")}
            className="cursor-pointer px-6 py-2 border border-slate-205 text-slate-500 hover:text-slate-700 font-bold rounded-xl text-xs bg-white hover:bg-slate-50 transition-all select-none"
            id="load_more_comments_btn"
          >
            Tải thêm bình luận
          </button>
        </div>

      </section>

    </div>
  );
}
