import {
  BaseEdge,
  EdgeLabelRenderer,
  MarkerType,
  getSmoothStepPath,
  type Edge,
  type EdgeProps,
} from "@xyflow/react"
import { CONDUCTORES } from "@/modules/dashboard/features/create-project/schemas/network.schema"
import { useNetworkViewerStore } from "../../store/useNetworkViewerStore"
import type { LineaFlowData } from "../../lib/networkToFlow"

export function LineaEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps<Edge<LineaFlowData>>) {
  const showLabels = useNetworkViewerStore((s) => s.showLabels)
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 8,
  })

  const linea = data?.linea
  const conductor = linea
    ? CONDUCTORES.find((c) => c.id === linea.conductor)
    : undefined

  const conductorLabel = conductor?.label.replace("CABLE ", "")
  const longitudLabel =
    linea?.longitudM != null ? `${linea.longitudM} m` : null

  const stroke = selected ? "var(--primary)" : "color-mix(in oklab, var(--foreground) 60%, transparent)"

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={`url(#arrow-${selected ? "active" : "default"})`}
        style={{
          stroke,
          strokeWidth: selected ? 2.4 : 1.8,
          transition: "stroke 120ms, stroke-width 120ms",
        }}
      />
      {showLabels && linea && (longitudLabel || conductorLabel) && (
        <EdgeLabelRenderer>
          <div
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
            className="pointer-events-auto absolute flex select-none flex-col items-center gap-0.5"
          >
            <span className="rounded-sm bg-background/85 px-1.5 py-px font-mono text-[10px] font-semibold text-foreground/90 backdrop-blur">
              {linea.id}
            </span>
            <span className="rounded-sm bg-background/70 px-1.5 py-px text-[9px] text-muted-foreground backdrop-blur">
              {longitudLabel}
              {longitudLabel && conductorLabel ? " · " : ""}
              {conductorLabel}
            </span>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}

/**
 * Defs SVG global con dos marcadores (default + activo). Se inyecta una sola
 * vez dentro del canvas para que todas las líneas puedan referenciarlos.
 */
export function EdgeMarkers() {
  return (
    <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden>
      <defs>
        <marker
          id="arrow-default"
          viewBox="0 0 12 12"
          refX="9"
          refY="6"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path
            d="M2,2 L9,6 L2,10 Z"
            fill="color-mix(in oklab, var(--foreground) 60%, transparent)"
          />
        </marker>
        <marker
          id="arrow-active"
          viewBox="0 0 12 12"
          refX="9"
          refY="6"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M2,2 L9,6 L2,10 Z" fill="var(--primary)" />
        </marker>
      </defs>
    </svg>
  )
}

// Re-export por si en el futuro alguien quiere usar MarkerType de RF.
export { MarkerType }
