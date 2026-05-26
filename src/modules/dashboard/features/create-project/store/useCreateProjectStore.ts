import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { GeneralData } from "../schemas/general.schema"
import type { LoadData } from "../schemas/load.schema"
import type { NetworkData } from "../schemas/network.schema"

export type StepId = "general" | "load" | "network"

export const STEP_ORDER: StepId[] = ["general", "load", "network"]

type State = {
  currentStep: StepId
  completed: Record<StepId, boolean>
  general: Partial<GeneralData>
  load: Partial<LoadData>
  network: Partial<NetworkData>
}

type Actions = {
  setStep: (step: StepId) => void
  next: () => void
  prev: () => void
  setGeneral: (data: GeneralData) => void
  setLoad: (data: LoadData) => void
  setNetwork: (data: NetworkData) => void
  /** Actualiza network sin marcar el paso como completado (uso del editor). */
  updateNetwork: (patch: Partial<NetworkData>) => void
  markCompleted: (step: StepId) => void
  reset: () => void
}

const initialState: State = {
  currentStep: "general",
  completed: { general: false, load: false, network: false },
  general: {},
  load: {},
  network: {},
}

const STORAGE_KEY = "voltiq:create-project"

export const useCreateProjectStore = create<State & Actions>()(
  persist(
    (set, get) => ({
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

      setNetwork: (network) =>
        set((s) => ({
          network,
          completed: { ...s.completed, network: true },
        })),

      updateNetwork: (patch) =>
        set((s) => ({
          network: { ...s.network, ...patch },
        })),

      markCompleted: (step) =>
        set((s) => ({ completed: { ...s.completed, [step]: true } })),

      reset: () => {
        set(initialState)
        useCreateProjectStore.persist.clearStorage()
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      version: 2,
      partialize: (state) => ({
        currentStep: state.currentStep,
        completed: state.completed,
        general: state.general,
        load: state.load,
        network: state.network,
      }),
    },
  ),
)
