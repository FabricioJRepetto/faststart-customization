import { atom } from 'jotai'
import { initialEdges, initialNodes } from './utils/presets'
import { EdgesById, FlowNode } from '@renderer/types/types.d'

// - Estructura del flujo
export const FlowNodes = atom<FlowNode[]>(initialNodes)
export const FlowEdges = atom<EdgesById>(initialEdges)
export const newNodeID = atom<number>(initialNodes.length + 1 || 0)

// export const SubFlows = atom<Map<string, { edges: EdgesById; nodes: FlowNode[] }>>()
export const CurrentFlow = atom<{ edges: EdgesById; nodes: FlowNode[] }>()

// - Variables Contextuales

// - Registry Storage
export const StorageIn = atom<FlowNode>()
export const StorageOut = atom<FlowNode>()

// - UI
export const SelectedNodeId = atom<string>()
