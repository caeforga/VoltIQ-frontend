import {
  BaseEdge,
  getSmoothStepPath,
  type Edge,
  type EdgeProps,
} from "@xyflow/react"
import type { LineaVirtualFlowData } from "../../lib/networkToFlow"

/**
 * Edge punteado para la conexión nodo MT → transformador.
 * Visualmente sutil y no seleccionable.
 */
export function LineaVirtualEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps<Edge<LineaVirtualFlowData>>) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 6,
  })

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{
        stroke: "color-mix(in oklab, var(--muted-foreground) 70%, transparent)",
        strokeWidth: 1.2,
        strokeDasharray: "3 3",
        opacity: 0.55,
      }}
    />
  )
}
