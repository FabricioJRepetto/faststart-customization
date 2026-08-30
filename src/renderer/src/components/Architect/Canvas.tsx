import { useCallback, useEffect, useMemo, useState } from 'react'
import { useConnection } from './hooks/useConnection'
import { NodeView } from './NodeView'
import { EdgeView } from './EdgeView'
import { getBezierPath, getHandlePosition } from './Geometry'
import { useAtom, useSetAtom } from 'jotai'
import { FlowEdges, FlowNodes, SelectedNodeId } from './FlowStorage'
import { useViewport } from './hooks/useViewport'
import { useNodeDrag } from './hooks/useOndrag'
import { addHandleTarget, removeHandleTarget } from './utils/updateNode'
import { FlowEdge, FlowNode } from '@renderer/types/types'

const GRID_SIZE = 20

export default function Canvas(): React.JSX.Element {
    const [nodes, setNodes] = useAtom(FlowNodes)
    const [edges, setEdges] = useAtom(FlowEdges)
    const selectedNode = useSetAtom(SelectedNodeId)
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)

    const openNodeOptions = (node: FlowNode): void => {
        selectedNode(node.id)
    }

    const {
        containerRef,
        viewport,
        screenToWorld,
        onWheel,
        onPointerDownBackground,
        onPointerMoveBackground,
        onPointerUpBackground
    } = useViewport({ x: 100, y: 200, zoom: 1 })

    const moveNode = useCallback(
        (id: string, x: number, y: number) => {
            setNodes((nds) =>
                nds.map((n) => (n.id === id ? { ...n, flowConfig: { ...n.flowConfig, x, y } } : n))
            )
        },
        [setNodes]
    )

    const { onPointerDown, onPointerMove, onPointerUp } = useNodeDrag(
        viewport.zoom,
        GRID_SIZE,
        moveNode
    )

    const addEdge = useCallback(
        (edge: FlowEdge) => {
            setEdges((eds) => {
                //? Regla: Conexiones - salida = máx 1, entrada = N
                // Se filtra posible edge previo que nazca del mismo handle
                const withoutPreviousFromSameSource = Object.fromEntries(
                    Object.entries(eds).filter(
                        ([, e]) =>
                            !(e.source === edge.source && e.sourceHandle === edge.sourceHandle)
                    )
                )
                console.log('set edge', edge);                
                return { ...withoutPreviousFromSameSource, [edge.id]: edge }
            })
            setNodes((prev) => {
                console.log('set node =>', edge.target)                
                return addHandleTarget(prev, edge.source, edge.sourceHandle, edge.target) || prev
            })
        },
        [setEdges, setNodes]
    )

    const removeEdge = useCallback(
        (edgeId: string) => {
            setEdges((eds) => {
                // eslint-disable-next-line
                const { [edgeId]: _removed, ...rest } = eds
                return rest
            })
            // setSelectedEdgeId((current) => (current === edgeId ? null : current))
            setSelectedEdgeId(null)
            setNodes((prev) => {
                return removeHandleTarget(prev, edgeId) || prev
            })
        },
        [setEdges, setNodes]
    )

    // Delete/Backspace borra el edge seleccionado. Se ignora si el foco está
    // en un input/textarea para no interferir con edición de texto en otro lado.
    useEffect(() => {
        function onKeyDown(e: KeyboardEvent): void {
            if (!selectedEdgeId) return
            if (e.key !== 'Delete' && e.key !== 'Backspace') return
            const target = e.target as HTMLElement
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
            removeEdge(selectedEdgeId)
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [selectedEdgeId, removeEdge])

    const {
        draft: connectionDraft,
        onHandlePointerDown,
        onHandlePointerMove,
        onHandlePointerUp
    } = useConnection({ screenToWorld, onConnect: addEdge })

    const nodesById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes])

    const gridSize = GRID_SIZE * viewport.zoom
    const backgroundStyle: React.CSSProperties = {
        backgroundImage: 'radial-gradient(circle, #33333375 1px, transparent 1px)',
        backgroundSize: `${gridSize}px ${gridSize}px`,
        backgroundPosition: `${viewport.x % gridSize}px ${viewport.y % gridSize}px`
    }

    // Línea fantasma mientras se arrastra una conexión nueva
    const ghostPath = useMemo(() => {
        if (!connectionDraft) return null
        const sourceNode = nodesById.get(connectionDraft.sourceNodeId)
        if (!sourceNode) return null
        const from = getHandlePosition(sourceNode, connectionDraft.sourceHandleId, 'salida')
        return getBezierPath(from.x, from.y, connectionDraft.pointer.x, connectionDraft.pointer.y)
    }, [connectionDraft, nodesById])

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '100vh',
                background: '#0d0d0d',
                overflow: 'hidden',
                position: 'relative',
                touchAction: 'none',
                ...backgroundStyle
            }}
            onWheel={onWheel}
            onPointerDown={(e) => {
                setSelectedEdgeId(null) // click en el fondo deselecciona
                onPointerDownBackground(e)
            }}
            onPointerMove={onPointerMoveBackground}
            onPointerUp={onPointerUpBackground}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
                    transformOrigin: '0 0'
                }}
            >
                <svg style={{ position: 'absolute', overflow: 'visible', pointerEvents: 'none' }}>
                    <defs>
                        <marker
                            id="flow-arrow"
                            viewBox="0 0 10 10"
                            refX="8"
                            refY="5"
                            markerWidth="8"
                            markerHeight="8"
                            orient="auto-start-reverse"
                        >
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#32363f" />
                        </marker>
                    </defs>

                    {Object.values(edges).map((edge) => (
                        <EdgeView
                            key={edge.id}
                            edge={edge}
                            nodes={nodesById}
                            selected={edge.id === selectedEdgeId}
                            onSelect={() => setSelectedEdgeId(edge.id)}
                        />
                    ))}

                    {ghostPath && (
                        <path
                            d={ghostPath}
                            fill="none"
                            stroke="#006152"
                            strokeWidth={2}
                            strokeDasharray="4 4"
                        />
                    )}
                </svg>

                {nodes.map((node) => (
                    <NodeView
                        key={node.id}
                        node={node}
                        connections={
                            !!Object.values(edges).find((e) => e.target === node.id)
                        }
                        onNodePointerDown={onPointerDown}
                        onNodePointerMove={onPointerMove}
                        onNodePointerUp={onPointerUp}
                        onHandlePointerDown={onHandlePointerDown}
                        onHandlePointerMove={onHandlePointerMove}
                        onHandlePointerUp={onHandlePointerUp}
                        openNodeOptions={openNodeOptions}
                    />
                ))}
            </div>
        </div>
    )
}
