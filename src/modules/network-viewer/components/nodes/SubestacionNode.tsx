import type { Node, NodeProps } from "@xyflow/react"
import { NetworkNodeShell } from "./NetworkNodeShell"
import { SubestacionSymbol } from "./symbols"
import type { NodoFlowData } from "../../lib/networkToFlow"

export function SubestacionNode({
  data,
  selected,
}: NodeProps<Node<NodoFlowData>>) {
  const { nodo } = data
  return (
    <NetworkNodeShell
      selected={selected}
      tone="se"
      icon={<SubestacionSymbol className="size-6" />}
      id={nodo.id}
      label={nodo.descripcion || "Subestación"}
      meta={nodo.voltajeKV ? `${nodo.voltajeKV} kV` : undefined}
      hasTop={false}
    />
  )
}
