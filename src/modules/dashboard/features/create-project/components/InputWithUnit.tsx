import { forwardRef } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type InputWithUnitProps = React.ComponentProps<typeof Input> & {
  unit?: string
}

export const InputWithUnit = forwardRef<HTMLInputElement, InputWithUnitProps>(
  function InputWithUnit({ unit, className, ...props }, ref) {
    if (!unit) {
      return <Input ref={ref} className={className} {...props} />
    }

    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          className={cn("pr-12", className)}
          {...props}
        />
        <div className="pointer-events-none absolute inset-y-px right-px flex items-center rounded-r-[calc(var(--radius)-1px)] border-l border-input px-3 text-sm text-muted-foreground">
          {unit}
        </div>
      </div>
    )
  },
)
