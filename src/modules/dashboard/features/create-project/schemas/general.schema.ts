import { z } from "zod"

export const TIPO_RED = ["MT", "BT", "MIXTA"] as const
export const TIPO_INSTALACION = ["aerea", "subterranea"] as const

export const generalSchema = z.object({
  proyecto: z
    .string()
    .min(1, "El nombre del proyecto es obligatorio")
    .max(100, "Máximo 100 caracteres"),
  ubicacion: z
    .string()
    .min(1, "La ubicación es obligatoria")
    .max(50, "Máximo 50 caracteres"),
  operadorRed: z
    .string()
    .min(1, "El operador de red es obligatorio")
    .max(50, "Máximo 50 caracteres"),
  tipoRed: z.enum(TIPO_RED, {
    message: "Seleccione el tipo de red",
  }),
  tipoInstalacion: z.enum(TIPO_INSTALACION, {
    message: "Seleccione el tipo de instalación",
  }),
  nivelTensionMT: z.coerce
    .number({ message: "Debe ser un número" })
    .positive("Debe ser mayor a 0"),
  nivelTensionBT: z.coerce
    .number({ message: "Debe ser un número" })
    .positive("Debe ser mayor a 0"),
  temperaturaZona: z.coerce
    .number({ message: "Debe ser un número" })
    .min(-10, "Mínimo -10 °C")
    .max(50, "Máximo 50 °C"),
})

export type GeneralData = z.infer<typeof generalSchema>
export type GeneralDataInput = z.input<typeof generalSchema>

export const TIPO_RED_LABELS: Record<(typeof TIPO_RED)[number], string> = {
  MT: "Media tensión",
  BT: "Baja tensión",
  MIXTA: "Mixta (MT + BT)",
}

export const TIPO_INSTALACION_LABELS: Record<
  (typeof TIPO_INSTALACION)[number],
  string
> = {
  aerea: "Aérea",
  subterranea: "Subterránea",
}

export const OPERADORES_POR_DEPARTAMENTO: Record<string, string[]> = {
  Nariño: ["CEDENAR S.A. E.S.P."],
  Cauca: ["CEO S.A. E.S.P."],
  Cundinamarca: ["ENEL Colombia S.A. E.S.P.", "EBSA"],
  Bogotá: ["ENEL Colombia S.A. E.S.P."],
  Antioquia: ["EPM E.S.P."],
  "Valle del Cauca": ["Celsia S.A. E.S.P.", "EMCALI E.S.P."],
  Atlántico: ["AIR-E S.A.S. E.S.P."],
  Bolívar: ["AFINIA S.A.S. E.S.P."],
  Caldas: ["CHEC S.A. E.S.P."],
  Quindío: ["EDEQ S.A. E.S.P."],
  Risaralda: ["EEP S.A. E.S.P."],
  Tolima: ["ENERTOLIMA S.A. E.S.P."],
  Huila: ["ELECTROHUILA S.A. E.S.P."],
  Santander: ["ESSA S.A. E.S.P."],
  "Norte de Santander": ["CENS S.A. E.S.P."],
  Boyacá: ["EBSA S.A. E.S.P."],
}

export const DEPARTAMENTOS = Object.keys(OPERADORES_POR_DEPARTAMENTO)
