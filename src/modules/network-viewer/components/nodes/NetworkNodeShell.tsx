import { Handle, Position } from "@xyflow/react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export type NodeTone = "se" | "mt" | "bt" | "trafo" | "carga"

type NetworkNodeShellProps = {
  selected?: boolean
  tone?: NodeTone
  icon: ReactNode
  /** ID corto en mono (N1, T3, etc.). */
  id: string
  /** Línea principal del label (descripción o tipo). */
  label?: string
  /** Línea secundaria (kV, kVA, FP, etc.). */
  meta?: ReactNode
  hasTop?: boolean
  hasBottom?: boolean
  hasSides?: boolean
}

/**
 * Estilo "diagrama unifilar": ícono circular + ID/etiqueta debajo, sin caja.
 * Los handles se mantienen invisibles para permitir conexiones pero sin
 * añadir ruido visual.
 */
const TONE_BG: Record<NodeTone, string> = {
  se: "bg-emerald-500/15 text-emerald-400 dark:text-emerald-300",
  mt: "bg-primary/15 text-primary",
  bt: "bg-cyan-500/15 text-cyan-400 dark:text-cyan-300",
  trafo: "bg-violet-500/15 text-violet-400 dark:text-violet-300",
  carga: "bg-rose-500/15 text-rose-400 dark:text-rose-300",
}

const TONE_BORDER: Record<NodeTone, string> = {
  se: "border-emerald-500/40",
  mt: "border-primary/40",
  bt: "border-cyan-500/40",
  trafo: "border-violet-500/40",
  carga: "border-rose-500/40",
}

const TONE_RING: Record<NodeTone, string> = {
  se: "ring-emerald-500",
  mt: "ring-primary",
  bt: "ring-cyan-500",
  trafo: "ring-violet-500",
  carga: "ring-rose-500",
}

const HANDLE_STYLE =
  "!h-2 !w-2 !border-0 !bg-transparent opacity-0 transition-opacity hover:opacity-100"

export function NetworkNodeShell({
  selected,
  tone = "mt",
  icon,
  id,
  label,
  meta,
  hasTop = true,
  hasBottom = true,
  hasSides = false,
}: NetworkNodeShellProps) {
  return (
    <div className="group relative flex w-[110px] select-none flex-col items-center gap-1.5">
      {hasTop && (
        <Handle
          type="target"
          position={Position.Top}
          className={HANDLE_STYLE}
          isConnectable={false}
        />
      )}
      {hasSides && (
        <>
          <Handle
            type="source"
            id="left"
            position={Position.Left}
            className={HANDLE_STYLE}
            isConnectable={false}
          />
          <Handle
            type="source"
            id="right"
            position={Position.Right}
            className={HANDLE_STYLE}
            isConnectable={false}
          />
        </>
      )}

      <div
        className={cn(
          "relative grid size-12 place-items-center rounded-full border transition-all",
          TONE_BG[tone],
          TONE_BORDER[tone],
          selected
            ? cn(
                "ring-2 ring-offset-2 ring-offset-background scale-105 shadow-lg",
                TONE_RING[tone],
              )
            : "shadow-sm group-hover:shadow-md group-hover:scale-[1.03]",
        )}
      >
        {icon}
      </div>

      <div className="flex max-w-[120px] flex-col items-center text-center leading-tight">
        <div
          className={cn(
            "font-mono text-[11px] font-semibold tracking-wide transition-colors",
            selected ? "text-foreground" : "text-foreground/85",
          )}
        >
          {id}
        </div>
        {label && (
          <div className="line-clamp-2 text-[10px] text-muted-foreground">
            {label}
          </div>
        )}
        {meta && (
          <div className="mt-0.5 text-[10px] font-medium text-foreground/70">
            {meta}
          </div>
        )}
      </div>

      {hasBottom && (
        <Handle
          type="source"
          position={Position.Bottom}
          className={HANDLE_STYLE}
          isConnectable={false}
        />
      )}
    </div>
  )
}
