'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Bell, Settings, LogOut, User, Award } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onShowNotification: (msg: string) => void;
  avatarUrl?: string;
  isLoggedIn: boolean;
  onLogout: () => void;
  userName?: string;
}

const navItems = [
  { label: 'Trang Chủ', href: '/', key: 'Topics' },
  { label: 'Chủ Đề', href: '/categories', key: 'Categories' },
  { label: 'Thư Viện', href: '/questions', key: 'Questions' },
  { label: 'Bảng Cá Nhân', href: '/dashboard', key: 'Dashboard' },
] as const;

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

export default function Header({
  searchQuery,
  onSearchChange,
  onShowNotification,
  avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
  isLoggedIn,
  onLogout,
  userName,
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const isQuestionsActive =
    pathname === '/questions' || pathname.startsWith('/questions/');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/questions');
    scrollToTop();
  };

  const handleNavClick = () => {
    scrollToTop();
  };

  return (
    <header className="bg-white border-b border-slate-200/85 sticky top-0 z-50 transition-all">
      <div className="flex justify-between items-center px-4 md:px-8 w-full max-w-[1280px] mx-auto h-16">
        <div className="flex items-center gap-8 md:gap-12">
          <Link
            href="/"
            onClick={handleNavClick}
            className="font-bold text-xl md:text-2xl tracking-tight text-brand-primary cursor-pointer flex items-center gap-2 select-none group"
            id="brand_logo"
          >
            <span className="bg-brand-primary text-white px-2 py-0.5 rounded-lg text-sm font-semibold transition-all group-hover:scale-105">
              AI
            </span>
            <span>DevPrep</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : item.href === '/questions'
                    ? isQuestionsActive
                    : pathname === item.href;

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={handleNavClick}
                  className={`font-medium text-sm transition-all pb-1 pt-2 cursor-pointer relative ${
                    isActive
                      ? 'text-brand-primary font-semibold'
                      : 'text-slate-500 hover:text-brand-primary'
                  }`}
                  id={`nav_link_${item.key.toLowerCase()}`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-brand-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (!isQuestionsActive) {
                  router.push('/questions');
                  scrollToTop();
                }
              }}
              placeholder="Tìm kiếm chủ đề hoặc câu hỏi..."
              className="bg-slate-50 border border-slate-200 focus:border-brand-primary rounded-full py-1.5 pl-9 pr-4 text-xs font-medium w-48 lg:w-60 focus:outline-none focus:ring-1 focus:ring-brand-primary/20 transition-all text-slate-800"
              id="global_search_input"
            />
          </form>

          <div className="relative">
            <button
              onClick={() => {
                setShowBellDropdown(!showBellDropdown);
                onShowNotification('Bạn có 2 thông báo mới về lộ trình ôn luyện!');
              }}
              className="p-2 text-slate-500 hover:text-brand-primary hover:bg-slate-100 transition-colors cursor-pointer rounded-full relative"
              id="header_bell_btn"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            </button>

            {showBellDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl py-2 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-slate-100 font-semibold text-xs text-slate-700 flex justify-between items-center">
                  <span>Thông báo gần đây</span>
                  <button
                    onClick={() => setShowBellDropdown(false)}
                    className="text-slate-400 hover:text-slate-600 text-[10px]"
                  >
                    Đóng
                  </button>
                </div>
                <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                  <Link
                    href="/questions"
                    onClick={() => {
                      setShowBellDropdown(false);
                      scrollToTop();
                    }}
                    className="block p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <p className="text-xs font-semibold text-slate-800">
                      🎉 Đóng góp của bạn tăng cao
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Bạn đã duy trì 15 ngày ôn luyện liên tiếp!
                    </p>
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => {
                      setShowBellDropdown(false);
                      scrollToTop();
                    }}
                    className="block p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <p className="text-xs font-semibold text-slate-800">
                      🔥 Đề xuất ôn luyện hôm nay
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Làm mới tư duy thuật toán với thử thách Tree Traversal.
                    </p>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() =>
              onShowNotification('Giao diện cấu hình tài khoản cá nhân & phím tắt')
            }
            className="p-2 text-slate-500 hover:text-brand-primary hover:bg-slate-100 transition-colors cursor-pointer rounded-full"
            id="header_settings_btn"
          >
            <Settings className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-200" />

          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="w-9 h-9 rounded-full overflow-hidden border border-slate-220 hover:border-brand-primary focus:outline-none transition-all cursor-pointer select-none"
                title="Quản lý tài khoản"
                id="header_avatar_btn"
              >
                <img
                  src={avatarUrl}
                  alt={userName || 'Học viên'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2.5 w-52 bg-white rounded-xl border border-slate-200/80 shadow-xl py-1.5 z-50 animate-fade-in text-left">
                  <div className="px-3 py-2 border-b border-slate-100 select-none">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {userName || 'Học viên DevPrep'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 tracking-wide">
                      Developer Account
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => {
                        setShowProfileDropdown(false);
                        scrollToTop();
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-primary transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Hồ sơ cá nhân</span>
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => {
                        setShowProfileDropdown(false);
                        scrollToTop();
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-primary transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Bảng Tiến Độ</span>
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        onLogout();
                        setShowProfileDropdown(false);
                        onShowNotification('Bạn đã đăng xuất tài khoản thành công!');
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                onClick={handleNavClick}
                className="px-3.5 py-1.5 hover:bg-slate-50 text-brand-primary border border-slate-200 hover:border-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                id="header_login_btn"
              >
                Đăng Nhập
              </Link>
              <Link
                href="/register"
                onClick={handleNavClick}
                className="px-3.5 py-1.5 bg-brand-primary hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow cursor-pointer"
                id="header_register_btn"
              >
                Đăng Ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
