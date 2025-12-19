
import React, { useState, useMemo } from 'react';
import { CHAPTER_WORDS } from '../constants';
import { Word } from '../types';
import { generateTTS, decode, decodeAudioData } from '../services/geminiService';
import { playClickSound } from '../services/audioService';

interface VocabularyViewProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

const VocabularyView: React.FC<VocabularyViewProps> = ({ favorites, onToggleFavorite }) => {
  const [tab, setTab] = useState<'study' | 'favorites'>('study');
  const [selectedCat, setSelectedCat] = useState<string>('기초 명사');
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const categories = ['기초 명사', '일상 동사', '필수 형용사', '여행/생활', '비즈니스/사회'];
  const levels = Array.from({ length: 5 }, (_, i) => i + 1); // 레벨 1~5로 제한

  const displayedWords = useMemo(() => {
    if (tab === 'favorites') {
      return CHAPTER_WORDS.filter(w => favorites.includes(w.id));
    }
    return CHAPTER_WORDS.filter(w => w.category === selectedCat && w.level === selectedLevel);
  }, [tab, selectedCat, selectedLevel, favorites]);

  const playTTS = async (text: string, id: string) => {
    playClickSound();
    if (playingId) return;
    setPlayingId(id);
    try {
      const audio = await generateTTS(text);
      if (audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
        const decoded = decode(audio);
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

  const handleTabChange = (newTab: 'study' | 'favorites') => {
    playClickSound();
    setTab(newTab);
  };

  const handleCatChange = (cat: string) => {
    playClickSound();
    setSelectedCat(cat);
  };

  const handleLevelChange = (lv: number) => {
    playClickSound();
    setSelectedLevel(lv);
  };

  return (
    <div className="p-4 animate-fade-in pb-28 bg-[#f8fafc]">
      <div className="flex bg-slate-100 rounded-[2.5rem] p-1.5 mb-8 shadow-inner">
        <button
          onClick={() => handleTabChange('study')}
          className={`flex-1 py-4 text-sm font-black rounded-[2rem] transition-all ${
            tab === 'study' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400'
          }`}
        >
          카테고리 학습
        </button>
        <button
          onClick={() => handleTabChange('favorites')}
          className={`flex-1 py-4 text-sm font-black rounded-[2rem] transition-all flex items-center justify-center gap-2 ${
            tab === 'favorites' ? 'bg-white shadow-md text-amber-500' : 'text-slate-400'
          }`}
        >
          <i className="fa-solid fa-star text-xs"></i>
          중요 단어장
        </button>
      </div>

      {tab === 'study' && (
        <div className="space-y-8 mb-8">
          <div>
            <label className="text-[10px] font-black text-slate-400 mb-3 block px-4 uppercase tracking-[0.2em]">Select Category</label>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCatChange(cat)}
                  className={`px-6 py-3.5 rounded-[1.8rem] text-sm font-black whitespace-nowrap border-2 transition-all ${
                    selectedCat === cat ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 mb-3 block px-4 uppercase tracking-[0.2em]">Level Selector</label>
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar px-1">
              {levels.map(lv => (
                <button
                  key={lv}
                  onClick={() => handleLevelChange(lv)}
                  className={`min-w-[54px] h-[54px] rounded-[1.8rem] flex items-center justify-center text-sm font-black border-2 transition-all ${
                    selectedLevel === lv 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-110 z-10' 
                      : 'bg-white border-slate-100 text-slate-400 shadow-sm'
                  }`}
                >
                  {lv}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-3 mb-6">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">학습 단어 리스트</h3>
        <span className="text-[10px] text-indigo-500 font-black bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">총 {displayedWords.length}개</span>
      </div>

      <div className="space-y-4">
        {displayedWords.map((word) => (
          <div key={word.id} className="bg-white p-6 rounded-[2.8rem] border border-slate-100 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.03)] flex items-center justify-between group hover:border-indigo-200 transition-all animate-fade-in">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-black text-slate-800 font-jp leading-none group-hover:text-indigo-600 transition-colors">
                  {word.jp}
                </span>
                <span className="text-[10px] font-black text-indigo-500 bg-indigo-50/50 border border-indigo-100 px-3 py-1.5 rounded-xl shadow-sm">
                  [{word.phonetic}]
                </span>
              </div>
              <div className="text-sm text-slate-400 font-bold ml-1">{word.kr}</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => playTTS(word.jp, word.id)}
                disabled={!!playingId && playingId === word.id}
                className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center transition-all active:scale-90 shadow-sm border ${
                  playingId === word.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-300 hover:text-indigo-600 border-slate-100'
                }`}
              >
                {playingId === word.id ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-volume-high text-sm"></i>}
              </button>
              <button
                onClick={() => { playClickSound(); onToggleFavorite(word.id); }}
                className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center transition-all active:scale-90 shadow-sm border ${
                  favorites.includes(word.id) ? 'bg-amber-50 text-amber-500 border-amber-200' : 'bg-white text-slate-100 border-slate-100'
                }`}
              >
                <i className={`fa-solid fa-star text-sm ${favorites.includes(word.id) ? 'text-amber-400' : ''}`}></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VocabularyView;
