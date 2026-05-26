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
  RED_FASES,
  RED_FASES_LABELS,
  conductoresPara,
  nivelDeLinea,
  type NetworkDataInput,
} from "../schemas/network.schema"
import { createEmptyLinea } from "./helpers"

export function LineasTable() {
  const { control } = useFormContext<NetworkDataInput>()
  const { fields, append, remove } = useFieldArray({ control, name: "lineas" })

  const lineas = useWatch({ control, name: "lineas" }) ?? []
  const nodos = useWatch({ control, name: "nodos" }) ?? []
  const nodosIds = nodos.map((n) => n?.id).filter(Boolean) as string[]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-base">2. Líneas</CardTitle>
          <CardDescription>
            Tramos de conductor entre dos nodos.
          </CardDescription>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => append(createEmptyLinea(lineas))}
        >
          <Plus className="mr-1 size-4" />
          Agregar línea
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead className="min-w-32">Origen</TableHead>
              <TableHead className="min-w-32">Destino</TableHead>
              <TableHead className="w-32 text-right">Longitud (m)</TableHead>
              <TableHead className="min-w-56">Conductor</TableHead>
              <TableHead className="min-w-40">Red</TableHead>
              <TableHead className="w-10" aria-label="Acciones" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {lineas[index]?.id ?? "—"}
                </TableCell>

                <TableCell>
                  <FormField
                    control={control}
                    name={`lineas.${index}.origen`}
                    render={({ field }) => {
                      const destinoActual = lineas[index]?.destino
                      const opciones = nodosIds.filter(
                        (id) => id !== destinoActual,
                      )
                      return (
                        <FormItem>
                          <Select
                            value={field.value ?? undefined}
                            onValueChange={field.onChange}
                            disabled={nodosIds.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Origen" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {opciones.map((id) => (
                                <SelectItem key={id} value={id}>
                                  {id}
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
                    name={`lineas.${index}.destino`}
                    render={({ field }) => {
                      const origenActual = lineas[index]?.origen
                      const opciones = nodosIds.filter(
                        (id) => id !== origenActual,
                      )
                      return (
                        <FormItem>
                          <Select
                            value={field.value ?? undefined}
                            onValueChange={field.onChange}
                            disabled={nodosIds.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Destino" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {opciones.map((id) => (
                                <SelectItem key={id} value={id}>
                                  {id}
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
                    name={`lineas.${index}.longitudM`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
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
                  <FormField
                    control={control}
                    name={`lineas.${index}.conductor`}
                    render={({ field }) => {
                      const fila = lineas[index]
                      const nodoOrigen = nodos.find(
                        (n) => n?.id === fila?.origen,
                      )
                      const nodoDestino = nodos.find(
                        (n) => n?.id === fila?.destino,
                      )
                      const nivel = nivelDeLinea(nodoOrigen, nodoDestino)
                      const opciones = conductoresPara(nivel)
                      return (
                        <FormItem>
                          <Select
                            value={field.value ?? undefined}
                            onValueChange={field.onChange}
                            disabled={!nivel}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    nivel
                                      ? `Conductor (${nivel})`
                                      : "Seleccione origen y destino"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {opciones.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                  {c.label}
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
                    name={`lineas.${index}.red`}
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          value={field.value ?? undefined}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Red" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {RED_FASES.map((r) => (
                              <SelectItem key={r} value={r}>
                                {RED_FASES_LABELS[r]}
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
                    aria-label={`Eliminar línea ${lineas[index]?.id ?? index + 1}`}
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
              Aún no hay líneas definidas.
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => append(createEmptyLinea(lineas))}
              disabled={nodosIds.length < 2}
            >
              <Plus className="mr-1 size-4" />
              Agregar la primera línea
            </Button>
            {nodosIds.length < 2 && (
              <p className="text-xs text-muted-foreground">
                Agrega al menos 2 nodos antes de crear líneas.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
