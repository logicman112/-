
import React, { useState, useMemo } from 'react';
import { PHRASES } from '../constants';
import { Phrase } from '../types';
import { generateTTS, decodeBase64, decodeAudioData } from '../services/geminiService';

const PhraseCard: React.FC<{ 
  phrase: Phrase; 
  isFavorite: boolean; 
  onToggleFavorite: (id: string) => void 
}> = ({ phrase, isFavorite, onToggleFavorite }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const play = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    try {
      const audio = await generateTTS(phrase.jp);
      if (audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const decoded = decodeBase64(audio);
        const buffer = await decodeAudioData(decoded, audioCtx);
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.onended = () => setIsPlaying(false);
        source.start();
      } else {
        setIsPlaying(false);
      }
    } catch (e) {
      console.error(e);
      setIsPlaying(false);
    }
  };

  return (
    <div className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-sm mb-4 flex items-center justify-between group hover:border-indigo-200 transition-all animate-fade-in relative overflow-hidden">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
           <span className="text-[10px] font-black text-white bg-indigo-500 px-2.5 py-0.5 rounded-full uppercase tracking-tighter shadow-sm shadow-indigo-100">
            LV.{phrase.level}
          </span>
          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-50 px-2.5 py-0.5 rounded-full">{phrase.category}</span>
        </div>
        <div className="text-xl font-bold text-slate-800 font-jp leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{phrase.jp}</div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-xl">
            [{phrase.phonetic}]
          </span>
          <span className="text-[10px] text-slate-300 italic font-medium tracking-tight">{phrase.romaji}</span>
        </div>
        <div className="text-sm text-slate-500 font-bold">{phrase.kr}</div>
      </div>
      <div className="flex flex-col gap-2 ml-4">
        <button 
          onClick={play}
          disabled={isPlaying}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-lg ${
            isPlaying ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
          } text-white`}
        >
          {isPlaying ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-volume-high"></i>}
        </button>
        <button 
          onClick={() => onToggleFavorite(phrase.id)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${
            isFavorite ? 'bg-amber-100 text-amber-500 shadow-amber-100 shadow-md border border-amber-200' : 'bg-slate-50 text-slate-300 hover:text-amber-400 border border-slate-100'
          }`}
        >
          <i className={`fa-solid fa-star ${isFavorite ? 'scale-110' : ''}`}></i>
        </button>
      </div>
    </div>
  );
};

interface PhraseViewProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

const PhraseView: React.FC<PhraseViewProps> = ({ favorites, onToggleFavorite }) => {
  const [tab, setTab] = useState<'learn' | 'favs'>('learn');
  const [selectedCat, setSelectedCat] = useState<string>('인사');
  const [selectedLevel, setSelectedLevel] = useState<number>(1);

  const categories = ['인사', '식당', '질문', '쇼핑', '미팅', '일상', '여행', '병원', '공항', '호텔'];
  const levels = Array.from({ length: 10 }, (_, i) => i + 1);

  const displayedPhrases = useMemo(() => {
    if (tab === 'favs') {
      return PHRASES.filter(p => favorites.includes(p.id));
    }
    return PHRASES.filter(p => p.category === selectedCat && p.level === selectedLevel);
  }, [tab, selectedCat, selectedLevel, favorites]);

  return (
    <div className="p-4 animate-fade-in">
      <div className="flex bg-slate-100 rounded-2xl p-1.5 mb-6 shadow-inner">
        <button
          onClick={() => setTab('learn')}
          className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${
            tab === 'learn' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400 hover:text-slate-500'
          }`}
        >
          회화 학습
        </button>
        <button
          onClick={() => setTab('favs')}
          className={`flex-1 py-3 text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 ${
            tab === 'favs' ? 'bg-white shadow-md text-amber-500' : 'text-slate-400 hover:text-slate-500'
          }`}
        >
          <i className="fa-solid fa-star text-xs"></i>
          중요 회화
        </button>
      </div>

      {tab === 'learn' && (
        <div className="space-y-6">
          <div className="animate-fade-in">
            <label className="text-[10px] font-black text-slate-400 mb-2 block px-1 uppercase tracking-widest">CATEGORY</label>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-6 py-2.5 rounded-2xl text-sm font-black whitespace-nowrap border-2 transition-all ${
                    selectedCat === cat ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="animate-fade-in">
            <label className="text-[10px] font-black text-slate-400 mb-2 block px-1 uppercase tracking-widest">DIFFICULTY LEVEL</label>
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
              {levels.map(lv => (
                <button
                  key={lv}
                  onClick={() => setSelectedLevel(lv)}
                  className={`min-w-[48px] h-[48px] rounded-2xl flex items-center justify-center text-sm font-black border-2 transition-all ${
                    selectedLevel === lv 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl scale-105' 
                      : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-100'
                  }`}
                >
                  {lv}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 mt-4">
        <div className="flex items-center justify-between px-1 mb-2">
          <h3 className="text-sm font-black text-slate-700">
            {tab === 'favs' ? '나의 중요 회화' : `${selectedCat} - Lv.${selectedLevel}`}
          </h3>
          <span className="text-[11px] text-slate-400 font-black">총 {displayedPhrases.length}개</span>
        </div>
        
        {displayedPhrases.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-50 flex flex-col items-center">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <i className="fa-solid fa-feather-pointed text-3xl text-slate-200"></i>
             </div>
            <p className="text-slate-400 text-sm font-black leading-relaxed">
              {tab === 'favs' ? '별을 눌러 중요한 문장을\n여기에 보관해보세요!' : '이 단계의 문장을 로직이가\n열심히 준비하고 있어요!'}
            </p>
          </div>
        ) : (
          displayedPhrases.map((phrase) => (
            <PhraseCard 
              key={phrase.id} 
              phrase={phrase} 
              isFavorite={favorites.includes(phrase.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PhraseView;
