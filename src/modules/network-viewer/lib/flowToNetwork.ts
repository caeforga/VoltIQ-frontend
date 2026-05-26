import type {
  Carga,
  Linea,
  NetworkData,
  Nodo,
  Subestacion,
} from "@/modules/dashboard/features/create-project/schemas/network.schema"

type NetworkLike = Partial<NetworkData>

/**
 * Aplica un cambio parcial a un nodo identificado por su id.
 * No modifica el original.
 */
export function updateNodo(
  network: NetworkLike,
  nodoId: string,
  patch: Partial<Nodo>,
): NetworkLike {
  const nodos = (network.nodos ?? []).map((n) =>
    n.id === nodoId ? ({ ...n, ...patch } as Nodo) : n,
  )
  return { ...network, nodos }
}

export function updateLinea(
  network: NetworkLike,
  lineaId: string,
  patch: Partial<Linea>,
): NetworkLike {
  const lineas = (network.lineas ?? []).map((l) =>
    l.id === lineaId ? ({ ...l, ...patch } as Linea) : l,
  )
  return { ...network, lineas }
}

export function updateSubestacion(
  network: NetworkLike,
  subId: string,
  patch: Partial<Subestacion>,
): NetworkLike {
  const subestaciones = (network.subestaciones ?? []).map((s) =>
    s.id === subId ? ({ ...s, ...patch } as Subestacion) : s,
  )
  return { ...network, subestaciones }
}

export function updateCarga(
  network: NetworkLike,
  cargaId: string,
  patch: Partial<Carga>,
): NetworkLike {
  const cargas = (network.cargas ?? []).map((c) =>
    c.id === cargaId ? ({ ...c, ...patch } as Carga) : c,
  )
  return { ...network, cargas }
}

/** Devuelve la carga asociada al nodoId, si existe. */
export function findCargaForNodo(
  network: NetworkLike,
  nodoId: string,
): Carga | undefined {
  return (network.cargas ?? []).find((c) => c.nodoId === nodoId)
}

export function removeNodo(network: NetworkLike, nodoId: string): NetworkLike {
  const nodos = (network.nodos ?? []).filter((n) => n.id !== nodoId)
  // Eliminar líneas que referencian este nodo
  const lineas = (network.lineas ?? []).filter(
    (l) => l.origen !== nodoId && l.destino !== nodoId,
  )
  // Eliminar transformadores asignados a este nodo
  const subestaciones = (network.subestaciones ?? []).filter(
    (s) => s.nodoId !== nodoId,
  )
  // Eliminar cargas asignadas a este nodo
  const cargas = (network.cargas ?? []).filter((c) => c.nodoId !== nodoId)
  return { ...network, nodos, lineas, subestaciones, cargas }
}

export function removeLinea(
  network: NetworkLike,
  lineaId: string,
): NetworkLike {
  const lineas = (network.lineas ?? []).filter((l) => l.id !== lineaId)
  return { ...network, lineas }
}

export function removeSubestacion(
  network: NetworkLike,
  subId: string,
): NetworkLike {
  const subestaciones = (network.subestaciones ?? []).filter(
    (s) => s.id !== subId,
  )
  return { ...network, subestaciones }
}

export function removeCarga(
  network: NetworkLike,
  cargaId: string,
): NetworkLike {
  const cargas = (network.cargas ?? []).filter((c) => c.id !== cargaId)
  return { ...network, cargas }
}
