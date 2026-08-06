import { atom } from 'jotai'
import { EdgesById, FlowNode } from '../../../../../shared/fluid_types'
import { initialEdges, initialNodes } from './utils/presets'

// - Estructura del flujo
export const FlowNodes = atom<FlowNode[]>(initialNodes)
export const FlowEdges = atom<EdgesById>(initialEdges)
export const newNodeID = atom<number>(initialNodes.length + 1 || 0)

// - Variables Contextuales

// - Registry Storage
export const StorageIn = atom<FlowNode>()
export const StorageOut = atom<FlowNode>()

// - UI
export const SelectedNodeId = atom<string>()
