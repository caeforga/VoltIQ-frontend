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
import { FACTOR_POTENCIA } from "../schemas/load.schema"
import { type NetworkDataInput } from "../schemas/network.schema"
import { createEmptyCarga } from "./helpers"

export function CargasTable() {
  const { control } = useFormContext<NetworkDataInput>()
  const { fields, append, remove } = useFieldArray({ control, name: "cargas" })

  const cargas = useWatch({ control, name: "cargas" }) ?? []
  const nodos = useWatch({ control, name: "nodos" }) ?? []
  const nodosCarga = nodos.filter((n) => n?.id && n.tipo === "CARGA") as {
    id: string
  }[]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-base">4. Cargas</CardTitle>
          <CardDescription>
            Potencia conectada en cada nodo de tipo CARGA.
          </CardDescription>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => append(createEmptyCarga(cargas))}
        >
          <Plus className="mr-1 size-4" />
          Agregar carga
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead className="min-w-32">Nodo</TableHead>
              <TableHead className="w-40 text-right">Potencia (kVA)</TableHead>
              <TableHead className="w-32">FP</TableHead>
              <TableHead className="w-10" aria-label="Acciones" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {cargas[index]?.id ?? "—"}
                </TableCell>

                <TableCell>
                  <FormField
                    control={control}
                    name={`cargas.${index}.nodoId`}
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          value={field.value ?? undefined}
                          onValueChange={field.onChange}
                          disabled={nodosCarga.length === 0}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  nodosCarga.length === 0
                                    ? "Sin nodos CARGA"
                                    : "Nodo"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {nodosCarga.map((n) => (
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
                    name={`cargas.${index}.potenciaKVA`}
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
                  <FormField
                    control={control}
                    name={`cargas.${index}.fp`}
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          value={
                            field.value !== undefined && field.value !== ""
                              ? String(field.value)
                              : undefined
                          }
                          onValueChange={(v) => field.onChange(Number(v))}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="FP" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {FACTOR_POTENCIA.map((fp) => (
                              <SelectItem key={fp} value={String(fp)}>
                                {String(fp).replace(".", ",")}
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
                    aria-label={`Eliminar carga ${cargas[index]?.id ?? index + 1}`}
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
              Aún no hay cargas definidas.
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => append(createEmptyCarga(cargas))}
              disabled={nodosCarga.length === 0}
            >
              <Plus className="mr-1 size-4" />
              Agregar la primera carga
            </Button>
            {nodosCarga.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Primero define al menos un nodo de tipo CARGA.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
