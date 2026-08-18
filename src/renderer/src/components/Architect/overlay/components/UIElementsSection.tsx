import DropUpSvg from '../../../../assets/arrow_drop_up.svg?react'
import DropDownSvg from '../../../../assets/arrow_drop_down.svg?react'
import DeleteSvg from '../../../../assets/close_small.svg?react'
import { FlowNode, UIElementType } from '@renderer/types/fluid_types'
import { addExtraNavButton, addNodeUI, deleteNodeUI } from '../../utils/updateNode'
import UIElementEditor from './UIElementEditor'

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
    const addNavButton = (): void => {
        const _id = node.id + '_nav_btn_' + new Date().getTime()
        addExtraNavButton(node.id, _id)
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

            <div className="actions-options">
                {Object.keys(UIElementList)
                    ?.filter((e) => !node.data.uiElements.map(t => t.type).includes(e as UIElementType))
                    ?.map((e) => (
                        <div className="action-option" key={e}>
                            <a
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => addNodeUI(node.id, e as UIElementType)}
                            >
                                {e}
                            </a>
                        </div>
                    ))}
            </div>
            {node.data.uiElements?.map((e, i) => (
                <div key={e.type + i} className="action-container">
                    <div className="action-container-header">
                        <p>{e.type}</p>
                        <span onClick={() => deleteNodeUI(node.id, e.type)}>
                            <DeleteSvg />
                        </span>
                    </div>
                    <div className="action-container-data">
                        <pre>{JSON.stringify(e.config, null, 2)}</pre>
                        {e.type === 'NavigationButton' ? (
                            <>
                                <div>
                                    <div className="action-option" onClick={() => addNavButton()}>
                                        + button
                                    </div>
                                </div>
                                {e.config.buttons?.map((b) => (
                                    <UIElementEditor key={b.id} type={e.type} buttonID={b.id} />
                                ))}
                            </>
                        ) : (
                            <UIElementEditor type={e.type} />
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default UIElementsSection
