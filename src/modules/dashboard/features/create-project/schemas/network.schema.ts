import { z } from "zod"
import { FACTOR_POTENCIA } from "./load.schema"

// ──────────────────────────────────────────────────────────────────────────
// CATÁLOGOS EDITABLES
// Modifica/añade entradas aquí; los componentes y validaciones se adaptan.
// ──────────────────────────────────────────────────────────────────────────

export const TIPO_NODO = [
  "SUBESTACION",
  "NODO_MT",
  "NODO_BT",
  "CARGA",
] as const

export const TIPO_NODO_LABELS: Record<(typeof TIPO_NODO)[number], string> = {
  SUBESTACION: "Subestación",
  NODO_MT: "Nodo MT",
  NODO_BT: "Nodo BT",
  CARGA: "Carga",
}

export const CLASES_POR_TIPO_NODO: Record<
  (typeof TIPO_NODO)[number],
  readonly string[]
> = {
  SUBESTACION: ["SUBESTACION PRINCIPAL S/E"],
  NODO_MT: [
    "POSTE DE FIBRA DE VIDRIO DE 14M",
    "POSTE DE CONCRETO DE 12M X 750KG",
    "POSTE DE CONCRETO DE 12M X 510KG",
  ],
  NODO_BT: [
    "POSTE METALICO DE 8M X 510KG",
    "POSTE DE CONCRETO DE 8M X 510KG",
  ],
  CARGA: [
    "ESTRATO 1",
    "ESTRATO 2",
    "ESTRATO 3",
    "ESTRATO 4",
    "ESTRATO 5",
    "ESTRATO 6",
    "COMERCIAL",
  ],
}

export const RED_FASES = ["1F", "2F", "3F"] as const

export const RED_FASES_LABELS: Record<(typeof RED_FASES)[number], string> = {
  "1F": "Monofásica (1F)",
  "2F": "Bifásica (2F)",
  "3F": "Trifásica (3F)",
}

export const CONDUCTORES = [
  "CABLE ACSR CALIBRE 2 - 3F",
  "CABLE ACSR CALIBRE 4 - 3F",
  "CABLE ACSR CALIBRE 4 - 2F",
  "CABLE TRENZADO ALUMINIO - 1F",
] as const

export type TipoTransformador = {
  id: string
  label: string
  kva: number
  fases: "MONO" | "TRI"
}

export const TIPOS_TRANSFORMADOR: readonly TipoTransformador[] = [
  { id: "MONO_25",   label: "Monofásico 25 kVA",   kva: 25,    fases: "MONO" },
  { id: "MONO_37_5", label: "Monofásico 37,5 kVA", kva: 37.5,  fases: "MONO" },
  { id: "MONO_50",   label: "Monofásico 50 kVA",   kva: 50,    fases: "MONO" },
  { id: "TRI_45",    label: "Trifásico 45 kVA",    kva: 45,    fases: "TRI"  },
  { id: "TRI_75",    label: "Trifásico 75 kVA",    kva: 75,    fases: "TRI"  },
  { id: "TRI_112_5", label: "Trifásico 112,5 kVA", kva: 112.5, fases: "TRI"  },
]

export const VOLTAJES_TRANSFORMADOR = [
  "13.2/120",
  "13.2/220",
  "13.2/208",
  "13.2/240",
] as const

// ──────────────────────────────────────────────────────────────────────────
// SCHEMAS Zod
// ──────────────────────────────────────────────────────────────────────────

const tipoTransformadorIds = TIPOS_TRANSFORMADOR.map((t) => t.id)

const nodoSchema = z.object({
  id: z.string().min(1),
  descripcion: z
    .string()
    .min(1, "Descripción obligatoria")
    .max(100, "Máximo 100 caracteres"),
  tipo: z.enum(TIPO_NODO, { message: "Seleccione el tipo" }),
  clase: z.string().min(1, "Seleccione la clase"),
  voltajeKV: z.coerce
    .number({ message: "Debe ser un número" })
    .positive("Debe ser mayor a 0"),
  cargaKVA: z.coerce
    .number({ message: "Debe ser un número" })
    .min(0, "No puede ser negativo"),
})

