'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider, useApp } from '@/context/AppProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Toast from '@/components/Toast';

const AUTH_ROUTES = ['/login', '/register'];

function AppShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { toast, dismissToast, searchQuery, setSearchQuery, showToast, isLoggedIn, handleLogout, profile } =
    useApp();
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col text-brand-primary" id="app_root">
        <AnimatePresence>
          {toast && <Toast message={toast.message} type={toast.type} onClose={dismissToast} />}
        </AnimatePresence>

        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col text-brand-primary" id="app_root">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onShowNotification={(msg) => showToast(msg, 'info')}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        userName={profile.name}
        avatarUrl={profile.avatar}
      />

      <main className="flex-grow pt-8 max-w-[1280px] w-full mx-auto px-4 md:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      <AnimatePresence>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={dismissToast} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <AppShellInner>{children}</AppShellInner>
    </AppProvider>
  );
}
