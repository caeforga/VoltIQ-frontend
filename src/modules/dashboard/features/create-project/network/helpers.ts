import type {
  NetworkDataInput,
  Nodo,
  Linea,
  Subestacion,
  Carga,
} from "../schemas/network.schema"

export type IdPrefix = "N" | "L" | "T" | "C"

/**
 * Genera el siguiente ID con el prefijo dado tomando como base el máximo
 * existente. Ej: ["N1", "N3"] + "N" => "N4".
 */
export function nextId(prefix: IdPrefix, rows: { id: string }[]): string {
  const max = rows.reduce((m, r) => {
    const n = Number(String(r.id).replace(prefix, "")) || 0
    return n > m ? n : m
  }, 0)
  return `${prefix}${max + 1}`
}

export function createEmptyNodo(existing: Nodo[]): NetworkDataInput["nodos"][number] {
  return {
    id: nextId("N", existing),
    descripcion: "",
    tipo: undefined as unknown as Nodo["tipo"],
    clase: "",
    voltajeKV: undefined as unknown as number,
    cargaKVA: 0,
  }
}

export function createEmptyLinea(existing: Linea[]): NetworkDataInput["lineas"][number] {
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
  existing: Subestacion[],
): NetworkDataInput["subestaciones"][number] {
  return {
    id: nextId("T", existing),
    nodoId: "",
    tipoTransformadorId: "",
    voltaje: undefined as unknown as Subestacion["voltaje"],
  }
}

export function createEmptyCarga(existing: Carga[]): NetworkDataInput["cargas"][number] {
  return {
    id: nextId("C", existing),
    nodoId: "",
    potenciaKVA: undefined as unknown as number,
    fp: undefined as unknown as number,
  }
}
