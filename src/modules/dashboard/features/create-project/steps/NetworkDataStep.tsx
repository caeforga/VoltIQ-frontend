import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import {
  networkSchema,
  type NetworkData,
  type NetworkDataInput,
} from "../schemas/network.schema"
import { useCreateProjectStore } from "../store/useCreateProjectStore"
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
  const markCompleted = useCreateProjectStore((s) => s.markCompleted)
  const prev = useCreateProjectStore((s) => s.prev)

  const form = useForm<NetworkDataInput, unknown, NetworkData>({
    resolver: zodResolver(networkSchema),
    defaultValues: {
      ...DEFAULT_VALUES,
      ...(network as NetworkDataInput),
    },
    mode: "onTouched",
  })

  const onSubmit = (data: NetworkData) => {
    setNetwork(data)
    markCompleted("network")
    toast.success("Proyecto listo para crearse", {
      description: "La integración con backend se implementará después.",
    })
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
