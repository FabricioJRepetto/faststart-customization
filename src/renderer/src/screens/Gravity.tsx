import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// ---- Config de la grilla ----
const COLS = 29 // columnas de la grilla
const ROWS = 18 // filas de la grilla
const SEGMENTS = 14 // segmentos por línea (resolución de la curvatura)
const GRAVITY_RADIUS = 220 // hasta dónde llega la influencia del cursor
const GRAVITY_STRENGTH = 240 // cuánto se "hunden" las líneas en el punto máximo
const PERSPECTIVE = 0.25 // 0 = sin perspectiva, 1 = perspectiva fuerte

export const GravityGrid = (): React.JSX.Element => {
    const svgRef = useRef(null)
    const [size, setSize] = useState({ w: window.innerWidth * 1.75, h: window.innerHeight })
    const mouse = useRef({ x: -9999, y: -9999, active: false })
    const linesH = useRef([]) // refs a <path> horizontales
    const linesV = useRef([]) // refs a <path> verticales
    const rafId = useRef(null)

    useEffect(() => {
        const onResize = () => setSize({ w: window.innerWidth * 1.75, h: window.innerHeight })
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    // Proyección con perspectiva simple: puntos más "lejos" (arriba) se acercan al centro y se comprimen en Y
    const project = useCallback((u, v, w, h) => {
        // u, v en [0,1]: u = horizontal, v = vertical (0 = arriba/lejos, 1 = abajo/cerca)
        const cx = w / 2
        const vanishY = h * 0.08
        const baseY = h * 1.05

        const depth = v // 0 lejos -> 1 cerca
        const spread = Math.pow(depth, 1 - PERSPECTIVE * 0.4) // controla qué tan rápido se abre el horizonte
        const x = cx + (u - 0.5) * w * (0.25 + 0.95 * spread)
        const y = vanishY + (baseY - vanishY) * Math.pow(depth, 1 + PERSPECTIVE)
        return { x, y }
    }, [])

    // Genera los puntos base de la grilla (sin deformar)
    const basePoints = useMemo(() => {
        const w = size.w,
            h = size.h
        const horiz = []
        for (let r = 0; r <= ROWS; r++) {
            const v = r / ROWS
            const pts = []
            for (let s = 0; s <= SEGMENTS; s++) {
                const u = s / SEGMENTS
                pts.push(project(u, v, w, h))
            }
            horiz.push(pts)
        }
        const vert = []
        for (let c = 0; c <= COLS; c++) {
            const u = c / COLS
            const pts = []
            for (let s = 0; s <= SEGMENTS; s++) {
                const v = s / SEGMENTS
                pts.push(project(u, v, w, h))
            }
            vert.push(pts)
        }
        return { horiz, vert }
    }, [size, project])

    // Convierte una serie de puntos en un path suave usando Catmull-Rom -> Bézier cúbica.
    // Esto evita los ángulos duros en cada vértice cuando los puntos se desplazan.
    const pointsToPath = (pts) => {
        const n = pts.length
        if (n < 3) {
            // fallback simple para series muy cortas
            let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`
            for (let i = 1; i < n; i++) d += ` L ${pts[i].x.toFixed(2)} ${pts[i].y.toFixed(2)}`
            return d
        }

        const get = (i) => pts[Math.max(0, Math.min(n - 1, i))] // clamp en los extremos

        let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`
        for (let i = 0; i < n - 1; i++) {
            const p0 = get(i - 1)
            const p1 = get(i)
            const p2 = get(i + 1)
            const p3 = get(i + 2)

            // tangentes Catmull-Rom (factor 1/6 = la versión estándar de Catmull-Rom -> Bézier)
            const cp1x = p1.x + (p2.x - p0.x) / 6
            const cp1y = p1.y + (p2.y - p0.y) / 6
            const cp2x = p2.x - (p3.x - p1.x) / 6
            const cp2y = p2.y - (p3.y - p1.y) / 6

            d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
        }
        return d
    }

    // El "campo gravitacional": cuánto se hunde un punto según distancia al cursor
    const gravityOffset = (x, y, mx, my) => {
        const dx = x - mx
        const dy = y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > GRAVITY_RADIUS) return 0
        // curva suave tipo "pozo gravitacional": 1 en el centro, 0 en el borde
        const t = 1 - dist / GRAVITY_RADIUS
        const falloff = t * t * (3 - 2 * t) // smoothstep
        return falloff * GRAVITY_STRENGTH
    }

    const render = useCallback(() => {
        const { x: mx, y: my, active } = mouse.current
        const factor = active ? 1 : 0

        basePoints.horiz.forEach((pts, idx) => {
            const el = linesH.current[idx]
            if (!el) return
            const deformed = pts.map((p) => {
                const sink = gravityOffset(p.x, p.y, mx, my) * factor
                return { x: p.x, y: p.y + sink }
            })
            el.setAttribute('d', pointsToPath(deformed))
        })

        basePoints.vert.forEach((pts, idx) => {
            const el = linesV.current[idx]
            if (!el) return
            const deformed = pts.map((p) => {
                const sink = gravityOffset(p.x, p.y, mx, my) * factor
                return { x: p.x, y: p.y + sink }
            })
            el.setAttribute('d', pointsToPath(deformed))
        })
    }, [basePoints])

    // Animación: interpolamos el mouse target con suavizado para que no sea brusco
    const smoothed = useRef({ x: -9999, y: -9999, active: false })

    useEffect(() => {
        const loop = () => {
            const target = mouse.current
            const s = smoothed.current
            const ease = 0.15
            s.x += (target.x - s.x) * ease
            s.y += (target.y - s.y) * ease
            s.active = target.active
            mouseForRender.current = s
            renderWithSmoothed()
            rafId.current = requestAnimationFrame(loop)
        }
        rafId.current = requestAnimationFrame(loop)
        return () => cancelAnimationFrame(rafId.current)
    }, [basePoints])

    const mouseForRender = useRef({ x: -9999, y: -9999, active: false })

    const renderWithSmoothed = useCallback(() => {
        const { x: mx, y: my, active } = mouseForRender.current
        const factor = active ? 1 : 0

        basePoints.horiz.forEach((pts, idx) => {
            const el = linesH.current[idx]
            if (!el) return
            const deformed = pts.map((p) => {
                const sink = gravityOffset(p.x, p.y, mx, my) * factor
                return { x: p.x, y: p.y + sink }
            })
            el.setAttribute('d', pointsToPath(deformed))
        })

        basePoints.vert.forEach((pts, idx) => {
            const el = linesV.current[idx]
            if (!el) return
            const deformed = pts.map((p) => {
                const sink = gravityOffset(p.x, p.y, mx, my) * factor
                return { x: p.x, y: p.y + sink }
            })
            el.setAttribute('d', pointsToPath(deformed))
        })
    }, [basePoints])

    const handleMouseMove = (e) => {
        const rect = svgRef.current.getBoundingClientRect()
        mouse.current.x = e.clientX - rect.left
        mouse.current.y = e.clientY - rect.top
        mouse.current.active = true
    }

    const handleMouseLeave = () => {
        mouse.current.active = false
    }

    return (
        <svg
            ref={svgRef}
            width={size.w}
            height={size.h}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                display: 'block',
                // background: 'radial-gradient(ellipse at 50% 10%, #1c112a 0%, #0a0a0f 70%)'
                background: 'radial-gradient(ellipse at 50% 10%, #0a0a0f 0%, #1c1724 70%)'
            }}
        >
            <defs>
                <linearGradient id="fadeH" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3a4570" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#7d8cff" stopOpacity="0.85" />
                </linearGradient>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                    <stop offset="10%" stopColor="#7d8cff" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#7d8cff" stopOpacity="0" />
                </radialGradient>
            </defs>

            {basePoints.vert.map((_, idx) => (
                <path
                    key={`v-${idx}`}
                    ref={(el) => (linesV.current[idx] = el)}
                    fill="none"
                    stroke="url(#fadeH)"
                    strokeWidth="1"
                />
            ))}
            {basePoints.horiz.map((_, idx) => {
                const t = idx / ROWS
                const opacity = 0.1 + t * 0.75
                return (
                    <path
                        key={`h-${idx}`}
                        ref={(el) => (linesH.current[idx] = el)}
                        fill="none"
                        stroke="#7d8cff"
                        strokeOpacity={opacity}
                        strokeWidth="1"
                    />
                )
            })}
        </svg>
    )
}
