import { create } from "zustand"

interface SoundState {
  isSoundOn: boolean
  toggleSound: () => void
  setSound: (value: boolean) => void
}

export const useSoundStore = create<SoundState>((set) => ({
  isSoundOn: false,
  toggleSound: () =>
    set((state) => ({
      isSoundOn: !state.isSoundOn,
    })),
  setSound: (value) => set({ isSoundOn: value }),
}))
