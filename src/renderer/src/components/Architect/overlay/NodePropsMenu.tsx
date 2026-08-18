import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import { FlowNodes, SelectedNodeId } from '../FlowStorage'
import CloseSvg from '../../../assets/close_small.svg?react'
import MaxSvg from '../../../assets/maximize.svg?react'
import MinSvg from '../../../assets/minimize.svg?react'
import { deleteNode } from '../utils/updateNode'
import { NodeColors } from '../utils/presets'
import ActionsSection from './components/ActionsSection'
import UIElementsSection from './components/UIElementsSection'
import PropertiesSection from './components/PropertiesSection'
import LogicFlowPanel from './components/LogicFlowPanel'
import { FlowNode, NodeAction } from '@renderer/types/types'

const NodePropsMenu = (): React.JSX.Element => {
    const [selectedNodeID, setSelectedNodeID] = useAtom(SelectedNodeId)
    const [showSection, setShowSection] = useState<'props' | 'actions' | 'ui' | null>(null)
    const [selectedAction, setSelectedAction] = useState<NodeAction | null>(null)
    const nodes = useAtomValue(FlowNodes)
    const [n, setSelectedNode] = useState<FlowNode>()

    const [maximized, setMaximized] = useState(false)

    const toogleMax = (): void => {
        setMaximized((prev) => !prev)
    }

    const closeProperties = (): void => {
        setSelectedNodeID(undefined)
    }

    const openLogicFlow = (action: NodeAction): void => {
        setSelectedAction(action)
        setMaximized(true)
    }

    useEffect(() => {
        const n = nodes.find((n) => n.id === selectedNodeID)
        // eslint-disable-next-line
        setSelectedNode(() => n)
    }, [selectedNodeID, nodes])

    return (
        <>
            {n && n.id === selectedNodeID && (
                <div key={n.id} className={`properties-menu ${maximized ? 'maximized' : ''}`}>
                    <div
                        className="properties-menu-header"
                        style={{ background: NodeColors[n.data.screenType] }}
                    >
                        <div className="properties-menu-header-title">
                            {`${n.id}-${n.data.screenName} (${n.data.screenType})
                                            ${n.data.flow ?? ''}`}
                        </div>

                        <div className="properties-menu-header-buttons">
                            <div className="properties-menu-header-button" onClick={toogleMax}>
                                {maximized ? <MinSvg /> : <MaxSvg />}
                            </div>
                            <div
                                className="properties-menu-header-button"
                                onClick={closeProperties}
                            >
                                <CloseSvg />
                            </div>
                        </div>
                    </div>

                    <div className="properties-menu-content">
                        {maximized && (
                            <div className="properties-menu-main-panel">
                                {showSection === 'actions' && selectedAction && (
                                    <LogicFlowPanel actionID={selectedAction.actionID} />
                                )}
                            </div>
                        )}

                        <div className="properties-menu-side-panel">
                            <PropertiesSection
                                open={showSection === 'props'}
                                setOpen={setShowSection}
                                node={n}
                            />

                            <ActionsSection
                                open={showSection === 'actions'}
                                setOpen={setShowSection}
                                openLogicFlow={openLogicFlow}
                                node={n}
                            />

                            <UIElementsSection
                                open={showSection === 'ui'}
                                setOpen={setShowSection}
                                node={n}
                            />

                            <div className="actions">
                                <div className="action">
                                    <a target="_blank" rel="noreferrer" onClick={() => null}>
                                        Sub Flujo
                                    </a>
                                </div>
                                <div className="action tertiary">
                                    <a
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={() => deleteNode(n.id)}
                                    >
                                        Borrar
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default NodePropsMenu
