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

        Object.values(store.get(FlowEdges)).map((e) => {
            const hasSource = nodes.find((n) => n.id === e.source)
            const hasTarget = nodes.find((n) => n.id === e.target)

            if (!hasSource) ghostSource.push(e.id)
            if (!hasTarget) ghostTarget.push(e.id)
        })

        if (ghostSource.length || ghostTarget.length) {
            console.warn(`[ASD] Ghost edge found`)
            console.log('[ASD] sources', ghostSource.concat())
            console.log('[ASD] targets', ghostTarget.concat())
        } else console.log(`[ASD] No ghosts here`)
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
