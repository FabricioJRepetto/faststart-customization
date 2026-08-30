import { store } from '@renderer/utils/context/context'
import { FlowEdges, FlowNodes } from '../FlowStorage'
import {
    ActionType,
    FlowNode,
    NodeAction,
    ScreenType,
    UIElement,
    UIElementType,
    LogicalStep,
    FlowEdge,
    UIelementConfigs,
    OptionsListOptions
} from '@renderer/types/types.d'
import TerminalActions, { TSService } from '../Actions/Terminal/TerminalActions'
import TerminalViews from '../Actions/Terminal/TerminalViews'

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

        console.log('addHandleTarget - sourceNodeID', sourceNodeID)
        console.log('sourceNode', sourceNode)
        console.log('actionType', actionType)
        console.log('actionID', actionID)
        console.log('handleID', handleID)

        if (!sourceNode) throw new Error(`Source Node not found: ${sourceNodeID}`)

        const newActions = sourceNode.data.actions.map((a) => {
            if (a.actionID === actionID && a.type === actionType) {
                console.log(
                    'reactions:',
                    a.reactions.map((r) => r.id)
                )
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

export function addNodeAction(
    nodeID: string,
    action: ActionType.user | ActionType.service | ActionType.timeout
): void
export function addNodeAction(
    nodeID: string,
    action: ActionType.terminal,
    serviceID: TSService
): void
export function addNodeAction(nodeID: string, action: ActionType, serviceID?: TSService): void {
    try {
        // TODO - modal para crear actions
        const presetAct: Record<string, NodeAction> = {
            [ActionType.user]: {
                type: ActionType.user,
                actionID: 'click',
                trigger: { type: 'user' },
                steps: [],
                reactions: [
                    {
                        reactionCode: '',
                        id: `${nodeID}.${action}.click.default`,
                        label: ''
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
            [ActionType.timeout]: {
                type: ActionType.timeout,
                actionID: 'timeout',
                trigger: { type: 'auto' },
                steps: [],
                reactions: [
                    {
                        reactionCode: 'timeout',
                        id: `${nodeID}.${action}.timeout.timeout`,
                        label: 'timeout'
                    }
                ]
            }
        }

        let _action: NodeAction
        let _views: Record<string, UIElement[]> = {}
        switch (action) {
            case ActionType.user:
                _action = presetAct[action]
                break

            case ActionType.terminal:
                _action = TerminalActions[serviceID!](nodeID)
                _views = TerminalViews[serviceID!]()
                break

            case ActionType.service:
                _action = presetAct[action]
                break

            case ActionType.timeout:
                _action = presetAct[action]
                break
        }

        store.set(FlowNodes, (nodes) => {
            return [...nodes]?.map((n) => {
                if (n.id === nodeID) {
                    return {
                        ...n,
                        data: {
                            ...n.data,
                            actions: [...n.data.actions, _action],
                            views: { ...n.data.views, ..._views }
                        }
                    }
                } else return n
            })
        })
    } catch (error) {
        console.error(error)
    }
}

export const updateNodeAction = (
    nodeID: string,
    actionID: string,
    props: Record<string, string>
): void => {
    store.set(FlowNodes, (nodes) => {
        return [...nodes]?.map((n) => {
            if (n.id === nodeID) {
                return {
                    ...n,
                    data: {
                        ...n.data,
                        actions: [...n.data.actions].map((a) => {
                            if (a.actionID === actionID) {
                                return {
                                    ...a,
                                    ...props
                                }
                            } else return a
                        })
                    }
                }
            } else return n
        })
    })
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

export const addNodeReaction = (nodeID: string, actionID: string): void => {
    store.set(FlowNodes, (nodes) => {
        return [...nodes]?.map((n) => {
            if (n.id === nodeID) {
                return {
                    ...n,
                    data: {
                        ...n.data,
                        actions: [...n.data.actions].map((a) => {
                            if (a.actionID === actionID) {
                                return {
                                    ...a,
                                    reactions: [
                                        ...a.reactions,
                                        {
                                            id: `${nodeID}.${a.type}.${a.actionID}.${new Date().getTime()}`,
                                            reactionCode: '',
                                            target: ''
                                        }
                                    ]
                                }
                            } else return a
                        })
                    }
                }
            } else return n
        })
    })
}

export const updateNodeReaction = (
    nodeID: string,
    actionID: string,
    reactionID: string,
    props: Record<string, string>
): void => {
    let new_r_id = reactionID
    if (props?.reactionCode) {
        new_r_id = reactionID.split('.').slice(0, -1).join('.') + '.' + props.reactionCode

        const edgesList = store.get(FlowEdges)
        Object.values(edgesList).map((e) => {
            if (e.sourceHandle === reactionID) {
                const new_edge_id = e.id.replace(reactionID, new_r_id)

                store.set(FlowEdges, (eds) => {
                    // eslint-disable-next-line
                    const { [e.id]: _removed, ...rest } = eds

                    const aux = {
                        ...rest,
                        [new_edge_id]: { ...e, id: new_edge_id, sourceHandle: new_r_id }
                    }
                    return aux
                })
            }
        })
    }

    store.set(FlowNodes, (nodes) => {
        return [...nodes]?.map((n) => {
            if (n.id === nodeID) {
                return {
                    ...n,
                    data: {
                        ...n.data,
                        actions: [...n.data.actions].map((a) => {
                            if (a.actionID === actionID) {
                                return {
                                    ...a,
                                    reactions: [...a.reactions].map((r) => {
                                        if (r.id === reactionID) {
                                            return { ...r, ...props, id: new_r_id }
                                        } else return r
                                    })
                                }
                            } else return a
                        })
                    }
                }
            } else return n
        })
    })
}

export const deleteNodeReaction = (nodeID: string, actionID: string, reactionID: string): void => {
    const edgesList = store.get(FlowEdges)
    Object.values(edgesList).map((e: FlowEdge) => {
        if (e.sourceHandle === reactionID) {
            store.set(FlowEdges, (eds) => {
                // eslint-disable-next-line
                const { [e.id]: _removed, ...rest } = eds
                return rest
            })
        }
    })

    store.set(FlowNodes, (nodes) => {
        return [...nodes]?.map((n) => {
            if (n.id === nodeID) {
                return {
                    ...n,
                    data: {
                        ...n.data,
                        actions: [...n.data.actions].map((a) => {
                            if (a.actionID === actionID) {
                                return {
                                    ...a,
                                    reactions: [...a.reactions].filter((r) => r.id !== reactionID)
                                }
                            } else return a
                        })
                    }
                }
            } else return n
        })
    })

    //TODO UPDATE EDGES
}

// Views

export const addNodeView = (nodeID: string, viewID: string): void => {
    try {
        store.set(FlowNodes, (nodes) => {
            return [...nodes]?.map((n) => {
                if (n.id === nodeID) {
                    return {
                        ...n,
                        data: {
                            ...n.data,
                            views: {
                                ...n.data.views,
                                [viewID]: []
                            }
                        }
                    }
                }
                return n
            })
        })
    } catch (error) {
        console.error(error)
    }
}
export const removeNodeView = (nodeID: string, viewID: string): void => {
    try {
        const aux = store.get(FlowNodes).find((n) => n.id === nodeID)!.data.views
        delete aux[viewID]

        store.set(FlowNodes, (nodes) => {
            return [...nodes]?.map((n) => {
                if (n.id === nodeID) {
                    return {
                        ...n,
                        data: {
                            ...n.data,
                            views: aux
                        }
                    }
                }
                return n
            })
        })
    } catch (error) {
        console.error(error)
    }
}

// UI
export const addNodeUI = (nodeID: string, viewID: string, element: UIElementType): void => {
    try {
        const presetUI: Record<UIElementType, UIElement> = {
            NavigationButton: {
                type: 'NavigationButton',
                config: {
                    buttons: [
                        {
                            onAction: '',
                            text: 'Continue',
                            position: 'right',
                            id: 'default_nav_btn_id'
                        }
                    ],
                    region: 'footer',
                    order: 0
                }
            },
            NumericInput: {
                type: 'NumericInput',
                config: {
                    region: 'body',
                    order: 0,
                    storageAlias: ''
                }
            },
            TextInput: {
                type: 'TextInput',
                config: {
                    region: 'body',
                    order: 0,
                    storageAlias: ''
                }
            },
            OptionsList: {
                type: 'OptionsList',
                config: {
                    region: 'body',
                    order: 0,
                    display: { type: 'flex', direction: 'column' },
                    optionsDirection: 'horizontal',
                    options: [
                        {
                            id: 'default',
                            onAction: '',
                            text: 'Option A',
                            icon: {
                                asset: 'icon_button_continue',
                                order: 'first'
                            }
                        }
                    ]
                }
            },
            Table: { type: 'Table', config: { data: '', region: 'body', order: 0 } },
            Information: {
                type: 'Information',
                config: {
                    title: 'Titulo informativo',
                    region: 'body',
                    order: 0
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
                            views: {
                                ...n.data.views,
                                [viewID]: [...n.data.views[viewID], presetUI[element]]
                            }
                        }
                    }
                } else return n
            })
        })
    } catch (error) {
        console.error(error)
    }
}

export function updateNodeUI(
    nodeID: string,
    viewID: string,
    elementType: UIElementType,
    props: UIelementConfigs
): void {
    store.set(FlowNodes, (nodes) => {
        return [...nodes].map((n) => {
            if (n.id === nodeID) {
                return {
                    ...n,
                    data: {
                        ...n.data,
                        views: {
                            ...n.data.views,
                            [viewID]: [...n.data.views[viewID]].map((e) => {
                                if ((e.type as UIElementType) === elementType) {
                                    return {
                                        ...e,
                                        config: {
                                            ...e.config,
                                            ...props
                                        }
                                    } as UIElement
                                } else return e
                            })
                        }
                    }
                }
            } else return n
        })
    })
}
export const deleteNodeUI = (nodeID: string, viewID: string, element: UIElementType): void => {
    try {
        store.set(FlowNodes, (nodes) => {
            return [...nodes]?.map((n) => {
                if (n.id === nodeID) {
                    return {
                        ...n,
                        data: {
                            ...n.data,
                            views: {
                                ...n.data.views,
                                [viewID]: [...n.data.views[viewID]].filter(
                                    (e) => !(e.type === element)
                                )
                            }
                        }
                    }
                } else return n
            })
        })
    } catch (error) {
        console.error(error)
    }
}

// NavigationButton
export function updateNavButton(
    nodeID: string,
    viewID: string,
    buttonID: string,
    props: Record<string, string>
): void {
    store.set(FlowNodes, (nodes) => {
        return [...nodes]?.map((n) => {
            if (n.id === nodeID) {
                return {
                    ...n,
                    data: {
                        ...n.data,
                        views: {
                            ...n.data.views,
                            [viewID]: [...n.data.views[viewID]].map((e) => {
                                if (e.type === 'NavigationButton') {
                                    return {
                                        ...e,
                                        config: {
                                            ...e.config,
                                            buttons: [...e.config.buttons].map((b) => {
                                                if (b.id === buttonID) {
                                                    return {
                                                        ...b,
                                                        ...props
                                                    }
                                                } else return b
                                            })
                                        }
                                    }
                                } else return e
                            })
                        }
                    }
                }
            } else return n
        })
    })
}
export const addExtraNavButton = (nodeID: string, viewID: string, buttonID: string): void => {
    try {
        store.set(FlowNodes, (nodes) => {
            return [...nodes]?.map((n) => {
                if (n.id === nodeID) {
                    return {
                        ...n,
                        data: {
                            ...n.data,
                            views: {
                                ...n.data.views,
                                [viewID]: [...n.data.views[viewID]].map((e: UIElement) => {
                                    if (e.type === 'NavigationButton') {
                                        return {
                                            ...e,
                                            config: {
                                                ...e.config,
                                                buttons: [
                                                    ...e.config.buttons,
                                                    {
                                                        text: '',
                                                        onAction: '',
                                                        position: 'left',
                                                        id: buttonID
                                                    }
                                                ]
                                            }
                                        }
                                    } else return e
                                })
                            }
                        }
                    }
                } else return n
            })
        })
    } catch (error) {
        console.error(error)
    }
}
export const deleteNavButton = (nodeID: string, viewID: string, buttonID: string): void => {
    try {
        store.set(FlowNodes, (nodes) => {
            return [...nodes]?.map((n) => {
                if (n.id === nodeID) {
                    return {
                        ...n,
                        data: {
                            ...n.data,
                            views: {
                                ...n.data.views,
                                [viewID]: [...n.data.views[viewID]].map((e: UIElement) => {
                                    if (e.type === 'NavigationButton') {
                                        return {
                                            ...e,
                                            config: {
                                                ...e.config,
                                                buttons: [...e.config.buttons].filter(
                                                    (b) => b.id !== buttonID
                                                )
                                            }
                                        }
                                    } else return e
                                })
                            }
                        }
                    }
                } else return n
            })
        })
    } catch (error) {
        console.error(error)
    }
}

// OptionsList
export const addOptionsListOption = (nodeID: string, viewID: string, optionID: string): void => {
    try {
        store.set(FlowNodes, (nodes) => {
            return [...nodes]?.map((n) => {
                if (n.id === nodeID) {
                    return {
                        ...n,
                        data: {
                            ...n.data,
                            views: {
                                ...n.data.views,
                                [viewID]: [...n.data.views[viewID]].map((e: UIElement) => {
                                    if (e.type === 'OptionsList') {
                                        return {
                                            ...e,
                                            config: {
                                                ...e.config,
                                                options: [
                                                    ...e.config.options,
                                                    {
                                                        id: optionID,
                                                        text: '',
                                                        onAction: '',
                                                        icon: {
                                                            asset: 'icon_button_continue',
                                                            order: 'first'
                                                        }
                                                    } as OptionsListOptions
                                                ]
                                            }
                                        }
                                    } else return e
                                })
                            }
                        }
                    }
                } else return n
            })
        })
    } catch (error) {
        console.error(error)
    }
}
export function updateOptionsListOption(
    nodeID: string,
    viewID: string,
    optionID: string,
    props: OptionsListOptions
): void {
    store.set(FlowNodes, (nodes) => {
        return [...nodes]?.map((n) => {
            if (n.id === nodeID) {
                return {
                    ...n,
                    data: {
                        ...n.data,
                        views: {
                            ...n.data.views,
                            [viewID]: [...n.data.views[viewID]].map((e) => {
                                if (e.type === 'OptionsList') {
                                    return {
                                        ...e,
                                        config: {
                                            ...e.config,
                                            options: [...e.config.options].map((opt) => {
                                                if (opt.id === optionID) {
                                                    return {
                                                        ...props
                                                    }
                                                } else return opt
                                            })
                                        }
                                    }
                                } else return e
                            })
                        }
                    }
                }
            } else return n
        })
    })
}
export const deleteOptionsListOption = (nodeID: string, viewID: string, optionID: string): void => {
    try {
        store.set(FlowNodes, (nodes) => {
            return [...nodes]?.map((n) => {
                if (n.id === nodeID) {
                    return {
                        ...n,
                        data: {
                            ...n.data,
                            views: {
                                ...n.data.views,
                                [viewID]: [...n.data.views[viewID]].map((e: UIElement) => {
                                    if (e.type === 'OptionsList') {
                                        return {
                                            ...e,
                                            config: {
                                                ...e.config,
                                                options: [...e.config.options].filter(
                                                    (opt) => opt.id !== optionID
                                                )
                                            }
                                        }
                                    } else return e
                                })
                            }
                        }
                    }
                } else return n
            })
        })
    } catch (error) {
        console.error(error)
    }
}

// Props
export const updateNodeProps = (
    nodeID: string,
    name: string,
    type: ScreenType,
    to: boolean
): void => {
    try {
        store.set(FlowNodes, (nodes) => {
            return [...nodes]?.map((n) => {
                if (n.id === nodeID) {
                    return {
                        ...n,
                        data: {
                            ...n.data,
                            screenName: name,
                            screenType: type,
                            timeout: to
                        }
                    }
                } else return n
            })
        })
    } catch (error) {
        console.error(error)
    }
}

// Logic Steps

export const addLogicStep = (nodeID: string, actionID: string, newStep: LogicalStep): void => {
    try {
        store.set(FlowNodes, (nodes) => {
            return [...nodes]?.map((n) => {
                if (n.id === nodeID) {
                    return {
                        ...n,
                        data: {
                            ...n.data,
                            actions: [...n.data.actions].map((a) => {
                                if (a.actionID === actionID) {
                                    return {
                                        ...a,
                                        steps: [
                                            ...a.steps,
                                            {
                                                ...newStep,
                                                id: new Date().getTime(),
                                                order: a.steps.length
                                            }
                                        ] as LogicalStep[]
                                    }
                                } else return a
                            })
                        }
                    }
                } else return n
            })
        })
    } catch (error) {
        console.error(error)
    }
}

export const updateLogicStep = (
    nodeID: string,
    actionID: string,
    stepID: string,
    props: unknown[]
): void => {
    try {
        store.set(FlowNodes, (nodes) => {
            return [...nodes]?.map((n) => {
                if (n.id === nodeID) {
                    return {
                        ...n,
                        data: {
                            ...n.data,
                            actions: [...n.data.actions].map((a) => {
                                if (a.actionID === actionID) {
                                    return {
                                        ...a,
                                        steps: [...a.steps].map((s) => {
                                            if (s.id === stepID) {
                                                return { ...s, ...props }
                                            } else return s
                                        }) as LogicalStep[]
                                    }
                                } else return a
                            })
                        }
                    }
                } else return n
            })
        })
    } catch (error) {
        console.error(error)
    }
}
export const sortLogicSteps = (
    nodeID: string,
    actionID: string,
    stepID: string,
    order: number,
    movement: 'up' | 'down'
): void => {
    try {
        store.set(FlowNodes, (nodes) => {
            return [...nodes]?.map((n) => {
                if (n.id === nodeID) {
                    return {
                        ...n,
                        data: {
                            ...n.data,
                            actions: [...n.data.actions].map((a) => {
                                if (a.actionID === actionID) {
                                    return {
                                        ...a,
                                        steps: [...a.steps]
                                            .map((s) => {
                                                if (s.id === stepID) {
                                                    return { ...s, order }
                                                } else if (s.order === order) {
                                                    return {
                                                        ...s,
                                                        order:
                                                            movement === 'up'
                                                                ? order + 1
                                                                : order - 1
                                                    }
                                                } else return s
                                            })
                                            .sort((a, b) => a.order - b.order) as LogicalStep[]
                                    }
                                } else return a
                            })
                        }
                    }
                } else return n
            })
        })
    } catch (error) {
        console.error(error)
    }
}

export const removeLogicStep = (nodeID: string, actionID: string, stepID: string): void => {
    try {
        store.set(FlowNodes, (nodes) => {
            return [...nodes]?.map((n) => {
                if (n.id === nodeID) {
                    return {
                        ...n,
                        data: {
                            ...n.data,
                            actions: [...n.data.actions].map((a) => {
                                if (a.actionID === actionID) {
                                    return {
                                        ...a,
                                        steps: [...a.steps].filter(
                                            (s) => s.id !== stepID
                                        ) as LogicalStep[]
                                    }
                                } else return a
                            })
                        }
                    }
                } else return n
            })
        })
    } catch (error) {
        console.error(error)
    }
}
