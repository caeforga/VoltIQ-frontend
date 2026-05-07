import { Button } from "@/components/ui/button"
import { Network } from "lucide-react"
import { toast } from "sonner"
import { useCreateProjectStore } from "../store/useCreateProjectStore"

export function NetworkDataStep() {
  const prev = useCreateProjectStore((s) => s.prev)
  const markCompleted = useCreateProjectStore((s) => s.markCompleted)

  const handleCreate = () => {
    markCompleted("network")
    toast.success("Proyecto listo para crearse", {
      description: "La integración con backend se implementará después.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-12 text-center">
        <Network className="size-10 text-muted-foreground/60" />
        <div className="space-y-1">
          <p className="text-sm font-medium">Topología de la red</p>
          <p className="text-xs text-muted-foreground">
            Aquí irán las tablas de nodos (postes), líneas (cables) y
            transformadores que conforman la red radial.
          </p>
        </div>
      </div>

      <div className="flex justify-between gap-2 pt-2">
        <Button variant="outline" onClick={prev}>
          Atrás
        </Button>
        <Button onClick={handleCreate}>Crear proyecto</Button>
      </div>
    </div>
  )
}
