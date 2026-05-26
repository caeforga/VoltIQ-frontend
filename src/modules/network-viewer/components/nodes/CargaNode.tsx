import type { Node, NodeProps } from "@xyflow/react"
import { Home } from "lucide-react"
import { NetworkNodeShell } from "./NetworkNodeShell"
import type { NodoFlowData } from "../../lib/networkToFlow"

export function CargaNode({ data, selected }: NodeProps<Node<NodoFlowData>>) {
  const { nodo, carga } = data

  const meta = carga ? (
    <span>
      {carga.potenciaKVA != null ? `${carga.potenciaKVA} kVA` : "—"}
      {carga.fp != null
        ? ` · FP ${String(carga.fp).replace(".", ",")}`
        : ""}
    </span>
  ) : (
    <span className="italic text-muted-foreground">sin carga</span>
  )

  return (
    <NetworkNodeShell
      selected={selected}
      tone="carga"
      icon={<Home className="size-5" />}
      id={nodo.id}
      label={nodo.descripcion || "Carga"}
      meta={meta}
      hasBottom={false}
    />
  )
}
