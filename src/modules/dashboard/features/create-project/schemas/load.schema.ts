import { z } from "zod"

export const TIPO_CARGA = [
  "residencial",
  "comercial"
] as const

export const ESTRATOS = [1, 2, 3, 4, 5, 6] as const

export const FACTOR_POTENCIA = [0.8, 0.9, 0.95] as const

export const UNIDAD_POTENCIA = ["kVA", "kW"] as const

export const loadSchema = z.object({
  potenciaTotal: z.coerce
    .number({ message: "Debe ser un número" })
    .positive("Debe ser mayor a 0"),
  unidadPotencia: z.enum(UNIDAD_POTENCIA, {
    message: "Seleccione la unidad",
  }),
  factorPotencia: z.coerce
    .number({ message: "Seleccione el factor de potencia" })
    .refine((v) => (FACTOR_POTENCIA as readonly number[]).includes(v), {
      message: "Seleccione el factor de potencia",
    }),
  tipoCarga: z.enum(TIPO_CARGA, {
    message: "Seleccione el tipo de carga",
  }),
  numeroUsuarios: z.coerce
    .number({ message: "Debe ser un número entero" })
    .int("Debe ser un número entero")
    .positive("Debe ser mayor a 0"),
  estrato: z.coerce
    .number({ message: "Seleccione un estrato" })
    .int()
    .min(1, "Estrato entre 1 y 6")
    .max(6, "Estrato entre 1 y 6"),
})

export type LoadData = z.infer<typeof loadSchema>
export type LoadDataInput = z.input<typeof loadSchema>

export const TIPO_CARGA_LABELS: Record<(typeof TIPO_CARGA)[number], string> = {
  residencial: "Residencial",
  comercial: "Comercial"
}
