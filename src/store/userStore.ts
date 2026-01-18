import { create } from 'zustand';
import { User } from '../types';

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  updateXP: (xp: number) => void;
  updateStreak: (streak: number) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateXP: (xp) =>
    set((state) => ({
      user: state.user ? { ...state.user, xp } : null,
    })),
  updateStreak: (streak) =>
    set((state) => ({
      user: state.user ? { ...state.user, streak } : null,
    })),
  clearUser: () => set({ user: null }),
}));
