import { useEffect } from "react"
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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { InputWithUnit } from "../components/InputWithUnit"
import {
  generalSchema,
  type GeneralData,
  type GeneralDataInput,
  TIPO_RED,
  TIPO_RED_LABELS,
  TIPO_INSTALACION,
  TIPO_INSTALACION_LABELS,
  DEPARTAMENTOS,
  OPERADORES_POR_DEPARTAMENTO,
} from "../schemas/general.schema"
import { useCreateProjectStore } from "../store/useCreateProjectStore"

const DEFAULT_VALUES: Partial<GeneralDataInput> = {
  proyecto: "",
  ubicacion: "",
  operadorRed: "",
  tipoRed: undefined,
  tipoInstalacion: undefined,
  nivelTensionMT: undefined,
  nivelTensionBT: undefined,
  temperaturaZona: undefined,
}

export function GeneralDataStep() {
  const general = useCreateProjectStore((s) => s.general)
  const setGeneral = useCreateProjectStore((s) => s.setGeneral)
  const next = useCreateProjectStore((s) => s.next)

  const form = useForm<GeneralDataInput, unknown, GeneralData>({
    resolver: zodResolver(generalSchema),
    defaultValues: { ...DEFAULT_VALUES, ...general },
    mode: "onTouched",
  })

  const ubicacion = form.watch("ubicacion")
  const operadoresDisponibles =
    (ubicacion && OPERADORES_POR_DEPARTAMENTO[ubicacion]) || []

  useEffect(() => {
    const current = form.getValues("operadorRed")
    if (current && operadoresDisponibles.length > 0 && !operadoresDisponibles.includes(current)) {
      form.setValue("operadorRed", "")
    }
  }, [ubicacion, operadoresDisponibles, form])

  const onSubmit = (data: GeneralData) => {
    setGeneral(data)
    next()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="proyecto"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>
                  Proyecto <span className="text-muted-foreground">(PROY)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="CONSTRUCCIÓN RED BARBACOAS"
                    maxLength={100}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Nombre del proyecto. Hasta 100 caracteres.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ubicacion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Ubicación{" "}
                  <span className="text-muted-foreground">(UBIC)</span>
                </FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un departamento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DEPARTAMENTOS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Departamento o ciudad del proyecto.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="operadorRed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Operador de red{" "}
                  <span className="text-muted-foreground">(OR)</span>
                </FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!ubicacion}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          ubicacion
                            ? "Seleccione un operador"
                            : "Primero seleccione la ubicación"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {operadoresDisponibles.map((op) => (
                      <SelectItem key={op} value={op}>
                        {op}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Filtrado según el departamento.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tipoRed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tipo de red <span className="text-muted-foreground">(TR)</span>
                </FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el tipo de red" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TIPO_RED.map((t) => (
                      <SelectItem key={t} value={t}>
                        {TIPO_RED_LABELS[t]}
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
            name="tipoInstalacion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tipo de instalación{" "}
                  <span className="text-muted-foreground">(TI)</span>
                </FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Aérea / Subterránea" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TIPO_INSTALACION.map((t) => (
                      <SelectItem key={t} value={t}>
                        {TIPO_INSTALACION_LABELS[t]}
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
            name="nivelTensionMT"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Nivel de tensión MT{" "}
                  <span className="text-muted-foreground">(NTMT)</span>
                </FormLabel>
                <FormControl>
                  <InputWithUnit
                    type="number"
                    step="0.0001"
                    placeholder="13,2"
                    unit="kV"
                    {...field}
                    value={(field.value as string | number | undefined) ?? ""}
                  />
                </FormControl>
                <FormDescription>Decimal en kilovoltios.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nivelTensionBT"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Nivel de tensión BT{" "}
                  <span className="text-muted-foreground">(NTBT)</span>
                </FormLabel>
                <FormControl>
                  <InputWithUnit
                    type="number"
                    step="0.0001"
                    placeholder="120"
                    unit="V"
                    {...field}
                    value={(field.value as string | number | undefined) ?? ""}
                  />
                </FormControl>
                <FormDescription>Decimal en voltios.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="temperaturaZona"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Temperatura promedio{" "}
                  <span className="text-muted-foreground">(TEMP)</span>
                </FormLabel>
                <FormControl>
                  <InputWithUnit
                    type="number"
                    step="0.0001"
                    placeholder="17"
                    unit="°C"
                    {...field}
                    value={(field.value as string | number | undefined) ?? ""}
                  />
                </FormControl>
                <FormDescription>Entre -10 °C y 50 °C.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="submit">Siguiente</Button>
        </div>
      </form>
    </Form>
  )
}
