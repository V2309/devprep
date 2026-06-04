'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { User, Mail, Award, Cpu, BookOpen, Clock, Link2, FileText, Check, Save, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '@/types/types';
import { useApp } from '@/context/AppProvider';

export default function ProfileView() {
  const { profile, handleUpdateProfile, showToast, completedQuestionsCount } = useApp();
  const completedCount = completedQuestionsCount;
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  // Local form state
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [role, setRole] = useState(profile.role);
  const [github, setGithub] = useState(profile.github);
  const [bio, setBio] = useState(profile.bio);
  const [avatar, setAvatar] = useState(profile.avatar);
  
  // Custom tech tag selectors
  const techSkillsList = [
    'React', 'Node.js', 'TypeScript', 'System Design', 'Algorithms', 'CSS Grid', 'Redis', 'Security', 'Docker', 'GraphQL'
  ];
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'React', 'TypeScript', 'Algorithms', 'Security'
  ]);

  const handleToggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Họ và tên không được để trống!', 'error');
      return;
    }

    const updated: UserProfile = {
      ...profile,
      name,
      email,
      role,
      github,
      bio,
      avatar
    };

    handleUpdateProfile(updated);
    showToast('Đã lưu thay đổi hồ sơ cá nhân thành công!', 'success');
  };

  const handleReset = () => {
    setName(profile.name);
    setEmail(profile.email);
    setRole(profile.role);
    setGithub(profile.github);
    setBio(profile.bio);
    setAvatar(profile.avatar);
    showToast('Đã khôi phục các giá trị ban đầu!', 'info');
  };

  // Preset avatars for rapid custom selections
  const avatarPresets = [
    { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120', label: 'Tech Female' },
    { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120', label: 'Tech Male 1' },
    { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120', label: 'Tech Male 2' },
    { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120', label: 'Dev Expert' }
  ];

  // Calculated achievements badges
  const badges = [
    { title: 'Tích Cực', desc: 'Có mặt rèn luyện liên tục hơn 10 ngày', icon: <Sparkles className="w-5 h-5 text-amber-500" />, unlocked: profile.streak >= 10 },
    { title: 'Chuyên Gia Cấu Trúc', desc: 'Đã hoàn thành ít nhất 2 bài thuật toán phức tạp', icon: <Cpu className="w-5 h-5 text-indigo-500" />, unlocked: completedCount >= 2 },
    { title: 'Kỹ Sư Trải Nghiệm', desc: 'Sở hữu hơn 250 điểm tích lũy XP rèn luyện', icon: <Award className="w-5 h-5 text-sky-500" />, unlocked: profile.xp >= 250 },
    { title: 'Thợ Săn Kiến Thức', desc: 'Đã lưu trữ tiến độ cá nhân thông suốt', icon: <BookOpen className="w-5 h-5 text-emerald-500" />, unlocked: true }
  ];

  return (
    <div className="animate-fade-in w-full pb-16">
      
      {/* Page Header */}
      <header className="mb-8 max-w-[1280px] mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <div>
          <h1 className="text-2xl md:text-3.5xl font-extrabold text-brand-primary tracking-tight">Hồ Sơ Cá Nhân</h1>
          <p className="text-slate-500 text-sm mt-1">
            Chỉnh sửa thông tin hồ sơ học tập và đồng bộ hóa huy hiệu đạt được cùng các kỹ năng kỹ thuật của bạn.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/dashboard"
            onClick={scrollToTop}
            className="cursor-pointer bg-white border border-slate-205 text-slate-600 hover:border-brand-primary px-4 py-2 rounded-xl text-xs font-bold transition-all"
          >
            Bảng điều khiển
          </Link>
          <Link
            href="/questions"
            onClick={scrollToTop}
            className="cursor-pointer bg-brand-primary text-white hover:bg-slate-800 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow"
          >
            Làm bài tập ngay
          </Link>
        </div>
      </header>

      {/* Profile Setup Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1280px] mx-auto px-4 items-start">
        
        {/* Left column: Summary Stats Card & Preset Avatars */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Main overview statistics badge card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm text-center">
            
            {/* Real Avatar */}
            <div className="relative w-24 h-24 mx-auto mb-4 group">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-brand-primary shadow">
                <img
                  src={avatar}
                  alt={name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 text-white flex items-center justify-center rounded-full text-[10px] font-bold border-2 border-white" title="Đang online">
                ✓
              </span>
            </div>

            <h2 className="font-extrabold text-lg text-brand-primary tracking-tight">{name}</h2>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">{role || 'Lập trình viên tự do'}</p>
            
            {/* XP and streak status info badges */}
            <div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-100 pt-5 text-center">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">TÍCH LŨY</span>
                <span className="text-md font-extrabold text-brand-primary mt-0.5 block">{profile.xp} XP</span>
              </div>
              <div className="border-x border-slate-150">
                <span className="text-[10px] text-slate-400 font-bold block">CHUỖI LIÊN TỤC</span>
                <span className="text-md font-extrabold text-brand-primary mt-0.5 block">🔥 {profile.streak} ngày</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">BÀI ĐÃ GIẢI</span>
                <span className="text-md font-extrabold text-emerald-600 mt-0.5 block">{completedCount} bài</span>
              </div>
            </div>
          </div>

          {/* Quick presets for avatar selections */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-brand-primary" /> Đổi Ảnh Đại Diện
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {avatarPresets.map((preset) => {
                const isSelected = avatar === preset.url;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setAvatar(preset.url);
                      showToast(`Đã đổi sang hình đại diện "${preset.label}"! Hãy lưu để cập nhật.`, 'info');
                    }}
                    className={`relative aspect-square rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-brand-primary scale-105 shadow-md ring-2 ring-sky-500/10' 
                        : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Custom Avatar Link input */}
            <div className="mt-4 space-y-1.5">
              <span className="text-[11px] text-slate-400 font-bold">Hoặc dùng liên kết ảnh tùy chỉnh</span>
              <input
                type="text"
                placeholder="Nhập Unsplash URL..."
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 py-1.5 px-3 text-[11px] font-medium rounded-lg text-slate-700 focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Custom Achievements badges block */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Award className="w-4 h-4 text-brand-primary" /> Huy Hiệu Đạt Được
            </h3>
            <div className="space-y-3">
              {badges.map((badge, idx) => (
                <div 
                  key={idx}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                    badge.unlocked 
                      ? 'bg-slate-50/50 border-slate-150' 
                      : 'bg-slate-50/30 border-slate-100 opacity-40'
                  }`}
                >
                  <div className={`p-2 rounded-xl flex-shrink-0 ${badge.unlocked ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                    {badge.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-brand-primary flex items-center gap-1">
                      {badge.title}
                      {badge.unlocked && <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-100 font-bold">Gặt hái</span>}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug font-medium">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </aside>

        {/* Right column: Edit Details Form & Technical Tags selection */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Main Setup Details form */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-sm font-bold text-slate-805 uppercase tracking-wider mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-primary" /> Chỉnh sửa Hồ sơ cá nhân
            </h3>

            <form onSubmit={handleSave} className="space-y-6">
              
              {/* Form 2 Column fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Full name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Họ và Tên</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Hoàng Minh"
                      className="w-full bg-slate-50 border border-slate-205 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary py-2 pl-10 pr-4 text-xs font-medium rounded-xl text-slate-800 transition-all focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Địa Chỉ Email</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="developer@gmail.com"
                      className="w-full bg-slate-50 border border-slate-205 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary py-2 pl-10 pr-4 text-xs font-medium rounded-xl text-slate-800 transition-all focus:outline-none"
                    />
                  </div>
                </div>

                {/* Job Title / Role */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Vị Trí Công Việc</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Ví dụ: Senior Frontend Engineer"
                    className="w-full bg-slate-50 border border-slate-205 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary py-2 px-4 text-xs font-medium rounded-xl text-slate-800 transition-all focus:outline-none"
                  />
                </div>

                {/* GitHub link */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Liên Kết GitHub</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Link2 className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="https://github.com/hoangminh"
                      className="w-full bg-slate-50 border border-slate-205 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary py-2 pl-10 pr-4 text-xs font-medium rounded-xl text-slate-800 transition-all focus:outline-none"
                    />
                  </div>
                </div>

              </div>

              {/* Bio summary */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Giới Thiệu Bản Thân</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Kể chút về đam mê lập trình của bạn và mục tiêu phỏng vấn vào các tập đoàn lớn..."
                  className="w-full bg-slate-50 border border-slate-205 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary p-4 text-xs font-normal rounded-xl text-slate-800 transition-all min-h-[90px] focus:outline-none"
                />
              </div>

              {/* Tech skill checklist block */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Kỹ Năng Đang Ôn Luyện</label>
                <div className="flex flex-wrap gap-2.5">
                  {techSkillsList.map((skill) => {
                    const isChecked = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleToggleSkill(skill)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 cursor-pointer transition-all ${
                          isChecked 
                            ? 'bg-brand-primary text-white border-brand-primary'
                            : 'bg-white text-slate-500 border-slate-202 hover:text-slate-800'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                        <span>{skill}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form action buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-200"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Khôi phục
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-primary hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                  id="profile_save_btn"
                >
                  <Save className="w-3.5 h-3.5" /> Lưu thay đổi
                </button>
              </div>

            </form>
          </div>

          {/* Detailed summary of achievements */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-sm font-bold text-slate-805 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
              Nhận xét rèn luyện từ Trí Tuệ Nhân Tạo (AI)
            </h3>
            <div className="p-5 bg-sky-50/50 border border-sky-100 rounded-xl flex gap-3.5 items-start">
              <div className="p-2.5 bg-white rounded-xl shadow-sm text-sky-600 flex-shrink-0">
                <Cpu className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-sky-950 uppercase tracking-wider">AI Coach Feedback</h4>
                <p className="text-xs text-sky-850 font-medium leading-relaxed mt-1.5 text-slate-600">
                  Chào {name}! Hiện tại bạn đang thể hiện tư duy vượt bậc ở nhánh <span className="bg-brand-primary text-white px-1.5 py-0.2 rounded font-mono text-[10px]">Frontend</span> với tỷ lệ hoàn thành các bài đố React.memo cực kỳ xuất sắc. Giai đoạn tiếp theo, lời khuyên là bạn nên bổ sung giải thuật con trỏ kép (Cấu trúc dữ liệu &amp; Giải thuật) và làm quen với Leaky Bucket (System Design) để sẵn sàng bức phá vào nhóm ứng viên Senior định hướng thiết kế hệ thống có tính mở rộng cao.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-sky-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-bold text-sky-800 uppercase tracking-widest">Lộ trình đề xuất: Merge Sort ➔ Rate Limiter</span>
                </div>
              </div>
            </div>
          </div>

        </section>

      </div>

    </div>
  );
}
