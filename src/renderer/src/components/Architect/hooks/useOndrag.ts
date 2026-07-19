import { useCallback, useRef } from 'react'
import type { FlowNode } from '../types'
import { snapToGrid } from '../Geometry'

type Return = {
    onPointerDown: (e: React.PointerEvent<HTMLDivElement>, node: FlowNode) => void
    onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void
    onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void
}

export function useNodeDrag(
    zoom: number,
    gridSize: number,
    onMove: (id: string, x: number, y: number) => void
): Return {
    const drag = useRef<{
        id: string
        startNodeX: number
        startNodeY: number
        startPointerX: number
        startPointerY: number
    } | null>(null)

    const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>, node: FlowNode) => {
        // stopPropagation para que este pointerdown no dispare el pan del fondo
        e.stopPropagation()
        drag.current = {
            id: node.id,
            startNodeX: node.x,
            startNodeY: node.y,
            startPointerX: e.clientX,
            startPointerY: e.clientY
        }
        e.currentTarget.setPointerCapture(e.pointerId)
    }, [])

    const onPointerMove = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            if (!drag.current) return
            // El delta de pantalla se divide por el zoom para obtener el delta
            // real en coordenadas del mundo (si estás zoomeado 2x, 1px de mouse
            // mueve el nodo medio px en el mundo)
            const dx = (e.clientX - drag.current.startPointerX) / zoom
            const dy = (e.clientY - drag.current.startPointerY) / zoom
            const newX = snapToGrid(drag.current.startNodeX + dx, gridSize)
            const newY = snapToGrid(drag.current.startNodeY + dy, gridSize)
            onMove(drag.current.id, newX, newY)
        },
        [zoom, gridSize, onMove]
    )

    const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        drag.current = null
        e.currentTarget.releasePointerCapture(e.pointerId)
    }, [])

    return { onPointerDown, onPointerMove, onPointerUp }
}
