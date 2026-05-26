import { useEffect, useMemo, useRef } from "react"
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type NodeChange,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { useCreateProjectStore } from "@/modules/dashboard/features/create-project/store/useCreateProjectStore"
import {
  networkToFlow,
  parseFlowId,
  type FlowEdgeData,
  type FlowNodeData,
} from "../lib/networkToFlow"
import { autoLayout } from "../lib/autoLayout"
import { useNetworkViewerStore } from "../store/useNetworkViewerStore"
import { SubestacionNode } from "./nodes/SubestacionNode"
import { NodoMTNode } from "./nodes/NodoMTNode"
import { NodoBTNode } from "./nodes/NodoBTNode"
import { CargaNode } from "./nodes/CargaNode"
import { TransformadorNode } from "./nodes/TransformadorNode"
import { LineaEdge } from "./edges/LineaEdge"
import { LineaVirtualEdge } from "./edges/LineaVirtualEdge"

const NODE_TYPES = {
  subestacion: SubestacionNode,
  nodoMT: NodoMTNode,
  nodoBT: NodoBTNode,
  carga: CargaNode,
  transformador: TransformadorNode,
}

const EDGE_TYPES = {
  linea: LineaEdge,
  lineaVirtual: LineaVirtualEdge,
}

function NetworkCanvasInner() {
  const network = useCreateProjectStore((s) => s.network)
  const positions = useNetworkViewerStore((s) => s.positions)
  const setPosition = useNetworkViewerStore((s) => s.setPosition)
  const setPositions = useNetworkViewerStore((s) => s.setPositions)
  const select = useNetworkViewerStore((s) => s.select)
  const selectedId = useNetworkViewerStore((s) => s.selectedId)

  const { fitView } = useReactFlow()
  const didAutoLayoutRef = useRef(false)

  const { nodes, edges } = useMemo(
    () => networkToFlow(network, positions),
    [network, positions],
  )

  // Auto-layout inicial: si ninguno tiene posición persistida, calcular con dagre.
  useEffect(() => {
    if (didAutoLayoutRef.current) return
    if (nodes.length === 0) return
    const algunoSinPos = nodes.some(
      (n) => !positions[n.id] && n.position.x === 0 && n.position.y === 0,
    )
    if (!algunoSinPos) {
      didAutoLayoutRef.current = true
      return
    }
    const laidOut = autoLayout(nodes, edges)
    const mapa: Record<string, { x: number; y: number }> = { ...positions }
    laidOut.forEach((n) => {
      mapa[n.id] = n.position
    })
    setPositions(mapa)
    didAutoLayoutRef.current = true
    // Pequeño delay para que React Flow renderice antes del fit
    setTimeout(() => fitView({ duration: 400, padding: 0.2 }), 50)
  }, [nodes, edges, positions, setPositions, fitView])

  const handleNodesChange = (changes: NodeChange[]) => {
    changes.forEach((c) => {
      if (c.type === "position" && c.position && c.dragging === false) {
        setPosition(c.id, c.position)
      }
    })
  }

  const handleNodeClick = (
    _evt: React.MouseEvent,
    node: Node<FlowNodeData>,
  ) => {
    const parsed = parseFlowId(node.id)
    if (!parsed) return
    if (parsed.kind === "transformador") {
      select(parsed.rawId, "transformador")
    } else if (parsed.kind === "nodo") {
      const nodo = node.data.kind === "nodo" ? node.data.nodo : null
      select(parsed.rawId, nodo?.tipo === "CARGA" ? "carga" : "nodo")
    }
  }

  const handleEdgeClick = (
    _evt: React.MouseEvent,
    edge: Edge<FlowEdgeData>,
  ) => {
    if (edge.data?.kind !== "linea") return
    const parsed = parseFlowId(edge.id)
    if (parsed?.kind === "linea") select(parsed.rawId, "linea")
  }

  const handlePaneClick = () => select(null, null)

  // Marcar nodos/edges seleccionados según el store
  const nodesWithSelection = useMemo(
    () =>
      nodes.map((n) => {
        const parsed = parseFlowId(n.id)
        const isSelected =
          !!selectedId &&
          parsed !== null &&
          parsed.rawId === selectedId &&
          (parsed.kind === "transformador" || parsed.kind === "nodo")
        return { ...n, selected: isSelected }
      }),
    [nodes, selectedId],
  )
  const edgesWithSelection = useMemo(
    () =>
      edges.map((e) => {
        const parsed = parseFlowId(e.id)
        const isSelected =
          !!selectedId && parsed?.kind === "linea" && parsed.rawId === selectedId
        return { ...e, selected: isSelected }
      }),
    [edges, selectedId],
  )

  return (
    <ReactFlow
      nodes={nodesWithSelection}
      edges={edgesWithSelection}
      nodeTypes={NODE_TYPES}
      edgeTypes={EDGE_TYPES}
      onNodesChange={handleNodesChange}
      onNodeClick={handleNodeClick}
      onEdgeClick={handleEdgeClick}
      onPaneClick={handlePaneClick}
      proOptions={{ hideAttribution: true }}
      fitView
      minZoom={0.2}
      maxZoom={2}
      nodesDraggable
      nodesConnectable={false}
      elementsSelectable
    >
      <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      <Controls showInteractive={false} />
      <MiniMap pannable zoomable className="!bg-card !border-border" />
    </ReactFlow>
  )
}

/**
 * Lienzo de visualización/edición de la red.
 * Envuelve React Flow con su provider y se integra con los stores.
 */
export function NetworkCanvas() {
  return (
    <ReactFlowProvider>
      <NetworkCanvasInner />
    </ReactFlowProvider>
  )
}

/** Hook reexportado para que la página pueda disparar reorganizar. */
export function useAutoLayoutTrigger() {
  const positions = useNetworkViewerStore((s) => s.positions)
  const setPositions = useNetworkViewerStore((s) => s.setPositions)
  const network = useCreateProjectStore((s) => s.network)
  return () => {
    const { nodes, edges } = networkToFlow(network, positions)
    const laidOut = autoLayout(nodes, edges)
    const mapa: Record<string, { x: number; y: number }> = {}
    laidOut.forEach((n) => {
      mapa[n.id] = n.position
    })
    setPositions(mapa)
  }
}
