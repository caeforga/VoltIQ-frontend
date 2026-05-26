import type { NodeProps, Node } from "@xyflow/react"
import { Circle } from "lucide-react"
import { NetworkNodeShell } from "./NetworkNodeShell"
import type { NodoFlowData } from "../../lib/networkToFlow"

export function NodoBTNode({
  data,
  selected,
}: NodeProps<Node<NodoFlowData>>) {
  const { nodo } = data
  return (
    <NetworkNodeShell
      selected={selected}
      tone="accent"
      icon={<Circle className="size-5" />}
      title={`${nodo.id} · ${nodo.descripcion || "Nodo BT"}`}
      subtitle={
        <>
          {nodo.voltajeKV ? `${nodo.voltajeKV} kV` : "BT"}
          {nodo.clase ? ` · ${nodo.clase}` : ""}
        </>
      }
      hasSides
    />
  )
}
