'use client';

import { useApp } from '@/context/AppProvider';

export default function Footer() {
  const { showToast } = useApp();

  return (
    <footer className="bg-white border-t border-slate-200 mt-20 py-8 text-slate-500">
      <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-bold text-sm text-brand-primary tracking-tight">AI DevPrep</span>
          <p className="text-slate-400 font-normal">
            © 2026 DevPrep AI. Built for structural confidence.
          </p>
        </div>

        <div className="flex gap-6 text-slate-400 font-medium">
          <button
            onClick={() => showToast('Hệ thống Điều khoản dịch vụ', 'info')}
            className="hover:text-brand-primary cursor-pointer"
          >
            Terms of Service
          </button>
          <button
            onClick={() => showToast('Chính sách bảo mật thông tin', 'info')}
            className="hover:text-brand-primary cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => showToast('Liên hệ Bộ phận trợ giúp kỹ thuật', 'info')}
            className="hover:text-brand-primary cursor-pointer"
          >
            Contact Support
          </button>
          <button
            onClick={() => showToast('API khai thác tài liệu & hệ thống', 'info')}
            className="hover:text-brand-primary cursor-pointer"
          >
            API Docs
          </button>
        </div>
      </div>
    </footer>
  );
}
