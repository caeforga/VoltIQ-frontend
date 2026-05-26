import type { Node, NodeProps } from "@xyflow/react"
import { Circle } from "lucide-react"
import { NetworkNodeShell } from "./NetworkNodeShell"
import type { NodoFlowData } from "../../lib/networkToFlow"

export function NodoBTNode({ data, selected }: NodeProps<Node<NodoFlowData>>) {
  const { nodo } = data
  return (
    <NetworkNodeShell
      selected={selected}
      tone="bt"
      icon={<Circle className="size-5" />}
      id={nodo.id}
      label={nodo.descripcion || "Nodo BT"}
      meta={nodo.voltajeKV ? `${nodo.voltajeKV} kV` : "BT"}
      hasSides
    />
  )
}
