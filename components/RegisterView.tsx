'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Mail, Lock, User, UserPlus, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useApp } from '@/context/AppProvider';

export default function RegisterView() {
  const router = useRouter();
  const { handleRegisterSuccess, showToast } = useApp();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      showToast('Vui lòng điền đầy đủ tất cả các trường dữ liệu!', 'error');
      return;
    }

    if (!email.includes('@')) {
      showToast('Vui lòng sử dụng địa chỉ email hợp lệ!', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Mật khẩu của bạn phải có độ dài tối thiểu 6 ký tự!', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Mật khẩu xác nhận không trùng khớp!', 'error');
      return;
    }

    if (!acceptTerms) {
      showToast('Bạn phải chấp nhận Điều khoản dịch vụ và Chính sách bảo mật!', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleRegisterSuccess(email, name);
      showToast(`Đăng ký thành công! Chào bạn thiết kế lộ trình rèn luyện, ${name}`, 'success');
      router.push('/');
      scrollToTop();
    }, 1200);
  };

  return (
    <div className="animate-fade-in w-full py-8 flex items-center justify-center min-h-[70vh]">
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl w-full max-w-md p-8 relative overflow-hidden">
        
        {/* Subtle top decoration */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-sky-600 to-brand-primary" />
        
        {/* Back Link */}
        <Link
          href="/login"
          onClick={scrollToTop}
          className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 text-[11px] font-bold cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Trở lại đăng nhập
        </Link>

        <div className="text-center mt-4 mb-8">
          <Link
            href="/"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 cursor-pointer font-bold text-2xl tracking-tight text-brand-primary select-none mb-3"
            id="register_logo"
          >
            <span className="bg-brand-primary text-white px-2 py-0.5 rounded-lg text-sm font-semibold">AI</span>
            <span>DevPrep</span>
          </Link>
          <h2 className="text-xl font-extrabold text-brand-primary tracking-tight">Tạo tài khoản học viên</h2>
          <p className="text-xs text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
            Tham gia cộng đồng và bước vào lộ trình huấn luyện phỏng vấn kỹ thuật lập trình chất lượng cao.
          </p>
        </div>

        {/* Form elements */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Real Full Name input field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Họ và Tên</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Ví dụ: Hoàng Minh"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary py-2 pl-10 pr-4 text-xs font-medium rounded-xl text-slate-800 transition-all focus:outline-none"
                id="register_name_input"
              />
            </div>
          </div>

          {/* Email input field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Địa Chỉ Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder="dev.prep@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary py-2 pl-10 pr-4 text-xs font-medium rounded-xl text-slate-800 transition-all focus:outline-none"
                id="register_email_input"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Mật Khẩu</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mật khẩu tối thiểu 6 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary py-2 pl-10 pr-10 text-xs font-medium rounded-xl text-slate-800 transition-all focus:outline-none"
                id="register_password_input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Nhập Lại Mật Khẩu</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Trùng khớp mật khẩu trên"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary py-2 pl-10 pr-10 text-xs font-medium rounded-xl text-slate-800 transition-all focus:outline-none"
                id="register_confirm_password_input"
              />
            </div>
          </div>

          {/* Terms Agreement Checkers */}
          <div className="flex items-start mt-2">
            <input
              type="checkbox"
              id="accept_terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer mt-0.5"
            />
            <label htmlFor="accept_terms" className="ml-2 text-[11px] text-slate-500 leading-snug cursor-pointer select-none">
              Tôi hoàn toàn đồng ý và tuân thủ các tài liệu{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); showToast('Đã mở quy chuẩn cộng đồng!', 'info'); }} className="text-brand-primary font-bold hover:underline">Điều khoản sử dụng</a> và{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); showToast('Đã mở tài liệu bảo mật!', 'info'); }} className="text-brand-primary font-bold hover:underline">Chính sách bảo mật của DevPrep AI</a>.
            </label>
          </div>

          {/* Submit register */}
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-gradient-to-r from-emerald-600 to-brand-primary text-white hover:opacity-90 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50 mt-4"
            id="register_submit_btn"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Đăng Ký Tài Khoản</span>
                <UserPlus className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Link back to login options */}
        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Đã có tài khoản từ trước?{' '}
            <Link
              href="/login"
              onClick={scrollToTop}
              className="text-brand-primary font-bold hover:underline"
              id="goto_login_btn"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
