import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type SelectedKind = "nodo" | "linea" | "transformador" | "carga"

export type Position = { x: number; y: number }

type State = {
  /** Mapa de posiciones por id de nodo de React Flow. */
  positions: Record<string, Position>
  selectedId: string | null
  selectedKind: SelectedKind | null
  showLabels: boolean
}

type Actions = {
  setPosition: (flowNodeId: string, position: Position) => void
  setPositions: (positions: Record<string, Position>) => void
  clearPositions: () => void
  select: (id: string | null, kind: SelectedKind | null) => void
  toggleLabels: () => void
  reset: () => void
}

const initialState: State = {
  positions: {},
  selectedId: null,
  selectedKind: null,
  showLabels: true,
}

export const useNetworkViewerStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,

      setPosition: (flowNodeId, position) =>
        set((s) => ({
          positions: { ...s.positions, [flowNodeId]: position },
        })),

      setPositions: (positions) => set({ positions }),

      clearPositions: () => set({ positions: {} }),

      select: (selectedId, selectedKind) => set({ selectedId, selectedKind }),

      toggleLabels: () => set((s) => ({ showLabels: !s.showLabels })),

      reset: () => set(initialState),
    }),
    {
      name: "voltiq:network-viewer",
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
      partialize: (state) => ({
        positions: state.positions,
        showLabels: state.showLabels,
      }),
    },
  ),
)
