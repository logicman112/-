
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiChat, generateTTS, decodeBase64, decodeAudioData } from '../services/geminiService';
import { ChatMessage } from '../types';

const AITutorView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '안녕하세요! 저는 일본어 공부를 도와줄 로직이에요. 일본어에 대해 궁금한 게 있다면 무엇이든 물어보세요! 😊', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [playingMsgIndex, setPlayingMsgIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatInstance = useRef<any>(null);

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
        text: response.text || '죄송해요, 다시 한번 말씀해주시겠어요?',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: '오류가 발생했습니다. 나중에 다시 시도해주세요.', timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const playTTS = async (text: string, index: number) => {
    if (playingMsgIndex !== null) return;
    
    const parts = text.split('----');
    const firstPart = parts[0];
    const jpRegex = /([一-龠ぁ-ゔァ-ヴー]+[^\-]*)/g;
    const match = firstPart.match(jpRegex) || text.match(jpRegex);
    
    const targetText = match ? match[0].trim() : text;

    setPlayingMsgIndex(index);
    try {
      const audio = await generateTTS(targetText);
      if (audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const decoded = decodeBase64(audio);
        const buffer = await decodeAudioData(decoded, audioCtx);
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.onended = () => setPlayingMsgIndex(null);
        source.start();
      } else {
        setPlayingMsgIndex(null);
      }
    } catch (e) {
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
                  if (trimmedLine === '----') {
                    return <hr key={idx} className="my-5 border-slate-100" />;
                  }
                  if (trimmedLine.startsWith('💡 Tip:')) {
                    return (
                      <div key={idx} className="mt-4 p-4 bg-amber-50 rounded-2xl text-amber-700 text-xs font-bold border border-amber-100 flex gap-2">
                        <span className="flex-shrink-0">💡</span>
                        <span>{trimmedLine.replace('💡 Tip:', '').trim()}</span>
                      </div>
                    );
                  }
                  // 교정된 문장 스타일 (줄바꿈 강조)
                  const isCorrectionLine = trimmedLine.startsWith('-');
                  return (
                    <div key={idx} className={`${isCorrectionLine ? 'text-indigo-500 font-bold mt-2 pl-2' : ''} ${msg.role === 'user' ? 'text-white' : ''}`}>
                      {line}
                    </div>
                  );
                })}
              </div>
              
              {msg.role === 'model' && (msg.text.includes('-') || msg.text.match(/[ぁ-ゔァ-ヴー]/)) && (
                <button 
                  onClick={() => playTTS(msg.text, i)}
                  className={`mt-6 flex items-center gap-2 px-5 py-3 rounded-2xl text-[11px] font-black transition-all active:scale-95 shadow-sm ${
                    playingMsgIndex === i 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100'
                  }`}
                >
                  {playingMsgIndex === i ? (
                    <><i className="fa-solid fa-spinner fa-spin"></i> 재생 중</>
                  ) : (
                    <><i className="fa-solid fa-volume-high"></i> 발음 듣기</>
                  )}
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
            <div className="bg-white border border-slate-100 p-4 rounded-3xl rounded-tl-none flex gap-1.5 shadow-sm">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
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
            placeholder="로직이와 대화해보세요!"
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
