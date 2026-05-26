import type { NodeProps, Node } from "@xyflow/react"
import { Workflow } from "lucide-react"
import { NetworkNodeShell } from "./NetworkNodeShell"
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
  return (
    <NetworkNodeShell
      selected={selected}
      tone="warning"
      icon={<Workflow className="size-5" />}
      title={`${subestacion.id} · ${tipo ? `${tipo.kva} kVA` : "Transformador"}`}
      subtitle={
        <>
          {tipo ? (tipo.fases === "MONO" ? "Monofásico" : "Trifásico") : ""}
          {subestacion.voltaje ? ` · ${subestacion.voltaje} kV` : ""}
        </>
      }
    />
  )
}
