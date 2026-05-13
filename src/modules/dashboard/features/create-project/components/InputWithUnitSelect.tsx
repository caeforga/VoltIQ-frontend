import { forwardRef } from "react"
import { Select as SelectPrimitive } from "radix-ui"
import { ChevronDownIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type InputWithUnitSelectProps = Omit<
  React.ComponentProps<typeof Input>,
  "value"
> & {
  value?: string | number | undefined
  units: readonly string[]
  unit: string | undefined
  onUnitChange: (unit: string) => void
  unitTriggerClassName?: string
}

/**
 * Input numérico/texto con la unidad como dropdown integrado.
 * Visualmente idéntico a InputWithUnit, pero la unidad es seleccionable.
 */
export const InputWithUnitSelect = forwardRef<
  HTMLInputElement,
  InputWithUnitSelectProps
>(function InputWithUnitSelect(
  {
    value,
    units,
    unit,
    onUnitChange,
    className,
    unitTriggerClassName,
    ...props
  },
  ref,
) {
  return (
    <div className="relative w-full">
      <Input
        ref={ref}
        className={cn("pr-20", className)}
        value={value ?? ""}
        {...props}
      />
      <Select value={unit} onValueChange={onUnitChange}>
        <SelectPrimitive.Trigger
          data-slot="select-trigger"
          className={cn(
            "absolute inset-y-px right-px flex items-center gap-1 rounded-r-[calc(var(--radius)-1px)] border-l border-input bg-transparent px-3 text-sm text-muted-foreground outline-none transition-colors hover:bg-muted/40 focus-visible:bg-muted/40 disabled:cursor-not-allowed disabled:opacity-50",
            unitTriggerClassName,
          )}
        >
          <SelectValue />
          <SelectPrimitive.Icon asChild>
            <ChevronDownIcon className="size-3.5 opacity-70" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectContent align="end">
          {units.map((u) => (
            <SelectItem key={u} value={u}>
              {u}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
})
