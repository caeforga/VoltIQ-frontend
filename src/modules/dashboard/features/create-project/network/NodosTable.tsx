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
import { Input } from "@/components/ui/input"
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
  CLASES_POR_TIPO_NODO,
  TIPO_NODO,
  TIPO_NODO_LABELS,
  type NetworkDataInput,
} from "../schemas/network.schema"
import { createEmptyNodo } from "./helpers"

export function NodosTable() {
  const { control } = useFormContext<NetworkDataInput>()
  const { fields, append, remove } = useFieldArray({ control, name: "nodos" })

  const nodos = useWatch({ control, name: "nodos" }) ?? []

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-base">1. Nodos</CardTitle>
          <CardDescription>
            Postes, subestaciones y puntos de carga del sistema.
          </CardDescription>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => append(createEmptyNodo(nodos))}
        >
          <Plus className="mr-1 size-4" />
          Agregar nodo
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead className="min-w-56">Descripción</TableHead>
              <TableHead className="min-w-40">Tipo</TableHead>
              <TableHead className="min-w-56">Clase</TableHead>
              {/* <TableHead className="w-32 text-right">Voltaje (kV)</TableHead> */}
              <TableHead className="w-32 text-right">Carga (kVA)</TableHead>
              <TableHead className="w-10" aria-label="Acciones" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((row, index) => {
              const tipoActual = nodos[index]?.tipo
              const opcionesClase = tipoActual
                ? CLASES_POR_TIPO_NODO[tipoActual]
                : []

              return (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {nodos[index]?.id ?? "—"}
                  </TableCell>

                  <TableCell>
                    <FormField
                      control={control}
                      name={`nodos.${index}.descripcion`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Ej. S/E PRINCIPAL"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  <TableCell>
                    <FormField
                      control={control}
                      name={`nodos.${index}.tipo`}
                      render={({ field }) => {
                        const tiposDisponibles =
                          index === 0
                            ? TIPO_NODO.filter((t) => t !== "CARGA")
                            : TIPO_NODO
                        return (
                          <FormItem>
                            <Select
                              value={field.value ?? undefined}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {tiposDisponibles.map((t) => (
                                  <SelectItem key={t} value={t}>
                                    {TIPO_NODO_LABELS[t]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <FormField
                      control={control}
                      name={`nodos.${index}.clase`}
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            value={field.value ?? undefined}
                            onValueChange={field.onChange}
                            disabled={!tipoActual}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    tipoActual ? "Clase" : "Seleccione tipo"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {opcionesClase.map((c) => (
                                <SelectItem key={c} value={c}>
                                  {c}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  {/* <TableCell>
                    <FormField
                      control={control}
                      name={`nodos.${index}.voltajeKV`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.0001"
                              placeholder="13,2"
                              className="text-right"
                              {...field}
                              value={
                                (field.value as string | number | undefined) ??
                                ""
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell> */}

                  <TableCell>
                    <FormField
                      control={control}
                      name={`nodos.${index}.cargaKVA`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.0001"
                              placeholder="0"
                              className="text-right"
                              {...field}
                              value={
                                (field.value as string | number | undefined) ??
                                ""
                              }
                            />
                          </FormControl>
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
                      aria-label={`Eliminar nodo ${nodos[index]?.id ?? index + 1}`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {fields.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Aún no hay nodos definidos.
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => append(createEmptyNodo(nodos))}
            >
              <Plus className="mr-1 size-4" />
              Agregar el primer nodo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
