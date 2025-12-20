
import React, { useState, useMemo, useRef } from 'react';
import { PHRASES } from '../constants';
import { Phrase } from '../types';
import { generateTTS, decode, decodeAudioData } from '../services/geminiService';
import { playClickSound } from '../services/audioService';

const PhraseCard: React.FC<{ 
  phrase: Phrase; 
  isFavorite: boolean; 
  onToggleFavorite: (id: string) => void;
  audioCtx: AudioContext | null;
}> = ({ phrase, isFavorite, onToggleFavorite, audioCtx }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const play = async () => {
    playClickSound();
    if (isPlaying) return;
    
    if (audioCtx) {
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }
    }

    setIsPlaying(true);
    try {
      const audioBase64 = await generateTTS(phrase.jp);
      if (audioBase64 && audioCtx) {
        const decoded = decode(audioBase64);
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
      console.error("Audio Playback Error:", e);
      setIsPlaying(false);
    }
  };

  return (
    <div className="bg-white border border-slate-100 p-7 rounded-[2.8rem] shadow-sm mb-4 flex items-center justify-between group hover:border-indigo-200 transition-all animate-fade-in">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase">Lv.{phrase.level}</span>
          <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{phrase.category}</span>
        </div>
        <div className="text-2xl font-black text-slate-800 font-jp leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{phrase.jp}</div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50/50 px-3 py-1 rounded-lg">[{phrase.phonetic}]</span>
        </div>
        <div className="text-sm text-slate-400 font-bold">{phrase.kr}</div>
      </div>
      <div className="flex flex-col gap-3 ml-4">
        <button 
          onClick={play}
          disabled={isPlaying}
          className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center transition-all active:scale-90 shadow-md ${
            isPlaying ? 'bg-indigo-400' : 'bg-indigo-600 text-white'
          }`}
        >
          {isPlaying ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-volume-high"></i>}
        </button>
        <button 
          onClick={() => { playClickSound(); onToggleFavorite(phrase.id); }}
          className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center transition-all active:scale-90 shadow-sm border ${
            isFavorite ? 'bg-amber-50 text-amber-500 border-amber-200' : 'bg-white text-slate-100 border-slate-100'
          }`}
        >
          <i className={`fa-solid fa-star ${isFavorite ? 'text-amber-400' : ''}`}></i>
        </button>
      </div>
    </div>
  );
};

const PhraseView: React.FC<{ favorites: string[]; onToggleFavorite: (id: string) => void }> = ({ favorites, onToggleFavorite }) => {
  const [tab, setTab] = useState<'learn' | 'favs'>('learn');
  const [selectedCat, setSelectedCat] = useState<string>('인사');
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const audioContextRef = useRef<AudioContext | null>(null);

  const categories = ['인사', '식당', '질문', '쇼핑', '미팅', '일상', '여행', '병원', '공항', '호텔'];
  const levels = Array.from({ length: 10 }, (_, i) => i + 1);

  const displayedPhrases = useMemo(() => {
    if (tab === 'favs') {
      return PHRASES.filter(p => favorites.includes(p.id));
    }
    return PHRASES.filter(p => p.category === selectedCat && p.level === selectedLevel);
  }, [tab, selectedCat, selectedLevel, favorites]);

  const handleTabChange = (newTab: 'learn' | 'favs') => {
    playClickSound();
    setTab(newTab);
  };

  // Lazy initialize AudioContext
  const getAudioCtx = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    }
    return audioContextRef.current;
  };

  return (
    <div className="p-4 animate-fade-in pb-28 bg-[#f8fafc]">
      <div className="flex bg-slate-100 rounded-[2.5rem] p-1.5 mb-8 shadow-inner">
        <button onClick={() => handleTabChange('learn')} className={`flex-1 py-4 text-sm font-black rounded-[2rem] transition-all ${tab === 'learn' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400'}`}>회화 학습</button>
        <button onClick={() => handleTabChange('favs')} className={`flex-1 py-4 text-sm font-black rounded-[2rem] transition-all flex items-center justify-center gap-2 ${tab === 'favs' ? 'bg-white shadow-md text-amber-500' : 'text-slate-400'}`}><i className="fa-solid fa-star text-xs"></i> 중요 회화</button>
      </div>

      {tab === 'learn' && (
        <div className="space-y-8 mb-8">
          <div>
            <label className="text-[10px] font-black text-slate-400 mb-3 block px-4 uppercase tracking-[0.2em]">Category</label>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
              {categories.map(cat => (
                <button key={cat} onClick={() => { playClickSound(); setSelectedCat(cat); }} className={`px-6 py-3.5 rounded-[1.8rem] text-sm font-black whitespace-nowrap border-2 transition-all ${selectedCat === cat ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}>{cat}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 mb-3 block px-4 uppercase tracking-[0.2em]">Level</label>
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar px-1">
              {levels.map(lv => (
                <button key={lv} onClick={() => { playClickSound(); setSelectedLevel(lv); }} className={`min-w-[54px] h-[54px] rounded-[1.8rem] flex items-center justify-center text-sm font-black border-2 transition-all ${selectedLevel === lv ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}>{lv}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {displayedPhrases.map(p => <PhraseCard key={p.id} phrase={p} isFavorite={favorites.includes(p.id)} onToggleFavorite={onToggleFavorite} audioCtx={getAudioCtx()} />)}
      </div>
    </div>
  );
};

export default PhraseView;
