import { Handle, Position } from "@xyflow/react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type NetworkNodeShellProps = {
  selected?: boolean
  /** Tono semántico (subestación verde, MT primario, BT cian, trafo naranja, carga rojo). */
  tone?: "primary" | "accent" | "warning" | "destructive" | "success"
  icon?: ReactNode
  title: string
  subtitle?: ReactNode
  badges?: ReactNode
  /** Mostrar handle superior (entrada). */
  hasTop?: boolean
  /** Mostrar handle inferior (salida). */
  hasBottom?: boolean
  /** Mostrar handles laterales (izq y der) — útil para conexiones colaterales. */
  hasSides?: boolean
  className?: string
}

const TONE_RING: Record<NonNullable<NetworkNodeShellProps["tone"]>, string> = {
  primary: "ring-[color:var(--primary)]",
  accent: "ring-[color:var(--accent-foreground)]",
  warning: "ring-amber-500",
  destructive: "ring-[color:var(--destructive)]",
  success: "ring-emerald-500",
}

const TONE_ACCENT: Record<NonNullable<NetworkNodeShellProps["tone"]>, string> =
  {
    primary: "text-[color:var(--primary)]",
    accent: "text-[color:var(--accent-foreground)]",
    warning: "text-amber-500",
    destructive: "text-[color:var(--destructive)]",
    success: "text-emerald-500",
  }

const HANDLE_STYLE = "!h-2 !w-2 !border-2 !bg-background !border-foreground/30"

/**
 * Contenedor visual compartido para todos los custom nodes del editor.
 * Aplica estilos coherentes con el tema (radius, border, ring de selección)
 * y expone handles configurables.
 */
export function NetworkNodeShell({
  selected,
  tone = "primary",
  icon,
  title,
  subtitle,
  badges,
  hasTop = true,
  hasBottom = true,
  hasSides = false,
  className,
}: NetworkNodeShellProps) {
  return (
    <div
      className={cn(
        "group relative flex min-w-[160px] items-center gap-2.5 rounded-lg border bg-card/95 px-3 py-2 shadow-sm backdrop-blur",
        "border-border transition-shadow",
        selected ? `ring-2 ring-offset-2 ring-offset-background ${TONE_RING[tone]}` : "hover:shadow-md",
        className,
      )}
    >
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
      {icon && (
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-md bg-muted",
            TONE_ACCENT[tone],
          )}
        >
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1 leading-tight">
        <div className="truncate text-sm font-semibold">{title}</div>
        {subtitle && (
          <div className="truncate text-xs text-muted-foreground">
            {subtitle}
          </div>
        )}
        {badges && <div className="mt-1 flex flex-wrap gap-1">{badges}</div>}
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
