import type { Node, NodeProps } from "@xyflow/react"
import { NetworkNodeShell } from "./NetworkNodeShell"
import { TrafoSymbol } from "./symbols"
import { TIPOS_TRANSFORMADOR } from "@/modules/dashboard/features/create-project/schemas/network.schema"
import type { TransformadorFlowData } from "../../lib/networkToFlow"

export function TransformadorNode({
  data,
  selected,
}: NodeProps<Node<TransformadorFlowData>>) {
  const { subestacion } = data
  const tipo = TIPOS_TRANSFORMADOR.find(
    (t) => t.id === subestacion.tipoTransformadorId,
  )

  const label = tipo
    ? `${tipo.kva} kVA · ${tipo.fases === "MONO" ? "Mono" : "Tri"}`
    : "Transformador"

  return (
    <NetworkNodeShell
      selected={selected}
      tone="trafo"
      icon={<TrafoSymbol className="size-6" />}
      id={subestacion.id}
      label={label}
      meta={subestacion.voltaje ? `${subestacion.voltaje} kV` : undefined}
    />
  )
}
