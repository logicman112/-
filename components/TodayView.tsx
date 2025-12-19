
import React, { useState, useMemo, useEffect } from 'react';
import { CHAPTER_WORDS, PHRASES } from '../constants';
import { Word, Phrase, User } from '../types';
import { generateTTS, decodeBase64, decodeAudioData } from '../services/geminiService';

interface TodayViewProps {
  user: User;
  wordFavorites: string[];
  phraseFavorites: string[];
  onToggleWordFavorite: (id: string) => void;
  onTogglePhraseFavorite: (id: string) => void;
}

// 헬퍼 함수: 로컬 기준 YYYY-MM-DD 문자열 생성
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

  const isToday = (day: number) => {
    return day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-4 px-2">
        <h4 className="text-sm font-black text-slate-700">{month + 1}월 학습 캘린더</h4>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-[10px] font-black text-slate-400">학습 완료</span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {['일', '월', '화', '수', '목', '금', '토'].map(d => (
          <div key={d} className="text-[10px] font-black text-slate-300 py-2">{d}</div>
        ))}
        {blanks.map(b => (
          <div key={`b-${b}`} className="aspect-square"></div>
        ))}
        {days.map(d => {
          const completed = isCompleted(d);
          const today = isToday(d);
          return (
            <div 
              key={d} 
              className={`aspect-square flex items-center justify-center text-xs font-black rounded-xl transition-all relative ${
                completed 
                  ? 'bg-green-500 text-white shadow-md shadow-green-100' 
                  : today 
                    ? 'border-2 border-indigo-500 text-indigo-600' 
                    : 'text-slate-400'
              }`}
            >
              {d}
              {completed && <i className="fa-solid fa-check absolute -top-1 -right-1 text-[8px] bg-white text-green-500 rounded-full w-3 h-3 flex items-center justify-center shadow-sm"></i>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TodayView: React.FC<TodayViewProps> = ({ 
  user,
  wordFavorites, 
  phraseFavorites, 
  onToggleWordFavorite, 
  onTogglePhraseFavorite 
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [completionHistory, setCompletionHistory] = useState<string[]>([]);

  // 로컬 시간 기준으로 오늘 날짜 문자열 획득
  const todayStr = useMemo(() => getLocalDateStr(new Date()), []);

  // 날짜 기반 시드 생성 및 학습 데이터 선정
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
      const idx = (seed + i * 13) % wordPool.length;
      selectedWords.push(wordPool.splice(idx, 1)[0]);
    }

    const phraseIdx = (seed * 7) % PHRASES.length;
    const selectedPhrase = PHRASES[phraseIdx];

    return { words: selectedWords, phrase: selectedPhrase };
  }, [todayStr]);

  // 로컬 스토리지 데이터 초기화
  useEffect(() => {
    const savedToday = localStorage.getItem(`nm_today_done_${todayStr}`);
    if (savedToday) {
      setCompletedIds(JSON.parse(savedToday));
    }

    const savedHistory = localStorage.getItem('nm_completion_history');
    if (savedHistory) {
      setCompletionHistory(JSON.parse(savedHistory));
    }
  }, [todayStr]);

  // 학습 완료 판정 및 히스토리 업데이트
  useEffect(() => {
    if (completedIds.length === 4 && !completionHistory.includes(todayStr)) {
      const newHistory = [...completionHistory, todayStr];
      setCompletionHistory(newHistory);
      localStorage.setItem('nm_completion_history', JSON.stringify(newHistory));
    }
  }, [completedIds, todayStr, completionHistory]);

  const toggleComplete = (id: string) => {
    const newIds = completedIds.includes(id)
      ? completedIds.filter(i => i !== id)
      : [...completedIds, id];
    setCompletedIds(newIds);
    localStorage.setItem(`nm_today_done_${todayStr}`, JSON.stringify(newIds));
  };

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

  const progress = Math.round((completedIds.length / 4) * 100);
  const isAllDone = completedIds.length === 4;

  return (
    <div className="p-6 animate-fade-in space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1 block">DAILY MISSION FOR {user.name}</span>
          <h2 className="text-3xl font-[900] text-slate-800 leading-tight">오늘의 학습</h2>
        </div>
        <div className="text-right">
          <span className="text-xs font-black text-slate-300 block">{new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}</span>
        </div>
      </div>

      {/* Progress Card */}
      <div className={`rounded-[2.5rem] p-6 text-white shadow-xl flex items-center justify-between relative overflow-hidden group transition-all duration-500 ${isAllDone ? 'bg-green-500 shadow-green-100' : 'bg-indigo-600 shadow-indigo-100'}`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-125 transition-transform"></div>
        <div className="relative z-10">
          <h3 className="text-lg font-black mb-1">{isAllDone ? '학습 완료!' : '오늘의 목표'}</h3>
          <p className="text-indigo-100 text-xs font-bold">{isAllDone ? '정말 대단해요! 캘린더에 기록되었습니다.' : '단어 3개 & 문장 1개 정복하기'}</p>
        </div>
        <div className="w-16 h-16 rounded-full border-4 border-white/20 flex items-center justify-center relative z-10">
          <span className="text-xl font-black">{progress}<small className="text-[10px] opacity-70">%</small></span>
        </div>
      </div>

      {/* Words Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <i className="fa-solid fa-bookmark text-indigo-500 text-xs"></i>
          <h4 className="text-sm font-black text-slate-700">추천 단어 (3)</h4>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {dailySelection.words.map((word) => {
            const isDone = completedIds.includes(word.id);
            return (
              <div key={word.id} className={`bg-white p-5 rounded-[2rem] border transition-all flex items-center justify-between group ${isDone ? 'border-green-200 bg-green-50/30' : 'border-slate-100 shadow-sm hover:border-indigo-200'}`}>
                <div className="flex items-center gap-4 flex-1">
                  <button 
                    onClick={() => toggleComplete(word.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isDone ? 'bg-green-500 border-green-500 text-white' : 'border-slate-200 text-transparent hover:border-indigo-300'}`}
                  >
                    <i className="fa-solid fa-check text-xs"></i>
                  </button>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`text-2xl font-black font-jp leading-none transition-colors ${isDone ? 'text-green-600 line-through opacity-50' : 'text-slate-800 group-hover:text-indigo-600'}`}>{word.jp}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${isDone ? 'bg-green-100 border-green-200 text-green-600' : 'bg-indigo-50 border-indigo-100 text-indigo-400'}`}>
                        {word.phonetic}
                      </span>
                    </div>
                    <div className={`text-sm font-bold ml-1 ${isDone ? 'text-green-400 opacity-50' : 'text-slate-400'}`}>{word.kr}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => playTTS(word.jp, word.id)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                      playingId === word.id ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-300 hover:text-indigo-600'
                    }`}
                  >
                    {playingId === word.id ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-volume-high text-xs"></i>}
                  </button>
                  <button
                    onClick={() => onToggleWordFavorite(word.id)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 border ${
                      wordFavorites.includes(word.id) ? 'bg-amber-100 text-amber-500 border-amber-200 shadow-sm shadow-amber-50' : 'bg-slate-50 text-slate-300 border-slate-100'
                    }`}
                  >
                    <i className={`fa-solid fa-star text-xs ${wordFavorites.includes(word.id) ? 'scale-110' : ''}`}></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Phrase Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <i className="fa-solid fa-quote-left text-indigo-500 text-xs"></i>
          <h4 className="text-sm font-black text-slate-700">오늘의 한 문장</h4>
        </div>
        {(() => {
          const phrase = dailySelection.phrase;
          const isDone = completedIds.includes(phrase.id);
          return (
            <div className={`p-6 rounded-[2.5rem] border transition-all relative overflow-hidden group ${isDone ? 'bg-green-50 border-green-200' : 'bg-gradient-to-br from-white to-slate-50 border-slate-100 shadow-sm hover:border-indigo-300'}`}>
               <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm ${isDone ? 'bg-green-500 text-white' : 'bg-indigo-500 text-white'}`}>
                      LV.{phrase.level} · {phrase.category}
                    </span>
                    {isDone && <span className="text-[10px] font-black bg-white text-green-500 px-3 py-1 rounded-full border border-green-200">DONE</span>}
                  </div>
                  <button 
                    onClick={() => toggleComplete(phrase.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isDone ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-slate-200 text-transparent hover:border-indigo-300'}`}
                  >
                    <i className="fa-solid fa-check text-sm"></i>
                  </button>
                </div>

                <div className={`text-2xl font-black font-jp leading-tight mb-2 transition-all ${isDone ? 'text-green-600 opacity-50 line-through' : 'text-slate-800 group-hover:text-indigo-600'}`}>
                  {phrase.jp}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-black bg-white border px-3 py-1 rounded-xl shadow-sm ${isDone ? 'border-green-100 text-green-500' : 'border-indigo-100 text-indigo-600'}`}>
                    [{phrase.phonetic}]
                  </span>
                </div>
                <div className={`text-base font-bold mb-6 ${isDone ? 'text-green-400 opacity-50' : 'text-slate-500'}`}>{phrase.kr}</div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => playTTS(phrase.jp, phrase.id)}
                    className={`flex-1 py-3.5 rounded-2xl font-black text-xs shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${isDone ? 'bg-green-600 text-white shadow-green-100' : 'bg-indigo-600 text-white shadow-indigo-100'}`}
                  >
                    {playingId === phrase.id ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-volume-high"></i>}
                    발음 듣기
                  </button>
                  <button
                    onClick={() => onTogglePhraseFavorite(phrase.id)}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-md border ${
                      phraseFavorites.includes(phrase.id) ? 'bg-amber-100 text-amber-500 border-amber-200 shadow-amber-50' : 'bg-white text-slate-200 border-slate-100'
                    }`}
                  >
                    <i className={`fa-solid fa-star text-lg ${phraseFavorites.includes(phrase.id) ? 'scale-110' : ''}`}></i>
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* 학습 캘린더 */}
      <Calendar completionHistory={completionHistory} />

      <div className="pt-4 text-center">
        <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest leading-loose">
          체크박스를 눌러 오늘 배운 내용을 완료하세요!<br/>
          완료하면 캘린더에 멋진 도장이 찍힙니다.
        </p>
      </div>
    </div>
  );
};

export default TodayView;
