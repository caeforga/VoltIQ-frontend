import dagre from "@dagrejs/dagre"
import type { Edge, Node } from "@xyflow/react"

const NODE_WIDTH = 110
const NODE_HEIGHT = 110

/**
 * Calcula posiciones jerárquicas (top-bottom) con dagre.
 * Útil como layout inicial; el usuario luego puede arrastrar nodos
 * y persistir posiciones manuales en `useNetworkViewerStore`.
 */
export function autoLayout<T extends Node, E extends Edge>(
  nodes: readonly T[],
  edges: readonly E[],
  options: { rankdir?: "TB" | "LR"; ranksep?: number; nodesep?: number } = {},
): T[] {
  const { rankdir = "TB", ranksep = 140, nodesep = 70 } = options

  const g = new dagre.graphlib.Graph({ multigraph: true })
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir, ranksep, nodesep, marginx: 24, marginy: 24 })

  nodes.forEach((n) => {
    const w = (n.width as number | undefined) ?? NODE_WIDTH
    const h = (n.height as number | undefined) ?? NODE_HEIGHT
    g.setNode(n.id, { width: w, height: h })
  })

  edges.forEach((e) => {
    g.setEdge(e.source, e.target, {}, e.id)
  })

  dagre.layout(g)

  return nodes.map((n) => {
    const pos = g.node(n.id)
    const w = (n.width as number | undefined) ?? NODE_WIDTH
    const h = (n.height as number | undefined) ?? NODE_HEIGHT
    return {
      ...n,
      position: pos
        ? { x: pos.x - w / 2, y: pos.y - h / 2 }
        : (n.position ?? { x: 0, y: 0 }),
    }
  })
}
