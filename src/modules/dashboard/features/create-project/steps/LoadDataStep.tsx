import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { InputWithUnit } from "../components/InputWithUnit"
import {
  loadSchema,
  type LoadData,
  type LoadDataInput,
  TIPO_CARGA,
  TIPO_CARGA_LABELS,
  ESTRATOS,
} from "../schemas/load.schema"
import { useCreateProjectStore } from "../store/useCreateProjectStore"

const DEFAULT_VALUES: Partial<LoadDataInput> = {
  potenciaTotalKW: undefined,
  factorPotencia: undefined,
  tipoCarga: undefined,
  numeroUsuarios: undefined,
  estrato: undefined,
}

export function LoadDataStep() {
  const load = useCreateProjectStore((s) => s.load)
  const setLoad = useCreateProjectStore((s) => s.setLoad)
  const next = useCreateProjectStore((s) => s.next)
  const prev = useCreateProjectStore((s) => s.prev)

  const form = useForm<LoadDataInput, unknown, LoadData>({
    resolver: zodResolver(loadSchema),
    defaultValues: { ...DEFAULT_VALUES, ...load },
    mode: "onTouched",
  })

  const onSubmit = (data: LoadData) => {
    setLoad(data)
    next()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="potenciaTotalKW"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>
                  Potencia total instalada{" "}
                  <span className="text-muted-foreground">(PT)</span>
                </FormLabel>
                <FormControl>
                  <InputWithUnit
                    type="number"
                    step="0.0001"
                    placeholder="0,0000"
                    unit="kW"
                    {...field}
                    value={(field.value as string | number | undefined) ?? ""}
                  />
                </FormControl>
                <FormDescription>
                  Sumatoria de la potencia de todos los usuarios.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="factorPotencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Factor de potencia{" "}
                  <span className="text-muted-foreground">(FP)</span>
                </FormLabel>
                <FormControl>
                  <InputWithUnit
                    type="number"
                    step="0.01"
                    min="0.5"
                    max="1"
                    placeholder="0,95"
                    {...field}
                    value={(field.value as string | number | undefined) ?? ""}
                  />
                </FormControl>
                <FormDescription>
                  Valor entre 0,5 y 1 (típicamente 0,8 – 0,95).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tipoCarga"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tipo de carga{" "}
                  <span className="text-muted-foreground">(TC)</span>
                </FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el tipo de carga" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TIPO_CARGA.map((t) => (
                      <SelectItem key={t} value={t}>
                        {TIPO_CARGA_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numeroUsuarios"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Número de usuarios{" "}
                  <span className="text-muted-foreground">(USUARIOS)</span>
                </FormLabel>
                <FormControl>
                  <InputWithUnit
                    type="number"
                    step="1"
                    min="1"
                    placeholder="20"
                    {...field}
                    value={(field.value as string | number | undefined) ?? ""}
                  />
                </FormControl>
                <FormDescription>Número entero de usuarios.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estrato"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Estrato{" "}
                  <span className="text-muted-foreground">(ESTRATO)</span>
                </FormLabel>
                <Select
                  value={
                    field.value === undefined || field.value === null
                      ? ""
                      : String(field.value)
                  }
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el estrato" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ESTRATOS.map((e) => (
                      <SelectItem key={e} value={String(e)}>
                        Estrato {e}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between gap-2 pt-2">
          <Button type="button" variant="outline" onClick={prev}>
            Atrás
          </Button>
          <Button type="submit">Siguiente</Button>
        </div>
      </form>
    </Form>
  )
}
