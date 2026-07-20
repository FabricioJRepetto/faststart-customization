import { useAtom, useAtomValue } from 'jotai'
import NewSvg from '../../assets/add.svg?react'
import CloseSvg from '../../assets/close_small.svg?react'
import { FlowNodes, SelectedNodeId } from './FlowStorage'
import { useState } from 'react'
import { ScreenType } from './types'
import { newNode } from './utils/presets'
import { deleteNode } from './utils/updateNode'

const FlowMenu = (): React.JSX.Element => {
    const [selectedNodeID, setSelectedNodeID] = useAtom(SelectedNodeId)
    const nodes = useAtomValue(FlowNodes)
    const [showSection, setShowSection] = useState<'actions' | null>('actions')
    const [showMiniMenu, setShowMiniMenu] = useState<boolean>(false)

    const closeProperties = (): void => {
        setSelectedNodeID(undefined)
    }

    const addNode = (t: ScreenType): void => {
        newNode(t)
    }

    return (
        <div className="architect-blueprint-sidemenu-container">
            <div className="bubble-menu">
                <div className="bubble-menu-option" onClick={() => setShowMiniMenu(true)}>
                    <NewSvg />
                </div>
            </div>
            {showMiniMenu && (
                <div className="minimenu-container">
                    <div
                        className="minimenu-container-header-button"
                        onClick={() => setShowMiniMenu(false)}
                    >
                        <CloseSvg />
                    </div>
                    <div className="actions">
                        <div className="action">
                            <a
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => addNode(ScreenType.idle)}
                            >
                                Idle
                            </a>
                        </div>
                        <div className="action">
                            <a
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => addNode(ScreenType.userAction)}
                            >
                                User Action
                            </a>
                        </div>
                        <div className="action">
                            <a
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => addNode(ScreenType.infoScreen)}
                            >
                                Info
                            </a>
                        </div>
                        <div className="action">
                            <a
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => addNode(ScreenType.successScreen)}
                            >
                                Success Screen
                            </a>
                        </div>
                        <div className="action">
                            <a
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => addNode(ScreenType.errorScreen)}
                            >
                                Error Screen
                            </a>
                        </div>
                        <div className="action">
                            <a
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => addNode(ScreenType.config)}
                            >
                                Configuration
                            </a>
                        </div>
                        <div className="action">
                            <a
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => addNode(ScreenType.close)}
                            >
                                Close
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {selectedNodeID &&
                nodes
                    .map(
                        (n) =>
                            n.id === selectedNodeID && (
                                <div key={n.id} className="properties-menu">
                                    <div className="properties-menu-header">
                                        <div>
                                            {n.flowConfig.titulo}({n.data.screenType})
                                            {n.data.flow ?? ''}
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
                                                setShowSection((p) =>
                                                    p === 'actions' ? null : 'actions'
                                                )
                                            }
                                        >
                                            <p style={{ cursor: 'pointer' }}>Actions</p>
                                            {n.data.actions.map((a) => (
                                                <div key={a.actionID} className="action-container">
                                                    <p>{a.type}</p>
                                                    {a.reactions.map((r) => (
                                                        <div key={r.id}>
                                                            <code>{r.label}</code>
                                                            <code>ID: {r.id}</code>
                                                            <code>CODE: {r.reactionCode}</code>
                                                            <p>
                                                                <code>
                                                                    target: {r?.target || 'unset'}
                                                                </code>
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="actions">
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
                            )
                    )
                    .filter((n) => n)}
        </div>
    )
}

export default FlowMenu
