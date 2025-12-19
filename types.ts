
export enum ViewType {
  HOME = 'HOME',
  TODAY = 'TODAY',
  ALPHABET = 'ALPHABET',
  PHRASES = 'PHRASES',
  VOCABULARY = 'VOCABULARY',
  AI_TUTOR = 'AI_TUTOR'
}

export interface Character {
  id: string;
  jp: string;
  romaji: string;
  phonetic: string;
  kr: string;
}

export interface Phrase {
  id: string;
  jp: string;
  kr: string;
  romaji: string;
  phonetic: string;
  category: string;
  level: number;
}

export interface Word {
  id: string;
  jp: string;
  kr: string;
  phonetic: string;
  category: string; // 추가
  level: number;    // chapter에서 level로 변경
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface User {
  name: string;
  email: string;
  photo: string;
}
