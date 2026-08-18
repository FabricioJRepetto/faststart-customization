import { store } from '@renderer/utils/context/context'
import { CurrentFlow, FlowEdges, FlowNodes } from '../FlowStorage'

export const openSubflow = (nodeId: string): void => {
    try {
        const node = store.get(FlowNodes).find((n) => n.id === nodeId)
        if (!node) throw new Error('Node not found')

        const nodes = Object.values(node.data.subFlow?.nodes || {})
        if (!nodes?.length) throw new Error('Error parsing nodes')

        store.set(CurrentFlow, { nodes: nodes, edges: {} })
    } catch (error) {
        console.error(error)
    }
}

export const backToMainFlow = (): void => {
        const nodes = store.get(FlowNodes)
        const edges = store.get(FlowEdges)

        store.set(CurrentFlow, { nodes: nodes, edges: edges })
}
