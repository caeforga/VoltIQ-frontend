import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { StepsPanel } from "./StepsPanel"
import { useCreateProjectStore, type StepId } from "./store/useCreateProjectStore"
import { GeneralDataStep } from "./steps/GeneralDataStep"
import { LoadDataStep } from "./steps/LoadDataStep"
import { NetworkDataStep } from "./steps/NetworkDataStep"

const TITLES: Record<StepId, string> = {
  general: "Datos generales",
  load: "Datos de carga",
  network: "Datos de red",
}

const DESCRIPTIONS: Record<StepId, string> = {
  general: "Información del proyecto y normativa aplicable.",
  load: "Usuarios y cargas conectadas a la red.",
  network: "Topología: nodos (postes), líneas y transformadores.",
}

export function CreateProjectWizard() {
  const currentStep = useCreateProjectStore((s) => s.currentStep)

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Nuevo proyecto</h1>
        <p className="text-sm text-muted-foreground">
          Define los datos generales, las cargas y la topología de la red en
          tres pasos.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
        <StepsPanel />

        <Card>
          <CardHeader>
            <CardTitle>{TITLES[currentStep]}</CardTitle>
            <CardDescription>{DESCRIPTIONS[currentStep]}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === "general" && <GeneralDataStep />}
            {currentStep === "load" && <LoadDataStep />}
            {currentStep === "network" && <NetworkDataStep />}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
