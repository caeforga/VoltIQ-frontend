import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useCreateProjectStore } from "@/modules/dashboard/features/create-project/store/useCreateProjectStore"
import {
  CLASES_POR_TIPO_NODO,
  CONDUCTORES,
  RED_FASES,
  RED_FASES_LABELS,
  TIPO_NODO,
  TIPO_NODO_LABELS,
  TIPOS_TRANSFORMADOR,
  VOLTAJES_TRANSFORMADOR,
  conductoresPara,
  nivelDeLinea,
  type Carga,
  type Linea,
  type NetworkData,
  type Nodo,
  type Subestacion,
} from "@/modules/dashboard/features/create-project/schemas/network.schema"
import { FACTOR_POTENCIA } from "@/modules/dashboard/features/create-project/schemas/load.schema"
import { useNetworkViewerStore } from "../store/useNetworkViewerStore"

export function PropertiesPanel() {
  const selectedId = useNetworkViewerStore((s) => s.selectedId)
  const selectedKind = useNetworkViewerStore((s) => s.selectedKind)
  const select = useNetworkViewerStore((s) => s.select)
  const network = useCreateProjectStore((s) => s.network)
  const updateNetwork = useCreateProjectStore((s) => s.updateNetwork)

  if (!selectedId || !selectedKind) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-sm text-muted-foreground">
        <span className="text-base font-medium text-foreground">
          Sin selección
        </span>
        <span>Selecciona un elemento del lienzo o de las listas.</span>
      </div>
    )
  }

  if (selectedKind === "nodo" || selectedKind === "carga") {
    const nodo = network.nodos?.find((n) => n.id === selectedId)
    if (nodo) {
      return (
        <NodoEditor
          nodo={nodo}
          network={network}
          onChange={(patch) => {
            const nodos = (network.nodos ?? []).map((n) =>
              n.id === nodo.id ? ({ ...n, ...patch } as Nodo) : n,
            )
            updateNetwork({ nodos })
          }}
          onDelete={() => {
            const nodos = (network.nodos ?? []).filter((n) => n.id !== nodo.id)
            const lineas = (network.lineas ?? []).filter(
              (l) => l.origen !== nodo.id && l.destino !== nodo.id,
            )
            const subestaciones = (network.subestaciones ?? []).filter(
              (s) => s.nodoId !== nodo.id,
            )
            const cargas = (network.cargas ?? []).filter(
              (c) => c.nodoId !== nodo.id,
            )
            updateNetwork({ nodos, lineas, subestaciones, cargas })
            select(null, null)
          }}
        />
      )
    }
    // Si selectedKind === "carga" pero no matchea con un nodo, prueba en cargas[]
    if (selectedKind === "carga") {
      const carga = network.cargas?.find((c) => c.id === selectedId)
      if (carga) {
        return (
          <CargaEditor
            carga={carga}
            network={network}
            onChange={(patch) => {
              const cargas = (network.cargas ?? []).map((c) =>
                c.id === carga.id ? ({ ...c, ...patch } as Carga) : c,
              )
              updateNetwork({ cargas })
            }}
            onDelete={() => {
              const cargas = (network.cargas ?? []).filter(
                (c) => c.id !== carga.id,
              )
              updateNetwork({ cargas })
              select(null, null)
            }}
          />
        )
      }
    }
  }

  if (selectedKind === "linea") {
    const linea = network.lineas?.find((l) => l.id === selectedId)
    if (linea) {
      return (
        <LineaEditor
          linea={linea}
          network={network}
          onChange={(patch) => {
            const lineas = (network.lineas ?? []).map((l) =>
              l.id === linea.id ? ({ ...l, ...patch } as Linea) : l,
            )
            updateNetwork({ lineas })
          }}
          onDelete={() => {
            const lineas = (network.lineas ?? []).filter(
              (l) => l.id !== linea.id,
            )
            updateNetwork({ lineas })
            select(null, null)
          }}
        />
      )
    }
  }

  if (selectedKind === "transformador") {
    const sub = network.subestaciones?.find((s) => s.id === selectedId)
    if (sub) {
      return (
        <SubestacionEditor
          sub={sub}
          network={network}
          onChange={(patch) => {
            const subestaciones = (network.subestaciones ?? []).map((s) =>
              s.id === sub.id ? ({ ...s, ...patch } as Subestacion) : s,
            )
            updateNetwork({ subestaciones })
          }}
          onDelete={() => {
            const subestaciones = (network.subestaciones ?? []).filter(
              (s) => s.id !== sub.id,
            )
            updateNetwork({ subestaciones })
            select(null, null)
          }}
        />
      )
    }
  }

  return (
    <div className="p-4 text-sm text-muted-foreground">
      Elemento no encontrado en la red.
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────
// Editores por tipo
// ──────────────────────────────────────────────────────────────────────────

function EditorShell({
  title,
  badge,
  children,
  onDelete,
  deleteLabel,
}: {
  title: string
  badge: string
  children: React.ReactNode
  onDelete: () => void
  deleteLabel: string
}) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="flex items-center justify-between border-b border-border p-3">
        <div>
          <span className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {badge}
          </span>
          <h3 className="mt-1 text-sm font-semibold">{title}</h3>
        </div>
      </div>
      <div className="flex-1 space-y-3 p-3 text-xs">{children}</div>
      <div className="border-t border-border p-3">
        <DeleteAction label={deleteLabel} onConfirm={onDelete} />
      </div>
    </div>
  )
}

