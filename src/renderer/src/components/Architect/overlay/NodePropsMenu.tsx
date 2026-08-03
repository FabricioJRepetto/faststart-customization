import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
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
    deleteNodeUI,
    updateNodeProps
} from '../utils/updateNode'
import { ActionType, FlowNode, ScreenType, UIElementType } from '../types'
import UIElementEditor from './components/UIElementEditor'
import { NodeColors } from '../utils/presets'

const UIElementList: Record<UIElementType, undefined> = {
    NavigationButton: undefined,
    NumericInput: undefined,
    TextInput: undefined,
    OptionsList: undefined,
    Table: undefined,
    Information: undefined
}

const NodePropsMenu = (): React.JSX.Element => {
    const [selectedNodeID, setSelectedNodeID] = useAtom(SelectedNodeId)
    const [showSection, setShowSection] = useState<'props' | 'actions' | 'ui' | null>(null)
    const nodes = useAtomValue(FlowNodes)
    const [n, setSelectedNode] = useState<FlowNode>()

    const [maximized, setMaximized] = useState(false)

    const toogleMax = (): void => {
        setMaximized((prev) => !prev)
    }

    const closeProperties = (): void => {
        setSelectedNodeID(undefined)
    }

    const [nodeName, setNodeName] = useState<string>('')
    const [nodeType, setNodeType] = useState<ScreenType>()
    const [closeTO, setCloseTO] = useState<boolean>()

    const saveNodeProps = (): void => {
        if (!nodeName || !nodeType) return
        updateNodeProps(selectedNodeID!, nodeName, nodeType, !!closeTO)
    }

    const addAction = (e: ActionType): void => {
        switch (e) {
            case 'terminal':
                addNodeAction(selectedNodeID!, ActionType.terminal, 'dispenser')
                break

            case 'user':
                addNodeAction(selectedNodeID!, ActionType.user)
                break

            default:
                console.warn('Action type not implemented')
                break
        }
    }

    useEffect(() => {
        const n = nodes.find((n) => n.id === selectedNodeID)
        // eslint-disable-next-line
        setSelectedNode(() => n)
        setNodeName(() => n?.data.screenName || '')
        setNodeType(() => n?.data.screenType)
        setCloseTO(() => n?.data.timeout)
    }, [selectedNodeID, nodes, setNodeName])

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
                        <div
                            className={`properties-menu-section ${showSection === 'props' ? 'section-open' : ''}`}
                        >
                            <div
                                className={`properties-menu-section-header`}
                                onClick={() =>
                                    setShowSection((p) => (p === 'props' ? null : 'props'))
                                }
                            >
                                <p>Node props</p>
                                {showSection === 'props' ? <DropUpSvg /> : <DropDownSvg />}
                            </div>
                            <div className="action-container-data node-prop-editor">
                                <div>
                                    <p>name</p>
                                    <input
                                        type="text"
                                        value={nodeName}
                                        onChange={(e) => setNodeName(e.target.value)}
                                    ></input>
                                </div>
                                <div>
                                    <p>type</p>
                                    <select
                                        value={n.data.screenType}
                                        onChange={(e) => setNodeType(e.target.value as ScreenType)}
                                    >
                                        {Object.keys(ScreenType).map((op) => (
                                            <option key={op} value={op}>
                                                {op}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <p>close timeout</p>
                                    <input
                                        type="radio"
                                        value={nodeName}
                                        onChange={(e) => setNodeName(e.target.value)}
                                    ></input>
                                </div>
                                <div
                                    className="action-option"
                                    style={{
                                        width: 'fit-content',
                                        padding: '2px 20px',
                                        alignSelf: 'end',
                                        margin: '10px 10px 0 0'
                                    }}
                                    onClick={saveNodeProps}
                                >
                                    save
                                </div>
                            </div>
                        </div>

                        <div
                            className={`properties-menu-section ${showSection === 'actions' ? 'section-open' : ''}`}
                        >
                            <div
                                className={`properties-menu-section-header`}
                                onClick={() =>
                                    setShowSection((p) => (p === 'actions' ? null : 'actions'))
                                }
                            >
                                <p>Actions</p>
                                {showSection === 'actions' ? <DropUpSvg /> : <DropDownSvg />}
                            </div>
                            <div className="actions-options">
                                {Object.keys(ActionType).map((e) => (
                                    <div
                                        key={e}
                                        className={`action-option ${e}`}
                                        style={{
                                            pointerEvents:
                                                e === ActionType.user || e === ActionType.terminal
                                                    ? 'all'
                                                    : 'none'
                                        }}
                                    >
                                        <a
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={() => addAction(e as ActionType)}
                                        >
                                            + {e}
                                        </a>
                                    </div>
                                ))}
                            </div>
                            {n.data.actions.map((a) => (
                                <div key={a.actionID} className="action-container">
                                    <div className={`action-container-header`}>
                                        <p className={a.type}>{a.actionID}</p>
                                        <span
                                            onClick={() =>
                                                deleteNodeAction(selectedNodeID, a.type, a.actionID)
                                            }
                                        >
                                            <DeleteSvg />
                                        </span>
                                    </div>
                                    {a.reactions.map((r) => (
                                        <div key={r.id} className="action-container-data">
                                            <code>{r.label}</code>
                                            <code>ID: {r.id}</code>
                                            <code>CODE: {r.reactionCode}</code>
                                            <p>
                                                <code>target: {r?.target || 'unset'}</code>
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
                                onClick={() => setShowSection((p) => (p === 'ui' ? null : 'ui'))}
                            >
                                <p>UI</p>
                                {showSection === 'ui' ? <DropUpSvg /> : <DropDownSvg />}
                            </div>

                            <div className="actions-options">
                                {Object.keys(UIElementList)?.map((e) => (
                                    <div className="action-option" key={e}>
                                        <a
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={() =>
                                                addNodeUI(selectedNodeID, e as UIElementType)
                                            }
                                        >
                                            {e}
                                        </a>
                                    </div>
                                ))}
                            </div>
                            {n.data.uiElements?.map((e, i) => (
                                <div key={e.type + i} className="action-container">
                                    <div className="action-container-header">
                                        <p>{e.type}</p>
                                        <span onClick={() => deleteNodeUI(selectedNodeID, e.type)}>
                                            <DeleteSvg />
                                        </span>
                                    </div>
                                    <div className="action-container-data">
                                        <pre>Config: {JSON.stringify(e.config, null, 2)}</pre>
                                        <UIElementEditor type={e.type} />
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
            )}
        </>
    )
}

export default NodePropsMenu
