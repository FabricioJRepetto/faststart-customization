import { RefObject, useCallback, useRef, useState } from 'react'
import type { Viewport } from '../types'
import { clamp } from '../Geometry'

const MIN_ZOOM = 0.2
const MAX_ZOOM = 2.5
const ZOOM_SENSITIVITY = 0.001

type Return = {
    containerRef: RefObject<HTMLDivElement | null>
    viewport: Viewport
    screenToWorld: (screenX: number, screenY: number) => { x: number; y: number }
    onWheel: (e: React.WheelEvent<HTMLDivElement>) => void
    onPointerDownBackground: (e: React.PointerEvent<HTMLDivElement>) => void
    onPointerMoveBackground: (e: React.PointerEvent<HTMLDivElement>) => void
    onPointerUpBackground: (e: React.PointerEvent<HTMLDivElement>) => void
}

export function useViewport(initial: Viewport = { x: 0, y: 0, zoom: 1 }): Return {
    const [viewport, setViewport] = useState<Viewport>(initial)
    const isPanning = useRef(false)
    const lastPointer = useRef({ x: 0, y: 0 })
    const containerRef = useRef<HTMLDivElement>(null)

    // Convierte un punto de pantalla (ej. e.clientX/Y) a coordenadas del
    // "mundo" (el espacio donde viven x/y de los nodos). Útil para saber
    // dónde soltó el usuario algo, o dónde crear un nodo nuevo con doble click.
    const screenToWorld = useCallback(
        (clientX: number, clientY: number) => {
            const rect = containerRef.current?.getBoundingClientRect()
            const localX = clientX - (rect?.left ?? 0)
            const localY = clientY - (rect?.top ?? 0)
            return {
                x: (localX - viewport.x) / viewport.zoom,
                y: (localY - viewport.y) / viewport.zoom
            }
        },
        [viewport]
    )

    // Zoom con la rueda del mouse (o pellizco en trackpad), centrado en la
    // posición del cursor: el punto del mundo bajo el mouse queda fijo.
    const onWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
        // e.preventDefault()
        const rect = e.currentTarget.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        setViewport((vp) => {
            const nextZoom = clamp(vp.zoom * (1 - e.deltaY * ZOOM_SENSITIVITY), MIN_ZOOM, MAX_ZOOM)
            const worldX = (mouseX - vp.x) / vp.zoom
            const worldY = (mouseY - vp.y) / vp.zoom
            return {
                zoom: nextZoom,
                x: mouseX - worldX * nextZoom,
                y: mouseY - worldY * nextZoom
            }
        })
    }, [])

    // Pan: arrastrar el fondo. Se dispara solo si el pointerdown empezó en el
    // fondo (no en un nodo — ver stopPropagation en el drag de nodos).
    const onPointerDownBackground = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        isPanning.current = true
        lastPointer.current = { x: e.clientX, y: e.clientY }
        e.currentTarget.setPointerCapture(e.pointerId)
    }, [])

    const onPointerMoveBackground = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!isPanning.current) return
        const dx = e.clientX - lastPointer.current.x
        const dy = e.clientY - lastPointer.current.y
        lastPointer.current = { x: e.clientX, y: e.clientY }
        setViewport((vp) => ({ ...vp, x: vp.x + dx, y: vp.y + dy }))
    }, [])

    const onPointerUpBackground = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        isPanning.current = false
        e.currentTarget.releasePointerCapture(e.pointerId)
    }, [])

    return {
        containerRef,
        viewport,
        screenToWorld,
        onWheel,
        onPointerDownBackground,
        onPointerMoveBackground,
        onPointerUpBackground
    }
}
