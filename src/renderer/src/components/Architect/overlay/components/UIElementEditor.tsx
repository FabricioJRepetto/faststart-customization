import { allKeysOf } from '../../utils/typeAssertion'
import { deleteNavButton, updateNavButton, updateNodeUI } from '../../utils/updateNode'
import { SelectedNodeId } from '../../FlowStorage'
import { store } from '@renderer/utils/context/context'
import {
    Images,
    InformationConfig,
    NavigationButtonButtonConfig,
    NavigationButtonConfig,
    NumericInputConfig,
    OptionsListConfig,
    TableConfig,
    TextInputConfig,
    UIelementConfigs,
    UIElementType
} from '@renderer/types/types'

type Props =
    | {
          viewID: string
          config: UIelementConfigs
          type: Exclude<UIElementType, 'NavigationButton'>
          buttonID?: never
      }
    | {
          viewID: string
          config: NavigationButtonButtonConfig
          type: 'NavigationButton'
          buttonID: string
      }

const UIElementEditor = ({ viewID, config, type, buttonID }: Props): React.JSX.Element => {
    /** Este elemento contiene todas las keys configurables de cada UIElement.
     * Si se modifica alguna interface/elemento, typescript va a lanzar un error en esta sección.
     */
    const inputs: Record<UIElementType, string[]> = {
        NavigationButton: allKeysOf<keyof NavigationButtonConfig>()(['buttons', 'region', 'order']),
        NumericInput: allKeysOf<keyof NumericInputConfig>()([
            'storageAlias',
            'maximum',
            'minimum',
            'length',
            'direction',
            'obfuscate',
            'region',
            'order'
        ]),
        TextInput: allKeysOf<keyof TextInputConfig>()([
            'storageAlias',
            'obfuscate',
            'length',
            'validator',
            'region',
            'order'
        ]),
        OptionsList: allKeysOf<keyof OptionsListConfig>()([
            'data',
            'onAction',
            'overflow',
            'region',
            'order'
        ]),
        Table: allKeysOf<keyof TableConfig>()(['data', 'region', 'order']),
        Information: allKeysOf<keyof InformationConfig>()([
            'title',
            'subtitle',
            'text',
            'illustration',
            'region',
            'order'
        ])
    }
    const buttons = allKeysOf<keyof NavigationButtonButtonConfig>()([
        'onAction',
        'position',
        'text',
        'id'
    ])

    const illustrations = allKeysOf<Images>()([
        'image_insert_bills',
        'image_take_bills',
        'image_take_ticket',
        'image_warning',
        'image_oos',
        'image_error',
        'image_success',
        'image_thankyou',
        'image_wait'
    ])

    const saveNodeUIProps = (): void => {
        const isNavBtn = type === 'NavigationButton'
        const aux = {}

        if (isNavBtn) {
            buttons.map((k) => {
                const el = document.getElementById(buttonID + k) as HTMLInputElement
                aux[k] = el?.value
            })
            aux['id'] = buttonID
        } else {
            inputs[type].map((k) => {
                const el = document.getElementById(k) as HTMLInputElement
                aux[k] = el?.value
            })
        }

        // TODO - HARDCODEADO
        aux['order'] = 0
        aux['region'] = isNavBtn ? 'footer' : 'body'

        isNavBtn
            ? updateNavButton(store.get(SelectedNodeId)!, viewID, buttonID, aux)
            : updateNodeUI(store.get(SelectedNodeId)!, viewID, type, aux as UIelementConfigs)
    }

    if (type === 'NavigationButton') {
        const delNavButton = (): void =>
            deleteNavButton(store.get(SelectedNodeId)!, viewID, buttonID)

        return (
            <div className="node-prop-editor">
                {buttons
                    .filter((k) => k !== 'id')
                    .map((k, i) => (
                        <div key={type + buttonID + k + i}>
                            <p>{k}</p>
                            {k === 'position' ? (
                                <select id={buttonID + k} defaultValue={config[k]}>
                                    <option value="left">Left</option>
                                    <option value="center">Center</option>
                                    <option value="right">Right</option>
                                </select>
                            ) : (
                                <input
                                    id={buttonID + k}
                                    type="text"
                                    placeholder={config[k]}
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
                        onClick={saveNodeUIProps}
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
                        onClick={delNavButton}
                    >
                        delete
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="node-prop-editor">
            {inputs[type]
                .filter((k) => k !== 'region' && k !== 'order')
                .map((k, i) => (
                    <div key={type + k + i}>
                        <p>{k === 'storageAlias' ? 'alias' : k}</p>
                        {k === 'illustration' ? (
                            <select defaultValue={config[k]}>
                                {illustrations.map((i) => (
                                    <option key={i} value={i}>
                                        {i.replace('image_', '')}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input id={k} type="text" placeholder={config[k]}></input>
                        )}
                    </div>
                ))}
            <div
                className="action-option"
                style={{
                    width: 'fit-content',
                    padding: '2px 20px',
                    alignSelf: 'end',
                    margin: '10px 10px 0 0'
                }}
                onClick={saveNodeUIProps}
            >
                save
            </div>
        </div>
    )
}

export default UIElementEditor
