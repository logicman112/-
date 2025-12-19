
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [nickname, setNickname] = useState('');

  const handleStart = () => {
    const finalNickname = nickname.trim() || '익명의 친구';
    const mockUser: User = {
      name: finalNickname,
      email: `${finalNickname.toLowerCase()}@logic.com`,
      photo: `https://ui-avatars.com/api/?name=${finalNickname}&background=6366f1&color=fff`
    };
    onLogin(mockUser);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDFDFF] p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60 animate-pulse"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-violet-50 rounded-full blur-3xl opacity-60"></div>
      
      <div className="w-full max-w-sm z-10 text-center">
        {/* Animated Logo Container */}
        <div className="mb-10 relative inline-block">
          <div className="w-28 h-28 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[2.5rem] flex items-center justify-center text-white text-5xl mx-auto shadow-[0_20px_50px_rgba(79,70,229,0.3)] animate-[bounce_3s_infinite] relative z-10">
            <i className="fa-solid fa-language"></i>
          </div>
          <div className="w-16 h-2 bg-slate-200 rounded-full blur-md mx-auto mt-6 opacity-50"></div>
        </div>

        <div className="space-y-3 mb-8 animate-fade-in">
          <h1 className="text-4xl font-[900] text-slate-800 tracking-tight">
            로직이의<br/>
            <span className="text-indigo-600">쉬운 일본어</span>
          </h1>
          <p className="text-slate-400 font-medium leading-relaxed">
            나만의 닉네임을 설정하고<br/> 
            일본어 학습을 시작해보세요!
          </p>
        </div>

        <div className="mb-8 space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="relative">
            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-2 text-left px-4">Nickname Settings</label>
            <input 
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="사용하실 닉네임 입력"
              className="w-full py-4.5 px-6 bg-white border-2 border-slate-100 rounded-[1.5rem] text-slate-700 font-bold focus:border-indigo-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>
        
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={handleStart}
            className="w-full flex items-center justify-center gap-4 bg-white border border-slate-100 py-4.5 px-4 rounded-[1.5rem] font-[900] text-slate-700 hover:bg-slate-50 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.05)] active:scale-95 group"
          >
            <div className="bg-white p-2 rounded-full shadow-sm">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            </div>
            Google 계정으로 로그인/시작
          </button>
          
          <div className="flex items-center gap-4 py-4">
            <div className="h-[1px] flex-1 bg-slate-100"></div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">or quick start</span>
            <div className="h-[1px] flex-1 bg-slate-100"></div>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-4.5 bg-slate-800 text-white rounded-[1.5rem] font-[900] shadow-xl shadow-slate-200 hover:bg-slate-900 transition-all active:scale-95"
          >
            게스트로 둘러보기
          </button>
        </div>
        
        <footer className="mt-16 text-[11px] text-slate-400 font-medium animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p>도움이 필요하신가요? <span className="text-indigo-500 font-bold underline cursor-pointer">고객센터</span></p>
          <p className="mt-4 opacity-60">© 2024 Logic Japanese. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Login;
