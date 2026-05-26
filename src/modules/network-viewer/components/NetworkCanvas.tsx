import { useEffect, useMemo, useRef } from "react"
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Edge,
  type Node,
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
import { EdgeMarkers, LineaEdge } from "./edges/LineaEdge"
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

const MINIMAP_NODE_COLORS: Record<string, string> = {
  subestacion: "rgb(16 185 129)",
  nodoMT: "rgb(59 130 246)",
  nodoBT: "rgb(6 182 212)",
  transformador: "rgb(139 92 246)",
  carga: "rgb(244 63 94)",
}

function nodeColor(node: Node) {
  return MINIMAP_NODE_COLORS[node.type ?? ""] ?? "rgb(148 163 184)"
}

function NetworkCanvasInner() {
  const network = useCreateProjectStore((s) => s.network)
  const positionsFromStore = useNetworkViewerStore((s) => s.positions)
  const setPosition = useNetworkViewerStore((s) => s.setPosition)
  const setPositions = useNetworkViewerStore((s) => s.setPositions)
  const select = useNetworkViewerStore((s) => s.select)
  const selectedId = useNetworkViewerStore((s) => s.selectedId)

  const { fitView } = useReactFlow()
  const didAutoLayoutRef = useRef(false)

  // Construcción inicial con dagre si no hay posiciones aún. Hacemos esto
  // sincrónicamente en el primer mount para evitar parpadeo.
  const initial = useMemo(() => {
    const base = networkToFlow(network, positionsFromStore)
    const algunoSinPos = base.nodes.some(
      (n) => !positionsFromStore[n.id] && n.position.x === 0 && n.position.y === 0,
    )
    if (algunoSinPos && base.nodes.length > 0) {
      const laidOut = autoLayout(base.nodes, base.edges)
      return { nodes: laidOut, edges: base.edges }
    }
    return base
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<FlowNodeData>>(
    initial.nodes,
  )
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge<FlowEdgeData>>(
    initial.edges,
  )

  // Persistir layout inicial (auto-layout) al store si se generó aquí
  useEffect(() => {
    if (didAutoLayoutRef.current) return
    if (initial.nodes.length === 0) return
    const mapa: Record<string, { x: number; y: number }> = {
      ...positionsFromStore,
    }
    let dirty = false
    initial.nodes.forEach((n) => {
      if (!positionsFromStore[n.id]) {
        mapa[n.id] = n.position
        dirty = true
      }
    })
    if (dirty) setPositions(mapa)
    didAutoLayoutRef.current = true
    setTimeout(() => fitView({ duration: 400, padding: 0.2 }), 60)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-sincronizar cuando cambia la network (alta/baja/edición de datos).
  // Preserva posiciones del state local para que el drag no se resetee.
  useEffect(() => {
    const next = networkToFlow(network, positionsFromStore)
    setNodes((prev) => {
      const prevById = new Map(prev.map((n) => [n.id, n]))
      return next.nodes.map((n) => {
        const exist = prevById.get(n.id)
        if (exist) {
          return { ...n, position: exist.position, data: n.data }
        }
        // Nodo nuevo: usar posición del store si existe, si no centrarlo cerca
        // del origen para que el usuario lo encuentre rápido.
        return n
      })
    })
    setEdges(next.edges)
    // Sólo re-corremos cuando cambian los datos de network. Las posiciones
    // viven en el state local controlado por React Flow.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network])

  // Persistir posición sólo cuando termina el drag.
  const onNodeDragStop = (_e: React.MouseEvent, node: Node) => {
    setPosition(node.id, { x: node.position.x, y: node.position.y })
  }

  // Botón "Reorganizar": el toolbar llama a `requestRelayout()` en el store
  // y este efecto aplica dagre sobre el estado local + persiste posiciones.
  const relayoutTick = useNetworkViewerStore((s) => s.relayoutTick)
  const isFirstRelayoutRef = useRef(true)
  useEffect(() => {
    if (isFirstRelayoutRef.current) {
      isFirstRelayoutRef.current = false
      return
    }
    setNodes((current) => {
      const laidOut = autoLayout(current, edges)
      const mapa: Record<string, { x: number; y: number }> = {}
      laidOut.forEach((n) => {
        mapa[n.id] = n.position
      })
      setPositions(mapa)
      setTimeout(() => fitView({ duration: 400, padding: 0.2 }), 30)
      return laidOut
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relayoutTick])

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

  // Marcar nodos/edges seleccionados según el store (sin pisar el state local)
  const nodesWithSelection = useMemo(
    () =>
      nodes.map((n) => {
        const parsed = parseFlowId(n.id)
        const isSelected =
          !!selectedId &&
          parsed !== null &&
          parsed.rawId === selectedId &&
          (parsed.kind === "transformador" || parsed.kind === "nodo")
        return isSelected !== n.selected ? { ...n, selected: isSelected } : n
      }),
    [nodes, selectedId],
  )
  const edgesWithSelection = useMemo(
    () =>
      edges.map((e) => {
        const parsed = parseFlowId(e.id)
        const isSelected =
          !!selectedId && parsed?.kind === "linea" && parsed.rawId === selectedId
        return isSelected !== e.selected ? { ...e, selected: isSelected } : e
      }),
    [edges, selectedId],
  )

  return (
    <>
      <EdgeMarkers />
      <ReactFlow
        nodes={nodesWithSelection}
        edges={edgesWithSelection}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop}
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
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={0.7}
          className="opacity-60"
        />
        <Controls showInteractive={false} className="!bg-card !border !border-border !shadow-sm" />
        <MiniMap
          pannable
          zoomable
          nodeColor={nodeColor}
          nodeStrokeWidth={3}
          nodeBorderRadius={20}
          maskColor="color-mix(in oklab, var(--background) 70%, transparent)"
          className="!bg-card/80 !border !border-border !rounded-md backdrop-blur"
        />
      </ReactFlow>
    </>
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

/** Dispara un re-layout dagre sobre el grafo actual (lo aplica el canvas). */
export function useAutoLayoutTrigger() {
  return useNetworkViewerStore((s) => s.requestRelayout)
}
