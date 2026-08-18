import {
    InformationConfig,
    NavigationButtonButtonConfig,
    NavigationButtonConfig,
    NumericInputConfig,
    OptionsListConfig,
    TableConfig,
    TextInputConfig,
    UIElementType
} from '../../../../types/fluid_types'
import { allKeysOf } from '../../utils/typeAssertion'
import { deleteNavButton, updateNavButton, updateNodeUI } from '../../utils/updateNode'
import { SelectedNodeId } from '../../FlowStorage'
import { store } from '@renderer/utils/context/context'

type Props =
    | {
          type: Exclude<UIElementType, 'NavigationButton'>
          buttonID?: never
      }
    | {
          type: 'NavigationButton'
          buttonID: string
      }

const UIElementEditor = ({ type, buttonID }: Props): React.JSX.Element => {
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
            ? updateNavButton(store.get(SelectedNodeId)!, buttonID, aux)
            : updateNodeUI(store.get(SelectedNodeId)!, type, aux)
    }

    if (type === 'NavigationButton') {
        const delNavButton = (): void => deleteNavButton(store.get(SelectedNodeId)!, buttonID)

        return (
            <div className="node-prop-editor">
                {buttons
                    .filter((k) => k !== 'id')
                    .map((k, i) => (
                        <div key={type + buttonID + k + i}>
                            <p>{k}</p>
                            <input id={buttonID + k} type="text"></input>
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
                        <input id={k} type="text"></input>
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
