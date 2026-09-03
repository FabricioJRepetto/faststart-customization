import { atom } from 'jotai'
import { initialEdges, initialNodes } from './utils/presets'
import { EdgesById, FlowDiagram, FlowNode } from '@renderer/types/types.d'

// - Estructura del flujo
export const FlowNodes = atom<FlowNode[]>(initialNodes)
export const FlowEdges = atom<EdgesById>(initialEdges)

export const CurrentFlow = atom<{ edges: EdgesById; nodes: FlowNode[] }>()

// - Variables Contextuales
export const EditingDiagram = atom<boolean>(false)
export const CurrentDiagramData = atom<FlowDiagram | null>(null)

// - Registry Storage
export const StorageIn = atom<FlowNode>()
export const StorageOut = atom<FlowNode>()

// - UI
export const SelectedNodeId = atom<string>()
