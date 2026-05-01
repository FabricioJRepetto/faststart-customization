import { EditedStylesDataAtom } from '@renderer/utils/context/context'
import { useAtom } from 'jotai'
import CheckSvg from '../assets/check.svg?react'
import CancelSvg from '../assets/cancel.svg?react'
import ClearSvg from '../assets/clear.svg?react'

interface Props {
    keyName: string
    parentName: string
    value: string
    reset: (key: string, parent: string) => void
    update: (key: string, parent: string, value: string) => void
    type?: 'color' | 'pixel' | 'boolean'
}

const StyleCard = ({
    keyName,
    parentName,
    value,
    reset,
    update,
    type = 'color'
}: Props): React.JSX.Element => {
    const [customStyles] = useAtom(EditedStylesDataAtom)

    const b = (v: string): boolean => {
        return v === 'true'
    }

    return (
        <div className="assets-container color-asset-container" key={keyName}>
            <div className="header">
                <p>{keyName}</p>
                {customStyles?.[parentName]?.[keyName] && (
                    <ClearSvg onClick={() => reset(keyName, parentName)} />
                )}
            </div>

            {type === 'boolean' && (
                <>
                    <p className="tag">Original {value || 'false'}</p>
                    <div
                        className="original-color-sample input-wrapper"
                        onClick={() =>
                            update(
                                keyName,
                                parentName,
                                b(customStyles?.[parentName]?.[keyName]) ? 'false' : 'true'
                            )
                        }
                    >
                        <p>{customStyles?.[parentName]?.[keyName] || 'false'}</p>
                        <button
                            className={b(customStyles?.[parentName]?.[keyName]) ? '' : 'inactive'}
                        >
                            {b(customStyles?.[parentName]?.[keyName]) ? (
                                <CheckSvg />
                            ) : (
                                <CancelSvg />
                            )}
                        </button>
                    </div>
                </>
            )}

            {type === 'pixel' && (
                <>
                    <p className="tag">Original {value || 'Sin indicar'}</p>

                    <div className="input-wrapper">
                        <input
                            type="number"
                            placeholder="Sin indicar"
                            min={0}
                            value={parseInt(customStyles?.[parentName]?.borderRadius) || ''}
                            onChange={(e) => update(keyName, parentName, e.target.value)}
                        ></input>
                    </div>

                    <div
                        className="custom-radius-sampler"
                        style={{
                            borderRadius: customStyles?.[parentName]?.borderRadius
                                ? customStyles?.[parentName]?.borderRadius + 'px'
                                : value
                        }}
                    >
                        PREVIEW
                    </div>
                </>
            )}
            {type === 'color' && (
                <>
                    <p className="tag">Original</p>
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
                                hidden
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
