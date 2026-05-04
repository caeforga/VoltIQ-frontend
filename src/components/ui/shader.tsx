import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

const FRAGMENT_SHADER = `
  precision highp float;

  uniform float u_time;
  uniform vec2  u_resolution;

  // ===== Utilidades =====

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  vec2 rot90(vec2 v) { return vec2(v.y, 1.0 - v.x); }

  // Aplica una rotación pseudo-aleatoria de 90° a las coordenadas locales
  void cellAndLocal(vec2 uv, out vec2 cell, out vec2 local) {
    cell  = floor(uv);
    local = fract(uv);
    float r = floor(hash(cell + 3.1) * 4.0);
    if (r > 0.5) local = rot90(local);
    if (r > 1.5) local = rot90(local);
    if (r > 2.5) local = rot90(local);
  }

  // ===== Tipos de pieza (PCB) =====
  // tileT: 0 = vacío, 1 = recto, 2 = L, 3 = cruce
  // Devuelve la distancia al trazo y el tipo de pieza por out param.

  float distInTile(vec2 local, vec2 cell, out float tileT) {
    float h = hash(cell + 7.7);
    if (h < 0.10) {
      tileT = 0.0;
      return 1.0;
    } else if (h < 0.50) {
      tileT = 1.0;
      return abs(local.y - 0.5);                       // recto horizontal
    } else if (h < 0.92) {
      tileT = 2.0;
      float d1 = local.x >= 0.5 ? abs(local.y - 0.5) : 1.0;
      float d2 = local.y <= 0.5 ? abs(local.x - 0.5) : 1.0;
      return min(d1, d2);                              // L: bottom -> right
    } else {
      tileT = 3.0;
      return min(abs(local.x - 0.5), abs(local.y - 0.5)); // cruce
    }
  }

  // Posición canónica del pulso según el tipo y un parámetro 0..1
  vec2 pulsePosInTile(float tileT, float param) {
    if (tileT < 0.5) return vec2(-9.0);                 // vacío: sin pulso
    if (tileT < 1.5) return vec2(param, 0.5);           // recto
    if (tileT < 2.5) {                                  // L
      return param < 0.5
        ? vec2(0.5, param)
        : vec2(0.5 + (param - 0.5), 0.5);
    }
    return vec2(-9.0);                                  // cruce: sin pulso (solo nodo)
  }

  // Renderiza una capa de circuito sobre 'col' modulada por 'amount'
  vec3 circuitLayer(
    vec3 col, vec2 p, float scale, float t,
    float traceWidthOuter, float traceWidthInner,
    float pulseRadius, float pulseSpeed, float intensity, vec3 cyan
  ) {
    vec2 grid = p * scale;
    vec2 cell, local;
    cellAndLocal(grid, cell, local);

    float tileT;
    float d     = distInTile(local, cell, tileT);
    float alive = step(0.5, tileT); // 0 si tile vacío

    float trace = smoothstep(traceWidthOuter, traceWidthInner, d) * alive;

    // Pads pequeños en cualquier intersección/centro de pieza viva
    float pad   = smoothstep(0.08, 0.0, length(local - 0.5)) * alive;

    // Pad XL en cruces (vía / soldadura grande)
    float crossPad = smoothstep(0.13, 0.0, length(local - 0.5)) * step(2.5, tileT);

    // Anillo exterior del cross pad para darle "ojal"
    float ring = smoothstep(0.115, 0.105, length(local - 0.5))
               * step(2.5, tileT)
               * step(0.085, length(local - 0.5));

    col += cyan * trace * 0.22 * intensity;
    col += cyan * pad   * 0.55 * intensity;
    col += cyan * crossPad * 0.85 * intensity;
    col += cyan * ring  * 0.6  * intensity;

    // Pulso recorriendo solo piezas con dirección definida (recto y L)
    float param  = fract(hash(cell + 11.3) + t * pulseSpeed);
    vec2  pp     = pulsePosInTile(tileT, param);
    float pulse  = smoothstep(pulseRadius, 0.0, length(local - pp)) * trace;
    col += cyan * pulse * 2.7 * intensity;

    return col;
  }

  void main() {
    vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
    float t = u_time;

    // Paleta de marca
    vec3 navy = vec3(0.016, 0.102, 0.204); // #041a34
    vec3 cyan = vec3(0.502, 0.914, 0.996); // #80e9fe
    vec3 deep = navy * 0.40;

    // Fondo radial
    float radial = 1.0 - length(p) * 0.55;
    vec3  col    = mix(deep, navy, smoothstep(0.0, 1.0, radial));

    // ---- Capa 1: pistas macro (gruesas, primer plano) ----
    col = circuitLayer(
      col, p,
      6.5,          // escala (celdas grandes)
      t,
      0.052, 0.024, // ancho de pista
      0.090,        // radio del pulso
      0.28,         // velocidad del pulso
      1.0,          // intensidad
      cyan
    );

    // ---- Capa 2: pistas micro (finas, fondo) ----
    col = circuitLayer(
      col, p + vec2(0.31, 0.17),
      13.0,
      t,
      0.034, 0.014,
      0.060,
      0.46,
      0.55,
      cyan
    );

    // ---- Barrido de alimentación muy sutil ----
    float sweepX = mod(t * 0.12, 2.8) - 1.4;
    float sweep  = smoothstep(0.50, 0.0, abs(p.x - sweepX));
    col += cyan * sweep * 0.04;

    // Vignette
    float vignette = 1.0 - dot(p, p) * 0.45;
    col *= clamp(vignette, 0.18, 1.0);

    // Grano sutil
    float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    col += (grain - 0.5) * 0.012;

    gl_FragColor = vec4(col, 1.0);
  }
`

