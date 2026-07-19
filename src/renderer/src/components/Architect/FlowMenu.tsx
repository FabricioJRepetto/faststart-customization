import { useAtom } from 'jotai'
import NewSvg from '../../assets/add.svg?react'
import CloseSvg from '../../assets/close_small.svg?react'
import { SelectedNode } from './FlowStorage'
import { useState } from 'react'

const FlowMenu = (): React.JSX.Element => {
    const [selectedNode, setSelectedNode] = useAtom(SelectedNode)
    const [showSection, setShowSection] = useState<'actions' | null>(null)

    const closeProperties = (): void => {
        setSelectedNode(undefined)
    }

    return (
        <div className="architect-blueprint-sidemenu-container">
            <div className="bubble-menu">
                <div className="bubble-menu-option">
                    <NewSvg />
                </div>
            </div>

            {selectedNode && (
                <div className="properties-menu">
                    <div className="properties-menu-header">
                        <div>
                            {selectedNode.flowConfig.titulo}
                            {selectedNode.data.flow ?? ''}
                        </div>

                        <div className="properties-menu-header-buttons">
                            <div
                                className="properties-menu-header-button"
                                onClick={closeProperties}
                            >
                                <CloseSvg />
                            </div>
                        </div>
                    </div>

                    <div className="properties-menu-content">
                        <div
                            className={`properties-menu-section ${showSection === 'actions' ? 'section-open' : ''}`}
                            onClick={() =>
                                setShowSection((p) => (p === 'actions' ? null : 'actions'))
                            }
                        >
                            <p style={{ cursor: 'pointer' }}>Actions</p>
                            {selectedNode.data.actions.map((a) => (
                                <div key={a.actionID} className="action-container">
                                    <p>{a.type}</p>
                                    {a.reactions.map((r) => (
                                        <div key={r.id}>
                                            <p>{r.label}</p>
                                            <p>ID: {r.id}</p>
                                            <p>CODE: {r.reactionCode}</p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FlowMenu
