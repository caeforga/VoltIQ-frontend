import { Link } from "react-router-dom"
import { ArrowRight, Network as NetworkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCreateProjectStore } from "@/modules/dashboard/features/create-project/store/useCreateProjectStore"
import { NetworkCanvas } from "../components/NetworkCanvas"
import { NetworkToolbar } from "../components/NetworkToolbar"
import { ElementsListPanel } from "../components/ElementsListPanel"
import { PropertiesPanel } from "../components/PropertiesPanel"

export function NetworkViewer() {
  const general = useCreateProjectStore((s) => s.general)
  const network = useCreateProjectStore((s) => s.network)

  const totalElementos =
    (network.nodos?.length ?? 0) +
    (network.lineas?.length ?? 0) +
    (network.subestaciones?.length ?? 0) +
    (network.cargas?.length ?? 0)

  if (totalElementos === 0) {
    return <EmptyState />
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <Header
        projectName={general.proyecto || "Proyecto sin nombre"}
        operador={general.operadorRed}
        tension={
          typeof general.nivelTensionMT === "number"
            ? general.nivelTensionMT
            : undefined
        }
      />
      <div className="grid flex-1 grid-cols-[300px_1fr_360px] overflow-hidden">
        <aside className="border-r border-border bg-card/40">
          <ElementsListPanel />
        </aside>
        <main className="flex flex-col overflow-hidden">
          <NetworkToolbar />
          <div className="relative flex-1 bg-background">
            <NetworkCanvas />
          </div>
        </main>
        <aside className="border-l border-border bg-card/40">
          <PropertiesPanel />
        </aside>
      </div>
    </div>
  )
}

function Header({
  projectName,
  operador,
  tension,
}: {
  projectName: string
  operador?: string
  tension?: number
}) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card/60 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
          <NetworkIcon className="size-5" />
        </div>
        <div>
          <h1 className="text-base font-semibold leading-tight">
            {projectName}
          </h1>
          <p className="text-xs text-muted-foreground">
            {operador ? operador : "Operador no definido"}
            {tension ? ` · Nivel MT ${tension} kV` : ""}
          </p>
        </div>
      </div>
    </header>
  )
}

function EmptyState() {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-8">
      <div className="max-w-md space-y-4 rounded-lg border border-dashed border-border bg-card/40 p-8 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <NetworkIcon className="size-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Editor de red vacío</h2>
          <p className="text-sm text-muted-foreground">
            Aún no has creado un proyecto con datos de red. Define al menos un
            nodo, una línea y un transformador desde el wizard de creación.
          </p>
        </div>
        <Button asChild>
          <Link to="/">
            Crear proyecto
            <ArrowRight className="ml-1 size-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
