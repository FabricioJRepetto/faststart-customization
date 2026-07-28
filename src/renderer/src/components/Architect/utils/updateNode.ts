import { store } from '@renderer/utils/context/context'
import { FlowEdges, FlowNodes } from '../FlowStorage'
import { ActionType, FlowNode, NodeAction, UIElement, UIElementType } from '../types'

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

/** Elimina las referencias 'target' de handles que apuntan a nodos eliminados basandose en la ID de un edge (conexion) */
export const removeHandleTarget = (nodes: FlowNode[], connectionID: string): FlowNode[] | null => {
    try {
        // e-[SourceHandleID]-[TargetNodeID].[TargetHandleID]-[Date]
        //          |
        // [NodoID].[ActionType].[ActionID].[ReactionCode]
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
    } catch (error) {
        console.error(error)
    }
}

export const addNodeAction = (nodeID: string, action: ActionType): void => {
    try {
        // TODO - modal para crear actions
        const presetAct: Record<ActionType, NodeAction> = {
            [ActionType.user]: {
                type: ActionType.user,
                actionID: 'click',
                trigger: { type: 'user' },
                steps: [],
                reactions: [
                    {
                        reactionCode: 'coninue',
                        id: `${nodeID}.${action}.click.coninue`,
                        label: 'continue'
                    }
                ]
            },
            [ActionType.service]: {
                type: ActionType.service,
                actionID: 'login',
                trigger: { type: 'user' },
                steps: [],
                reactions: [
                    {
                        reactionCode: 'ok',
                        id: `${nodeID}.${action}.login.ok`,
                        label: 'ok'
                    },
                    {
                        reactionCode: 'error',
                        id: `${nodeID}.${action}.login.error`,
                        label: 'error'
                    }
                ]
            },
            [ActionType.terminal]: {
                type: ActionType.terminal,
                actionID: 'CDMisAvailable',
                trigger: { type: 'auto' },
                steps: [],
                reactions: [
                    {
                        reactionCode: 'available',
                        id: `${nodeID}.${action}.CDMisAvailable.available`,
                        label: 'available'
                    },
                    {
                        reactionCode: 'notAvailable',
                        id: `${nodeID}.${action}.CDMisAvailable.notAvailable`,
                        label: 'notAvailable'
                    }
                ]
            },
            [ActionType.timeout]: {
                type: ActionType.timeout,
                actionID: 'timeout',
                trigger: { type: 'auto' },
                steps: [],
                reactions: [
                    {
                        reactionCode: 'timeout',
                        id: `${nodeID}.${action}.timeout.timeout`,
                        label: ''
                    }
                ]
            }
        }

        store.set(FlowNodes, (nodes) => {
            return [...nodes]?.map((n) => {
                if (n.id === nodeID) {
                    return {
                        ...n,
                        data: {
                            ...n.data,
                            actions: [...n.data.actions, presetAct[action]]
                        }
                    }
                } else return n
            })
        })
    } catch (error) {
        console.error(error)
    }
}

/** Elimina una accion del nodo y sus conexiones */
export const deleteNodeAction = (nodeID: string, actionType: string, actionId: string): void => {
    try {
        const nodes = store.get(FlowNodes)
        const edgesList = store.get(FlowEdges)
        const handlesID = nodes
            .find((n) => n.id === nodeID)
            ?.data.actions.find((a) => a.actionID === actionId && a.type === actionType)
            ?.reactions.map((r) => r.id)

        Object.values(edgesList).map((e) => {
            if (handlesID?.includes(e.sourceHandle)) {
                store.set(FlowEdges, (eds) => {
                    // eslint-disable-next-line
                    const { [e.id]: _removed, ...rest } = eds
                    return rest
                })
            }
        })

        const newNodes = [...nodes]?.map((n) => {
            if (n.id === nodeID) {
                return {
                    ...n,
                    data: {
                        ...n.data,
                        actions: [...n.data.actions].filter(
                            (a) => !(a.actionID === actionId && a.type === actionType)
                        )
                    }
                }
            } else return n
        })
        store.set(FlowNodes, newNodes)
    } catch (error) {
        console.error(error)
    }
}

export const addNodeUI = (nodeID: string, element: UIElementType): void => {
    try {
        const presetUI: Record<UIElementType, UIElement> = {
            [UIElementType.NavigationButton]: {
                type: UIElementType.NavigationButton,
                config: {
                    buttons: [{ onAction: '', text: 'Continue', position: 'right' }]
                }
            },
            [UIElementType.NumericInput]: { type: UIElementType.NumericInput, config: {} },
            [UIElementType.TextInput]: { type: UIElementType.TextInput, config: {} },
            [UIElementType.OptionsList]: {
                type: UIElementType.OptionsList,
                config: { onAction: '', data: '' }
            },
            [UIElementType.Table]: { type: UIElementType.Table, config: { data: '' } },
            [UIElementType.Information]: {
                type: UIElementType.Information,
                config: {
                    title: 'Titulo informativo',
                    subtitle: 'Subtitulo informativo',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                    illustration: 'image_thankyou'
                }
            }
        }

        store.set(FlowNodes, (nodes) => {
            return [...nodes]?.map((n) => {
                if (n.id === nodeID) {
                    return {
                        ...n,
                        data: {
                            ...n.data,
                            UIElement: [...n.data.UIElement, presetUI[element]]
                        }
                    }
                } else return n
            })
        })
    } catch (error) {
        console.error(error)
    }
}

export const deleteNodeUI = (nodeID: string, element: UIElementType): void => {
    try {
        store.set(FlowNodes, (nodes) => {
            return [...nodes]?.map((n) => {
                if (n.id === nodeID) {
                    return {
                        ...n,
                        data: {
                            ...n.data,
                            UIElement: [...n.data.UIElement].filter((e) => !(e.type === element))
                        }
                    }
                } else return n
            })
        })
    } catch (error) {
        console.error(error)
    }
}
