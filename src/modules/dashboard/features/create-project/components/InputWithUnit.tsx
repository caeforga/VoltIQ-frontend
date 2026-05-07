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
      <div className="flex w-full">
        <Input
          ref={ref}
          className={cn(
            "rounded-r-none border-r-0 focus-visible:z-10",
            className,
          )}
          {...props}
        />
        <span className="inline-flex shrink-0 items-center rounded-r-md border border-input bg-muted px-3 text-sm text-muted-foreground">
          {unit}
        </span>
      </div>
    )
  },
)
