import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  TIPOS_TRANSFORMADOR,
  VOLTAJES_TRANSFORMADOR,
  type NetworkDataInput,
} from "../schemas/network.schema"
import { createEmptySubestacion } from "./helpers"

export function SubestacionesTable() {
  const { control } = useFormContext<NetworkDataInput>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "subestaciones",
  })

  const subestaciones = useWatch({ control, name: "subestaciones" }) ?? []
  const nodos = useWatch({ control, name: "nodos" }) ?? []
  const nodosValidos = nodos.filter(
    (n) => n?.id && (n.tipo === "SUBESTACION" || n.tipo === "NODO_MT"),
  ) as { id: string }[]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-base">3. Subestaciones</CardTitle>
          <CardDescription>
            Transformadores ubicados en nodos MT/Subestación.
          </CardDescription>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => append(createEmptySubestacion(subestaciones))}
        >
          <Plus className="mr-1 size-4" />
          Agregar transformador
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead className="min-w-32">Nodo</TableHead>
              <TableHead className="min-w-56">Potencia (kVA)</TableHead>
              <TableHead className="min-w-40">Voltaje (kV)</TableHead>
              <TableHead className="w-10" aria-label="Acciones" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {subestaciones[index]?.id ?? "—"}
                </TableCell>

                <TableCell>
                  <FormField
                    control={control}
                    name={`subestaciones.${index}.nodoId`}
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          value={field.value ?? undefined}
                          onValueChange={field.onChange}
                          disabled={nodosValidos.length === 0}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  nodosValidos.length === 0
                                    ? "Sin nodos MT"
                                    : "Nodo"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {nodosValidos.map((n) => (
                              <SelectItem key={n.id} value={n.id}>
                                {n.id}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>

                <TableCell>
                  <FormField
                    control={control}
                    name={`subestaciones.${index}.tipoTransformadorId`}
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          value={field.value ?? undefined}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Tipo de transformador" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TIPOS_TRANSFORMADOR.map((t) => (
                              <SelectItem key={t.id} value={t.id}>
                                {t.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>

                <TableCell>
                  <FormField
                    control={control}
                    name={`subestaciones.${index}.voltaje`}
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          value={field.value ?? undefined}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="kV primario/secundario" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {VOLTAJES_TRANSFORMADOR.map((v) => (
                              <SelectItem key={v} value={v}>
                                {v}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>

                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-destructive"
                    onClick={() => remove(index)}
                    aria-label={`Eliminar transformador ${
                      subestaciones[index]?.id ?? index + 1
                    }`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {fields.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Aún no hay transformadores definidos.
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => append(createEmptySubestacion(subestaciones))}
              disabled={nodosValidos.length === 0}
            >
              <Plus className="mr-1 size-4" />
              Agregar el primer transformador
            </Button>
            {nodosValidos.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Primero define al menos un nodo de tipo MT o Subestación.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
