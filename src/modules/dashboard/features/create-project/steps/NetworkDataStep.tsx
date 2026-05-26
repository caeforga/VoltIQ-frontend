import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import {
  networkSchema,
  type NetworkData,
  type NetworkDataInput,
} from "../schemas/network.schema"
import { useCreateProjectStore } from "../store/useCreateProjectStore"
import { useNetworkViewerStore } from "@/modules/network-viewer/store/useNetworkViewerStore"
import { NodosTable } from "../network/NodosTable"
import { LineasTable } from "../network/LineasTable"
import { SubestacionesTable } from "../network/SubestacionesTable"
import { CargasTable } from "../network/CargasTable"

const DEFAULT_VALUES: NetworkDataInput = {
  nodos: [],
  lineas: [],
  subestaciones: [],
  cargas: [],
}

export function NetworkDataStep() {
  const network = useCreateProjectStore((s) => s.network)
  const setNetwork = useCreateProjectStore((s) => s.setNetwork)
  const updateNetwork = useCreateProjectStore((s) => s.updateNetwork)
  const markCompleted = useCreateProjectStore((s) => s.markCompleted)
  const prev = useCreateProjectStore((s) => s.prev)
  const resetViewerPositions = useNetworkViewerStore((s) => s.clearPositions)
  const navigate = useNavigate()

  const form = useForm<NetworkDataInput, unknown, NetworkData>({
    resolver: zodResolver(networkSchema),
    defaultValues: {
      ...DEFAULT_VALUES,
      ...(network as NetworkDataInput),
    },
    mode: "onTouched",
  })

  // Backup en vivo: cada cambio del formulario persiste en el store
  // (sessionStorage) para no perder datos al recargar la página.
  useEffect(() => {
    const subscription = form.watch((values) => {
      updateNetwork(values as Partial<NetworkData>)
    })
    return () => subscription.unsubscribe()
  }, [form, updateNetwork])

  const onSubmit = (data: NetworkData) => {
    setNetwork(data)
    markCompleted("network")
    // Limpiar posiciones previas para forzar auto-layout con la red recién creada
    resetViewerPositions()
    toast.success("Proyecto creado", {
      description: "Abriendo el editor visual de red…",
    })
    navigate("/network")
  }

  const onInvalid = () => {
    toast.error("Revisa los datos del formulario", {
      description: "Hay campos faltantes o inválidos en las tablas.",
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className="space-y-6"
      >
        <div className="space-y-4">
          <NodosTable />
          <LineasTable />
          <SubestacionesTable />
          <CargasTable />
        </div>

        <div className="flex justify-between gap-2 pt-2">
          <Button type="button" variant="outline" onClick={prev}>
            Atrás
          </Button>
          <Button type="submit">Crear proyecto</Button>
        </div>
      </form>
    </Form>
  )
}
