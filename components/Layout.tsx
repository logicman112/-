
import React from 'react';
import { ViewType, User } from '../types';
import { playClickSound } from '../services/audioService';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewType;
  onNavigate: (view: ViewType) => void;
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate, user, onLogout }) => {
  const navItems = [
    { type: ViewType.HOME, icon: 'fa-house', label: '홈' },
    { type: ViewType.TODAY, icon: 'fa-calendar-check', label: '오늘' },
    { type: ViewType.ALPHABET, icon: 'fa-font', label: '문자' },
    { type: ViewType.PHRASES, icon: 'fa-comment-dots', label: '회화' },
    { type: ViewType.VOCABULARY, icon: 'fa-star', label: '단어장' },
    { type: ViewType.AI_TUTOR, icon: 'fa-robot', label: 'AI 튜터' },
  ];

  const handleNavClick = (view: ViewType) => {
    playClickSound();
    onNavigate(view);
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white shadow-2xl relative overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 p-4 sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm shadow-md">
            <i className="fa-solid fa-language"></i>
          </div>
          <h1 className="text-lg font-black text-gray-800 tracking-tight">로직이의 쉬운일본어</h1>
        </div>
        {user && (
          <button onClick={() => { playClickSound(); onLogout(); }} className="flex items-center gap-2 group">
            <img src={user.photo} className="w-8 h-8 rounded-full border border-gray-200" alt="Profile" />
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 bg-gray-50/50">
        {children}
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-lg border-t border-gray-100 flex justify-around p-2 z-20 pb-6">
        {navItems.map((item) => (
          <button
            key={item.type}
            onClick={() => handleNavClick(item.type)}
            className={`flex flex-col items-center p-2 rounded-2xl transition-all ${
              activeView === item.type ? 'text-indigo-600 bg-indigo-50 shadow-inner scale-105' : 'text-gray-400 hover:text-indigo-400'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-lg mb-1`}></i>
            <span className="text-[9px] font-black uppercase">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
