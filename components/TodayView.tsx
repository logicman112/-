
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CHAPTER_WORDS, PHRASES } from '../constants';
import { Word, Phrase, User } from '../types';
import { generateTTS, decode, decodeAudioData } from '../services/geminiService';
import { playClickSound } from '../services/audioService';

const getLocalDateStr = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Calendar: React.FC<{ completionHistory: string[] }> = ({ completionHistory }) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const isCompleted = (day: number) => {
    const targetDate = new Date(year, month, day);
    const dateStr = getLocalDateStr(targetDate);
    return completionHistory.includes(dateStr);
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-4 px-2">
        <h4 className="text-sm font-black text-slate-700">{month + 1}월 학습 현황</h4>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-[10px] font-black text-slate-400">학습 완료</span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {['일', '월', '화', '수', '목', '금', '토'].map(d => (
          <div key={d} className="text-[10px] font-black text-slate-300 py-2">{d}</div>
        ))}
        {blanks.map(b => <div key={`b-${b}`} className="aspect-square"></div>)}
        {days.map(d => (
          <div key={d} className={`aspect-square flex items-center justify-center text-xs font-black rounded-xl transition-all relative ${isCompleted(d) ? 'bg-green-500 text-white shadow-md' : 'text-slate-400'}`}>
            {d}
          </div>
        ))}
      </div>
    </div>
  );
};

interface TodayViewProps {
  user: User;
  wordFavorites: string[];
  phraseFavorites: string[];
  onToggleWordFavorite: (id: string) => void;
  onTogglePhraseFavorite: (id: string) => void;
}

const TodayView: React.FC<TodayViewProps> = ({ user, wordFavorites, phraseFavorites, onToggleWordFavorite, onTogglePhraseFavorite }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [completionHistory, setCompletionHistory] = useState<string[]>([]);
  const todayStr = useMemo(() => getLocalDateStr(new Date()), []);
  const audioContextRef = useRef<AudioContext | null>(null);

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
    const savedHistory = localStorage.getItem('nm_completion_history');
    if (savedHistory) setCompletionHistory(JSON.parse(savedHistory));
  }, [todayStr]);

  useEffect(() => {
    if (completedIds.length === 4 && !completionHistory.includes(todayStr)) {
      const newHistory = [...completionHistory, todayStr];
      setCompletionHistory(newHistory);
      localStorage.setItem('nm_completion_history', JSON.stringify(newHistory));
    }
  }, [completedIds, todayStr, completionHistory]);

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
    <div className="p-6 animate-fade-in space-y-8 bg-slate-50/50 min-h-full">
      <div className="flex items-end justify-between">
        <div>
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1 block">Daily Mission</span>
          <h2 className="text-3xl font-[900] text-slate-800">오늘의 학습</h2>
        </div>
      </div>

      <div className={`rounded-[2.5rem] p-7 text-white shadow-2xl flex items-center justify-between relative overflow-hidden transition-all duration-700 ${completedIds.length === 4 ? 'bg-green-500 shadow-green-100' : 'bg-indigo-600 shadow-indigo-100'}`}>
        <div className="relative z-10">
          <h3 className="text-xl font-black mb-1">{completedIds.length === 4 ? 'Mission Clear!' : '오늘의 목표'}</h3>
          <p className="text-indigo-100 text-xs font-bold">실제 단어 3개와 문장 1개를 학습하세요.</p>
        </div>
        <div className="w-20 h-20 rounded-full border-8 border-white/20 flex items-center justify-center relative z-10">
          <span className="text-2xl font-black">{progress}%</span>
        </div>
      </div>

      <section className="space-y-4">
        <h4 className="text-sm font-black text-slate-500 px-2 uppercase tracking-widest">Words of the Day</h4>
        {dailySelection.words.map((word) => (
          <div key={word.id} className={`bg-white p-5 rounded-[2.5rem] border transition-all flex items-center justify-between shadow-sm ${completedIds.includes(word.id) ? 'border-green-100 bg-green-50/30' : 'border-slate-100'}`}>
            <div className="flex items-center gap-4 flex-1">
              <button onClick={() => toggleComplete(word.id)} className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all ${completedIds.includes(word.id) ? 'bg-green-500 border-green-500 text-white' : 'border-slate-100 text-transparent'}`}><i className="fa-solid fa-check"></i></button>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xl font-black font-jp ${completedIds.includes(word.id) ? 'text-green-600 opacity-40 line-through' : 'text-slate-800'}`}>{word.jp}</span>
                  <span className="text-[10px] font-black text-indigo-400 bg-indigo-50/50 px-2 py-1 rounded-lg">[{word.phonetic}]</span>
                </div>
                <div className="text-xs font-bold text-slate-400">{word.kr}</div>
              </div>
            </div>
            <div className="flex gap-2">
               <button onClick={() => playTTS(word.jp, word.id)} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-300 flex items-center justify-center hover:text-indigo-600 transition-colors"><i className="fa-solid fa-volume-high text-xs"></i></button>
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h4 className="text-sm font-black text-slate-500 px-2 uppercase tracking-widest">Sentence of the Day</h4>
        <div className={`p-7 rounded-[3rem] border transition-all shadow-sm ${completedIds.includes(dailySelection.phrase.id) ? 'bg-green-50 border-green-200' : 'bg-white border-slate-100'}`}>
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] font-black bg-indigo-600 text-white px-4 py-1.5 rounded-full uppercase">Lv.{dailySelection.phrase.level} · {dailySelection.phrase.category}</span>
            <button onClick={() => toggleComplete(dailySelection.phrase.id)} className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 ${completedIds.includes(dailySelection.phrase.id) ? 'bg-green-500 border-green-500 text-white' : 'border-slate-100 text-transparent'}`}><i className="fa-solid fa-check text-lg"></i></button>
          </div>
          <div className={`text-2xl font-black font-jp mb-3 ${completedIds.includes(dailySelection.phrase.id) ? 'text-green-600 opacity-40 line-through' : 'text-slate-800'}`}>{dailySelection.phrase.jp}</div>
          <div className="text-sm font-black text-indigo-500 mb-2">[{dailySelection.phrase.phonetic}]</div>
          <div className="text-base font-bold text-slate-400 mb-8">{dailySelection.phrase.kr}</div>
          <button onClick={() => playTTS(dailySelection.phrase.jp, dailySelection.phrase.id)} className="w-full py-4.5 bg-indigo-600 text-white rounded-[1.8rem] font-black text-sm shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95 transition-all">
            <i className="fa-solid fa-volume-high"></i> 발음 듣기
          </button>
        </div>
      </section>

      <Calendar completionHistory={completionHistory} />
    </div>
  );
};

export default TodayView;
