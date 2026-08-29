import DropUpSvg from '../../../../assets/arrow_drop_up.svg?react'
import DropDownSvg from '../../../../assets/arrow_drop_down.svg?react'
import AddSvg from '../../../../assets/add_box.svg?react'
import DeleteSvg from '../../../../assets/close_small.svg?react'
import {
    addExtraNavButton,
    addNodeUI,
    addNodeView,
    deleteNodeUI,
    removeNodeView
} from '../../utils/updateNode'
import UIElementEditor from './UIElementEditor'
import { FlowNode, UIElementType } from '@renderer/types/types'
import { DEFAULT_VIEW } from '@renderer/CONSTANTS'

const UIElementList: Record<UIElementType, undefined> = {
    NavigationButton: undefined,
    NumericInput: undefined,
    TextInput: undefined,
    OptionsList: undefined,
    Table: undefined,
    Information: undefined
}
interface Props {
    open: boolean
    setOpen: (v: 'ui' | null) => void
    node: FlowNode
}

const UIElementsSection = ({ open, setOpen, node }: Props): React.JSX.Element => {
    const addNavButton = (viewID: string): void => {
        const _id = node.id + '_nav_btn_' + new Date().getTime()
        addExtraNavButton(node.id, viewID, _id)
    }

    const addView = (): void => {
        const viewID = new Date().getTime() + ''
        addNodeView(node.id, viewID)
    }

    const deleteView = (viewID: string): void => {
        if (viewID === DEFAULT_VIEW) return
        removeNodeView(node.id, viewID)
    }

    return (
        <div className={`properties-menu-section ${open ? 'section-open' : ''}`}>
            <div
                className={`properties-menu-section-header`}
                onClick={() => setOpen(open ? null : 'ui')}
            >
                <p>UI</p>
                {open ? <DropUpSvg /> : <DropDownSvg />}
            </div>

            <div className="action-container-header">
                <div className="action-option">
                    <a target="_blank" rel="noreferrer" onClick={addView}>
                        <AddSvg /> Add View
                    </a>
                </div>
            </div>

            {Object.entries(node.data.views).map(([viewID, elements]) => (
                <div className="view-section" key={viewID}>
                    <div className="action-container-header view-id-header">
                        <p style={{ fontSize: '.75rem' }}>{viewID}</p>
                        {viewID !== DEFAULT_VIEW && (
                            <DeleteSvg onClick={() => deleteView(viewID)} />
                        )}
                    </div>

                    <div className="actions-options">
                        {Object.keys(UIElementList)
                            ?.filter(
                                (e) => !elements.map((t) => t.type).includes(e as UIElementType)
                            )
                            ?.map((e) => (
                                <div className="action-option" key={e}>
                                    <a
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={() =>
                                            addNodeUI(node.id, viewID, e as UIElementType)
                                        }
                                    >
                                        {e}
                                    </a>
                                </div>
                            ))}
                    </div>
                    {elements?.map((e, i) => (
                        <div key={e.type + i} className="action-container">
                            <div className="action-container-header">
                                <p>{e.type}</p>
                                <span onClick={() => deleteNodeUI(node.id, viewID, e.type)}>
                                    <DeleteSvg />
                                </span>
                            </div>
                            <div className="action-container-data">
                                {/* <pre>{JSON.stringify(e.config, null, 2)}</pre> */}
                                {e.type === 'NavigationButton' ? (
                                    <>
                                        <div >
                                            <div
                                                style={{
                                                    margin: '15px 0',
                                                    width: 'max-content',
                                                    pointerEvents:
                                                        e.config.buttons?.length >= 3
                                                            ? 'none'
                                                            : 'all',
                                                    opacity:
                                                        e.config.buttons?.length >= 3 ? '.25' : '1'
                                                }}
                                                className="action-option action-container-header"
                                                onClick={() => addNavButton(viewID)}
                                            >
                                                + Add button
                                            </div>
                                        </div>
                                        {e.config.buttons?.map((b) => (
                                            <UIElementEditor
                                                key={b.id}
                                                type={e.type}
                                                viewID={viewID}
                                                buttonID={b.id}
                                                config={b}
                                            />
                                        ))}
                                    </>
                                ) : (
                                    <UIElementEditor
                                        type={e.type}
                                        viewID={viewID}
                                        config={e.config}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default UIElementsSection
