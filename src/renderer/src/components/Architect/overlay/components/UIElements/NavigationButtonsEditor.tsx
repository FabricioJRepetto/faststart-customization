import { allKeysOf } from '../../../utils/typeAssertion'
import { addExtraNavButton, deleteNavButton, updateNavButton } from '../../../utils/updateNode'
import { SelectedNodeId } from '../../../FlowStorage'
import { store } from '@renderer/utils/context/context'
import { NavigationButtonButtonConfig, NavigationButtonConfig } from '@renderer/types/types'

type Props = {
    nodeID: string
    viewID: string
    config: NavigationButtonConfig
}

const NavigationButtonsEditor = ({ nodeID, viewID, config }: Props): React.JSX.Element => {
    const buttons = allKeysOf<keyof NavigationButtonButtonConfig>()([
        'onAction',
        'position',
        'text',
        'id'
    ])

    const saveNodeUIProps = (buttonID: string): void => {
        const aux = {}

        buttons.map((k) => {
            const el = document.getElementById(buttonID + k) as HTMLInputElement
            el?.value && (aux[k] = el.value)
        })
        aux['id'] = buttonID

        aux['order'] = 0
        aux['region'] = 'footer'

        updateNavButton(store.get(SelectedNodeId)!, viewID, buttonID, aux)
    }

    const addNavButton = (viewID: string): void => {
        const _id = 'nav_btn_' + new Date().getTime()
        addExtraNavButton(nodeID, viewID, _id)
    }
    const delNavButton = (buttonID: string): void => {
        deleteNavButton(store.get(SelectedNodeId)!, viewID, buttonID)
    }

    return (
        <>
            {/* <pre>{JSON.stringify(config, null, 2)}</pre> */}
            <div>
                <div
                    style={{
                        margin: '15px 0',
                        width: 'max-content',
                        pointerEvents: config.buttons?.length >= 3 ? 'none' : 'all',
                        opacity: config.buttons?.length >= 3 ? '.25' : '1'
                    }}
                    className="action-option action-container-header"
                    onClick={() => addNavButton(viewID)}
                >
                    + Add button
                </div>
            </div>

            {config.buttons.map((button) => (
                <div key={button.id} className="node-prop-editor">
                    {buttons
                        .filter((k) => k !== 'id')
                        .map((k, i) => (
                            <div key={'NavigationButton' + button.id + k + i}>
                                <p>{k}</p>
                                {k === 'position' ? (
                                    <select id={button.id + k} defaultValue={button[k]}>
                                        <option value="left">Left</option>
                                        <option value="center">Center</option>
                                        <option value="right">Right</option>
                                    </select>
                                ) : (
                                    <input
                                        id={button.id + k}
                                        type="text"
                                        placeholder={button[k]}
                                    ></input>
                                )}
                            </div>
                        ))}

                    <div>
                        <div
                            className="action-option"
                            style={{
                                width: 'fit-content',
                                padding: '2px 20px',
                                alignSelf: 'end',
                                margin: '10px 10px 0 0'
                            }}
                            onClick={() => saveNodeUIProps(button.id)}
                        >
                            save
                        </div>
                        <div
                            className="action-option"
                            style={{
                                width: 'fit-content',
                                padding: '2px 20px',
                                alignSelf: 'end',
                                margin: '10px 10px 0 0'
                            }}
                            onClick={() => delNavButton(button.id)}
                        >
                            delete
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default NavigationButtonsEditor
