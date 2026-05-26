import type { Edge, Node } from "@xyflow/react"
import type {
  Carga,
  Linea,
  NetworkData,
  Nodo,
  Subestacion,
} from "@/modules/dashboard/features/create-project/schemas/network.schema"

// ──────────────────────────────────────────────────────────────────────────
// Modelo: transformadores en serie
// ──────────────────────────────────────────────────────────────────────────
//
// Para cada subestación T con `nodoId = X`:
//   - Si X tiene líneas de bajada (origen X, destino BT o CARGA), T se inserta
//     ENTRE X y esos destinos: X -.virtual.→ T -─línea─→ Y_BT
//   - Si no, T se renderiza colgante con una línea virtual desde X.
//
// El edge de la línea reescrita conserva su id (`edge:Lx`) para que la
// selección/edición siga apuntando a la línea original del schema.
//
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
  hostNodoId: string
}

export type FlowNodeData = NodoFlowData | TransformadorFlowData

export type FlowEdgeKind = "linea" | "linea-virtual"

export type LineaFlowData = {
  kind: "linea"
  linea: Linea
  /** True cuando la línea fue remapeada para salir del transformador. */
  remapped?: boolean
}

export type LineaVirtualFlowData = {
  kind: "linea-virtual"
  hostNodoId: string
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
// Helpers
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

const esBT = (tipo: Nodo["tipo"] | undefined) =>
  tipo === "NODO_BT" || tipo === "CARGA"

// ──────────────────────────────────────────────────────────────────────────
// Conversión NetworkData → { nodes, edges } de React Flow
// ──────────────────────────────────────────────────────────────────────────

export function networkToFlow(
  network: Partial<NetworkData>,
  positions: Record<string, { x: number; y: number }> = {},
): { nodes: Node<FlowNodeData>[]; edges: Edge<FlowEdgeData>[] } {
  const nodos = network.nodos ?? []
  const lineas = network.lineas ?? []
  const subestaciones = network.subestaciones ?? []
  const cargas = network.cargas ?? []

  const nodoPorId = new Map<string, Nodo>()
  nodos.forEach((n) => {
    if (n?.id) nodoPorId.set(n.id, n)
  })

  const cargaPorNodo = new Map<string, Carga>()
  cargas.forEach((c) => {
    if (c?.nodoId) cargaPorNodo.set(c.nodoId, c)
  })

  // Para cada nodo MT/SE: lista de líneas de bajada (a BT/CARGA)
  const bajadaPorNodo = new Map<string, Linea[]>()
  lineas.forEach((l) => {
    if (!l?.origen || !l?.destino) return
    const origen = nodoPorId.get(l.origen)
    const destino = nodoPorId.get(l.destino)
    if (!origen || !destino) return
    if (!esBT(origen.tipo) && esBT(destino.tipo)) {
      const lista = bajadaPorNodo.get(l.origen) ?? []
      lista.push(l)
      bajadaPorNodo.set(l.origen, lista)
    }
  })

  // Mapa de líneas remapeadas: id de línea → id del transformador que la "intercepta"
  const lineaRemapeadaPorTrafo = new Map<string, string>()
  subestaciones.forEach((sub) => {
    if (!sub?.id || !sub.nodoId) return
    const bajada = bajadaPorNodo.get(sub.nodoId) ?? []
    bajada.forEach((l) => {
      // Si una línea ya fue tomada por otro trafo del mismo nodo, dejamos al
      // primero (escenario raro; el usuario debería tener 1 trafo por nodo MT).
      if (!lineaRemapeadaPorTrafo.has(l.id)) {
        lineaRemapeadaPorTrafo.set(l.id, sub.id)
      }
    })
  })

  // ── Nodos ───────────────────────────────────────────────────────────────
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

  // ── Edges ───────────────────────────────────────────────────────────────
  const edges: Edge<FlowEdgeData>[] = []

  lineas.forEach((linea) => {
    if (!linea?.id || !linea.origen || !linea.destino) return
    const interceptadaPor = lineaRemapeadaPorTrafo.get(linea.id)
    const sourceFlowId = interceptadaPor
      ? txFlowId(interceptadaPor)
      : nodeFlowId(linea.origen)
    edges.push({
      id: edgeFlowId(linea.id),
      source: sourceFlowId,
      target: nodeFlowId(linea.destino),
      type: "linea",
      data: { kind: "linea", linea, remapped: !!interceptadaPor },
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