interface ShaderProps {
    className?: string
}

export function Shader({ className }: ShaderProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const gl =
            (canvas.getContext("webgl") as WebGLRenderingContext | null) ??
            (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null)
        if (!gl) {
            console.warn("WebGL no soportado en este navegador.")
            return
        }

        const compile = (type: number, src: string) => {
            const sh = gl.createShader(type)
            if (!sh) return null
            gl.shaderSource(sh, src)
            gl.compileShader(sh)
            if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(sh))
                gl.deleteShader(sh)
                return null
            }
            return sh
        }

        const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER)
        const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
        if (!vs || !fs) return

        const program = gl.createProgram()
        if (!program) return
        gl.attachShader(program, vs)
        gl.attachShader(program, fs)
        gl.linkProgram(program)
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program))
            return
        }
        gl.useProgram(program)

        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            gl.STATIC_DRAW
        )

        const aPos = gl.getAttribLocation(program, "a_position")
        gl.enableVertexAttribArray(aPos)
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

        const uTime = gl.getUniformLocation(program, "u_time")
        const uResolution = gl.getUniformLocation(program, "u_resolution")

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            const w = Math.floor(canvas.clientWidth * dpr)
            const h = Math.floor(canvas.clientHeight * dpr)
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w
                canvas.height = h
                gl.viewport(0, 0, w, h)
            }
        }

        let raf = 0
        const start = performance.now()

        const render = (now: number) => {
            resize()
            gl.uniform1f(uTime, (now - start) * 0.001)
            gl.uniform2f(uResolution, canvas.width, canvas.height)
            gl.drawArrays(gl.TRIANGLES, 0, 6)
            raf = requestAnimationFrame(render)
        }
        raf = requestAnimationFrame(render)

        const onResize = () => resize()
        window.addEventListener("resize", onResize)

        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener("resize", onResize)
            gl.deleteBuffer(buffer)
            gl.deleteProgram(program)
            gl.deleteShader(vs)
            gl.deleteShader(fs)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            aria-hidden
            className={cn(
                "pointer-events-none absolute inset-0 h-full w-full",
                className
            )}
        />
    )
}
