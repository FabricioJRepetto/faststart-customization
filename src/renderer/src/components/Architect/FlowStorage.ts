import { atom } from 'jotai'
import { EdgesById, FlowNode, NodeType } from './types'

const initialNodes: FlowNode[] = [
    {
        id: '1',
        x: 0,
        y: 0,
        width: 200,
        height: 100,
        titulo: 'Login',
        color: '#3d5a80',
        salidas: [
            { id: 'ok', label: 'OK' },
            { id: 'error', label: 'Error' }
        ],
        data: {
            screenType: NodeType.idle
        }
    },
    {
        id: '2',
        x: 380,
        y: -80,
        width: 200,
        height: 100,
        titulo: 'Dashboard',
        color: '#588157',
        data: {
            screenType: NodeType.userAction
        }
    },
    {
        id: '3',
        x: 380,
        y: 100,
        width: 200,
        height: 100,
        titulo: 'Error',
        color: '#bc4749',
        data: {
            screenType: NodeType.errorScreen
        }
    }
]

// Indexados por id desde el arranque, no como array
const initialEdges: EdgesById = {
    e1: { id: 'e1', source: '1', sourceHandle: 'ok', target: '2', targetHandle: 'in' },
    e2: { id: 'e2', source: '1', sourceHandle: 'error', target: '3', targetHandle: 'in' }
}

export const FlowNodes = atom<FlowNode[]>(initialNodes)
export const FlowEdges = atom<EdgesById>(initialEdges)

export const SelectedNode = atom<FlowNode>()
