import { create } from "zustand"
import type { GeneralData } from "../schemas/general.schema"
import type { LoadData } from "../schemas/load.schema"

export type StepId = "general" | "load" | "network"

export const STEP_ORDER: StepId[] = ["general", "load", "network"]

type State = {
  currentStep: StepId
  completed: Record<StepId, boolean>
  general: Partial<GeneralData>
  load: Partial<LoadData>
}

type Actions = {
  setStep: (step: StepId) => void
  next: () => void
  prev: () => void
  setGeneral: (data: GeneralData) => void
  setLoad: (data: LoadData) => void
  markCompleted: (step: StepId) => void
  reset: () => void
}

const initialState: State = {
  currentStep: "general",
  completed: { general: false, load: false, network: false },
  general: {},
  load: {},
}

export const useCreateProjectStore = create<State & Actions>((set, get) => ({
  ...initialState,

  setStep: (currentStep) => set({ currentStep }),

  next: () => {
    const { currentStep, completed } = get()
    const idx = STEP_ORDER.indexOf(currentStep)
    if (idx < STEP_ORDER.length - 1) {
      set({
        currentStep: STEP_ORDER[idx + 1],
        completed: { ...completed, [currentStep]: true },
      })
    }
  },

  prev: () => {
    const idx = STEP_ORDER.indexOf(get().currentStep)
    if (idx > 0) set({ currentStep: STEP_ORDER[idx - 1] })
  },

  setGeneral: (general) =>
    set((s) => ({
      general,
      completed: { ...s.completed, general: true },
    })),

  setLoad: (load) =>
    set((s) => ({
      load,
      completed: { ...s.completed, load: true },
    })),

  markCompleted: (step) =>
    set((s) => ({ completed: { ...s.completed, [step]: true } })),

  reset: () => set(initialState),
}))
