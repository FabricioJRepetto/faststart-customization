import type { Node, Edge } from '@xyflow/react'

// Datos de cada PantallaNode vía props.data
export type PantallaData = {
    titulo: string
    descripcion?: string
    color?: string // acento visual, ej para diferenciar flujos
}

// React Flow tipa los nodos como Node<TData, TType>
export type PantallaNode = Node<PantallaData, 'pantalla'>

export type FlowEdge = Edge
