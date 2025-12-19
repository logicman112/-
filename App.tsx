
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import AlphabetView from './components/AlphabetView';
import PhraseView from './components/PhraseView';
import AITutorView from './components/AITutorView';
import VocabularyView from './components/VocabularyView';
import TodayView from './components/TodayView';
import { ViewType, User } from './types';

const HomeDashboard: React.FC<{ user: User; onNavigate: (v: ViewType) => void; wordFavs: number; phraseFavs: number }> = ({ user, onNavigate, wordFavs, phraseFavs }) => {
  return (
    <div className="animate-fade-in flex flex-col min-h-full pb-12 bg-slate-50/50">
      {/* Premium Hero Section */}
      <div className="relative pt-16 pb-28 px-8 overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-500 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-5%] left-[-10%] w-[350px] h-[350px] bg-violet-400 rounded-full blur-[100px] animate-pulse [animation-delay:2s]"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative mb-12 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-300 to-violet-300 rounded-full blur-3xl opacity-20 scale-150 animate-pulse"></div>
            
            <div className="relative w-40 h-40 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[3.5rem] flex items-center justify-center text-white text-7xl shadow-[0_40px_80px_-15px_rgba(79,70,229,0.5)] animate-[float_4s_ease-in-out_infinite] z-10 border-4 border-white transition-all duration-500 hover:rotate-3 hover:scale-105">
              <i className="fa-solid fa-face-laugh-wink"></i>
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white text-xl shadow-xl border-4 border-white animate-bounce">
                <i className="fa-solid fa-heart"></i>
              </div>
              <div className="absolute -bottom-2 -left-4 w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-white text-lg shadow-lg border-4 border-white animate-[bounce_2s_infinite_1s]">
                <i className="fa-solid fa-star"></i>
              </div>
            </div>
            <div className="w-24 h-4 bg-slate-200/50 rounded-full blur-lg mx-auto mt-10 animate-[shadow_4s_ease-in-out_infinite]"></div>
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl font-[900] text-slate-800 tracking-tight leading-tight">
              기분 좋은 하루예요,<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 inline-block mt-1">
                {user.name}님!
              </span>
            </h2>
            <p className="text-slate-400 font-bold text-base tracking-wide opacity-80">로컬 저장소에 안전하게 저장 중입니다</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-20 mb-12 relative z-20">
        <div className="bg-white/90 backdrop-blur-3xl border border-white rounded-[3.5rem] p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between mb-10 px-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                <i className="fa-solid fa-chart-pie"></i>
              </div>
              <div>
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">My Progress</span>
                <span className="text-lg font-black text-slate-800">학습 리포트</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="relative overflow-hidden bg-slate-50/80 rounded-[2.5rem] p-7 border border-slate-100 group hover:border-indigo-200 hover:bg-white transition-all cursor-pointer shadow-sm hover:shadow-md" onClick={() => onNavigate(ViewType.VOCABULARY)}>
              <span className="block text-[10px] font-black text-indigo-400 uppercase mb-4 tracking-[0.2em] opacity-80">Saved Words</span>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-[1000] text-slate-800 leading-none">{wordFavs}</span>
                <span className="text-sm font-black text-slate-400 mb-1">단어</span>
              </div>
              <div className="absolute -bottom-2 -right-2 opacity-[0.03] group-hover:opacity-[0.08] transition-all group-hover:scale-125 group-hover:-rotate-12">
                <i className="fa-solid fa-book-bookmark text-7xl text-indigo-900"></i>
              </div>
            </div>
            
            <div className="relative overflow-hidden bg-slate-50/80 rounded-[2.5rem] p-7 border border-slate-100 group hover:border-rose-200 hover:bg-white transition-all cursor-pointer shadow-sm hover:shadow-md" onClick={() => onNavigate(ViewType.PHRASES)}>
              <span className="block text-[10px] font-black text-rose-400 uppercase mb-4 tracking-[0.2em] opacity-80">Saved Phrases</span>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-[1000] text-slate-800 leading-none">{phraseFavs}</span>
                <span className="text-sm font-black text-slate-400 mb-1">문장</span>
              </div>
              <div className="absolute -bottom-2 -right-2 opacity-[0.03] group-hover:opacity-[0.08] transition-all group-hover:scale-125 group-hover:-rotate-12">
                <i className="fa-solid fa-comments text-7xl text-rose-900"></i>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigate(ViewType.TODAY)}
            className="w-full mt-10 h-20 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-[2.5rem] font-[900] text-lg shadow-2xl shadow-indigo-200 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-4 group"
          >
            오늘의 학습 미션 시작
            <i className="fa-solid fa-arrow-right-long animate-[bounceX_1.5s_infinite]"></i>
          </button>
        </div>
      </div>

      <div className="px-8 pb-16">
        <div className="flex items-center justify-between mb-10 px-2">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">학습 카테고리</h3>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-200"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {[
            { type: ViewType.ALPHABET, icon: 'fa-font', label: '문자 정복', color: 'indigo', desc: '히라가나/가타카나' },
            { type: ViewType.PHRASES, icon: 'fa-comment-dots', label: '상황 회화', color: 'rose', desc: '실전 상황별 회화' },
            { type: ViewType.VOCABULARY, icon: 'fa-star', label: '단어 박사', color: 'amber', desc: '필수 기초 단어' },
            { type: ViewType.AI_TUTOR, icon: 'fa-robot', label: 'AI 과외', color: 'violet', desc: '로직이와 프리토킹' },
          ].map((item) => (
            <button 
              key={item.type}
              onClick={() => onNavigate(item.type)}
              className="bg-white p-8 rounded-[3rem] border border-slate-100 flex flex-col items-center gap-6 hover:shadow-2xl hover:border-indigo-100 transition-all active:scale-95 group relative overflow-hidden"
            >
              <div className={`w-16 h-16 bg-${item.color}-50 text-${item.color}-500 rounded-3xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm`}>
                <i className={`fa-solid ${item.icon}`}></i>
              </div>
              <div className="text-center relative z-10">
                <div className="font-black text-slate-800 text-base mb-1">{item.label}</div>
                <div className="text-[11px] text-slate-400 font-bold opacity-80">{item.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes bounceX {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(10px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes shadow {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(0.8); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>(ViewType.HOME);
  const [user, setUser] = useState<User>({
    name: '학습자',
    email: 'local@storage.com',
    photo: 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff'
  });
  const [wordFavorites, setWordFavorites] = useState<string[]>([]);
  const [phraseFavorites, setPhraseFavorites] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Load favorites from local storage
    const savedWordFavs = localStorage.getItem('nm_word_favs');
    if (savedWordFavs) setWordFavorites(JSON.parse(savedWordFavs));

    const savedPhraseFavs = localStorage.getItem('nm_phrase_favs');
    if (savedPhraseFavs) setPhraseFavorites(JSON.parse(savedPhraseFavs));
    
    setInitialized(true);
  }, []);

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
      onLogout={() => {}} // Logout functionality removed
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
