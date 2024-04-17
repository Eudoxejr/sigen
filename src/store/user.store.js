import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { produce } from 'immer'

export const useUserStore = create(
  persist(
    (set) => ({
      user: false,
      setUser: (value) => set({ user: value }),
      updateUser: (newuser) => set(
        produce((state) => {
          state.user.user = newuser
        })
      ),
    }),
    {
      name: 'user-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
)