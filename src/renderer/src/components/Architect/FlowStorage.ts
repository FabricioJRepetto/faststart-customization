import { atom } from 'jotai'
import { EdgesById, FlowNode, ScreenType } from './types'

const initialNodes: FlowNode[] = [
    {
        id: '1',
        flowConfig: {
            x: 0,
            y: 0,
            width: 200,
            height: 32,
            titulo: 'Login',
            color: '#3d5a80',
            salidas: [
                {
                    id: '1.userInput.click.start'
                },
                {
                    id: '1.service.login.ok'
                },
                {
                    id: '1.terminal.start.ok'
                },
                {
                    id: '1.terminal.start.error'
                },
                {
                    id: '1.timeout.timeout.timeout'
                }
            ]
        },
        data: {
            screenType: ScreenType.idle,
            timeout: false,
            storage: [],
            actions: [
                {
                    type: 'userInput',
                    actionID: 'click',
                    reactions: [
                        {
                            reactionCode: 'start',
                            id: '1.userInput.click.start',
                            label: 'start'
                        }
                    ]
                },
                {
                    type: 'service',
                    actionID: 'login',
                    reactions: [
                        {
                            reactionCode: 'ok',
                            id: '1.service.login.ok',
                            label: 'ok'
                        }
                    ]
                },
                {
                    type: 'terminal',
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
                    ]
                },
                {
                    type: 'timeout',
                    actionID: 'timeout',
                    reactions: [
                        {
                            reactionCode: 'timeout',
                            id: '1.timeout.timeout.timeout',
                            label: 'timeout'
                        }
                    ]
                }
            ],
            logicalFlow: '',
            ui: []
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
            logicalFlow: '',
            ui: []
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
            logicalFlow: '',
            ui: []
        }
    }
]

// Indexados por id desde el arranque, no como array
const initialEdges: EdgesById = {
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

// - Estructura del flujo
export const FlowNodes = atom<FlowNode[]>(initialNodes)
export const FlowEdges = atom<EdgesById>(initialEdges)

// - Variables Contextuales

// - Registry Storage
export const StorageIn = atom<FlowNode>()
export const StorageOut = atom<FlowNode>()

// - UI
export const SelectedNode = atom<FlowNode>()
