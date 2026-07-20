import { store } from '@renderer/utils/context/context'
import { FlowEdges, FlowNodes } from '../FlowStorage'
import { FlowNode } from '../types'

/** Agrega un target al Nodo indicado
 * @param source Nodo de origen
 * @param handleID ID de  (Handle de Salida)
 */
export const addHandleTarget = (
    nodes: FlowNode[],
    /** @example [NodoID]+[ActionType]+[ActionID]+[ReactionID] */
    sourceNodeID: string,
    handleID: string,
    targetNodeID: string
): FlowNode[] | null => {
    try {
        const sourceNode = nodes.filter((n) => n.id === sourceNodeID)?.[0]
        const actionType = handleID.split('.')[1]
        const actionID = handleID.split('.')[2]

        if (!sourceNode) throw new Error(`Source Node not found: ${sourceNodeID}`)

        const newActions = sourceNode.data.actions.map((a) => {
            if (a.actionID === actionID && a.type === actionType) {
                return {
                    ...a,
                    reactions: a.reactions.map((r) => {
                        if (r.id === handleID) {
                            return {
                                ...r,
                                target: targetNodeID
                            }
                        } else return r
                    })
                }
            } else return a
        })

        const newNodes = nodes.map((n) => {
            if (n.id === sourceNodeID) {
                const aux = { ...n, data: { ...n.data, actions: newActions } }
                return aux
            } else return n
        })
        return newNodes
    } catch (error) {
        console.error(error)
        return null
    }
}

export const removeHandleTarget = (nodes: FlowNode[], connectionID: string): FlowNode[] | null => {
    try {
        /** e-[SourceHandleID]-[TargetNodeID].[TargetHandleID]-[Date] */
        /** [NodoID].[ActionType].[ActionID].[ReactionCode] */
        const handleID = connectionID.split('-')?.[1]
        const sourceNodeID = handleID.split('.')?.[0]
        const actionType = handleID.split('.')?.[1]
        const actionID = handleID.split('.')?.[2]

        // console.log('[ASD] handleID', handleID)
        // console.log('[ASD] sourceNodeID', sourceNodeID)
        // console.log('[ASD] actionType', actionType)
        // console.log('[ASD] actionID', actionID)

        const sourceNode = nodes.filter((n) => n.id === sourceNodeID)?.[0]

        if (!sourceNode) throw new Error(`Source Node not found: ${sourceNodeID}`)

        const newActions = sourceNode.data.actions.map((a) => {
            if (a.actionID === actionID && a.type === actionType) {
                return {
                    ...a,
                    reactions: a.reactions.map((r) => {
                        if (r.id === handleID) {
                            return {
                                ...r,
                                target: undefined
                            }
                        } else return r
                    })
                }
            } else return a
        })

        const newNodes = nodes.map((n) => {
            if (n.id === sourceNodeID) {
                const aux = { ...n, data: { ...n.data, actions: newActions } }
                return aux
            } else return n
        })
        return newNodes
    } catch (error) {
        console.error(error)
        return null
    }
}

export const deleteNode = (nodeID: string): void => {
    try {
        const edgesList = store.get(FlowEdges)
        Object.values(edgesList).map((e) => {
            if (e.target === nodeID) {
                store.set(FlowEdges, (eds) => {
                    // eslint-disable-next-line
                    const { [e.id]: _removed, ...rest } = eds
                    return rest
                })
                store.set(FlowNodes, (prev) => {
                    return removeHandleTarget(prev, e.id) || prev
                })
            }
            if (e.source === nodeID) {
                store.set(FlowEdges, (eds) => {
                    // eslint-disable-next-line
                    const { [e.id]: _removed, ...rest } = eds
                    return rest
                })
            }
        })

        store.set(FlowNodes, (prev) => {
            return prev.filter((n) => n.id !== nodeID)
        })
        // TODO - Iterar edges / nodos buscando conexiones fantasma
    } catch (error) {
        console.error(error)
    }
}
