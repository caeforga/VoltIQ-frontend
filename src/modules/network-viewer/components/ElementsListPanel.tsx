import { Fragment } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCreateProjectStore } from "@/modules/dashboard/features/create-project/store/useCreateProjectStore"
import {
  createEmptyCarga,
  createEmptyLinea,
  createEmptyNodo,
  createEmptySubestacion,
} from "@/modules/dashboard/features/create-project/network/helpers"
import {
  TIPO_NODO_LABELS,
  TIPOS_TRANSFORMADOR,
  type NetworkData,
} from "@/modules/dashboard/features/create-project/schemas/network.schema"
import { useNetworkViewerStore } from "../store/useNetworkViewerStore"

type Section = "nodos" | "lineas" | "subestaciones" | "cargas"

const TITLES: Record<Section, string> = {
  nodos: "Nodos",
  lineas: "Líneas",
  subestaciones: "Transformadores",
  cargas: "Cargas",
}

export function ElementsListPanel() {
  const network = useCreateProjectStore((s) => s.network)
  const updateNetwork = useCreateProjectStore((s) => s.updateNetwork)
  const selectedId = useNetworkViewerStore((s) => s.selectedId)
  const selectedKind = useNetworkViewerStore((s) => s.selectedKind)
  const select = useNetworkViewerStore((s) => s.select)

  const nodos = network.nodos ?? []
  const lineas = network.lineas ?? []
  const subestaciones = network.subestaciones ?? []
  const cargas = network.cargas ?? []

  const addNodo = () => {
    const nuevo = createEmptyNodo(nodos)
    const next = [...nodos, nuevo] as unknown as NetworkData["nodos"]
    updateNetwork({ nodos: next })
    select(nuevo.id, "nodo")
  }

  const addLinea = () => {
    const nuevo = createEmptyLinea(lineas)
    const next = [...lineas, nuevo] as unknown as NetworkData["lineas"]
    updateNetwork({ lineas: next })
    select(nuevo.id, "linea")
  }

  const addSubestacion = () => {
    const nuevo = createEmptySubestacion(subestaciones)
    const next = [...subestaciones, nuevo] as unknown as NetworkData["subestaciones"]
    updateNetwork({ subestaciones: next })
    select(nuevo.id, "transformador")
  }

  const addCarga = () => {
    const nuevo = createEmptyCarga(cargas)
    const next = [...cargas, nuevo] as unknown as NetworkData["cargas"]
    updateNetwork({ cargas: next })
    select(nuevo.id, "carga")
  }

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto p-3">
      <SectionHeader
        title={TITLES.nodos}
        count={nodos.length}
        onAdd={addNodo}
      />
      <ul className="space-y-1">
        {nodos.length === 0 && <EmptyHint>Sin nodos</EmptyHint>}
        {nodos.map((n) => (
          <ListRow
            key={n.id}
            active={
              selectedId === n.id &&
              (selectedKind === "nodo" || selectedKind === "carga")
            }
            onClick={() =>
              select(n.id, n.tipo === "CARGA" ? "carga" : "nodo")
            }
            id={n.id}
            label={n.descripcion || TIPO_NODO_LABELS[n.tipo] || "—"}
            badge={n.tipo ? TIPO_NODO_LABELS[n.tipo] : undefined}
          />
        ))}
      </ul>

      <SectionHeader
        title={TITLES.lineas}
        count={lineas.length}
        onAdd={addLinea}
      />
      <ul className="space-y-1">
        {lineas.length === 0 && <EmptyHint>Sin líneas</EmptyHint>}
        {lineas.map((l) => (
          <ListRow
            key={l.id}
            active={selectedId === l.id && selectedKind === "linea"}
            onClick={() => select(l.id, "linea")}
            id={l.id}
            label={`${l.origen || "?"} → ${l.destino || "?"}`}
            badge={l.longitudM ? `${l.longitudM} m` : undefined}
          />
        ))}
      </ul>

      <SectionHeader
        title={TITLES.subestaciones}
        count={subestaciones.length}
        onAdd={addSubestacion}
      />
      <ul className="space-y-1">
        {subestaciones.length === 0 && <EmptyHint>Sin transformadores</EmptyHint>}
        {subestaciones.map((s) => {
          const tipo = TIPOS_TRANSFORMADOR.find(
            (t) => t.id === s.tipoTransformadorId,
          )
          return (
            <ListRow
              key={s.id}
              active={selectedId === s.id && selectedKind === "transformador"}
              onClick={() => select(s.id, "transformador")}
              id={s.id}
              label={tipo ? `${tipo.kva} kVA` : "Transformador"}
              badge={s.nodoId || undefined}
            />
          )
        })}
      </ul>

      <SectionHeader
        title={TITLES.cargas}
        count={cargas.length}
        onAdd={addCarga}
      />
      <ul className="space-y-1">
        {cargas.length === 0 && <EmptyHint>Sin cargas</EmptyHint>}
        {cargas.map((c) => (
          <ListRow
            key={c.id}
            active={selectedId === c.id && selectedKind === "carga"}
            onClick={() => select(c.id, "carga")}
            id={c.id}
            label={c.potenciaKVA ? `${c.potenciaKVA} kVA` : "—"}
            badge={c.nodoId || undefined}
          />
        ))}
      </ul>
    </div>
  )
}

function SectionHeader({
  title,
  count,
  onAdd,
}: {
  title: string
  count: number
  onAdd: () => void
}) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-1">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title} ({count})
      </h3>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="h-7 px-2 text-xs"
        onClick={onAdd}
      >
        <Plus className="mr-1 size-3.5" />
        Agregar
      </Button>
    </div>
  )
}

function ListRow({
  id,
  label,
  badge,
  active,
  onClick,
}: {
  id: string
  label: string
  badge?: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex w-full items-center gap-2 rounded-md border border-transparent px-2 py-1.5 text-left text-xs transition-colors",
          active
            ? "border-primary/40 bg-primary/10 text-foreground"
            : "hover:bg-muted/60",
        )}
      >
        <span className="font-mono font-semibold text-foreground">{id}</span>
        <span className="flex-1 truncate text-muted-foreground">{label}</span>
        {badge && (
          <span className="shrink-0 rounded-sm bg-muted px-1.5 py-0.5 text-[10px] text-foreground/80">
            {badge}
          </span>
        )}
      </button>
    </li>
  )
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <Fragment>
      <li className="px-2 py-1 text-[11px] italic text-muted-foreground">
        {children}
      </li>
    </Fragment>
  )
}
