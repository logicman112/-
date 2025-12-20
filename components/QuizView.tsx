
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CHAPTER_WORDS, PHRASES } from '../constants';
import { generateTTS, decode, decodeAudioData } from '../services/geminiService';
import { playClickSound } from '../services/audioService';

// 'audioToKr' 타입을 제거하고 'jpToKr' (Reading) 전용으로 설정
type QuestionType = 'jpToKr';

interface QuizOption {
  kr: string;
  jp: string;
  phonetic: string;
}

interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  phonetic: string;
  correctAnswer: string;
  options: QuizOption[];
  audioText: string;
}

const QuizView: React.FC = () => {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  const generateQuestion = useCallback(() => {
    // 리스닝을 제거하고 항상 독해(Reading) 퀴즈로 생성
    const currentType: QuestionType = 'jpToKr';

    const isWord = Math.random() > 0.4;
    const pool = isWord ? CHAPTER_WORDS : PHRASES;
    const targetIdx = Math.floor(Math.random() * pool.length);
    const target = pool[targetIdx];
    
    const options: QuizOption[] = [{ kr: target.kr, jp: target.jp, phonetic: target.phonetic }];
    while (options.length < 4) {
      const rand = pool[Math.floor(Math.random() * pool.length)];
      if (!options.find(o => o.kr === rand.kr)) {
        options.push({ kr: rand.kr, jp: rand.jp, phonetic: rand.phonetic });
      }
    }
    
    const shuffledOptions = options.sort(() => Math.random() - 0.5);
    
    const newQuestion: QuizQuestion = {
      id: target.id,
      type: currentType,
      question: target.jp,
      phonetic: target.phonetic, 
      correctAnswer: target.kr,
      options: shuffledOptions,
      audioText: target.jp
    };

    setQuestion(newQuestion);
    setSelectedIdx(null);
    setIsCorrect(null);
  }, []);

  useEffect(() => {
    generateQuestion();
  }, []);

  const playTTS = async (text: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    try {
      const audio = await generateTTS(text);
      if (audio && audioContextRef.current) {
        const decoded = decode(audio);
        const buffer = await decodeAudioData(decoded, audioContextRef.current);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.start();
      }
    } catch (e) {
      console.error("Quiz Audio Error:", e);
    }
  };

  const handleSelect = (idx: number) => {
    if (selectedIdx !== null) return;
    playClickSound();
    
    const selectedOption = question?.options[idx];
    const correct = selectedOption?.kr === question?.correctAnswer;
    
    setSelectedIdx(idx);
    setIsCorrect(correct);
    
    if (correct) {
      setScore(s => s + 10 + (combo * 2));
      setCombo(c => c + 1);
    } else {
      setCombo(0);
    }

    setTimeout(() => {
      generateQuestion();
    }, 1800);
  };

  if (!question) return null;

  return (
    <div className="p-6 animate-fade-in flex flex-col h-full bg-slate-50">
      {/* Quiz Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
          <i className="fa-solid fa-star text-amber-400 text-xs"></i>
          <span className="text-sm font-black text-slate-700">{score}</span>
        </div>
        
        {combo > 0 && (
          <div className="bg-rose-500 text-white px-5 py-2 rounded-2xl shadow-lg animate-bounce flex items-center gap-2">
            <i className="fa-solid fa-fire text-xs"></i>
            <span className="text-xs font-black">{combo} COMBO</span>
          </div>
        )}

        <div className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-full uppercase">
          Reading Quiz
        </div>
      </div>

      {/* Main Question Card */}
      <div className={`glass-card rounded-[3.5rem] p-12 mb-10 text-center relative transition-all duration-500 border-b-[10px] ${
        isCorrect === true ? 'border-green-500 shadow-green-100' : 
        isCorrect === false ? 'border-rose-500 animate-shake shadow-rose-100' : 'border-slate-100 shadow-xl shadow-slate-200/50'
      }`}>
        <div className="text-slate-300 text-[10px] font-black uppercase tracking-[0.4em] mb-8">Word Mastery</div>
        
        <div className="space-y-6">
          <div className="text-6xl font-black text-slate-800 font-jp leading-tight drop-shadow-sm">
            {question.question}
          </div>
          
          {/* 질문 영역 한글 발음 표시 */}
          <div className="text-2xl font-[900] text-indigo-500 tracking-wider bg-indigo-50/50 py-2 px-6 rounded-2xl inline-block">
            {question.phonetic}
          </div>

          <div className="pt-4">
            <button 
              onClick={() => playTTS(question.audioText)}
              className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-slate-100"
            >
              <i className="fa-solid fa-volume-high text-base"></i>
            </button>
          </div>
        </div>

        {isCorrect !== null && (
          <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-2xl border-6 border-white animate-fade-in ${isCorrect ? 'bg-green-500 text-white' : 'bg-rose-500 text-white'}`}>
            <i className={`fa-solid ${isCorrect ? 'fa-check' : 'fa-xmark'}`}></i>
          </div>
        )}
      </div>

      {/* Options List */}
      <div className="grid grid-cols-1 gap-4">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            disabled={selectedIdx !== null}
            className={`w-full p-6 rounded-[2.5rem] transition-all flex items-center justify-between border-2 shadow-sm ${
              selectedIdx === idx 
                ? (isCorrect ? 'bg-green-500 border-green-500 text-white scale-95' : 'bg-rose-500 border-rose-500 text-white animate-shake')
                : (selectedIdx !== null && opt.kr === question.correctAnswer ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-100 text-slate-600 active:scale-95 hover:border-indigo-200')
            }`}
          >
            <div className="flex flex-col items-start text-left w-full">
              {/* 선택지에서는 발음 제거, 뜻만 표시 */}
              <span className="text-xl font-black leading-tight w-full text-center">{opt.kr}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizView;
