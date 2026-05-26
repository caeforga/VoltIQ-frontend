import type { NodeProps, Node } from "@xyflow/react"
import { CircleDot } from "lucide-react"
import { NetworkNodeShell } from "./NetworkNodeShell"
import type { NodoFlowData } from "../../lib/networkToFlow"

export function NodoMTNode({
  data,
  selected,
}: NodeProps<Node<NodoFlowData>>) {
  const { nodo } = data
  return (
    <NetworkNodeShell
      selected={selected}
      tone="primary"
      icon={<CircleDot className="size-5" />}
      title={`${nodo.id} · ${nodo.descripcion || "Nodo MT"}`}
      subtitle={
        <>
          {nodo.voltajeKV ? `${nodo.voltajeKV} kV` : "MT"}
          {nodo.clase ? ` · ${nodo.clase}` : ""}
        </>
      }
      hasSides
    />
  )
}
