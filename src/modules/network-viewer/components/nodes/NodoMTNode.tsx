import type { Node, NodeProps } from "@xyflow/react"
import { CircleDot } from "lucide-react"
import { NetworkNodeShell } from "./NetworkNodeShell"
import type { NodoFlowData } from "../../lib/networkToFlow"

export function NodoMTNode({ data, selected }: NodeProps<Node<NodoFlowData>>) {
  const { nodo } = data
  return (
    <NetworkNodeShell
      selected={selected}
      tone="mt"
      icon={<CircleDot className="size-6" />}
      id={nodo.id}
      label={nodo.descripcion || "Nodo MT"}
      meta={nodo.voltajeKV ? `${nodo.voltajeKV} kV` : "MT"}
      hasSides
    />
  )
}
