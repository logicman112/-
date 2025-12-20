
import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import AlphabetView from './components/AlphabetView';
import PhraseView from './components/PhraseView';
import AITutorView from './components/AITutorView';
import VocabularyView from './components/VocabularyView';
import QuizView from './components/QuizView';
import { ViewType, User, Word, Phrase } from './types';
import { CHAPTER_WORDS, PHRASES } from './constants';
import { playClickSound } from './services/audioService';
import { generateTTS, decode, decodeAudioData } from './services/geminiService';

const getLocalDateStr = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const HomeDashboard: React.FC<{ 
  user: User; 
  onNavigate: (v: ViewType) => void;
  wordFavs: number;
  phraseFavs: number;
}> = ({ user, onNavigate, wordFavs, phraseFavs }) => {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const todayStr = useMemo(() => getLocalDateStr(new Date()), []);

  // 오늘 배울 데이터 선정 (시드 기반 랜덤)
  const dailySelection = useMemo(() => {
    const getHash = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash);
    };
    const seed = getHash(todayStr);
    const selectedWords: Word[] = [];
    const wordPool = [...CHAPTER_WORDS];
    for (let i = 0; i < 3; i++) {
      const idx = (seed + i * 23) % wordPool.length;
      selectedWords.push(wordPool.splice(idx, 1)[0]);
    }
    const phraseIdx = (seed * 11) % PHRASES.length;
    return { words: selectedWords, phrase: PHRASES[phraseIdx] };
  }, [todayStr]);

  useEffect(() => {
    const savedToday = localStorage.getItem(`nm_today_done_${todayStr}`);
    if (savedToday) setCompletedIds(JSON.parse(savedToday));
  }, [todayStr]);

  const toggleComplete = (id: string) => {
    playClickSound();
    const newIds = completedIds.includes(id) ? completedIds.filter(i => i !== id) : [...completedIds, id];
    setCompletedIds(newIds);
    localStorage.setItem(`nm_today_done_${todayStr}`, JSON.stringify(newIds));
  };

  const playTTS = async (text: string, id: string) => {
    playClickSound();
    if (playingId) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    }

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    setPlayingId(id);
    try {
      const audio = await generateTTS(text);
      if (audio && audioContextRef.current) {
        const decoded = decode(audio);
        const buffer = await decodeAudioData(decoded, audioContextRef.current);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => setPlayingId(null);
        source.start();
      } else {
        setPlayingId(null);
      }
    } catch (e) {
      console.error("Audio Playback Error:", e);
      setPlayingId(null);
    }
  };

  const progress = Math.round((completedIds.length / 4) * 100);

  return (
    <div className="animate-fade-in flex flex-col min-h-full pb-12 relative">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-0 left-0 w-full h-[800px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-5%] right-[-10%] w-[600px] h-[600px] bg-indigo-200 rounded-full blur-[140px] drifting opacity-50"></div>
        <div className="absolute top-[30%] left-[-15%] w-[500px] h-[500px] bg-violet-100 rounded-full blur-[120px] drifting opacity-40" style={{ animationDelay: '3s' }}></div>
      </div>

      <header className="pt-16 pb-10 px-8 flex flex-col items-center">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-[1000] text-slate-800 tracking-tight leading-tight">
            오하이요, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{user.name}</span>님!
          </h2>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-slate-400 font-bold text-sm tracking-wide">오늘의 미션을 완료해보세요</p>
          </div>
        </div>
      </header>

      {/* 웅장해진 메인 오늘의 목표 카드 */}
      <div className="px-6 mb-12">
        <div className={`glass-card rounded-[3.5rem] p-10 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.12)] border-b-[12px] transition-all duration-700 ${progress === 100 ? 'border-green-500 bg-green-50/20' : 'border-indigo-600'}`}>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-transform duration-500 ${progress === 100 ? 'bg-green-500 scale-110 rotate-12' : 'bg-indigo-600'}`}>
                <i className={`fa-solid ${progress === 100 ? 'fa-award' : 'fa-fire-alt'} text-xl`}></i>
              </div>
              <div>
                <h3 className="font-[1000] text-slate-800 text-2xl tracking-tight">오늘의 목표</h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Daily Study Plan</span>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-[1000] tracking-tighter ${progress === 100 ? 'text-green-600' : 'text-indigo-600'}`}>
                {progress}<span className="text-lg font-black ml-0.5">%</span>
              </div>
            </div>
          </div>

          {/* 단어 리스트 - 더 크게 */}
          <div className="space-y-6 mb-10">
            {dailySelection.words.map((word) => (
              <div key={word.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-5">
                  <button 
                    onClick={() => toggleComplete(word.id)} 
                    className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 shadow-sm ${completedIds.includes(word.id) ? 'bg-green-500 border-green-500 text-white scale-110' : 'border-slate-100 text-transparent bg-white hover:border-indigo-300'}`}
                  >
                    <i className="fa-solid fa-check text-sm"></i>
                  </button>
                  <div className="flex flex-col">
                    <span className={`text-2xl font-black font-jp tracking-tight transition-all ${completedIds.includes(word.id) ? 'text-slate-300 line-through opacity-60' : 'text-slate-800'}`}>
                      {word.jp}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-black text-indigo-400 bg-indigo-50 px-2 py-0.5 rounded-md">[{word.phonetic}]</span>
                      <span className="text-xs font-bold text-slate-400">{word.kr}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => playTTS(word.jp, word.id)} 
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${playingId === word.id ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-50 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50'}`}
                >
                  <i className={`fa-solid ${playingId === word.id ? 'fa-spinner fa-spin' : 'fa-volume-high'} text-sm`}></i>
                </button>
              </div>
            ))}
          </div>

          {/* 문장 섹션 - 강조된 박스 형태 */}
          <div className={`p-8 rounded-[2.5rem] transition-all duration-500 mb-10 ${completedIds.includes(dailySelection.phrase.id) ? 'bg-green-100/50 border-2 border-green-200' : 'bg-slate-50 border-2 border-transparent hover:border-indigo-100'}`}>
            <div className="flex items-center gap-4 mb-5">
              <button 
                onClick={() => toggleComplete(dailySelection.phrase.id)} 
                className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${completedIds.includes(dailySelection.phrase.id) ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 bg-white text-transparent'}`}
              >
                <i className="fa-solid fa-check text-sm"></i>
              </button>
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-sm">Today's Phrase</span>
            </div>
            
            <div className="space-y-2 mb-6">
              <div className={`text-xl font-[1000] font-jp leading-tight transition-all ${completedIds.includes(dailySelection.phrase.id) ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                {dailySelection.phrase.jp}
              </div>
              <div className="text-sm font-black text-indigo-600/70">[{dailySelection.phrase.phonetic}]</div>
              <div className="text-sm font-bold text-slate-400">{dailySelection.phrase.kr}</div>
            </div>

            <button 
              onClick={() => playTTS(dailySelection.phrase.jp, dailySelection.phrase.id)} 
              className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 border border-indigo-50"
            >
              <i className="fa-solid fa-volume-high"></i>
              문장 전체 발음 듣기
            </button>
          </div>
          
          {/* 하단 진행바 - 더 굵게 */}
          <div className="relative pt-2">
            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-2 px-1">
              <span>Mission Status</span>
              <span>{completedIds.length} / 4 Done</span>
            </div>
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className={`h-full transition-all duration-1000 ease-out relative ${progress === 100 ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-indigo-500 to-indigo-700'}`} 
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] skew-x-12"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Menu */}
      <div className="px-8 grid grid-cols-2 gap-5">
        {[
          { type: ViewType.PHRASES, icon: 'fa-comments', label: '상황 회화', color: 'rose', sub: '상황별 리얼 일본어' },
          { type: ViewType.QUIZ, icon: 'fa-circle-question', label: '무한 퀴즈', color: 'green', sub: '지루할 틈 없는 퀴즈' },
          { type: ViewType.ALPHABET, icon: 'fa-spell-check', label: '문자 정복', color: 'indigo', sub: '기초부터 탄탄하게' },
          { type: ViewType.AI_TUTOR, icon: 'fa-user-astronaut', label: 'AI 과외', color: 'violet', sub: '로직이와 대화하기' },
        ].map((item) => (
          <button 
            key={item.type}
            onClick={() => onNavigate(item.type)}
            className="bg-white p-7 rounded-[2.8rem] border border-slate-100 flex flex-col items-start gap-4 hover:shadow-2xl hover:-translate-y-1 transition-all group relative overflow-hidden"
          >
            <div className={`w-14 h-14 bg-${item.color}-50 text-${item.color}-600 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500`}>
              <i className={`fa-solid ${item.icon}`}></i>
            </div>
            <div className="text-left">
              <div className="font-[1000] text-slate-800 text-lg leading-none mb-1">{item.label}</div>
              <div className="text-[10px] text-slate-400 font-bold">{item.sub}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Stats Section */}
      <div className="px-8 mt-12 pb-10">
        <div className="bg-slate-900 text-white p-8 rounded-[3rem] flex items-center justify-between overflow-hidden relative shadow-2xl">
          <div className="relative z-10">
            <div className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em] mb-2">Learning Progress</div>
            <div className="text-2xl font-[1000]">학습 보관함</div>
          </div>
          <div className="flex gap-6 relative z-10">
             <div className="text-center">
                <div className="text-3xl font-[1000] text-rose-400">{phraseFavs}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase">Phrases</div>
             </div>
             <div className="text-center">
                <div className="text-3xl font-[1000] text-amber-400">{wordFavs}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase">Words</div>
             </div>
          </div>
          <div className="absolute -bottom-6 -right-4 text-9xl text-white/5 rotate-12 pointer-events-none">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
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
      case ViewType.ALPHABET:
        return <AlphabetView />;
      case ViewType.PHRASES:
        return <PhraseView favorites={phraseFavorites} onToggleFavorite={togglePhraseFavorite} />;
      case ViewType.VOCABULARY:
        return <VocabularyView favorites={wordFavorites} onToggleFavorite={toggleWordFavorite} />;
      case ViewType.AI_TUTOR:
        return <AITutorView />;
      case ViewType.QUIZ:
        return <QuizView />;
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
      onLogout={() => {}} 
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
