import { allKeysOf } from '../../utils/typeAssertion'
import { updateNodeUI } from '../../utils/updateNode'
import { SelectedNodeId } from '../../FlowStorage'
import { store } from '@renderer/utils/context/context'
import {
    Images,
    InformationConfig,
    NumericInputConfig,
    TableConfig,
    TextInputConfig,
    UIelementConfigs,
    UIElementType
} from '@renderer/types/types'

type Props = {
    viewID: string
    config: UIelementConfigs
    type: Exclude<UIElementType, 'NavigationButton' | 'OptionsList'>
    buttonID?: never
    optionID?: never
}

const UIElementEditor = ({ viewID, config, type }: Props): React.JSX.Element => {
    /** Este elemento contiene todas las keys configurables de cada UIElement.
     * Si se modifica alguna interface/elemento, typescript va a lanzar un error en esta sección.
     */
    const inputs: Record<Exclude<UIElementType, 'NavigationButton' | 'OptionsList'>, string[]> = {
        Information: allKeysOf<keyof InformationConfig>()([
            'title',
            'subtitle',
            'text',
            'illustration',
            'region',
            'order'
        ]),
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
        Table: allKeysOf<keyof TableConfig>()(['data', 'region', 'order'])
    }

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
        const aux = {}

        inputs[type].map((k) => {
            const el = document.getElementById(k) as HTMLInputElement
            console.log(k, el?.value)
            
            // UI Information siempre pisa valores para poder dejar campos vacios
            if (el?.value || type === 'Information') {
                aux[k] = el?.value
            }
        })

        //: WARN - HARDCODEADO
        aux['order'] = 0
        aux['region'] = 'body'

        updateNodeUI(store.get(SelectedNodeId)!, viewID, type, aux as UIelementConfigs)
    }

    return (
        <div className="node-prop-editor">
            <pre>{JSON.stringify(config, null, 2)}</pre>
            {inputs[type]
                .filter((k) => k !== 'region' && k !== 'order')
                .map((k, i) => (
                    <div key={type + k + i}>
                        <p>{k === 'storageAlias' ? 'alias' : k}</p>
                        {k === 'illustration' ? (
                            <select id={'illustration'} defaultValue={config[k]}>
                                {illustrations.map((i) => (
                                    <option key={i} value={i}>
                                        {i.replace('image_', '')}
                                    </option>
                                ))}
                                <option key={'undefined'} value={undefined}>
                                    no image
                                </option>
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
