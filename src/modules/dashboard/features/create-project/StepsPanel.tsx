import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Check, FileText, Network, Plug } from "lucide-react"
import {
  STEP_ORDER,
  useCreateProjectStore,
  type StepId,
} from "./store/useCreateProjectStore"

type StepMeta = {
  label: string
  subtitle: string
  icon: React.ElementType
}

const META: Record<StepId, StepMeta> = {
  general: {
    label: "Datos generales",
    subtitle: "Información del proyecto",
    icon: FileText,
  },
  load: {
    label: "Datos de carga",
    subtitle: "Usuarios conectados",
    icon: Plug,
  },
  network: {
    label: "Datos de red",
    subtitle: "Nodos, líneas y trafos",
    icon: Network,
  },
}

export function StepsPanel() {
  const currentStep = useCreateProjectStore((s) => s.currentStep)
  const completed = useCreateProjectStore((s) => s.completed)
  const setStep = useCreateProjectStore((s) => s.setStep)

  const currentIdx = STEP_ORDER.indexOf(currentStep)

  return (
    <Card className="h-fit p-2 lg:sticky lg:top-4">
      <ol className="flex flex-col gap-1">
        {STEP_ORDER.map((id, idx) => {
          const meta = META[id]
          const Icon = meta.icon
          const isCurrent = id === currentStep
          const isDone = completed[id]
          const canJump = isDone || idx <= currentIdx

          return (
            <li key={id}>
              <button
                type="button"
                disabled={!canJump}
                onClick={() => setStep(id)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-md p-3 text-left transition-colors",
                  "hover:bg-sidebar-accent/30 disabled:cursor-not-allowed disabled:opacity-50",
                  isCurrent &&
                    "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent",
                )}
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                    isDone
                      ? "border-primary bg-primary text-primary-foreground"
                      : isCurrent
                        ? "border-sidebar-accent-foreground"
                        : "border-muted-foreground/40 text-muted-foreground",
                  )}
                >
                  {isDone ? <Check className="size-4" /> : idx + 1}
                </span>

                <div className="flex flex-col">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <Icon className="size-4" />
                    {meta.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {meta.subtitle}
                  </span>
                </div>
              </button>
            </li>
          )
        })}
      </ol>
    </Card>
  )
}
