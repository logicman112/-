
import React, { useState, useRef, useEffect } from 'react';
import { HIRAGANA, KATAKANA } from '../constants';
import { generateTTS, decodeBase64, decodeAudioData } from '../services/geminiService';
import { Character } from '../types';

const DrawingBoard: React.FC<{ char: Character; onComplete: (accuracy: number) => void }> = ({ char, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    clearCanvas();
  }, [char]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const pos = getPos(e);
    setPoints([pos]);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e);
    const lastPos = points[points.length - 1];

    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    setPoints(prev => [...prev, pos]);
    if ('touches' in e) e.preventDefault();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const checkAccuracy = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tCtx = tempCanvas.getContext('2d')!;
    tCtx.font = 'bold 240px "Noto Sans JP"';
    tCtx.fillStyle = 'black';
    tCtx.textAlign = 'center';
    tCtx.textBaseline = 'middle';
    tCtx.fillText(char.jp, canvas.width / 2, canvas.height / 2);

    const templateData = tCtx.getImageData(0, 0, canvas.width, canvas.height).data;
    const userData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let targetPixels = 0;
    let matchingPixels = 0;
    let wrongPixels = 0;

    for (let i = 0; i < templateData.length; i += 4) {
      const isTarget = templateData[i + 3] > 10;
      const isUser = userData[i + 3] > 10;

      if (isTarget) {
        targetPixels++;
        if (isUser) matchingPixels++;
      } else if (isUser) {
        wrongPixels++;
      }
    }

    const accuracy = (matchingPixels / targetPixels) - (wrongPixels / targetPixels * 0.1);
    onComplete(Math.max(0, accuracy));
    
    // 채점 후 캔버스 자동 초기화
    setTimeout(() => {
      clearCanvas();
    }, 500);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = 'bold 240px "Noto Sans JP"';
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeText(char.jp, canvas.width / 2, canvas.height / 2);
    ctx.fillText(char.jp, canvas.width / 2, canvas.height / 2);
    setPoints([]);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-[340px]">
      <div className="relative bg-white rounded-[2.5rem] shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] border-2 border-slate-100 overflow-hidden touch-none w-full aspect-square">
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="cursor-crosshair w-full h-full"
        />
        {points.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
            <div className="flex flex-col items-center gap-2">
              <i className="fa-solid fa-hand-pointer animate-bounce text-slate-400"></i>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">따라 써보세요</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-3 w-full">
        <button 
          onClick={clearCanvas} 
          className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-rotate-right"></i> 다시 쓰기
        </button>
        <button 
          onClick={checkAccuracy} 
          className="flex-[1.5] py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-check"></i> 채점하기
        </button>
      </div>
    </div>
  );
};

