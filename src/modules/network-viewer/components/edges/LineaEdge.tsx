import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
  type Edge,
} from "@xyflow/react"
import { CONDUCTORES } from "@/modules/dashboard/features/create-project/schemas/network.schema"
import { useNetworkViewerStore } from "../../store/useNetworkViewerStore"
import type { LineaFlowData } from "../../lib/networkToFlow"

const STROKE = "var(--primary)"

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
    borderRadius: 6,
  })

  const linea = data?.linea
  const conductor = linea
    ? CONDUCTORES.find((c) => c.id === linea.conductor)
    : undefined

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: STROKE,
          strokeWidth: selected ? 2.5 : 1.75,
        }}
      />
      {showLabels && linea && (
        <EdgeLabelRenderer>
          <div
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
            className="pointer-events-auto absolute select-none rounded-md border border-border bg-background/95 px-2 py-1 text-[10px] font-medium leading-tight shadow-sm backdrop-blur"
          >
            <div className="font-semibold">{linea.id}</div>
            <div className="text-muted-foreground">
              {linea.longitudM ? `${linea.longitudM} m` : "— m"}
              {conductor ? ` · ${conductor.label.replace("CABLE ", "")}` : ""}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
