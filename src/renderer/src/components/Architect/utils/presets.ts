import { store } from '@renderer/utils/context/context'
import { FlowNodes, newNodeID } from '../FlowStorage'
import {
    ActionType,
    CompareStep,
    EdgesById,
    FlowNode,
    MathStep,
    ScreenType,
    ServiceStep,
    StorageStep,
    TerminalStep,
    TimeStep
} from '@renderer/types/types.d'
import {
    CompareSteps,
    MathSteps,
    ServiceSteps,
    StorageSteps,
    TerminalSteps,
    TimeSteps
} from '../Logical/components/StepsCard'

export const initialNodes: FlowNode[] = [
    {
        id: 'close',
        flowConfig: {
            x: 0,
            y: -160,
            width: 200,
            height: 32,
            color: '#588157'
        },
        data: {
            screenName: '/Close',
            screenType: 'close',
            timeout: false,
            storage: [],
            actions: [],
            views: {
                __DEFAULT_VIEW__: [
                    {
                        type: 'Information',
                        config: {
                            order: 0,
                            region: 'body',
                            title: 'Espere por favor',
                            text: 'configurando terminal',
                            illustration: 'image_wait'
                        }
                    }
                ]
            }
        }
    },
    {
        id: 'config',
        flowConfig: {
            x: 0,
            y: -60,
            width: 200,
            height: 32,
            color: '#588157'
        },
        data: {
            screenName: '/Config',
            screenType: 'config',
            timeout: false,
            storage: [],
            actions: [
                {
                    type: 'service',
                    actionID: 'settingup',
                    reactions: [
                        {
                            reactionCode: 'ok',
                            id: 'config.service.settingup.ok',
                            label: 'ok',
                            target: 'idle'
                        },
                        {
                            reactionCode: 'error',
                            id: 'config.service.settingup.error',
                            label: 'error',
                            target: 'outofservice'
                        }
                    ],
                    trigger: {
                        type: 'auto'
                    },
                    steps: [
                        {
                            id: '0',
                            order: 0,
                            type: 'callService',
                            subtype: 'initial_config'
                        }
                    ]
                }
            ],
            views: {
                __DEFAULT_VIEW__: [
                    {
                        type: 'Information',
                        config: {
                            order: 0,
                            region: 'body',
                            title: 'Espere por favor',
                            text: 'configurando terminal',
                            illustration: 'image_wait'
                        }
                    }
                ]
            }
        }
    },
    {
        id: 'idle',
        flowConfig: {
            x: 320,
            y: -60,
            width: 200,
            height: 32,
            color: '#3d5a80'
        },
        data: {
            screenName: 'Idle',
            screenType: 'idle',
            timeout: false,
            storage: [],
            actions: [
                {
                    type: 'user',
                    actionID: 'click',
                    reactions: [
                        {
                            reactionCode: 'start',
                            id: 'idle.user.click.start',
                            label: 'start',
                            target: '2'
                        }
                    ],
                    trigger: {
                        type: 'user'
                    },
                    steps: []
                }
            ],
            views: {
                __DEFAULT_VIEW__: [
                    {
                        type: 'Information',
                        config: {
                            order: 0,
                            region: 'body',
                            title: 'Bienvenido',
                            subtitle: 'Presione el botón para iniciar'
                        }
                    },
                    {
                        type: 'NavigationButton',
                        config: {
                            order: 0,
                            region: 'footer',
                            buttons: [
                                {
                                    id: '1',
                                    position: 'right',
                                    text: 'Iniciar',
                                    onAction: 'start'
                                }
                            ]
                        }
                    }
                ]
            }
        }
    },
    {
        id: 'outofservice',
        flowConfig: {
            x: 320,
            y: 40,
            width: 200,
            height: 32,
            color: '#588157'
        },
        data: {
            screenName: '/OutOfService',
            screenType: 'OutOfService',
            timeout: false,
            storage: [],
            actions: [],
            views: {
                __DEFAULT_VIEW__: [
                    {
                        type: 'Information',
                        config: {
                            order: 0,
                            region: 'body',
                            title: 'Terminal Fuera de serivicio',
                            illustration: 'image_oos'
                        }
                    }
                ]
            }
        }
    },
    {
        id: '2',
        flowConfig: {
            x: 640,
            y: -60,
            width: 200,
            height: 32,
            color: '#588157'
        },
        data: {
            screenName: 'Menu',
            screenType: 'userAction',
            timeout: false,
            storage: [],
            actions: [],
            views: {
                __DEFAULT_VIEW__: []
            }
        }
    }
]

// Indexados por id desde el arranque, no como array
export const initialEdges: EdgesById = {
    'e-config.service.settingup.ok-idle.in-1787951241903': {
        id: 'e-config.service.settingup.ok-idle.in-1787951241903',
        source: 'config',
        sourceHandle: 'config.service.settingup.ok',
        target: 'idle',
        targetHandle: 'in'
    },
    'e-config.service.settingup.error-outofservice.in-1787951243431': {
        id: 'e-config.service.settingup.error-outofservice.in-1787951243431',
        source: 'config',
        sourceHandle: 'config.service.settingup.error',
        target: 'outofservice',
        targetHandle: 'in'
    },
    'e-idle.user.click.start-2.in-1787951338946': {
        id: 'e-idle.user.click.start-2.in-1787951338946',
        source: 'idle',
        sourceHandle: 'idle.user.click.start',
        target: '2',
        targetHandle: 'in'
    }
}

