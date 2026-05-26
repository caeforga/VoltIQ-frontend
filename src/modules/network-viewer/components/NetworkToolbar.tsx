import { Eye, EyeOff, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNetworkViewerStore } from "../store/useNetworkViewerStore"
import { useAutoLayoutTrigger } from "./NetworkCanvas"

export function NetworkToolbar() {
  const showLabels = useNetworkViewerStore((s) => s.showLabels)
  const toggleLabels = useNetworkViewerStore((s) => s.toggleLabels)
  const triggerLayout = useAutoLayoutTrigger()

  return (
    <div className="flex items-center gap-2 border-b border-border bg-card/60 px-3 py-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={triggerLayout}
      >
        <LayoutGrid className="mr-1.5 size-3.5" />
        Reorganizar
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={toggleLabels}
      >
        {showLabels ? (
          <EyeOff className="mr-1.5 size-3.5" />
        ) : (
          <Eye className="mr-1.5 size-3.5" />
        )}
        {showLabels ? "Ocultar etiquetas" : "Mostrar etiquetas"}
      </Button>
    </div>
  )
}
