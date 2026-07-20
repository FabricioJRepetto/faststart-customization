import { getBezierPath, getHandlePosition } from './Geometry'
import type { FlowEdge, FlowNode } from './types'

interface Props {
    edge: FlowEdge
    nodes: Map<string, FlowNode>
    selected?: boolean
    onSelect?: () => void
}

export function EdgeView({ edge, nodes, selected, onSelect }: Props): React.JSX.Element | null {
    const source = nodes.get(edge.source)
    const target = nodes.get(edge.target)
    if (!source || !target) return null // nodo borrado, edge huérfano

    const from = getHandlePosition(source, edge.sourceHandle, 'salida')
    const to = getHandlePosition(target, edge.targetHandle, 'entrada')

    const d = getBezierPath(from.x, from.y, to.x, to.y)

    return (
        <g style={{ cursor: 'pointer' }}>
            {/* Path invisible más ancho: agranda el área de click sin agrandar
          el trazo visible (clickear un bezier de 2px es muy poco margen) */}
            <path
                d={d}
                fill="none"
                stroke="transparent"
                strokeWidth={16}
                style={{ pointerEvents: 'stroke' }}
                onPointerDown={(e) => {
                    e.stopPropagation()
                    onSelect?.()
                }}
            />
            <path
                d={d}
                fill="none"
                stroke={selected ? '#00b196' : '#32363f'}
                strokeWidth={2}
                // markerEnd="url(#flow-arrow)"
                style={{ pointerEvents: 'none' }}
            />
        </g>
    )
}
