import { useAtomValue } from 'jotai'
import NewSvg from '../../assets/add.svg?react'
import TestSvg from '../../assets/test.svg?react'
import { FlowEdges, FlowNodes } from './FlowStorage'
import { useState } from 'react'
import { store } from '@renderer/utils/context/context'
import NodePropsMenu from './overlay/NodePropsMenu'
import NewNodeMiniMenu from './overlay/MiniMenu'

const CanvasOverlay = (): React.JSX.Element => {
    const nodes = useAtomValue(FlowNodes)
    const [showMiniMenu, setShowMiniMenu] = useState<boolean>(false)

    const runTest = (): void => {
        const ghostSource: string[] = []
        const ghostTarget: string[] = []

        console.log('Nodes:', nodes.length)

        const disconectedReactions = nodes
            .flatMap((n) =>
                n.data.actions.flatMap((a) => {
                    const disconectedReactions = a.reactions
                        .map((r) => (!r.target ? r.id : null))
                        .filter((v) => v)
                    if (disconectedReactions.length) {
                        return disconectedReactions
                    }
                    return null
                })
            )
            .filter((v) => v)

        if (disconectedReactions.length) {
            console.warn(
                `${disconectedReactions.length} disconected reactions found:\n\n ${disconectedReactions.join('\n ')}`
            )
        } else console.log('✅ All reactions connected');

        const edges = Object.values(store.get(FlowEdges))
        console.log('Edges:', edges.length)

        edges.map((e) => {
            const sNode = nodes.find((n) => n.id === e.source)
            const hasSource = sNode?.data.actions
                .map((a) => {
                    const r = a.reactions.find((r) => r.id === e.sourceHandle)
                    return r ? true : false
                })
                .filter((n) => n)

            const hasTarget = nodes.find((n) => n.id === e.target)

            if (!hasSource?.length) {
                console.warn(`Node handle ID ${e.sourceHandle} not found`)
                ghostSource.push(e.id)
            }
            if (!hasTarget) {
                console.log(`Node ID ${e.target} not found`)
                ghostTarget.push(e.id)
            }
        })

        if (ghostSource.length || ghostTarget.length) {
            console.warn(`Orphan edge found`)
            ghostSource.length && console.log('sources ->', ghostSource.concat())
            ghostTarget.length && console.log('targets ->', ghostTarget.concat())
        } else console.log(`✅ No orphan edge found`)

        console.log('@ Main Flow Nodes:', store.get(FlowNodes));
        console.log('@ Main Flow Edges:', store.get(FlowEdges));        
    }

    return (
        <div className="architect-blueprint-sidemenu-container">
            <div className="bubble-menu">
                <div className="bubble-menu-option" onClick={() => setShowMiniMenu(true)}>
                    <NewSvg />
                </div>
                <div className="bubble-menu-option" onClick={runTest}>
                    <TestSvg />
                </div>
            </div>

            <NewNodeMiniMenu visible={showMiniMenu} close={() => setShowMiniMenu(false)} />

            <NodePropsMenu />
        </div>
    )
}

export default CanvasOverlay
