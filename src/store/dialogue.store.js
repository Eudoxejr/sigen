import { create } from 'zustand'
import { produce } from 'immer'

export const useDialogueStore = create((set) => ({
  dialogue: {
    size: "sm",
    open: false,
    view: null,
    data: null
  },
  backdrop: {
    active: false
  },
  setDialogue: (newDialogValue) => set(
    produce((state) => {
        state.dialogue = newDialogValue
    })
  ),
  setBackdrop: (newBackdropValue) => set(
    produce((state) => {
        state.backdrop = newBackdropValue
    })
  )

}))