
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiChat, generateTTS, decode, decodeAudioData } from '../services/geminiService';
import { playClickSound } from '../services/audioService';
import { ChatMessage } from '../types';

const AITutorView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '안녕! 나는 너의 일본어 친구 로직이야. 우리 오늘 어떤 이야기를 해볼까? 일본어 공부하면서 궁금한 게 있었다면 물어봐줘! 😊', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [playingMsgIndex, setPlayingMsgIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatInstance = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    chatInstance.current = getGeminiChat();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    playClickSound();

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    }

    const userMessage: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatInstance.current.sendMessage({ message: input });
      const modelMessage: ChatMessage = {
        role: 'model',
        text: response.text || '미안해, 방금 한 말을 잘 못 알아들었어. 다시 말해줄래?',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: '앗, 로직이의 머릿속이 잠깐 복잡해졌나봐. 다시 시도해줄래?', timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const playTTS = async (text: string, index: number) => {
    playClickSound();
    if (playingMsgIndex !== null) return;
    
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    } else if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    }

    const parts = text.split('----');
    const speechText = parts[0].trim();

    setPlayingMsgIndex(index);
    try {
      const audioBase64 = await generateTTS(speechText);
      if (audioBase64 && audioContextRef.current) {
        const decoded = decode(audioBase64);
        const buffer = await decodeAudioData(decoded, audioContextRef.current);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => setPlayingMsgIndex(null);
        source.start();
      } else {
        setPlayingMsgIndex(null);
      }
    } catch (e) {
      console.error("Audio Playback Error:", e);
      setPlayingMsgIndex(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-50">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-[85%] p-5 rounded-3xl text-sm shadow-sm relative group ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-100 shadow-xl' 
                : 'bg-white text-gray-800 rounded-tl-none border border-slate-100'
            }`}>
              <div className="whitespace-pre-wrap leading-relaxed font-medium">
                {msg.text.split('\n').map((line, idx) => {
                  const trimmedLine = line.trim();
                  if (trimmedLine === '----') return <hr key={idx} className="my-5 border-slate-100" />;
                  if (trimmedLine.startsWith('💡 Tip:')) {
                    return (
                      <div key={idx} className="mt-4 p-4 bg-amber-50 rounded-2xl text-amber-700 text-[11px] font-black border border-amber-100 flex gap-2">
                        <span className="flex-shrink-0">💡</span>
                        <span>{trimmedLine.replace('💡 Tip:', '').trim()}</span>
                      </div>
                    );
                  }
                  const isQuestion = trimmedLine.includes('?') && idx < 5;
                  const isCorrectionLine = trimmedLine.startsWith('-');
                  return (
                    <div key={idx} className={`${isCorrectionLine ? 'text-indigo-500 font-bold mt-2 pl-2' : ''} ${isQuestion ? 'text-slate-900 font-[900] text-[15px] border-l-4 border-indigo-200 pl-3 my-2' : ''} ${msg.role === 'user' ? 'text-white' : ''}`}>
                      {line}
                    </div>
                  );
                })}
              </div>
              
              {msg.role === 'model' && (
                <button 
                  onClick={() => playTTS(msg.text, i)}
                  className={`mt-6 flex items-center gap-2 px-5 py-3 rounded-2xl text-[11px] font-black transition-all active:scale-95 shadow-sm ${
                    playingMsgIndex === i ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100'
                  }`}
                >
                  {playingMsgIndex === i ? <><i className="fa-solid fa-spinner fa-spin"></i> 로직이가 말하는 중...</> : <><i className="fa-solid fa-volume-high"></i> 로직이 목소리 듣기</>}
                </button>
              )}
              <div className={`text-[9px] mt-2 opacity-30 font-bold ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse pl-4">
            <div className="bg-white border border-slate-100 p-4 rounded-3xl rounded-tl-none flex gap-1.5 shadow-sm items-center">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
                <i className="fa-solid fa-robot text-indigo-500 text-[10px]"></i>
              </div>
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        <div className="flex gap-2 items-center bg-slate-100 rounded-[1.5rem] px-5 py-3 border-2 border-transparent focus-within:border-indigo-200 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="로직이에게 대답해주세요!"
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1 outline-none font-bold text-slate-700"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:bg-slate-300 transition-all shadow-lg shadow-indigo-100 active:scale-90"
          >
            <i className="fa-solid fa-paper-plane text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITutorView;