export const NodeColors: Record<ScreenType, string> = {
    [ScreenType.idle]: '#588157',
    [ScreenType.config]: '#313131',
    [ScreenType.close]: '#141414',
    [ScreenType.userAction]: '#8a7e39',
    [ScreenType.infoScreen]: '#3d5a80',
    [ScreenType.successScreen]: '#588157',
    [ScreenType.errorScreen]: '#bc4749',
    [ScreenType.OutOfService]: '#bc4749'
}

export const newNode = (type: ScreenType, name?: string): void => {
    const id = store.get(newNodeID) + ''
    const Xpos = 250
    const Ypos = -80

    const NodePresets: Record<ScreenType, FlowNode> = {
        [ScreenType.idle]: {
            id: 'idle',
            flowConfig: {
                x: Xpos,
                y: Ypos,
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
                                id: `${id}.${ActionType.user}.click.start`,
                                label: 'Click start'
                            }
                        ],
                        trigger: {
                            type: 'user'
                        },
                        steps: []
                    }
                ],
                views: { __DEFAULT_VIEW__: [] }
            }
        },
        [ScreenType.config]: {
            id: id,
            flowConfig: {
                x: Xpos,
                y: Ypos,
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
                        actionID: 'initial_config',
                        reactions: [
                            {
                                reactionCode: 'ok',
                                id: `${id}.${ActionType.service}.initial_config.ok`,
                                label: 'ok',
                                target: 'idle'
                            },
                            {
                                reactionCode: 'error',
                                id: `${id}.${ActionType.service}.initial_config.error`,
                                label: 'error'
                            }
                        ],
                        trigger: {
                            type: 'auto'
                        },
                        steps: [
                            {
                                id: '1',
                                order: 0,
                                type: 'callService',
                                subtype: 'initial_config'
                            }
                        ]
                    }
                ],
                views: {
                    __DEFAULT_VIEW__: [
                        {
                            type: 'Information',
                            config: {
                                order: 0,
                                region: 'body',
                                title: 'Espere por favor',
                                text: 'configurando terminal',
                                illustration: 'image_wait'
                            }
                        }
                    ]
                }
            }
        },
        [ScreenType.close]: {
            id: id,
            flowConfig: {
                x: Xpos,
                y: Ypos,
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
                                id: `${id}.${ActionType.terminal}.closeSession.sessionClosed`,
                                label: 'ok',
                                target: 'config'
                            }
                        ],
                        trigger: {
                            type: 'auto'
                        },
                        steps: []
                    }
                ],
                views: {
                    __DEFAULT_VIEW__: [
                        {
                            type: 'Information',
                            config: {
                                order: 0,
                                region: 'body',
                                title: 'Espere por favor',
                                text: 'cerrando sesión',
                                illustration: 'image_wait'
                            }
                        }
                    ]
                }
            }
        },
        [ScreenType.OutOfService]: {
            id: id,
            flowConfig: {
                x: Xpos,
                y: Ypos,
                width: 200,
                height: 32,
                color: NodeColors.errorScreen
            },
            data: {
                screenName: name || 'Out of Service',
                screenType: ScreenType.OutOfService,
                timeout: false,
                storage: [],
                actions: [],
                views: {
                    __DEFAULT_VIEW__: [
                        {
                            type: 'Information',
                            config: {
                                order: 0,
                                region: 'body',
                                title: 'Terminal Fuera de serivicio',
                                illustration: 'image_oos'
                            }
                        }
                    ]
                }
            }
        },
        [ScreenType.userAction]: {
            id: id,
            flowConfig: {
                x: Xpos,
                y: Ypos,
                width: 200,
                height: 32,
                color: NodeColors.userAction
            },
            data: {
                screenName: name || 'User action',
                screenType: ScreenType.userAction,
                timeout: true,
                storage: [],
                actions: [
                    {
                        type: ActionType.user,
                        actionID: 'click',
                        reactions: [
                            {
                                reactionCode: 'continue',
                                id: `${id}.${ActionType.user}.click.continue`,
                                label: 'Click continue'
                            },
                            {
                                reactionCode: 'back',
                                id: `${id}.${ActionType.user}.click.back`,
                                label: 'Click back'
                            },
                            {
                                reactionCode: 'exit',
                                id: `${id}.${ActionType.user}.click.exit`,
                                label: 'Click exit'
                            }
                        ],
                        trigger: {
                            type: 'user'
                        },
                        steps: []
                    }
                ],
                views: {
                    __DEFAULT_VIEW__: [
                        {
                            type: 'NavigationButton',
                            config: {
                                order: 0,
                                region: 'footer',
                                buttons: [
                                    {
                                        id: '1',
                                        text: 'Continuar',
                                        onAction: 'continue',
                                        position: 'right'
                                    },
                                    {
                                        id: '2',
                                        text: 'Volver',
                                        onAction: 'back',
                                        position: 'center'
                                    },
                                    {
                                        id: '3',
                                        text: 'Salir',
                                        onAction: 'exit',
                                        position: 'left'
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        },
        [ScreenType.infoScreen]: {
            id: id,
            flowConfig: {
                x: Xpos,
                y: Ypos,
                width: 200,
                height: 32,
                color: NodeColors.infoScreen
            },
            data: {
                screenName: name || 'Info screen',
                screenType: ScreenType.infoScreen,
                timeout: false,
                storage: [],
                actions: [
                    {
                        type: ActionType.timeout,
                        actionID: 'timeout',
                        reactions: [
                            {
                                reactionCode: 'timeout',
                                id: `${id}.${ActionType.timeout}.timeout.timeout`,
                                label: 'timeout'
                            }
                        ],
                        trigger: {
                            type: 'auto'
                        },
                        steps: []
                    }
                ],
                views: {
                    __DEFAULT_VIEW__: [
                        {
                            type: 'Information',
                            config: {
                                order: 0,
                                region: 'body',
                                title: 'Espere por favor'
                            }
                        }
                    ]
                }
            }
        },
        [ScreenType.successScreen]: {
            id: id,
            flowConfig: {
                x: Xpos,
                y: Ypos,
                width: 200,
                height: 32,
                color: NodeColors.successScreen
            },
            data: {
                screenName: name || 'Success',
                screenType: ScreenType.successScreen,
                timeout: false,
                storage: [],
                actions: [
                    {
                        type: ActionType.timeout,
                        actionID: 'timeout',
                        reactions: [
                            {
                                reactionCode: 'timeout',
                                id: `${id}.${ActionType.timeout}.timeout.timeout`,
                                label: 'timeout'
                            }
                        ],
                        trigger: {
                            type: 'auto'
                        },
                        steps: []
                    }
                ],
                views: {
                    __DEFAULT_VIEW__: [
                        {
                            type: 'Information',
                            config: {
                                order: 0,
                                region: 'body',
                                title: 'Transacción exitosa',
                                illustration: 'image_success'
                            }
                        }
                    ]
                }
            }
        },
        [ScreenType.errorScreen]: {
            id: id,
            flowConfig: {
                x: Xpos,
                y: Ypos,
                width: 200,
                height: 32,
                color: NodeColors.errorScreen
            },
            data: {
                screenName: name || 'Error',
                screenType: ScreenType.errorScreen,
                timeout: false,
                storage: [],
                actions: [
                    {
                        type: ActionType.timeout,
                        actionID: 'timeout',
                        reactions: [
                            {
                                reactionCode: 'timeout',
                                id: `${id}.${ActionType.timeout}.timeout.timeout`,
                                label: 'timeout'
                            }
                        ],
                        trigger: {
                            type: 'auto'
                        },
                        steps: []
                    }
                ],
                views: {
                    __DEFAULT_VIEW__: [
                        {
                            type: 'Information',
                            config: {
                                order: 0,
                                region: 'body',
                                title: 'Ocurrió un error',
                                illustration: 'image_error'
                            }
                        }
                    ]
                }
            }
        }
    }

    store.set(newNodeID, (prev) => prev + 1)

    store.set(FlowNodes, (prev) => [...prev, NodePresets[type]])
}

// eslint-disable-next-line
const LFSteps = [
    ...CompareSteps,
    ...MathSteps,
    ...ServiceSteps,
    ...StorageSteps,
    ...TerminalSteps,
    ...TimeSteps
] as const

type LFS = (typeof LFSteps)[number]

export const LogicFlowSteps: Record<LFS, object> = {
    initial_config: { type: 'callService', subtype: 'initial_config' } as ServiceStep,
    login: { type: 'callService', subtype: 'login' } as ServiceStep,
    dispense: { type: 'runService', subtype: 'dispense' } as TerminalStep,
    getVar: { type: 'getVar', subtype: '' } as StorageStep,
    setVar: { type: 'setVar', subtype: '' } as StorageStep,
    timeout: { type: 'time', subtype: 'timeout' } as TimeStep,
    delay: { type: 'time', subtype: 'delay' } as TimeStep,
    eq: { type: 'compare', subtype: 'eq' } as CompareStep,
    neq: { type: 'compare', subtype: 'neq' } as CompareStep,
    gt: { type: 'compare', subtype: 'gt' } as CompareStep,
    gte: { type: 'compare', subtype: 'gte' } as CompareStep,
    lt: { type: 'compare', subtype: 'lt' } as CompareStep,
    lte: { type: 'compare', subtype: 'lte' } as CompareStep,
    max: { type: 'math', subtype: 'max' } as MathStep,
    min: { type: 'math', subtype: 'min' } as MathStep,
    sum: { type: 'math', subtype: 'sum' } as MathStep,
    rest: { type: 'math', subtype: 'rest' } as MathStep
}
