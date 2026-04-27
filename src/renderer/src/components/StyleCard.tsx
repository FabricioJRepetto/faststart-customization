import { EditedStylesDataAtom } from '@renderer/utils/context/context'
import { useAtom } from 'jotai'
import CheckSvg from '../assets/check.svg?react'
import CancelSvg from '../assets/cancel.svg?react'
import ClearSvg from '../assets/clear.svg?react'

interface Props {
    keyName: string
    value: string
    reset: (key: string) => void
    update: (key: string, value: string) => void
    type?: 'color' | 'pixel' | 'boolean'
}

const StyleCard = ({ keyName, value, reset, update, type = 'color' }: Props): React.JSX.Element => {
    const [customStyles] = useAtom(EditedStylesDataAtom)

    const b = (v: string): boolean => {
        return v === 'true'
    }

    return (
        <div className="assets-container color-asset-container" key={keyName}>
            <div className="header">
                <p>{keyName}</p>
                {customStyles?.[keyName] && <ClearSvg onClick={() => reset(keyName)} />}
            </div>

            {type === 'boolean' && (
                <>
                    <p className="tag">Original {value || 'false'}</p>
                    <div
                        className="original-color-sample input-wrapper"
                        onClick={() =>
                            update(keyName, b(customStyles?.[keyName]) ? 'false' : 'true')
                        }
                    >
                        <p>{customStyles?.[keyName] || 'false'}</p>
                        <button className={b(customStyles?.[keyName]) ? '' : 'inactive'}>
                            {b(customStyles?.[keyName]) ? <CheckSvg /> : <CancelSvg />}
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
                            value={parseInt(customStyles?.buttonBorderRadius) ?? ''}
                            onChange={(e) => update(keyName, e.target.value)}
                        ></input>
                    </div>

                    <div
                        className="custom-radius-sampler"
                        style={{
                            borderRadius: customStyles?.buttonBorderRadius
                                ? customStyles?.buttonBorderRadius + 'px'
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
                            value={customStyles?.[keyName]}
                            onChange={(e) => update(keyName, e.target.value)}
                        ></input>
                        <label
                            className="custom-color-sample"
                            style={{ backgroundColor: customStyles?.[keyName] }}
                        >
                            <input
                                hidden
                                type="color"
                                value={customStyles?.[keyName]}
                                onChange={(e) => update(keyName, e.target.value)}
                            />
                        </label>
                    </div>
                </>
            )}
        </div>
    )
}
export default StyleCard
