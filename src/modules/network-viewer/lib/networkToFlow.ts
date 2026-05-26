import type { Edge, Node } from "@xyflow/react"
import type {
  Carga,
  Linea,
  NetworkData,
  Nodo,
  Subestacion,
} from "@/modules/dashboard/features/create-project/schemas/network.schema"

// ──────────────────────────────────────────────────────────────────────────
// Tipos de nodos y edges en React Flow (data adjuntada)
// ──────────────────────────────────────────────────────────────────────────

export type FlowNodeKind = "nodo" | "transformador"

export type NodoFlowData = {
  kind: "nodo"
  nodo: Nodo
  /** Carga asociada (si el nodo es de tipo CARGA y existe en `cargas[]`). */
  carga?: Carga
}

export type TransformadorFlowData = {
  kind: "transformador"
  subestacion: Subestacion
  /** Nodo anfitrión al que está asignado el transformador. */
  hostNodoId: string
}

export type FlowNodeData = NodoFlowData | TransformadorFlowData

export type FlowEdgeKind = "linea" | "linea-virtual"

export type LineaFlowData = {
  kind: "linea"
  linea: Linea
}

export type LineaVirtualFlowData = {
  kind: "linea-virtual"
  /** id del nodo MT/anfitrión del transformador. */
  hostNodoId: string
  /** id de la subestación (transformador). */
  transformadorId: string
}

export type FlowEdgeData = LineaFlowData | LineaVirtualFlowData

// ──────────────────────────────────────────────────────────────────────────
// IDs estables (prefijo para evitar colisiones)
// ──────────────────────────────────────────────────────────────────────────

export const NODE_PREFIX = "node:"
export const TX_PREFIX = "tx:"
export const EDGE_PREFIX = "edge:"
export const VIRTUAL_EDGE_PREFIX = "vedge:"

export const nodeFlowId = (nodoId: string) => `${NODE_PREFIX}${nodoId}`
export const txFlowId = (subId: string) => `${TX_PREFIX}${subId}`
export const edgeFlowId = (lineaId: string) => `${EDGE_PREFIX}${lineaId}`
export const virtualEdgeFlowId = (subId: string) =>
  `${VIRTUAL_EDGE_PREFIX}${subId}`

/** Recupera el id original del schema desde un id de React Flow. */
export function parseFlowId(
  id: string,
):
  | { kind: "nodo"; rawId: string }
  | { kind: "transformador"; rawId: string }
  | { kind: "linea"; rawId: string }
  | { kind: "linea-virtual"; rawId: string }
  | null {
  if (id.startsWith(NODE_PREFIX))
    return { kind: "nodo", rawId: id.slice(NODE_PREFIX.length) }
  if (id.startsWith(TX_PREFIX))
    return { kind: "transformador", rawId: id.slice(TX_PREFIX.length) }
  if (id.startsWith(VIRTUAL_EDGE_PREFIX))
    return {
      kind: "linea-virtual",
      rawId: id.slice(VIRTUAL_EDGE_PREFIX.length),
    }
  if (id.startsWith(EDGE_PREFIX))
    return { kind: "linea", rawId: id.slice(EDGE_PREFIX.length) }
  return null
}

// ──────────────────────────────────────────────────────────────────────────
// Conversión NetworkData → { nodes, edges } de React Flow
// ──────────────────────────────────────────────────────────────────────────

function nodoFlowType(tipo: Nodo["tipo"]): string {
  switch (tipo) {
    case "SUBESTACION":
      return "subestacion"
    case "NODO_MT":
      return "nodoMT"
    case "NODO_BT":
      return "nodoBT"
    case "CARGA":
      return "carga"
  }
}

export function networkToFlow(
  network: Partial<NetworkData>,
  positions: Record<string, { x: number; y: number }> = {},
): { nodes: Node<FlowNodeData>[]; edges: Edge<FlowEdgeData>[] } {
  const nodos = network.nodos ?? []
  const lineas = network.lineas ?? []
  const subestaciones = network.subestaciones ?? []
  const cargas = network.cargas ?? []

  const cargaPorNodo = new Map<string, Carga>()
  cargas.forEach((c) => {
    if (c?.nodoId) cargaPorNodo.set(c.nodoId, c)
  })

  const nodes: Node<FlowNodeData>[] = []

  nodos.forEach((nodo) => {
    if (!nodo?.id) return
    const id = nodeFlowId(nodo.id)
    nodes.push({
      id,
      type: nodoFlowType(nodo.tipo),
      position: positions[id] ?? { x: 0, y: 0 },
      data: {
        kind: "nodo",
        nodo,
        carga: cargaPorNodo.get(nodo.id),
      },
    })
  })

  subestaciones.forEach((sub) => {
    if (!sub?.id) return
    const id = txFlowId(sub.id)
    nodes.push({
      id,
      type: "transformador",
      position: positions[id] ?? { x: 0, y: 0 },
      data: {
        kind: "transformador",
        subestacion: sub,
        hostNodoId: sub.nodoId,
      },
    })
  })

  const edges: Edge<FlowEdgeData>[] = []

  lineas.forEach((linea) => {
    if (!linea?.id || !linea.origen || !linea.destino) return
    edges.push({
      id: edgeFlowId(linea.id),
      source: nodeFlowId(linea.origen),
      target: nodeFlowId(linea.destino),
      type: "linea",
      data: { kind: "linea", linea },
    })
  })

  subestaciones.forEach((sub) => {
    if (!sub?.id || !sub.nodoId) return
    edges.push({
      id: virtualEdgeFlowId(sub.id),
      source: nodeFlowId(sub.nodoId),
      target: txFlowId(sub.id),
      type: "lineaVirtual",
      selectable: false,
      data: {
        kind: "linea-virtual",
        hostNodoId: sub.nodoId,
        transformadorId: sub.id,
      },
    })
  })

  return { nodes, edges }
}
