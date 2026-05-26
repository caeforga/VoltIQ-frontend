import {
  BaseEdge,
  getSmoothStepPath,
  type EdgeProps,
  type Edge,
} from "@xyflow/react"
import type { LineaVirtualFlowData } from "../../lib/networkToFlow"

/**
 * Edge punteado para conexiones derivadas (nodo MT → transformador).
 * No es seleccionable ni mostrable como línea editable.
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
        stroke: "var(--muted-foreground)",
        strokeWidth: 1.25,
        strokeDasharray: "4 3",
        opacity: 0.7,
      }}
    />
  )
}
