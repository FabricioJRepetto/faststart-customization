import { EditedStylesDataAtom } from '@renderer/utils/context/context'
import { useAtom } from 'jotai'

interface Props {
    keyName: string
    value: string
    reset: (key: string) => void
    update: (key: string, value: string) => void
    type?: 'color' | 'pixel' | 'boolean'
}

const StyleCard = ({ keyName, value, reset, update, type = 'color' }: Props): React.JSX.Element => {
    const [customStyles] = useAtom(EditedStylesDataAtom)

    if (type === 'boolean') {
        return (
            <div className="assets-container color-asset-container" key={keyName}>
                <div>
                    <p>{keyName}</p>
                    <p onClick={() => reset(keyName)}>reset</p>
                </div>

                <p className="tag">Original</p>
                <div className="original-color-sample">
                    <p>{value || 'False'}</p>
                </div>

                <p className="tag">Custom {customStyles?.[keyName]}</p>
                <div className="input-wrapper">
                    <button
                        // value={customStyles?.[keyName]}
                        onClick={() => update(keyName, customStyles?.[keyName] ? '' : 'true')}
                    ></button>
                </div>
            </div>
        )
    }

    if (type === 'pixel') {
        return (
            <div className="assets-container color-asset-container" key={keyName}>
                <div>
                    <p>{keyName}</p>
                    <p onClick={() => reset(keyName)}>reset</p>
                </div>

                <p className="tag">Original {value || 'Sin indicar'}</p>

                <p className="tag">Custom</p>
                <div className="input-wrapper">
                    <input
                        type="number"
                        value={parseInt(customStyles?.buttonBorderRadius) || 0}
                        onChange={(e) => update(keyName, e.target.value)}
                    ></input>
                </div>
            </div>
        )
    }
    return (
        <div className="assets-container color-asset-container" key={keyName}>
            <div>
                <p>{keyName}</p>
                <p onClick={() => reset(keyName)}>reset</p>
            </div>

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
                    className="color-input"
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
        </div>
    )
}
export default StyleCard