const AlphabetView: React.FC = () => {
  const [tab, setTab] = useState<'hiragana' | 'katakana'>('hiragana');
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [loadingAudio, setLoadingAudio] = useState<string | null>(null);
  const [accuracyResult, setAccuracyResult] = useState<{ acc: number; success: boolean } | null>(null);
  const [successCount, setSuccessCount] = useState(0);

  const data = tab === 'hiragana' ? HIRAGANA : KATAKANA;

  useEffect(() => {
    // 3번 통과 시 다음 글자로 이동
    if (successCount >= 3) {
      const timer = setTimeout(() => {
        handleNextChar();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successCount]);

  const handleNextChar = () => {
    if (!selectedChar) return;
    const currentIndex = data.findIndex(c => c.id === selectedChar.id);
    const nextIndex = currentIndex + 1;
    if (nextIndex < data.length) {
      setSelectedChar(data[nextIndex]);
      setSuccessCount(0);
      setAccuracyResult(null);
    } else {
      setSelectedChar(null);
      setSuccessCount(0);
      setAccuracyResult(null);
    }
  };

  const playPronunciation = async (char: string) => {
    setLoadingAudio(char);
    const audioBase64 = await generateTTS(char);
    if (audioBase64) {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const decoded = decodeBase64(audioBase64);
      const buffer = await decodeAudioData(decoded, audioCtx);
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start();
    }
    setLoadingAudio(null);
  };

  const handleDrawComplete = (acc: number) => {
    const success = acc >= 0.4; // 유사도 40% 이상 통과
    setAccuracyResult({ acc, success });
    if (success) {
      setSuccessCount(prev => prev + 1);
      playPronunciation(selectedChar?.jp || '');
    }
  };

  return (
    <div className="p-4 animate-fade-in max-w-md mx-auto">
      {!selectedChar ? (
        <>
          <div className="flex bg-slate-100 rounded-2xl p-1.5 mb-8 shadow-inner">
            <button
              onClick={() => setTab('hiragana')}
              className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${
                tab === 'hiragana' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400'
              }`}
            >
              히라가나
            </button>
            <button
              onClick={() => setTab('katakana')}
              className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${
                tab === 'katakana' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400'
              }`}
            >
              가타카나
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {data.map((char) => (
              <button
                key={char.id}
                onClick={() => { setSelectedChar(char); setAccuracyResult(null); setSuccessCount(0); }}
                className="flex flex-col items-center justify-center bg-white border-2 border-slate-50 p-5 rounded-3xl shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all active:scale-95 group relative"
              >
                <span className="text-3xl font-black text-slate-800 mb-1 font-jp group-hover:text-indigo-600 transition-colors">
                  {char.jp}
                </span>
                <span className="text-[12px] text-indigo-400 font-black">
                  {char.phonetic}
                </span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="animate-fade-in flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-8">
            <button 
              onClick={() => { setSelectedChar(null); setAccuracyResult(null); setSuccessCount(0); }}
              className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 shadow-sm transition-all"
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <div className="text-center">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">{tab} PRACTICE</h2>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3].map(i => (
                <div key={i} className={`w-3 h-3 rounded-full border-2 ${successCount >= i ? 'bg-indigo-500 border-indigo-500' : 'bg-slate-100 border-slate-200'}`}></div>
              ))}
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-5xl font-black text-slate-800 mb-2 font-jp">{selectedChar.jp}</h2>
            <div className="flex items-center justify-center gap-2">
              <span className="text-indigo-600 font-black text-xl">[{selectedChar.phonetic}]</span>
              <span className="text-slate-300 text-sm italic font-medium">/{selectedChar.romaji}/</span>
            </div>
          </div>

          <DrawingBoard char={selectedChar} onComplete={handleDrawComplete} />

          {accuracyResult && (
            <div className={`mt-8 p-6 rounded-[2.5rem] w-full max-w-[340px] text-center animate-fade-in shadow-lg ${accuracyResult.success ? 'bg-green-50 border-2 border-green-100' : 'bg-rose-50 border-2 border-rose-100'}`}>
              <div className={`text-4xl mb-3 ${accuracyResult.success ? 'text-green-500' : 'text-rose-500'}`}>
                <i className={`fa-solid ${accuracyResult.success ? 'fa-medal' : 'fa-face-sad-tear'}`}></i>
              </div>
              <h3 className={`text-xl font-black ${accuracyResult.success ? 'text-green-600' : 'text-rose-600'}`}>
                {accuracyResult.success 
                  ? (successCount >= 3 ? '글자 마스터! 다음으로 이동합니다.' : `통과! (${successCount}/3)`)
                  : '조금 더 비슷하게 써보세요.'}
              </h3>
              <div className="mt-3 flex items-center justify-center gap-3">
                <div className="h-2 flex-1 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${accuracyResult.success ? 'bg-green-500' : 'bg-rose-500'}`}
                    style={{ width: `${Math.round(accuracyResult.acc * 100)}%` }}
                  ></div>
                </div>
                <span className="text-xs font-black text-slate-400 whitespace-nowrap">
                  {Math.round(accuracyResult.acc * 100)}% 일치
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AlphabetView;
