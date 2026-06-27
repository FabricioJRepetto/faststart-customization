import { DefaultStylesDataAtom, EditedStylesDataAtom } from '@renderer/utils/context/context'
import { useAtom, useAtomValue } from 'jotai'
import CheckSvg from '../../assets/check.svg?react'
import CancelSvg from '../../assets/cancel.svg?react'
import UndoSvg from '../../assets/undo.svg?react'
import Tooltip from '../Tooltip'

interface Props {
    keyName: string
    description?: string
    parentName: string
    value: string
    reset: (key: string, parent: string) => void
    update: (key: string, parent: string, value: string) => void
    type?: 'color' | 'border'
}

const StyleCard = ({
    keyName,
    description,
    parentName,
    value,
    reset,
    update,
    type = 'color'
}: Props): React.JSX.Element => {
    const ogStyles = useAtomValue(DefaultStylesDataAtom)
    const [customStyles] = useAtom(EditedStylesDataAtom)

    const hasCustom =
        (type === 'border' && customStyles?.[parentName]?.border) ||
        customStyles?.[parentName]?.[keyName]

    const b = (v: string): boolean => {
        return v === 'true'
    }

    return (
        <div
            className={`assets-container color-asset-container ${hasCustom ? 'asset-card-has-custom' : 'asset-card-initial'}`}
            key={keyName}
        >
            <div className="header">
                <p>{keyName}</p>
                <p className="style-card-description">{description}</p>
                {hasCustom && (
                    <Tooltip text="Restablecer valor">
                        <span
                            className="button delete-buton"
                            onClick={() => reset(keyName, parentName)}
                        >
                            <UndoSvg />
                        </span>
                    </Tooltip>
                )}
            </div>

            {type === 'border' && (
                <>
                    <p className="tag">
                        Mostrar borde (inicinal:{' '}
                        {ogStyles?.[parentName]?.border === 'true' ? 'si' : 'no'})
                    </p>
                    <div
                        className="original-color-sample input-wrapper"
                        onClick={() =>
                            update(
                                'border',
                                parentName,
                                b(customStyles?.[parentName]?.border) ? 'false' : 'true'
                            )
                        }
                    >
                        <p>{customStyles?.[parentName]?.border || 'false'}</p>
                        <button className={b(customStyles?.[parentName]?.border) ? '' : 'inactive'}>
                            {b(customStyles?.[parentName]?.border) ? <CheckSvg /> : <CancelSvg />}
                        </button>
                    </div>

                    <p className="tag">Suavizado (inicinal: {value ?? '0px'})</p>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            placeholder="Sin indicar"
                            min={0}
                            value={parseInt(customStyles?.[parentName]?.borderRadius ?? 0) + ''}
                            onChange={(e) => update(keyName, parentName, e.target.value)}
                        ></input>
                    </div>

                    {/* <div
                        className="custom-radius-sampler"
                        style={{
                            borderRadius: customStyles?.[parentName]?.borderRadius
                                ? customStyles[parentName].borderRadius + 'px'
                                : value
                        }}
                    >
                        PREVIEW
                    </div> */}
                </>
            )}
            {type === 'color' && (
                <>
                    <p className="tag">Inicinal</p>
                    <div className="original-color-sample">
                        <p>{value || 'Sin indicar'}</p>
                        <div className="color-sample" style={{ backgroundColor: value }}></div>
                    </div>

                    <p className="tag">Custom</p>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            placeholder="Sin indicar"
                            value={customStyles?.[parentName]?.[keyName] || ''}
                            onChange={(e) => update(keyName, parentName, e.target.value)}
                        ></input>
                        <label
                            className="custom-color-sample"
                            style={{ backgroundColor: customStyles?.[parentName]?.[keyName] || '' }}
                        >
                            <input
                                className="hidden-color-input"
                                type="color"
                                value={customStyles?.[parentName]?.[keyName]}
                                onChange={(e) => update(keyName, parentName, e.target.value)}
                            />
                        </label>
                    </div>
                </>
            )}
        </div>
    )
}
export default StyleCard
