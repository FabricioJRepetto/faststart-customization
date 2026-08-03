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
            color: '#3d5a80'
        },
        data: {
            screenName: 'Login',
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
                            id: '1.user.click.start',
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
            uiElements: []
        }
    },
    {
        id: '2',
        flowConfig: {
            x: 380,
            y: -80,
            width: 200,
            height: 32,
            color: '#588157'
        },
        data: {
            screenName: 'Dashboard',
            screenType: ScreenType.userAction,
            timeout: false,
            storage: [],
            actions: [],
            uiElements: []
        }
    },
    {
        id: '3',
        flowConfig: {
            x: 380,
            y: 100,
            width: 200,
            height: 32,
            color: '#bc4749'
        },
        data: {
            screenName: 'Error',
            screenType: ScreenType.errorScreen,
            timeout: false,
            storage: [],
            actions: [],
            uiElements: []
        }
    }
]

// Indexados por id desde el arranque, no como array
export const initialEdges: EdgesById = {
    e1: {
        id: 'e1',
        source: '1',
        sourceHandle: '1.user.click.start',
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

export const NodeColors: Record<ScreenType, string> = {
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
                color: NodeColors.idle
            },
            data: {
                screenName: name || 'Idle',
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
                uiElements: []
            }
        },
        [ScreenType.userAction]: {
            id: id,
            flowConfig: {
                x: 0,
                y: -70,
                width: 200,
                height: 32,
                color: NodeColors.userAction
            },
            data: {
                screenName: name || 'Confirmation',
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
                uiElements: []
            }
        },
        [ScreenType.infoScreen]: {
            id: id,
            flowConfig: {
                x: 0,
                y: -70,
                width: 200,
                height: 32,
                color: NodeColors.infoScreen
            },
            data: {
                screenName: name || 'Info',
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
                uiElements: []
            }
        },
        [ScreenType.successScreen]: {
            id: id,
            flowConfig: {
                x: 0,
                y: -70,
                width: 200,
                height: 32,
                color: NodeColors.successScreen
            },
            data: {
                screenName: name || 'Success',
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
                uiElements: []
            }
        },
        [ScreenType.errorScreen]: {
            id: id,
            flowConfig: {
                x: 0,
                y: -70,
                width: 200,
                height: 32,
                color: NodeColors.errorScreen
            },
            data: {
                screenName: name || 'Error',
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
                uiElements: []
            }
        },
        [ScreenType.config]: {
            id: id,
            flowConfig: {
                x: 0,
                y: -70,
                width: 200,
                height: 32,
                color: NodeColors.config
            },
            data: {
                screenName: name || 'Configuration',
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
                uiElements: []
            }
        },
        [ScreenType.close]: {
            id: id,
            flowConfig: {
                x: 0,
                y: -70,
                width: 200,
                height: 32,
                color: NodeColors.close
            },
            data: {
                screenName: name || 'Close',
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
                uiElements: []
            }
        }
    }

    store.set(newNodeID, (prev) => prev + 1)

    store.set(FlowNodes, (prev) => [...prev, NodePresets[type]])
}
