import { ActionType, EdgesById, FlowNode, ScreenType } from '../types'
import { store } from '@renderer/utils/context/context'
import { FlowNodes, newNodeID } from '../FlowStorage'

export const initialNodes: FlowNode[] = [
    {
        id: '1',
        flowConfig: {
            x: 0,
            y: 0,
            width: 200,
            height: 32,
            titulo: 'Login',
            color: '#3d5a80'
        },
        data: {
            screenType: ScreenType.idle,
            timeout: false,
            storage: [],
            actions: [
                {
                    type: ActionType.user,
                    actionID: 'click',
                    reactions: [
                        {
                            reactionCode: 'start',
                            id: '1.userInput.click.start',
                            label: 'start'
                        }
                    ],
                    trigger: {
                        type: 'user'
                    },
                    steps: []
                },
                {
                    type: ActionType.service,
                    actionID: 'login',
                    reactions: [
                        {
                            reactionCode: 'ok',
                            id: '1.service.login.ok',
                            label: 'ok'
                        }
                    ],
                    trigger: {
                        type: 'user'
                    },
                    steps: []
                },
                {
                    type: ActionType.terminal,
                    actionID: 'status',
                    reactions: [
                        {
                            reactionCode: 'ok',
                            id: '1.terminal.status.ok',
                            label: 'ok'
                        },
                        {
                            reactionCode: 'error',
                            id: '1.terminal.status.error',
                            label: 'error'
                        }
                    ],
                    trigger: {
                        type: 'user'
                    },
                    steps: []
                },
                {
                    type: ActionType.terminal,
                    actionID: 'start',
                    reactions: [
                        {
                            reactionCode: 'ok',
                            id: '1.terminal.start.ok',
                            label: 'ok'
                        },
                        {
                            reactionCode: 'error',
                            id: '1.terminal.start.error',
                            label: 'error'
                        }
                    ],
                    trigger: {
                        type: 'user'
                    },
                    steps: []
                },
                {
                    type: ActionType.timeout,
                    actionID: 'timeout',
                    reactions: [
                        {
                            reactionCode: 'timeout',
                            id: '1.timeout.timeout.timeout',
                            label: 'timeout'
                        }
                    ],
                    trigger: {
                        type: 'user'
                    },
                    steps: []
                }
            ],
            UIElement: []
        }
    },
    {
        id: '2',
        flowConfig: {
            x: 380,
            y: -80,
            width: 200,
            height: 32,
            titulo: 'Dashboard',
            color: '#588157'
        },
        data: {
            screenType: ScreenType.userAction,
            timeout: false,
            storage: [],
            actions: [],
            UIElement: []
        }
    },
    {
        id: '3',
        flowConfig: {
            x: 380,
            y: 100,
            width: 200,
            height: 32,
            titulo: 'Error',
            color: '#bc4749'
        },
        data: {
            screenType: ScreenType.errorScreen,
            timeout: false,
            storage: [],
            actions: [],
            UIElement: []
        }
    }
]

// Indexados por id desde el arranque, no como array
export const initialEdges: EdgesById = {
    e1: {
        id: 'e1',
        source: '1',
        sourceHandle: '1.userInput.click.start',
        target: '2',
        targetHandle: 'in'
    },
    e2: {
        id: 'e2',
        source: '1',
        sourceHandle: '1.timeout.timeout.timeout',
        target: '3',
        targetHandle: 'in'
    }
}

const NodeColors: Record<ScreenType, string> = {
    [ScreenType.idle]: '#588157',
    [ScreenType.userAction]: '#8a7e39',
    [ScreenType.infoScreen]: '#3d5a80',
    [ScreenType.successScreen]: '#588157',
    [ScreenType.errorScreen]: '#bc4749',
    [ScreenType.config]: '#313131',
    [ScreenType.close]: '#141414'
}

