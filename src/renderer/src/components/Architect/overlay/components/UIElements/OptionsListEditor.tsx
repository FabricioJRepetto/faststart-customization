import { allKeysOf } from '../../../utils/typeAssertion'
import { SelectedNodeId } from '../../../FlowStorage'
import { store } from '@renderer/utils/context/context'
import { Icons, OptionsListConfig, OptionsListOptions } from '@renderer/types/types'
import { useState } from 'react'
import {
    addOptionsListOption,
    deleteOptionsListOption,
    updateNodeUI,
    updateOptionsListOption
} from '@renderer/components/Architect/utils/updateNode'

type Props = {
    viewID: string
    config: OptionsListConfig
}

const OptionsListElementEditor = ({ viewID, config }: Props): React.JSX.Element => {
    const [displayType, setDisplayType] = useState<'flex' | 'grid'>(config.display!.type)

    const saveNodeUIProps = (): void => {
        const aux: OptionsListConfig = {
            region: 'body',
            order: 0,
            overflow:
                ((document.getElementById('overflow') as HTMLInputElement)?.value as
                    | 'scroll'
                    | 'pagination') ?? 'scroll',
            optionsDirection:
                ((document.getElementById('optionsDirection') as HTMLInputElement)?.value as
                    | 'horizontal'
                    | 'vertical') ?? 'horizontal',
            options: [...config.options]
        }

        if (displayType === 'flex') {
            aux.display = {
                type: 'flex',
                direction:
                    ((document.getElementById('flex-direction') as HTMLInputElement)?.value as
                        | 'row'
                        | 'column') ?? 'column'
            }
        } else {
            aux.display = {
                type: 'grid',
                columns: parseInt(
                    (document.getElementById('grid-columns') as HTMLInputElement)?.value ?? 1
                ),
                rows: parseInt(
                    (document.getElementById('grid-rows') as HTMLInputElement)?.value ?? 1
                )
            }
        }
        updateNodeUI(store.get(SelectedNodeId)!, viewID, 'OptionsList', aux)
    }

    const optionsInputs = allKeysOf<keyof OptionsListOptions>()([
        'id',
        'onAction',
        'text',
        'icon'
    ]).filter((k) => k !== 'id')

    const icons = allKeysOf<Icons>()([
        'icon_bills',
        'icon_button_confirm',
        'icon_button_continue',
        'icon_button_exit',
        'icon_exchange',
        'icon_left_arrow',
        'icon_logo',
        'icon_qr_logo',
        'icon_return',
        'icon_right_arrow',
        'icon_world'
    ])

    const addOption = (): void => {
        const optionID = new Date().getTime().toString()
        addOptionsListOption(store.get(SelectedNodeId)!, viewID, optionID)
    }

    const saveOption = (option: OptionsListOptions): void => {
        const aux: OptionsListOptions = {
            id: option.id,
            onAction:
                (document.getElementById(`${option.id}-onAction`) as HTMLInputElement)?.value ?? option.onAction,
            text: (document.getElementById(`${option.id}-text`) as HTMLInputElement)?.value ?? option.text,
            icon: {
                asset:
                    ((document.getElementById(`${option.id}-icon-asset`) as HTMLInputElement)
                        ?.value as Icons) ?? '',
                order:
                    ((document.getElementById(`${option.id}-icon-order`) as HTMLInputElement)
                        ?.value as 'first' | 'last') ?? 'first'
            }
        }
        updateOptionsListOption(store.get(SelectedNodeId)!, viewID, option.id, aux)
    }
    const delOption = (optionID: string): void => {
        deleteOptionsListOption(store.get(SelectedNodeId)!, viewID, optionID)
    }

    return (
        <div className="node-prop-editor">
            <p>Display</p>
            <div>
                <p>type</p>
                <select
                    defaultValue={config.display?.type}
                    onChange={(e) => setDisplayType(e.target.value as 'flex' | 'grid')}
                >
                    <option value={'flex'}>Flex</option>
                    <option value={'grid'}>Grid</option>
                </select>
            </div>
            {displayType === 'flex' && (
                <div>
                    <p>direction</p>
                    <select
                        id="flex-direction"
                        //  @ts-expect-error: Caso contemplado
                        defaultValue={config.display!.direction}
                    >
                        <option value={'column'}>Column</option>
                        <option value={'row'}>Row</option>
                    </select>
                </div>
            )}
            {displayType === 'grid' && (
                <>
                    <div>
                        <p>columns</p>
                        <input
                            id={'grid-columns'}
                            type="number"
                            min={1}
                            //  @ts-expect-error: Caso contemplado
                            defaultValue={config.display!.columns}
                        ></input>
                    </div>
                    <div>
                        <p>rows</p>
                        <input
                            id={'grid-rows'}
                            type="number"
                            min={1}
                            //  @ts-expect-error: Caso contemplado
                            defaultValue={config.display!.rows}
                        ></input>
                    </div>
                </>
            )}

            <div>
                <p>overflow</p>
                <select id={'overflow'} defaultValue={config.display?.type}>
                    <option value={'scroll'}>Scroll</option>
                    <option value={'pagination'}>Pages</option>
                </select>
            </div>

            <div>
                <p>opt Direction</p>
                <select id={'optionsDirection'} defaultValue={config.display?.type}>
                    <option value={'horizontal'}>Horizontal</option>
                    <option value={'vertical'}>Vertical</option>
                </select>
            </div>

            <div>
                <div
                    className="action-option"
                    style={{
                        width: 'fit-content',
                        padding: '2px 20px',
                        alignSelf: 'end',
                        margin: '10px 10px 0 0'
                    }}
                    onClick={() => saveNodeUIProps()}
                >
                    save
                </div>
            </div>

            <div>
                <div
                    style={{
                        margin: '15px 0',
                        width: 'max-content'
                    }}
                    className="action-option action-container-header"
                    onClick={addOption}
                >
                    + Add option
                </div>
            </div>

            {config.options.map((option) => (
                <div key={option.id} className="node-prop-editor">
                    {optionsInputs.map((k, i) => (
                        <div key={'OptionsList' + option.id + k + i}>
                            <p>{k}</p>
                            {k === 'icon' && (
                                <>
                                    <select
                                        id={`${option.id}-icon-asset`}
                                        defaultValue={option[k]?.asset}
                                    >
                                        {icons.map((i) => (
                                            <option key={i} value={i}>
                                                {i.replace('icon_', '')}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        id={`${option.id}-icon-order`}
                                        defaultValue={option[k]?.order}
                                    >
                                        <option value={'first'}>First</option>
                                        <option value={'lasst'}>Last</option>
                                    </select>
                                </>
                            )}
                            {(k === 'text' || k === 'onAction') && (
                                <input
                                    id={`${option.id}-${k}`}
                                    type="text"
                                    placeholder={option[k]}
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
                            onClick={() => saveOption(option)}
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
                            onClick={() => delOption(option.id)}
                        >
                            delete
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default OptionsListElementEditor
