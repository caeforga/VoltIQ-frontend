import type { NodeProps, Node } from "@xyflow/react"
import { Home } from "lucide-react"
import { NetworkNodeShell } from "./NetworkNodeShell"
import type { NodoFlowData } from "../../lib/networkToFlow"

export function CargaNode({ data, selected }: NodeProps<Node<NodoFlowData>>) {
  const { nodo, carga } = data
  const badges = carga ? (
    <>
      <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-medium text-foreground">
        {carga.potenciaKVA} kVA
      </span>
      <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-medium text-foreground">
        FP {String(carga.fp).replace(".", ",")}
      </span>
    </>
  ) : (
    <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
      Sin carga
    </span>
  )

  return (
    <NetworkNodeShell
      selected={selected}
      tone="destructive"
      icon={<Home className="size-5" />}
      title={`${nodo.id} · ${nodo.descripcion || "Carga"}`}
      subtitle={nodo.clase || "Carga"}
      badges={badges}
      hasBottom={false}
    />
  )
}
