import type {
  NetworkDataInput,
  Nodo,
  Linea,
  Subestacion,
} from "../schemas/network.schema"

export type IdPrefix = "N" | "L" | "T" | "C"

type WithId = { id: string }

/**
 * Genera el siguiente ID con el prefijo dado tomando como base el máximo
 * existente. Ej: ["N1", "N3"] + "N" => "N4".
 */
export function nextId(prefix: IdPrefix, rows: readonly WithId[]): string {
  const max = rows.reduce((m, r) => {
    const n = Number(String(r.id).replace(prefix, "")) || 0
    return n > m ? n : m
  }, 0)
  return `${prefix}${max + 1}`
}

export function createEmptyNodo(
  existing: readonly WithId[],
): NetworkDataInput["nodos"][number] {
  return {
    id: nextId("N", existing),
    descripcion: "",
    tipo: undefined as unknown as Nodo["tipo"],
    clase: "",
    voltajeKV: undefined as unknown as number,
    cargaKVA: 0,
  }
}

export function createEmptyLinea(
  existing: readonly WithId[],
): NetworkDataInput["lineas"][number] {
  return {
    id: nextId("L", existing),
    origen: "",
    destino: "",
    longitudM: undefined as unknown as number,
    conductor: undefined as unknown as Linea["conductor"],
    red: undefined as unknown as Linea["red"],
  }
}

export function createEmptySubestacion(
  existing: readonly WithId[],
): NetworkDataInput["subestaciones"][number] {
  return {
    id: nextId("T", existing),
    nodoId: "",
    tipoTransformadorId: "",
    voltaje: undefined as unknown as Subestacion["voltaje"],
  }
}

export function createEmptyCarga(
  existing: readonly WithId[],
): NetworkDataInput["cargas"][number] {
  return {
    id: nextId("C", existing),
    nodoId: "",
    potenciaKVA: undefined as unknown as number,
    fp: undefined as unknown as number,
  }
}
