import { useAtom, useAtomValue } from 'jotai'
import { useState } from 'react'
import { FlowNodes, SelectedNodeId } from '../FlowStorage'
import CloseSvg from '../../../assets/close_small.svg?react'
import MaxSvg from '../../../assets/maximize.svg?react'
import MinSvg from '../../../assets/minimize.svg?react'
import DropDownSvg from '../../../assets/arrow_drop_down.svg?react'
import DropUpSvg from '../../../assets/arrow_drop_up.svg?react'
import DeleteSvg from '../../../assets/close_small.svg?react'
import {
    addNodeAction,
    addNodeUI,
    deleteNode,
    deleteNodeAction,
    deleteNodeUI
} from '../utils/updateNode'
import { ActionType, UIElementType } from '../types'

const NodePropsMenu = (): React.JSX.Element => {
    const [selectedNodeID, setSelectedNodeID] = useAtom(SelectedNodeId)
    const [showSection, setShowSection] = useState<'actions' | 'ui' | null>(null)
    const nodes = useAtomValue(FlowNodes)

    const [maximized, setMaximized] = useState(false)

    const toogleMax = (): void => {
        setMaximized((prev) => !prev)
    }

    const closeProperties = (): void => {
        setSelectedNodeID(undefined)
    }

    return (
        <>
            {selectedNodeID &&
                nodes
                    .map(
                        (n) =>
                            n.id === selectedNodeID && (
                                <div
                                    key={n.id}
                                    className={`properties-menu ${maximized ? 'maximized' : ''}`}
                                >
                                    <div
                                        className="properties-menu-header"
                                        style={{ background: n.flowConfig.color }}
                                    >
                                        <div className="properties-menu-header-title">
                                            {`${n.id}-${n.flowConfig.titulo} (${n.data.screenType})
                                            ${n.data.flow ?? ''}`}
                                        </div>

                                        <div className="properties-menu-header-buttons">
                                            <div
                                                className="properties-menu-header-button"
                                                onClick={toogleMax}
                                            >
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
                                        <div
                                            className={`properties-menu-section ${showSection === 'actions' ? 'section-open' : ''}`}
                                        >
                                            <div
                                                className={`properties-menu-section-header`}
                                                onClick={() =>
                                                    setShowSection((p) =>
                                                        p === 'actions' ? null : 'actions'
                                                    )
                                                }
                                            >
                                                <p>Actions</p>
                                                {showSection === 'actions' ? (
                                                    <DropUpSvg />
                                                ) : (
                                                    <DropDownSvg />
                                                )}
                                            </div>
                                            <div className="actions-options">
                                                {Object.keys(ActionType).map((e) => (
                                                    <div key={e} className={`action-option ${e}`}>
                                                        <a
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            onClick={() =>
                                                                addNodeAction(
                                                                    selectedNodeID,
                                                                    e as ActionType
                                                                )
                                                            }
                                                        >
                                                            + {e}
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                            {n.data.actions.map((a) => (
                                                <div key={a.actionID} className="action-container">
                                                    <div
                                                        className={`action-container-header`}
                                                    >
                                                        <p className={a.type}>{a.actionID}</p>
                                                        <span
                                                            onClick={() =>
                                                                deleteNodeAction(
                                                                    selectedNodeID,
                                                                    a.type,
                                                                    a.actionID
                                                                )
                                                            }
                                                        >
                                                            <DeleteSvg />
                                                        </span>
                                                    </div>
                                                    {a.reactions.map((r) => (
                                                        <div
                                                            key={r.id}
                                                            className="action-container-data"
                                                        >
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

                                        <div
                                            className={`properties-menu-section ${showSection === 'ui' ? 'section-open' : ''}`}
                                        >
                                            <div
                                                className={`properties-menu-section-header`}
                                                onClick={() =>
                                                    setShowSection((p) =>
                                                        p === 'ui' ? null : 'ui'
                                                    )
                                                }
                                            >
                                                <p>UI</p>
                                                {showSection === 'ui' ? (
                                                    <DropUpSvg />
                                                ) : (
                                                    <DropDownSvg />
                                                )}
                                            </div>

                                            <div className="actions-options">
                                                {Object.keys(UIElementType)?.map((e) => (
                                                    <div className="action-option" key={e}>
                                                        <a
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            onClick={() =>
                                                                addNodeUI(
                                                                    selectedNodeID,
                                                                    e as UIElementType
                                                                )
                                                            }
                                                        >
                                                            {e}
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                            {n.data.UIElement?.map((e, i) => (
                                                <div key={e.type + i} className="action-container">
                                                    <div className="action-container-header">
                                                        <p>{e.type}</p>
                                                        <span
                                                            onClick={() =>
                                                                deleteNodeUI(selectedNodeID, e.type)
                                                            }
                                                        >
                                                            <DeleteSvg />
                                                        </span>
                                                    </div>
                                                    <div className="action-container-data">
                                                        <pre>
                                                            Config:{' '}
                                                            {JSON.stringify(e.config, null, 2)}
                                                        </pre>
                                                    </div>
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
        </>
    )
}

export default NodePropsMenu
