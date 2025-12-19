
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import AlphabetView from './components/AlphabetView';
import PhraseView from './components/PhraseView';
import AITutorView from './components/AITutorView';
import VocabularyView from './components/VocabularyView';
import TodayView from './components/TodayView';
import Login from './components/Login';
import { ViewType, User } from './types';

const HomeDashboard: React.FC<{ user: User; onNavigate: (v: ViewType) => void; wordFavs: number; phraseFavs: number }> = ({ user, onNavigate, wordFavs, phraseFavs }) => {
  return (
    <div className="animate-fade-in flex flex-col min-h-full pb-8">
      {/* Premium Hero Section */}
      <div className="relative pt-12 pb-24 px-8 overflow-hidden bg-white">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-500 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-rose-500 rounded-full blur-[80px]"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Animated Logic Character */}
          <div className="relative mb-10 group cursor-pointer">
            <div className="absolute inset-0 bg-indigo-200 rounded-full blur-3xl opacity-30 animate-pulse scale-150"></div>
            
            <div className="w-36 h-36 bg-indigo-600 rounded-[3.5rem] flex items-center justify-center text-white text-6xl shadow-[0_30px_60px_rgba(79,70,229,0.4)] animate-[float_4s_ease-in-out_infinite] relative z-10 border-4 border-white transition-transform group-hover:scale-110">
              <i className="fa-solid fa-face-smile-wink"></i>
              
              {/* Accessory: Floating music notes */}
              <div className="absolute -top-4 -right-2 animate-bounce">
                <i className="fa-solid fa-music text-rose-500 text-xl"></i>
              </div>
            </div>
            
            {/* Dynamic Shadow */}
            <div className="w-20 h-3 bg-slate-200 rounded-full blur-md mx-auto mt-8 opacity-60 animate-[shadow_4s_ease-in-out_infinite]"></div>
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-[900] text-slate-800 tracking-tight leading-tight">
              오늘도 힘내요,<br/>
              <span className="text-indigo-600 inline-block mt-1">{user.name}님!</span>
            </h2>
            <p className="text-slate-400 font-bold text-sm">로직이가 당신의 학습을 응원합니다!</p>
          </div>
        </div>
      </div>

      {/* Premium Stats Grid (Aligned & Sophisticated) */}
      <div className="px-6 -mt-16 mb-10 relative z-20">
        <div className="bg-white/80 backdrop-blur-2xl border border-white rounded-[3rem] p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
              <i className="fa-solid fa-fire-flame-curved"></i>
            </div>
            <span className="text-base font-black text-slate-700">나의 학습 현황</span>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-[2.5rem] p-6 border border-indigo-100/50 shadow-sm flex flex-col items-center group hover:shadow-md transition-all">
              <span className="block text-[10px] font-black text-indigo-400 uppercase mb-3 tracking-widest opacity-80">Saved Words</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-800">{wordFavs}</span>
                <span className="text-xs font-black text-slate-400">개</span>
              </div>
              <div className="mt-4 w-8 h-1 bg-indigo-200 rounded-full opacity-50"></div>
            </div>
            
            <div className="bg-gradient-to-br from-rose-50 to-white rounded-[2.5rem] p-6 border border-rose-100/50 shadow-sm flex flex-col items-center group hover:shadow-md transition-all">
              <span className="block text-[10px] font-black text-rose-400 uppercase mb-3 tracking-widest opacity-80">Saved Phrases</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-800">{phraseFavs}</span>
                <span className="text-xs font-black text-slate-400">개</span>
              </div>
              <div className="mt-4 w-8 h-1 bg-rose-200 rounded-full opacity-50"></div>
            </div>
          </div>

          <button 
            onClick={() => onNavigate(ViewType.TODAY)}
            className="w-full mt-8 h-16 bg-indigo-600 text-white rounded-[2rem] font-black text-base shadow-2xl shadow-indigo-100 active:scale-[0.97] transition-all hover:bg-indigo-700 flex items-center justify-center gap-3 group"
          >
            오늘의 학습 시작하기 <i className="fa-solid fa-arrow-right-long group-hover:translate-x-2 transition-transform"></i>
          </button>
        </div>
      </div>

      {/* Navigation Cards Grid */}
      <div className="px-8 pb-12">
        <h3 className="text-lg font-black text-slate-800 mb-6 px-2">로직이의 학습 도구</h3>
        <div className="grid grid-cols-2 gap-5">
          {[
            { type: ViewType.ALPHABET, icon: 'fa-font', label: '문자 정복', color: 'indigo', desc: '히라가나/가타카나' },
            { type: ViewType.PHRASES, icon: 'fa-comment-dots', label: '상황 회화', color: 'rose', desc: '상황별 100문장' },
            { type: ViewType.VOCABULARY, icon: 'fa-star', label: '나만의 단어', color: 'amber', desc: '암기 필수 단어' },
            { type: ViewType.AI_TUTOR, icon: 'fa-robot', label: 'AI 과외', color: 'violet', desc: '로직이와 프리토킹' },
          ].map((item) => (
            <button 
              key={item.type}
              onClick={() => onNavigate(item.type)}
              className="bg-white p-6 rounded-[2.5rem] border border-slate-50 flex flex-col items-center gap-4 hover:shadow-xl hover:border-indigo-100 transition-all active:scale-95 group"
            >
              <div className={`w-14 h-14 bg-${item.color}-50 text-${item.color}-500 rounded-[1.25rem] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                <i className={`fa-solid ${item.icon}`}></i>
              </div>
              <div className="text-center">
                <div className="font-black text-slate-800 text-sm">{item.label}</div>
                <div className="text-[10px] text-slate-400 font-bold mt-1">{item.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes shadow {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(0.85); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>(ViewType.HOME);
  const [user, setUser] = useState<User | null>(null);
  const [wordFavorites, setWordFavorites] = useState<string[]>([]);
  const [phraseFavorites, setPhraseFavorites] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('nm_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const savedWordFavs = localStorage.getItem('nm_word_favs');
    if (savedWordFavs) setWordFavorites(JSON.parse(savedWordFavs));

    const savedPhraseFavs = localStorage.getItem('nm_phrase_favs');
    if (savedPhraseFavs) setPhraseFavorites(JSON.parse(savedPhraseFavs));
    
    setInitialized(true);
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('nm_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nm_user');
    setActiveView(ViewType.HOME);
  };

  const toggleWordFavorite = (id: string) => {
    const newFavs = wordFavorites.includes(id) 
      ? wordFavorites.filter(f => f !== id) 
      : [...wordFavorites, id];
    setWordFavorites(newFavs);
    localStorage.setItem('nm_word_favs', JSON.stringify(newFavs));
  };

  const togglePhraseFavorite = (id: string) => {
    const newFavs = phraseFavorites.includes(id) 
      ? phraseFavorites.filter(f => f !== id) 
      : [...phraseFavorites, id];
    setPhraseFavorites(newFavs);
    localStorage.setItem('nm_phrase_favs', JSON.stringify(newFavs));
  };

  if (!initialized) return null;

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeView) {
      case ViewType.TODAY:
        return (
          <TodayView 
            user={user}
            wordFavorites={wordFavorites} 
            phraseFavorites={phraseFavorites}
            onToggleWordFavorite={toggleWordFavorite}
            onTogglePhraseFavorite={togglePhraseFavorite}
          />
        );
      case ViewType.ALPHABET:
        return <AlphabetView />;
      case ViewType.PHRASES:
        return <PhraseView favorites={phraseFavorites} onToggleFavorite={togglePhraseFavorite} />;
      case ViewType.VOCABULARY:
        return <VocabularyView favorites={wordFavorites} onToggleFavorite={toggleWordFavorite} />;
      case ViewType.AI_TUTOR:
        return <AITutorView />;
      default:
        return (
          <HomeDashboard 
            user={user} 
            onNavigate={setActiveView} 
            wordFavs={wordFavorites.length}
            phraseFavs={phraseFavorites.length}
          />
        );
    }
  };

  return (
    <Layout 
      activeView={activeView} 
      onNavigate={setActiveView} 
      user={user}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
