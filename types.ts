export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  brailleSize: string; // e.g., "120 pages braille"
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface SearchParams {
  genre: string;
  query: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
}

export type ViewState = 'HOME' | 'LOGIN' | 'PROFILE';