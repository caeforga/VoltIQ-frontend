/**
 * Símbolo unifilar de transformador: dos óvalos verticales enlazados con
 * un punto de cruce. Renderiza usando `currentColor`, por lo que hereda el
 * color del contenedor (`text-violet-400`, etc.).
 */
export function TrafoSymbol({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="9.5" r="3.5" />
      <circle cx="12" cy="14.5" r="3.5" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
    </svg>
  )
}

/**
 * Símbolo unifilar de subestación: torre con dos travesaños horizontales.
 */
export function SubestacionSymbol({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="6" y1="7" x2="18" y2="7" />
      <line x1="7.5" y1="11" x2="16.5" y2="11" />
      <line x1="9" y1="15" x2="15" y2="15" />
      <line x1="6" y1="22" x2="9" y2="18" />
      <line x1="18" y1="22" x2="15" y2="18" />
    </svg>
  )
}
