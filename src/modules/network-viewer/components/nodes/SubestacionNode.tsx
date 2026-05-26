import type { NodeProps, Node } from "@xyflow/react"
import { RadioTower } from "lucide-react"
import { NetworkNodeShell } from "./NetworkNodeShell"
import type { NodoFlowData } from "../../lib/networkToFlow"

export function SubestacionNode({
  data,
  selected,
}: NodeProps<Node<NodoFlowData>>) {
  const { nodo } = data
  return (
    <NetworkNodeShell
      selected={selected}
      tone="success"
      icon={<RadioTower className="size-5" />}
      title={`${nodo.id} · ${nodo.descripcion || "Subestación"}`}
      subtitle={nodo.voltajeKV ? `${nodo.voltajeKV} kV` : nodo.clase}
      hasTop={false}
    />
  )
}