export const newNode = (type: ScreenType, name?: string): void => {
    const id = store.get(newNodeID) + ''

    const NodePresets: Record<ScreenType, FlowNode> = {
        [ScreenType.idle]: {
            id: id,
            flowConfig: {
                x: 0,
                y: -70,
                width: 200,
                height: 32,
                titulo: name || 'Idle',
                color: NodeColors.idle
            },
            data: {
                screenType: ScreenType.idle,
                timeout: false,
                storage: [],
                actions: [
                    {
                        type: ActionType.user,
                        actionID: 'click',
                        reactions: [
                            {
                                reactionCode: 'start',
                                id: id + '.userInput.click.start',
                                label: 'Click start'
                            }
                        ],
                        trigger: {
                            type: 'user'
                        },
                        steps: []
                    },
                    {
                        type: ActionType.service,
                        actionID: 'QR',
                        reactions: [
                            {
                                reactionCode: 'scan',
                                id: id + '.service.QR.ok',
                                label: 'QR scan'
                            }
                        ],
                        trigger: {
                            type: 'user'
                        },
                        steps: []
                    }
                ],
                UIElement: []
            }
        },
        [ScreenType.userAction]: {
            id: id,
            flowConfig: {
                x: 0,
                y: -70,
                width: 200,
                height: 32,
                titulo: name || 'Confirmation',
                color: NodeColors.userAction
            },
            data: {
                screenType: ScreenType.userAction,
                timeout: true,
                storage: [],
                actions: [
                    {
                        type: ActionType.user,
                        actionID: 'click_button',
                        reactions: [
                            {
                                reactionCode: 'continue',
                                id: id + '.userInput.click_button.continue',
                                label: 'Click continue'
                            },
                            {
                                reactionCode: 'back',
                                id: id + '.userInput.click_button.back',
                                label: 'Click back'
                            },
                            {
                                reactionCode: 'exit',
                                id: id + '.userInput.click_button.exit',
                                label: 'Click exit'
                            }
                        ],
                        trigger: {
                            type: 'user'
                        },
                        steps: []
                    },
                    {
                        type: ActionType.timeout,
                        actionID: 'timeout',
                        reactions: [
                            {
                                reactionCode: 'timeout',
                                id: id + '.timeout.timeout.timeout',
                                label: 'timeout'
                            }
                        ],
                        trigger: {
                            type: 'user'
                        },
                        steps: []
                    }
                ],
                UIElement: []
            }
        },
        [ScreenType.infoScreen]: {
            id: id,
            flowConfig: {
                x: 0,
                y: -70,
                width: 200,
                height: 32,
                titulo: name || 'Info',
                color: NodeColors.infoScreen
            },
            data: {
                screenType: ScreenType.infoScreen,
                timeout: false,
                storage: [],
                actions: [
                    {
                        type: ActionType.service,
                        actionID: 'login',
                        reactions: [
                            {
                                reactionCode: 'ok',
                                id: id + '.service.login.ok',
                                label: 'ok'
                            },
                            {
                                reactionCode: 'notOk',
                                id: id + '.service.login.notOk',
                                label: 'notOk'
                            },
                            {
                                reactionCode: 'error',
                                id: id + '.service.login.error',
                                label: 'error'
                            },
                            {
                                reactionCode: 'timeout',
                                id: id + '.service.login.timeout',
                                label: 'timeout'
                            }
                        ],
                        trigger: {
                            type: 'user'
                        },
                        steps: []
                    }
                ],
                UIElement: []
            }
        },
        [ScreenType.successScreen]: {
            id: id,
            flowConfig: {
                x: 0,
                y: -70,
                width: 200,
                height: 32,
                titulo: name || 'Success',
                color: NodeColors.successScreen
            },
            data: {
                screenType: ScreenType.successScreen,
                timeout: true,
                storage: [],
                actions: [
                    {
                        type: ActionType.timeout,
                        actionID: 'timeout',
                        reactions: [
                            {
                                reactionCode: 'timeout',
                                id: id + '.timeout.timeout.timeout',
                                label: 'timeout'
                            }
                        ],
                        trigger: {
                            type: 'user'
                        },
                        steps: []
                    }
                ],
                UIElement: []
            }
        },
        [ScreenType.errorScreen]: {
            id: id,
            flowConfig: {
                x: 0,
                y: -70,
                width: 200,
                height: 32,
                titulo: name || 'Error',
                color: NodeColors.errorScreen
            },
            data: {
                screenType: ScreenType.errorScreen,
                timeout: true,
                storage: [],
                actions: [
                    {
                        type: ActionType.timeout,
                        actionID: 'timeout',
                        reactions: [
                            {
                                reactionCode: 'timeout',
                                id: id + '.timeout.timeout.timeout',
                                label: 'timeout'
                            }
                        ],
                        trigger: {
                            type: 'user'
                        },
                        steps: []
                    }
                ],
                UIElement: []
            }
        },
        [ScreenType.config]: {
            id: id,
            flowConfig: {
                x: 0,
                y: -70,
                width: 200,
                height: 32,
                titulo: name || 'Configuration',
                color: NodeColors.config
            },
            data: {
                screenType: ScreenType.config,
                timeout: false,
                storage: [],
                actions: [
                    {
                        type: ActionType.service,
                        actionID: 'bootup',
                        reactions: [
                            {
                                reactionCode: 'ok',
                                id: id + '.service.bootup.ok',
                                label: 'ok'
                            },
                            {
                                reactionCode: 'error',
                                id: id + '.service.bootup.error',
                                label: 'error'
                            }
                        ],
                        trigger: {
                            type: 'user'
                        },
                        steps: []
                    }
                ],
                UIElement: []
            }
        },
        [ScreenType.close]: {
            id: id,
            flowConfig: {
                x: 0,
                y: -70,
                width: 200,
                height: 32,
                titulo: name || 'Close',
                color: NodeColors.close
            },
            data: {
                screenType: ScreenType.close,
                timeout: false,
                storage: [],
                actions: [
                    {
                        type: ActionType.terminal,
                        actionID: 'closeSession',
                        reactions: [
                            {
                                reactionCode: 'sessionClosed',
                                id: id + '.terminal.closeSession.sessionClosed',
                                label: 'ok'
                            }
                        ],
                        trigger: {
                            type: 'user'
                        },
                        steps: []
                    }
                ],
                UIElement: []
            }
        }
    }

    store.set(newNodeID, (prev) => prev + 1)

    store.set(FlowNodes, (prev) => [...prev, NodePresets[type]])
}
