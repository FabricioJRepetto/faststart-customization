import { useCallback, useState } from 'react'
import type { ConnectionDraft, FlowEdge, FlowNode } from '../types'

type Return = {
    draft: ConnectionDraft | null
    onHandlePointerDown: (
        e: React.PointerEvent<HTMLDivElement>,
        node: FlowNode,
        handleId: string
    ) => void
    onHandlePointerMove: (e: React.PointerEvent<HTMLDivElement>) => void
    onHandlePointerUp: (e: React.PointerEvent<HTMLDivElement>) => void
}

interface Args {
    screenToWorld: (screenX: number, screenY: number) => { x: number; y: number }
    onConnect: (edge: FlowEdge) => void
}

export function useConnection({ screenToWorld, onConnect }: Args): Return {
    const [draft, setDraft] = useState<ConnectionDraft | null>(null)

    // Arranca al hacer pointerDown sobre un handle de SALIDA
    const onHandlePointerDown = useCallback(
        (e: React.PointerEvent<HTMLDivElement>, node: FlowNode, handleId: string) => {
            // que no dispare el drag del nodo ni el pan del fondo
            e.stopPropagation()
            setDraft({
                sourceNodeId: node.id,
                sourceHandleId: handleId,
                pointer: screenToWorld(e.clientX, e.clientY)
            })
            e.currentTarget.setPointerCapture(e.pointerId)
        },
        [screenToWorld]
    )

    // Como el pointer queda "capturado" por el handle de origen, este mismo
    // handler sigue recibiendo los eventos aunque el mouse esté sobre otro nodo
    const onHandlePointerMove = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            if (!draft) return
            const pointer = screenToWorld(e.clientX, e.clientY)
            setDraft((d) => (d ? { ...d, pointer } : d))
        },
        [draft, screenToWorld]
    )

    const onHandlePointerUp = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            if (!draft) return
            e.currentTarget.releasePointerCapture(e.pointerId)

            // Al estar el pointer capturado, hay que usar elementFromPoint para
            // saber qué elemento hay realmente debajo del cursor al soltar
            const dropTarget = document
                .elementFromPoint(e.clientX, e.clientY)
                ?.closest<HTMLElement>('[data-flow-handle="target"]')

            if (dropTarget) {
                const targetNodeId = dropTarget.dataset.nodeId!
                const targetHandleId = dropTarget.dataset.handleId!
                // evita conectar un nodo consigo mismo
                if (targetNodeId !== draft.sourceNodeId) {
                    onConnect({
                        id: `e-${draft.sourceNodeId}.${draft.sourceHandleId}-${targetNodeId}.${targetHandleId}-${Date.now()}`,
                        source: draft.sourceNodeId,
                        sourceHandle: draft.sourceHandleId,
                        target: targetNodeId,
                        targetHandle: targetHandleId
                    })
                }
            }

            setDraft(null)
        },
        [draft, onConnect]
    )

    return { draft, onHandlePointerDown, onHandlePointerMove, onHandlePointerUp }
}
