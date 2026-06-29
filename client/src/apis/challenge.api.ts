import { callAPI } from './axios.client';
import type { AxiosResponse } from 'axios';
import type { BaseApiResponse } from '../types/auth.types';

export interface ChallengeOverview {
  currentStreak: number;
  highestStreak: number;
  todayDate: string;
  breakfastDone: boolean;
  lunchDone: boolean;
  dinnerDone: boolean;
  snackDone: boolean;
  isTodayCompleted: boolean;
}

export interface CheckMealRequest {
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  status: boolean;
}

export interface DailyMealRecord {
  id: string;
  userId: string;
  recordDate: string;
  breakfastDone: boolean;
  lunchDone: boolean;
  dinnerDone: boolean;
  snackDone: boolean;
  isCompleted: boolean;
  createdAt: string;
}

export const challengeApi = {
  getTodayOverview: (): Promise<AxiosResponse<BaseApiResponse<ChallengeOverview>>> => {
    return callAPI('GET', '/challenges/today');
  },

  checkMeal: (data: CheckMealRequest): Promise<AxiosResponse<BaseApiResponse<ChallengeOverview>>> => {
    return callAPI('POST', '/challenges/check', data);
  },

  getHistory: (yearMonth: string): Promise<AxiosResponse<BaseApiResponse<DailyMealRecord[]>>> => {
    return callAPI('GET', '/challenges/history?yearMonth=' + yearMonth);
  }
};
