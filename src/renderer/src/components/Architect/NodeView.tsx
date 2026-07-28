import type { ActionType, FlowNode } from './types'
import OptionsSvg from '../../assets/options.svg?react'

interface Props {
    node: FlowNode
    connections: boolean
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
    openNodeOptions: (node: FlowNode) => void
}

// Reparte N handles equiespaciados verticalmente (mismo cálculo que
// getHandlePosition en geometry.ts, tienen que coincidir siempre)
function offsetForIndex(index: number): string {
    // return `${((index + 1) / (total + 1)) * 100}%`
    return `${index * 32 + 16}px`
}

export function NodeView({
    node,
    connections,
    onNodePointerDown,
    onNodePointerMove,
    onNodePointerUp,
    onHandlePointerDown,
    onHandlePointerMove,
    onHandlePointerUp,
    openNodeOptions
}: Props): React.JSX.Element {
    // const entradas = getNodeHandles(node, 'entrada')
    // const salidas = getNodeHandles(node, 'salida')

    const actionColor = (v: ActionType): string => {
        switch (v) {
            case 'service':
                return '#6262e5'
            case 'terminal':
                return '#53b653'
            case 'user':
                return '#c07a1f'
            case 'timeout':
            default:
                return '#999'
        }
    }

    const nodeHeight = (): number => {
        // const handles = node.data.actions.reduce((pre,cur) => (pre + cur.reactions.length), 0)
        const height =
            node.flowConfig.height +
            (node.data.actions.flatMap((a) => a.reactions).length ?? 1) * 32
        return Math.max(64, height)
    }

    return (
        <div
            onPointerDown={(e) => onNodePointerDown(e, node)}
            onPointerMove={onNodePointerMove}
            onPointerUp={onNodePointerUp}
            className="flow-node-container"
            style={{
                left: node.flowConfig.x,
                top: node.flowConfig.y,
                width: node.flowConfig.width,
                height: nodeHeight()
            }}
        >
            <div
                className="flow-node-header"
                style={{
                    background: node.flowConfig.color ?? '#2a2a2a'
                }}
            >
                <p>{node.flowConfig.titulo}</p>
                {node.data.flow && <p>- {node.data.flow}</p>}
            </div>

            {/* Handles de entrada: necesitan los data-attributes para que useConnection los detecte al soltar */}
            {/* {entradas.map(() => (
            ))} */}
            <div
                key={'in'}
                data-flow-handle="target"
                data-node-id={node.id}
                data-handle-id={'in'}
                className={`flow-node-handle-base flow-node-handle-in ${connections ? 'connected' : ''}`}
            />

            {/* Handles de salida: acá arranca el drag de una conexión nueva */}
            {node.data.actions.map((action, i, array) => (
                <div
                    key={action.actionID}
                    className="flow-node-action-container"
                    style={{
                        borderRadius: i === array.length - 1 ? '0 0 10px 10px' : '0',
                        color: actionColor(action.type),
                        height: action.reactions.length * 32 + 'px'
                    }}
                >
                    <p>{action.actionID}</p>
                    {action.reactions.map((h, i) => (
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
                                top: offsetForIndex(i)
                            }}
                        >
                            {h.label && <span>{h.label}</span>}
                        </div>
                    ))}
                </div>
            ))}

            <div
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => openNodeOptions(node)}
                className="node-options-button"
            >
                <OptionsSvg />
            </div>
        </div>
    )
}