function DeleteAction({
  label,
  onConfirm,
}: {
  label: string
  onConfirm: () => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="w-full">
          <Trash2 className="mr-2 size-3.5" />
          Eliminar elemento
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar {label}?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminarán también los
            elementos relacionados (líneas, transformadores y cargas asociados,
            cuando corresponda).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm()
              setOpen(false)
            }}
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  )
}

// ── NodoEditor ───────────────────────────────────────────────────────────

function NodoEditor({
  nodo,
  network,
  onChange,
  onDelete,
}: {
  nodo: Nodo
  network: Partial<NetworkData>
  onChange: (patch: Partial<Nodo>) => void
  onDelete: () => void
}) {
  const updateNetwork = useCreateProjectStore((s) => s.updateNetwork)
  const cargaAsociada = network.cargas?.find((c) => c.nodoId === nodo.id)
  const isFirstNodo = (network.nodos ?? [])[0]?.id === nodo.id
  const tiposDisponibles = isFirstNodo
    ? TIPO_NODO.filter((t) => t !== "CARGA")
    : TIPO_NODO
  const clases =
    nodo.tipo && CLASES_POR_TIPO_NODO[nodo.tipo]
      ? CLASES_POR_TIPO_NODO[nodo.tipo]
      : []

  return (
    <EditorShell
      title={nodo.descripcion || "Nodo"}
      badge={`Nodo · ${nodo.id}`}
      onDelete={onDelete}
      deleteLabel={`nodo ${nodo.id}`}
    >
      <Field label="Descripción">
        <Input
          value={nodo.descripcion ?? ""}
          onChange={(e) => onChange({ descripcion: e.target.value })}
        />
      </Field>

      <Field label="Tipo">
        <Select
          value={nodo.tipo ?? ""}
          onValueChange={(v) => onChange({ tipo: v as Nodo["tipo"], clase: "" })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar tipo" />
          </SelectTrigger>
          <SelectContent>
            {tiposDisponibles.map((t) => (
              <SelectItem key={t} value={t}>
                {TIPO_NODO_LABELS[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Clase">
        <Select
          value={nodo.clase ?? ""}
          onValueChange={(v) => onChange({ clase: v })}
          disabled={!nodo.tipo || clases.length === 0}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={nodo.tipo ? "Seleccionar clase" : "Elige tipo primero"}
            />
          </SelectTrigger>
          <SelectContent>
            {clases.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Voltaje (kV)">
          <Input
            type="number"
            step="0.01"
            value={nodo.voltajeKV ?? ""}
            onChange={(e) =>
              onChange({ voltajeKV: numOrUndef(e.target.value) as number })
            }
          />
        </Field>
        <Field label="Carga (kVA)">
          <Input
            type="number"
            step="0.01"
            value={nodo.cargaKVA ?? ""}
            onChange={(e) =>
              onChange({ cargaKVA: numOrUndef(e.target.value) as number })
            }
          />
        </Field>
      </div>

      {nodo.tipo === "CARGA" && cargaAsociada && (
        <div className="mt-4 space-y-3 rounded-md border border-border bg-muted/30 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Carga asociada ({cargaAsociada.id})
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Potencia (kVA)">
              <Input
                type="number"
                step="0.01"
                value={cargaAsociada.potenciaKVA ?? ""}
                onChange={(e) => {
                  const cargas = (network.cargas ?? []).map((c) =>
                    c.id === cargaAsociada.id
                      ? ({
                          ...c,
                          potenciaKVA: numOrUndef(e.target.value) as number,
                        } as Carga)
                      : c,
                  )
                  updateNetwork({ cargas })
                }}
              />
            </Field>
            <Field label="Factor potencia">
              <Select
                value={
                  cargaAsociada.fp != null ? String(cargaAsociada.fp) : ""
                }
                onValueChange={(v) => {
                  const cargas = (network.cargas ?? []).map((c) =>
                    c.id === cargaAsociada.id
                      ? ({ ...c, fp: Number(v) } as Carga)
                      : c,
                  )
                  updateNetwork({ cargas })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="FP" />
                </SelectTrigger>
                <SelectContent>
                  {FACTOR_POTENCIA.map((fp) => (
                    <SelectItem key={fp} value={String(fp)}>
                      {fp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </div>
      )}
    </EditorShell>
  )
}

// ── LineaEditor ──────────────────────────────────────────────────────────

function LineaEditor({
  linea,
  network,
  onChange,
  onDelete,
}: {
  linea: Linea
  network: Partial<NetworkData>
  onChange: (patch: Partial<Linea>) => void
  onDelete: () => void
}) {
  const nodos = network.nodos ?? []
  const origenNodo = nodos.find((n) => n.id === linea.origen)
  const destinoNodo = nodos.find((n) => n.id === linea.destino)
  const nivel = nivelDeLinea(origenNodo, destinoNodo)
  const conductoresValidos = conductoresPara(nivel)

  return (
    <EditorShell
      title={`${linea.origen || "?"} → ${linea.destino || "?"}`}
      badge={`Línea · ${linea.id}`}
      onDelete={onDelete}
      deleteLabel={`línea ${linea.id}`}
    >
      <div className="grid grid-cols-2 gap-3">
        <Field label="Origen">
          <Select
            value={linea.origen ?? ""}
            onValueChange={(v) => onChange({ origen: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Origen" />
            </SelectTrigger>
            <SelectContent>
              {nodos
                .filter((n) => n.id !== linea.destino)
                .map((n) => (
                  <SelectItem key={n.id} value={n.id}>
                    {n.id} · {n.descripcion || TIPO_NODO_LABELS[n.tipo]}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Destino">
          <Select
            value={linea.destino ?? ""}
            onValueChange={(v) => onChange({ destino: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Destino" />
            </SelectTrigger>
            <SelectContent>
              {nodos
                .filter((n) => n.id !== linea.origen)
                .map((n) => (
                  <SelectItem key={n.id} value={n.id}>
                    {n.id} · {n.descripcion || TIPO_NODO_LABELS[n.tipo]}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label={`Conductor${nivel ? ` (${nivel})` : ""}`}>
        <Select
          value={linea.conductor ?? ""}
          onValueChange={(v) => onChange({ conductor: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Conductor" />
          </SelectTrigger>
          <SelectContent>
            {(conductoresValidos.length ? conductoresValidos : CONDUCTORES).map(
              (c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.label}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Longitud (m)">
          <Input
            type="number"
            step="0.01"
            value={linea.longitudM ?? ""}
            onChange={(e) =>
              onChange({ longitudM: numOrUndef(e.target.value) as number })
            }
          />
        </Field>
        <Field label="Tipo de red">
          <Select
            value={linea.red ?? ""}
            onValueChange={(v) => onChange({ red: v as Linea["red"] })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Red" />
            </SelectTrigger>
            <SelectContent>
              {RED_FASES.map((r) => (
                <SelectItem key={r} value={r}>
                  {RED_FASES_LABELS[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
    </EditorShell>
  )
}

// ── SubestacionEditor ────────────────────────────────────────────────────

function SubestacionEditor({
  sub,
  network,
  onChange,
  onDelete,
}: {
  sub: Subestacion
  network: Partial<NetworkData>
  onChange: (patch: Partial<Subestacion>) => void
  onDelete: () => void
}) {
  const nodos = network.nodos ?? []
  return (
    <EditorShell
      title={`Transformador ${sub.id}`}
      badge={`Trafo · ${sub.id}`}
      onDelete={onDelete}
      deleteLabel={`transformador ${sub.id}`}
    >
      <Field label="Nodo anfitrión">
        <Select
          value={sub.nodoId ?? ""}
          onValueChange={(v) => onChange({ nodoId: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar nodo" />
          </SelectTrigger>
          <SelectContent>
            {nodos.map((n) => (
              <SelectItem key={n.id} value={n.id}>
                {n.id} · {n.descripcion || TIPO_NODO_LABELS[n.tipo]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Tipo de transformador">
        <Select
          value={sub.tipoTransformadorId ?? ""}
          onValueChange={(v) => onChange({ tipoTransformadorId: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent>
            {TIPOS_TRANSFORMADOR.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.kva} kVA · {t.fases === "MONO" ? "Mono" : "Tri"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Voltaje">
        <Select
          value={sub.voltaje ?? ""}
          onValueChange={(v) => onChange({ voltaje: v as Subestacion["voltaje"] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar voltaje" />
          </SelectTrigger>
          <SelectContent>
            {VOLTAJES_TRANSFORMADOR.map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </EditorShell>
  )
}

// ── CargaEditor ──────────────────────────────────────────────────────────

function CargaEditor({
  carga,
  network,
  onChange,
  onDelete,
}: {
  carga: Carga
  network: Partial<NetworkData>
  onChange: (patch: Partial<Carga>) => void
  onDelete: () => void
}) {
  const cargaNodos = (network.nodos ?? []).filter((n) => n.tipo === "CARGA")
  return (
    <EditorShell
      title={`Carga ${carga.id}`}
      badge={`Carga · ${carga.id}`}
      onDelete={onDelete}
      deleteLabel={`carga ${carga.id}`}
    >
      <Field label="Nodo (tipo CARGA)">
        <Select
          value={carga.nodoId ?? ""}
          onValueChange={(v) => onChange({ nodoId: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent>
            {cargaNodos.map((n) => (
              <SelectItem key={n.id} value={n.id}>
                {n.id} · {n.descripcion || "Carga"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Potencia (kVA)">
          <Input
            type="number"
            step="0.01"
            value={carga.potenciaKVA ?? ""}
            onChange={(e) =>
              onChange({ potenciaKVA: numOrUndef(e.target.value) as number })
            }
          />
        </Field>
        <Field label="Factor potencia">
          <Select
            value={carga.fp != null ? String(carga.fp) : ""}
            onValueChange={(v) => onChange({ fp: Number(v) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="FP" />
            </SelectTrigger>
            <SelectContent>
              {FACTOR_POTENCIA.map((fp) => (
                <SelectItem key={fp} value={String(fp)}>
                  {fp}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
    </EditorShell>
  )
}

function numOrUndef(v: string): number | undefined {
  if (v === "" || v == null) return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}
