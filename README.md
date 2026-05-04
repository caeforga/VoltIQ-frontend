# VoltIQ Power Suite — Frontend

Interfaz web del **VoltIQ Power Suite**, software para ingeniería eléctrica.
Construido con **Vite + React 19 + TypeScript** y un stack moderno enfocado en
DX, rendimiento y componentes accesibles.

---

## Stack

| Categoría          | Tecnología                                                       |
| ------------------ | ---------------------------------------------------------------- |
| Build / dev        | [Vite 8](https://vite.dev)                                       |
| UI                 | [React 19](https://react.dev) + TypeScript                       |
| Estilos            | [Tailwind CSS v4](https://tailwindcss.com) (`@tailwindcss/vite`) |
| Componentes        | [shadcn/ui](https://ui.shadcn.com) (estilo `radix-nova`)         |
| Iconos             | [lucide-react](https://lucide.dev)                               |
| Routing            | [React Router v7](https://reactrouter.com)                       |
| Estado             | [Zustand 5](https://zustand-demo.pmnd.rs)                        |
| Lint               | ESLint + typescript-eslint                                       |
| Gráficos / shaders | WebGL crudo (sin dependencias)                                   |

---

## Requisitos

- **Node.js ≥ 22.9** (recomendado Node 24, fijado en `.nvmrc`).
- **npm** (incluido con Node).
- **Navegador moderno** con soporte WebGL para los shaders del login.

### Usando fnm

El proyecto incluye un `.nvmrc`. Si tienes [`fnm`](https://github.com/Schniz/fnm)
con `--use-on-cd` activado, la versión correcta de Node se selecciona
automáticamente al entrar a la carpeta. Si no, ejecuta:

```bash
fnm use
```

---

## Puesta en marcha

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar el servidor de desarrollo
npm run dev

# La app queda disponible en http://localhost:5173
```

---

## Scripts disponibles

| Comando           | Qué hace                                                                   |
| ----------------- | -------------------------------------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo con HMR (Vite).                                     |
| `npm run build`   | Compila TypeScript (`tsc -b`) y genera el bundle de producción en `dist/`. |
| `npm run preview` | Sirve el bundle de producción localmente para probarlo.                    |
| `npm run lint`    | Linter ESLint sobre todo el proyecto.                                      |

---

## Estructura del proyecto

```
src/
├── app/                          # Configuración global de la app
│   ├── router.tsx                # Definición de rutas (React Router)
│   └── store.tsx                 # (placeholder) stores globales si los hubiera
│
├── modules/                      # Código organizado por dominio / feature
│   ├── auth/
│   │   └── components/
│   │       └── Login.tsx
│   └── dashboard/
│       └── components/
│           └── Dashboard.tsx
│
├── shared/                       # Código transversal (no atado a un módulo)
│   └── components/
│       └── ErrorPage.tsx
│
├── components/
│   └── ui/                       # Componentes de shadcn/ui (editables)
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── login.tsx             # Bloque de login con shader de fondo
│       └── shader.tsx            # Shader WebGL (estética PCB / circuitos)
│
├── lib/
│   └── utils.ts                  # Helper `cn()` para combinar clases
│
├── App.tsx                       # (no usado actualmente — entry vía router)
├── index.css                     # Tokens del theme (shadcn) + Tailwind v4
└── main.tsx                      # Bootstrap de React + RouterProvider
```

### Convenciones

- **Modular por dominio**: cada feature vive en `src/modules/<feature>/` con
  su propia carpeta de `components/`, y opcionalmente `store/`, `services/`,
  `types/`, `hooks/`. Cuando un módulo crece, mantenlo autocontenido.
- **Componentes UI compartidos**: en `src/components/ui/` (shadcn).
- **Lógica/UI compartida no UI-genérica**: en `src/shared/`.
- **Path alias**: `@/*` apunta a `./src/*`. Configurado en `tsconfig.json`,
  `tsconfig.app.json` y `vite.config.ts`.

---

## Theme y estilos

- Tailwind v4 se importa con `@import "tailwindcss";` en `src/index.css`.
- Los tokens del theme (colores, radios, etc.) están definidos en bloques
  `:root` (claro) y `.dark` (oscuro) usando variables CSS, mapeados a tokens
  de Tailwind con `@theme inline`.
- Soporte de modo oscuro: la directiva `@custom-variant dark` permite usar
  `dark:*` añadiendo la clase `dark` a cualquier ancestro (por ejemplo, una
  sección que necesite forzar tema oscuro independientemente del global).
- `tw-animate-css` añadido para animaciones complementarias.

### Añadir un componente de shadcn

```bash
npx shadcn@latest add <componente>
# Ej.: npx shadcn@latest add dropdown-menu
```

Los componentes se generan en `src/components/ui/` y son **código tuyo**,
editable.

---

## Routing

Configurado en `src/app/router.tsx` con `createBrowserRouter`. Rutas actuales:

| Path     | Componente              | Layout |
| -------- | ----------------------- | ------ |
| `/`      | `Dashboard`             | —      |
| `/login` | `Login` (módulo `auth`) | —      |

Errores de ruta o renderizado caen en `src/shared/components/ErrorPage.tsx`.

---

## Estado global (Zustand)

Convención: cada módulo gestiona su propio store dentro de
`src/modules/<feature>/store/`. Ejemplo:

```
src/modules/auth/store/authStore.ts
src/modules/dashboard/store/dashboardStore.ts
```

Esto evita un único store gigante y mantiene cada feature autocontenida.

---

## Shader del login

El fondo animado del login (`src/components/ui/shader.tsx`) usa **WebGL crudo
sin librerías**. Genera proceduralmente trazas tipo PCB, pads/vías y pulsos
de energía en la paleta de la marca.

Los parámetros (escala, ancho de pista, velocidad de pulso, etc.) están
documentados en comentarios dentro del propio shader.

---

## Solución de problemas

**`npm` reporta `EBADENGINE`**
La versión de Node no cumple con los requisitos del paquete. Ejecuta `fnm use`
o instala Node ≥ 22.9.

**Vite no resuelve `@/...`**
Verifica que `vite.config.ts` tenga el alias `@` apuntando a `./src` y que
`tsconfig.app.json` tenga `paths` configurado.

**El shader no se ve / la pantalla está negra en el login**
WebGL no soportado o desactivado en el navegador. La consola lo indicará. La
sección tiene un fondo de fallback (`bg-background`).

---

## Roadmap corto

- [ ] Autenticación real (JWT/cookie session) en `modules/auth`.
- [ ] `ProtectedRoute` en `shared/components/` con redirección.
- [ ] Cliente HTTP centralizado (axios o `fetch` wrapper) en `shared/services/`.
- [ ] Toggle global de modo oscuro/claro.
- [ ] Tests con Vitest + React Testing Library.

---

## Licencia

Privado — © VoltIQ.
