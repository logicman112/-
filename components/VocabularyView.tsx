
import React, { useState, useMemo } from 'react';
import { CHAPTER_WORDS } from '../constants';
import { Word } from '../types';
import { generateTTS, decodeBase64, decodeAudioData } from '../services/geminiService';

interface VocabularyViewProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

const VocabularyView: React.FC<VocabularyViewProps> = ({ favorites, onToggleFavorite }) => {
  const [tab, setTab] = useState<'chapters' | 'favorites'>('chapters');
  const [currentChapter, setCurrentChapter] = useState(1);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // 현재 데이터에 있는 챕터 수만큼 표시 (동적으로 계산 가능하지만 명시적으로 10챕터 설정)
  const chapters = Array.from({ length: 10 }, (_, i) => i + 1);

  const displayedWords = useMemo(() => {
    if (tab === 'favorites') {
      return CHAPTER_WORDS.filter(w => favorites.includes(w.id));
    }
    return CHAPTER_WORDS.filter(w => w.chapter === currentChapter);
  }, [tab, currentChapter, favorites]);

  const playTTS = async (text: string, id: string) => {
    if (playingId) return;
    setPlayingId(id);
    try {
      const audio = await generateTTS(text);
      if (audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const decoded = decodeBase64(audio);
        const buffer = await decodeAudioData(decoded, audioCtx);
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.onended = () => setPlayingId(null);
        source.start();
      } else {
        setPlayingId(null);
      }
    } catch (e) {
      setPlayingId(null);
    }
  };

  return (
    <div className="p-4 animate-fade-in">
      <div className="flex bg-slate-100 rounded-2xl p-1.5 mb-6 shadow-inner">
        <button
          onClick={() => setTab('chapters')}
          className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${
            tab === 'chapters' ? 'bg-white shadow text-indigo-600' : 'text-slate-400'
          }`}
        >
          챕터별 단어
        </button>
        <button
          onClick={() => setTab('favorites')}
          className={`flex-1 py-3 text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 ${
            tab === 'favorites' ? 'bg-white shadow text-amber-500' : 'text-slate-400'
          }`}
        >
          <i className="fa-solid fa-star text-xs"></i>
          중요 단어
        </button>
      </div>

      {tab === 'chapters' && (
        <div className="mb-6">
          <label className="text-[10px] font-black text-slate-400 mb-2 block px-1 uppercase tracking-widest">CHAPTER SELECT</label>
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            {chapters.map(ch => (
              <button
                key={ch}
                onClick={() => setCurrentChapter(ch)}
                className={`min-w-[60px] h-[60px] rounded-[1.5rem] flex items-center justify-center text-sm font-black border-2 transition-all ${
                  currentChapter === ch 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl scale-105' 
                    : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-100'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
          <div className="mt-2 px-6 py-5 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-3xl border border-indigo-100 flex items-center justify-between shadow-sm">
            <div>
              <span className="block text-xs font-black text-indigo-600 uppercase mb-1">Chapter {currentChapter}</span>
              <span className="text-sm text-slate-700 font-bold">주제별 필수 단어 학습</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-indigo-400 font-black block">PROGRESS</span>
              <span className="text-xs text-indigo-600 font-black">{displayedWords.length} Words</span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {displayedWords.length === 0 ? (
          <div className="text-center py-28 bg-white rounded-[3rem] border-4 border-dashed border-slate-50 flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <i className="fa-solid fa-book-open text-3xl text-slate-200"></i>
            </div>
            <p className="text-slate-400 text-sm font-black leading-relaxed">
              {tab === 'favorites' ? '별표를 눌러 저장한\n단어가 아직 없어요.' : `Chapter ${currentChapter} 단어를\n곧 채워드릴게요!`}
            </p>
          </div>
        ) : (
          displayedWords.map((word) => (
            <div key={word.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all animate-fade-in">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-black text-slate-800 font-jp leading-none group-hover:text-indigo-600 transition-colors">{word.jp}</span>
                  <span className="text-xs font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-xl shadow-sm shadow-indigo-50">
                    [{word.phonetic}]
                  </span>
                </div>
                <div className="text-sm text-slate-500 font-bold ml-1">{word.kr}</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => playTTS(word.jp, word.id)}
                  disabled={!!playingId && playingId === word.id}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-lg ${
                    playingId === word.id ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-300 hover:text-indigo-600 border border-slate-100'
                  }`}
                >
                  {playingId === word.id ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-volume-high text-sm"></i>}
                </button>
                <button
                  onClick={() => onToggleFavorite(word.id)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-md border ${
                    favorites.includes(word.id) ? 'bg-amber-100 text-amber-500 border-amber-200 shadow-amber-50' : 'bg-slate-50 text-slate-300 border-slate-100 hover:text-amber-400'
                  }`}
                >
                  <i className={`fa-solid fa-star ${favorites.includes(word.id) ? 'scale-110' : ''}`}></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VocabularyView;
