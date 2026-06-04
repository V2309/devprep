'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppProvider';

export default function LoginView() {
  const router = useRouter();
  const { handleLoginSuccess, showToast } = useApp();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Vui lòng điền đầy đủ email và mật khẩu!', 'error');
      return;
    }

    if (!email.includes('@')) {
      showToast('Email không đúng định dạng!', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const computedName = email.split('@')[0];
      const normalizedName = computedName.charAt(0).toUpperCase() + computedName.slice(1);

      handleLoginSuccess(email, normalizedName);
      showToast(`Đăng nhập thành công! Chào mừng quay trở lại, ${normalizedName}`, 'success');
      router.push('/');
      scrollToTop();
    }, 1000);
  };

  const handleQuickLogin = (presetEmail: string) => {
    setEmail(presetEmail);
    setPassword('demopass123');
  };

  return (
    <div className="animate-fade-in w-full py-8 flex items-center justify-center min-h-[70vh]">
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl w-full max-w-md p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-primary via-blue-500 to-brand-cyan" />

        <div className="text-center mb-8">
          <Link
            href="/"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 cursor-pointer font-bold text-2xl tracking-tight text-brand-primary select-none mb-3"
            id="login_logo"
          >
            <span className="bg-brand-primary text-white px-2 py-0.5 rounded-lg text-sm font-semibold">AI</span>
            <span>DevPrep</span>
          </Link>
          <h2 className="text-xl font-extrabold text-brand-primary tracking-tight">Đăng nhập tài khoản</h2>
          <p className="text-xs text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
            Tiếp tục chinh phục kho tri thức phỏng vấn và rèn luyện tư duy lập trình chuyên sâu.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Email Của Bạn</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-slate-50 border border-slate-200 focus:border-brand-primary rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all"
                id="login_email_input"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Mật Khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 focus:border-brand-primary rounded-xl py-3 pl-10 pr-12 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all"
                id="login_password_input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary hover:bg-slate-800 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow cursor-pointer"
            id="login_submit_btn"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Đăng Nhập</span>
                <LogIn className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Chưa có tài khoản?{' '}
            <Link
              href="/register"
              onClick={scrollToTop}
              className="text-brand-primary font-bold hover:underline"
              id="goto_register_btn"
            >
              Đăng ký ngay bây giờ
            </Link>
          </p>
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2 text-center flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Bản Thử Nghiệm Nhanh
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('minh.dev@gmail.com')}
              className="px-2 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-[10px] text-slate-700 font-bold rounded-lg transition-all text-center cursor-pointer truncate"
              title="Minh Dev (Senior)"
            >
              Minh Dev
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('lananh.fe@gmail.com')}
              className="px-2 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-[10px] text-slate-700 font-bold rounded-lg transition-all text-center cursor-pointer truncate"
              title="Lan Anh (Frontend)"
            >
              Lan Anh
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@devprep.com')}
              className="px-2 py-1.5 bg-rose-55 hover:bg-rose-100 border border-rose-200 text-[10px] text-rose-700 font-extrabold rounded-lg transition-all text-center cursor-pointer truncate"
              title="Tài khoản Quản trị viên (Admin)"
            >
              Admin Acc
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