const lineaSchema = z
  .object({
    id: z.string().min(1),
    origen: z.string().min(1, "Seleccione el origen"),
    destino: z.string().min(1, "Seleccione el destino"),
    longitudM: z.coerce
      .number({ message: "Debe ser un número" })
      .positive("Debe ser mayor a 0"),
    conductor: z.enum(CONDUCTORES, { message: "Seleccione el conductor" }),
    red: z.enum(RED_FASES, { message: "Seleccione el tipo de red" }),
  })
  .refine((l) => l.origen !== l.destino, {
    message: "Origen y destino deben ser distintos",
    path: ["destino"],
  })

const subestacionSchema = z.object({
  id: z.string().min(1),
  nodoId: z.string().min(1, "Seleccione un nodo"),
  tipoTransformadorId: z
    .string()
    .min(1, "Seleccione el tipo de transformador")
    .refine((v) => tipoTransformadorIds.includes(v), {
      message: "Tipo de transformador no válido",
    }),
  voltaje: z.enum(VOLTAJES_TRANSFORMADOR, {
    message: "Seleccione el voltaje",
  }),
})

const cargaSchema = z.object({
  id: z.string().min(1),
  nodoId: z.string().min(1, "Seleccione un nodo"),
  potenciaKVA: z.coerce
    .number({ message: "Debe ser un número" })
    .positive("Debe ser mayor a 0"),
  fp: z.coerce
    .number({ message: "Seleccione el FP" })
    .refine((v) => (FACTOR_POTENCIA as readonly number[]).includes(v), {
      message: "Seleccione el FP",
    }),
})

export const networkSchema = z
  .object({
    nodos: z.array(nodoSchema).min(1, "Debe haber al menos 1 nodo"),
    lineas: z.array(lineaSchema).min(1, "Debe haber al menos 1 línea"),
    subestaciones: z
      .array(subestacionSchema)
      .min(1, "Debe haber al menos 1 transformador"),
    cargas: z.array(cargaSchema).min(1, "Debe haber al menos 1 carga"),
  })
  .superRefine((data, ctx) => {
    const idsNodos = new Set(data.nodos.map((n) => n.id))
    const idsNodosCarga = new Set(
      data.nodos.filter((n) => n.tipo === "CARGA").map((n) => n.id),
    )

    data.lineas.forEach((l, i) => {
      if (l.origen && !idsNodos.has(l.origen)) {
        ctx.addIssue({
          code: "custom",
          path: ["lineas", i, "origen"],
          message: "El nodo origen no existe",
        })
      }
      if (l.destino && !idsNodos.has(l.destino)) {
        ctx.addIssue({
          code: "custom",
          path: ["lineas", i, "destino"],
          message: "El nodo destino no existe",
        })
      }
    })

    data.subestaciones.forEach((s, i) => {
      if (s.nodoId && !idsNodos.has(s.nodoId)) {
        ctx.addIssue({
          code: "custom",
          path: ["subestaciones", i, "nodoId"],
          message: "El nodo no existe",
        })
      }
    })

    data.cargas.forEach((c, i) => {
      if (c.nodoId && !idsNodosCarga.has(c.nodoId)) {
        ctx.addIssue({
          code: "custom",
          path: ["cargas", i, "nodoId"],
          message: "Debe ser un nodo de tipo CARGA",
        })
      }
    })
  })

export type Nodo = z.infer<typeof nodoSchema>
export type Linea = z.infer<typeof lineaSchema>
export type Subestacion = z.infer<typeof subestacionSchema>
export type Carga = z.infer<typeof cargaSchema>

export type NetworkData = z.infer<typeof networkSchema>
export type NetworkDataInput = z.input<typeof networkSchema>
