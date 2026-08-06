import {
    InformationConfig,
    NavigationButtonButtonConfig,
    NavigationButtonConfig,
    NumericInputConfig,
    OptionsListConfig,
    TableConfig,
    TextInputConfig,
    UIElementType
} from '../../../../../../../shared/fluid_types'
import { allKeysOf } from '../../utils/typeAssertion'

interface Props {
    type: UIElementType
}

const UIElementEditor = ({ type }: Props): React.JSX.Element => {
    /** Este elemento contiene todas las keys configurables de cada UIElement.
     * Si se modifica alguna interface/elemento, typescript va a lanzar un error en esta sección.
     */
    const inputs: Record<UIElementType, string[]> = {
        NavigationButton: allKeysOf<NavigationButtonConfig>()(['buttons', 'region', 'order']),
        NumericInput: allKeysOf<NumericInputConfig>()([
            'maximum',
            'minimum',
            'length',
            'direction',
            'obfuscate',
            'region',
            'order'
        ]),
        TextInput: allKeysOf<TextInputConfig>()([
            'obfuscate',
            'length',
            'validator',
            'region',
            'order'
        ]),
        OptionsList: allKeysOf<OptionsListConfig>()([
            'data',
            'onAction',
            'overflow',
            'region',
            'order'
        ]),
        Table: allKeysOf<TableConfig>()(['data', 'region', 'order']),
        Information: allKeysOf<InformationConfig>()([
            'title',
            'subtitle',
            'text',
            'illustration',
            'region',
            'order'
        ])
    }

    if (type === 'NavigationButton') {
        const buttons = allKeysOf<NavigationButtonButtonConfig>()(['onAction', 'position', 'text'])
        return (
            <div className="node-prop-editor">
                <div className="action-option">+ button</div>
                {buttons.map((k, i) => (
                    <div key={type + k + i}>
                        <p>{k}</p>
                        <input type="text"></input>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="node-prop-editor">
            {inputs[type].map((k, i) => (
                <div key={type + k + i}>
                    <p>{k}</p>
                    <input type="text"></input>
                </div>
            ))}
        </div>
    )
}


export default UIElementEditor
