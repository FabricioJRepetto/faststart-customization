import type { FlowNode } from './types'
import { getNodeHandles } from './Geometry'
import OptionsSvg from '../../assets/options.svg?react'

interface Props {
    node: FlowNode
    // drag del nodo completo (arrastrar por el cuerpo)
    onNodePointerDown: (e: React.PointerEvent<HTMLDivElement>, node: FlowNode) => void
    onNodePointerMove: (e: React.PointerEvent<HTMLDivElement>) => void
    onNodePointerUp: (e: React.PointerEvent<HTMLDivElement>) => void
    // drag de conexión (arrastrar desde un handle de salida)
    onHandlePointerDown: (
        e: React.PointerEvent<HTMLDivElement>,
        node: FlowNode,
        handleId: string
    ) => void
    onHandlePointerMove: (e: React.PointerEvent<HTMLDivElement>) => void
    onHandlePointerUp: (e: React.PointerEvent<HTMLDivElement>) => void
    onNodeOptionsPointerDown: (e: React.MouseEvent<HTMLDivElement>, node: FlowNode) => void
}

// Reparte N handles equiespaciados verticalmente (mismo cálculo que
// getHandlePosition en geometry.ts, tienen que coincidir siempre)
function offsetForIndex(index: number, total: number): string {
    return `${((index + 1) / (total + 1)) * 100}%`
}

export function NodeView({
    node,
    onNodePointerDown,
    onNodePointerMove,
    onNodePointerUp,
    onHandlePointerDown,
    onHandlePointerMove,
    onHandlePointerUp,
    onNodeOptionsPointerDown
}: Props): React.JSX.Element {
    const entradas = getNodeHandles(node, 'entrada')
    const salidas = getNodeHandles(node, 'salida')

    return (
        <div
            onPointerDown={(e) => onNodePointerDown(e, node)}
            onPointerMove={onNodePointerMove}
            onPointerUp={onNodePointerUp}
            className="flow-node-container"
            style={{
                left: node.x,
                top: node.y,
                width: node.width,
                height: node.height
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    background: node.color ?? '#2a2a2a',
                    borderRadius: '8px 8px 0 0',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#fff'
                }}
            >
                {node.titulo}
            </div>

            {/* Handles de entrada: necesitan los data-attributes para que useConnection los detecte al soltar */}
            {entradas.map((h) => (
                <div
                    key={h.id}
                    data-flow-handle="target"
                    data-node-id={node.id}
                    data-handle-id={h.id}
                    className="flow-node-handle-base flow-node-handle-in"
                />
            ))}

            {/* Handles de salida: acá arranca el drag de una conexión nueva */}
            {salidas.map((h, i) => (
                <div
                    key={h.id}
                    data-flow-handle="source"
                    data-node-id={node.id}
                    data-handle-id={h.id}
                    onPointerDown={(e) => onHandlePointerDown(e, node, h.id)}
                    onPointerMove={onHandlePointerMove}
                    onPointerUp={onHandlePointerUp}
                    className="flow-node-handle-base flow-node-handle-out"
                    style={{
                        top: offsetForIndex(i, salidas.length)
                    }}
                >
                    {h.label && <span>{h.label}</span>}
                </div>
            ))}

            <div
                onPointerDown={(e) => onNodeOptionsPointerDown(e, node)}
                className="node-options-button"
            >
                <OptionsSvg />
            </div>
        </div>
    )
}
