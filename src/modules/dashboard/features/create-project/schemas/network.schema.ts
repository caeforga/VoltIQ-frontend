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
    "POSTE DE CONCRETO DE 12M X 510KG",
    "POSTE DE CONCRETO DE 12M X 750KG",
    "POSTE DE CONCRETO DE 12M X 1050KG",
    "POSTE DE FIBRA DE VIDRIO DE 12M X 510KG",
    "POSTE DE FIBRA DE VIDRIO DE 14M X 750KG",
    "POSTE DE FIBRA DE VIDRIO DE 12M X 1050KG",
    "POSTE METALICO DE 12M X 510KG",
    "POSTE METALICO DE 12M X 750KG",
    "POSTE METALICO DE 12M X 1050KG",
  ],
  NODO_BT: [
    "POSTE DE CONCRETO DE 8M X 510KG",
    "POSTE DE CONCRETO DE 8M X 750KG",
    "POSTE DE CONCRETO DE 8M X 1050KG",
    "POSTE DE CONCRETO DE 10M X 510KG",
    "POSTE METALICO DE 8M X 510KG",
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

export const NIVEL_TENSION = ["MT", "BT"] as const
export const TIPO_CABLE = ["ABIERTA", "TRENZADA"] as const

export type Conductor = {
  id: string
  label: string
  /** Niveles donde aplica el conductor: MT, BT o ambos. */
  niveles: ReadonlyArray<(typeof NIVEL_TENSION)[number]>
  tipoCable: (typeof TIPO_CABLE)[number]
}

/**
 * Catálogo de conductores. Reglas tomadas del Excel:
 * - MT (aéreo) → solo RED ABIERTA (cables ACSR).
 * - BT (aéreo) → RED ABIERTA (ACSR) o RED TRENZADA (cuádruplex/tríplex).
 * Los conductores ACSR aplican a ambos niveles.
 */
export const CONDUCTORES: readonly Conductor[] = [
  // RED ABIERTA - ACSR (aplican a MT y BT)
  { id: "ACSR_2",   label: "CABLE ACSR CALIBRE No. 2",   niveles: ["MT", "BT"], tipoCable: "ABIERTA" },
  { id: "ACSR_1_0", label: "CABLE ACSR CALIBRE No. 1/0", niveles: ["MT", "BT"], tipoCable: "ABIERTA" },
  { id: "ACSR_2_0", label: "CABLE ACSR CALIBRE No. 2/0", niveles: ["MT", "BT"], tipoCable: "ABIERTA" },
  // RED TRENZADA - CUÁDRUPLEX (solo BT)
  { id: "TRZ_CUAD_3X2_2",         label: "CABLE TRENZADO CUADRUPLEX 3X2+2",         niveles: ["BT"], tipoCable: "TRENZADA" },
  { id: "TRZ_CUAD_3X1_0_1X1_0",   label: "CABLE TRENZADO CUADRUPLEX 3X1/0+1x1/0",   niveles: ["BT"], tipoCable: "TRENZADA" },
  { id: "TRZ_CUAD_3X2_0_1_0",     label: "CABLE TRENZADO CUADRUPLEX 3x2/0+1/0",     niveles: ["BT"], tipoCable: "TRENZADA" },
  { id: "TRZ_CUAD_3X2_0_2_0",     label: "CABLE TRENZADO CUADRUPLEX 3x2/0+2/0",     niveles: ["BT"], tipoCable: "TRENZADA" },
  { id: "TRZ_CUAD_3X4_0_4_0",     label: "CABLE TRENZADO CUADRUPLEX 3X4/0+4/0",     niveles: ["BT"], tipoCable: "TRENZADA" },
  // RED TRENZADA - TRÍPLEX (solo BT)
  { id: "TRZ_TRIP_2X2_1X2",       label: "CABLE TRENZADO TRIPLEX 2X2+1x2",          niveles: ["BT"], tipoCable: "TRENZADA" },
  { id: "TRZ_TRIP_2X1_0_1_0",     label: "CABLE TRENZADO TRIPLEX 2X1/0+1/0",        niveles: ["BT"], tipoCable: "TRENZADA" },
  { id: "TRZ_TRIP_2X2_0_2_0",     label: "CABLE TRENZADO TRIPLEX 2X2/0+2/0",        niveles: ["BT"], tipoCable: "TRENZADA" },
]

export type TipoTransformador = {
  id: string
  label: string
  kva: number
  fases: "MONO" | "TRI"
}

/**
 * Transformadores tipo poste según el catálogo del Excel.
 * Monofásicos: 5, 10, 15, 25, 37.5, 50 kVA.
 * Trifásicos: 15, 30, 45, 75 kVA.
 */
export const TIPOS_TRANSFORMADOR: readonly TipoTransformador[] = [
  { id: "MONO_5",    label: "TRANSFORMADOR MONOFASICO TIPO POSTE DE 5 KVA",    kva: 5,    fases: "MONO" },
  { id: "MONO_10",   label: "TRANSFORMADOR MONOFASICO TIPO POSTE DE 10 KVA",   kva: 10,   fases: "MONO" },
  { id: "MONO_15",   label: "TRANSFORMADOR MONOFASICO TIPO POSTE DE 15 KVA",   kva: 15,   fases: "MONO" },
  { id: "MONO_25",   label: "TRANSFORMADOR MONOFASICO TIPO POSTE DE 25 KVA",   kva: 25,   fases: "MONO" },
  { id: "MONO_37_5", label: "TRANSFORMADOR MONOFASICO TIPO POSTE DE 37,5 KVA", kva: 37.5, fases: "MONO" },
  { id: "MONO_50",   label: "TRANSFORMADOR MONOFASICO TIPO POSTE DE 50 KVA",   kva: 50,   fases: "MONO" },
  { id: "TRI_15",    label: "TRANSFORMADOR TRIFASICO TIPO POSTE DE 15 KVA",    kva: 15,   fases: "TRI"  },
  { id: "TRI_30",    label: "TRANSFORMADOR TRIFASICO TIPO POSTE DE 30 KVA",    kva: 30,   fases: "TRI"  },
  { id: "TRI_45",    label: "TRANSFORMADOR TRIFASICO TIPO POSTE DE 45 KVA",    kva: 45,   fases: "TRI"  },
  { id: "TRI_75",    label: "TRANSFORMADOR TRIFASICO TIPO POSTE DE 75 KVA",    kva: 75,   fases: "TRI"  },
]

export const VOLTAJES_TRANSFORMADOR = [
  "13.2/120",
  "13.2/220",
  "13.2/208",
  "13.2/240",
] as const

// ──────────────────────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────────────────────

/**
 * Deriva el nivel de tensión de una línea a partir de los tipos de sus
 * nodos. Si involucra BT o CARGA → "BT"; si solo MT/SUBESTACION → "MT".
 * Devuelve null si falta alguno de los nodos.
 */
export function nivelDeLinea(
  origen: { tipo?: (typeof TIPO_NODO)[number] } | undefined,
  destino: { tipo?: (typeof TIPO_NODO)[number] } | undefined,
): (typeof NIVEL_TENSION)[number] | null {
  if (!origen?.tipo || !destino?.tipo) return null
  const involucraBT = [origen.tipo, destino.tipo].some(
    (t) => t === "NODO_BT" || t === "CARGA",
  )
  return involucraBT ? "BT" : "MT"
}

/** Conductores aplicables a un nivel dado. */
export function conductoresPara(
  nivel: (typeof NIVEL_TENSION)[number] | null,
): readonly Conductor[] {
  if (!nivel) return CONDUCTORES
  return CONDUCTORES.filter((c) => c.niveles.includes(nivel))
}

// ──────────────────────────────────────────────────────────────────────────
// SCHEMAS Zod
// ──────────────────────────────────────────────────────────────────────────

const tipoTransformadorIds = TIPOS_TRANSFORMADOR.map((t) => t.id)
const conductorIds = CONDUCTORES.map((c) => c.id)

const nodoSchema = z.object({
  id: z.string().min(1),
  descripcion: z
    .string()
    .min(1, "Descripción obligatoria")
    .max(100, "Máximo 100 caracteres"),
  tipo: z.enum(TIPO_NODO, { message: "Seleccione el tipo" }),
  clase: z.string().min(1, "Seleccione la clase"),
  // Voltaje opcional: el nivel del sistema se define en el paso 1 (general)
  // y el voltaje de salida del trafo se define en SubestacionesTable.
  voltajeKV: z.coerce
    .number({ message: "Debe ser un número" })
    .positive("Debe ser mayor a 0")
    .optional(),
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
    conductor: z
      .string()
      .min(1, "Seleccione el conductor")
      .refine((v) => conductorIds.includes(v), {
        message: "Conductor no válido",
      }),
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

    const nodoPorId = new Map(data.nodos.map((n) => [n.id, n]))

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

      const nivel = nivelDeLinea(
        nodoPorId.get(l.origen),
        nodoPorId.get(l.destino),
      )
      if (nivel && l.conductor) {
        const conductor = CONDUCTORES.find((c) => c.id === l.conductor)
        if (conductor && !conductor.niveles.includes(nivel)) {
          ctx.addIssue({
            code: "custom",
            path: ["lineas", i, "conductor"],
            message:
              nivel === "MT"
                ? "MT solo admite cables ACSR (red abierta)"
                : "El conductor no aplica a baja tensión",
          })
        }
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
