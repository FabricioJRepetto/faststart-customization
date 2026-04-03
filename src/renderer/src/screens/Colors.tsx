import { getColorData } from '@renderer/utils/appSettings.utils'
import { useState } from 'react'
import ClearSvg from '../assets/clear.svg?react'
import { useAtom } from 'jotai'
import { EditedColorsDataAtom } from '@renderer/utils/context/context'
import { DefaultColorsData } from '@renderer/utils/types'

const Colors = (): React.JSX.Element => {
    const [ogColors] = useState(getColorData())
    const [customColors, setCustomColors] = useAtom(EditedColorsDataAtom)

    const updateCustom = (key: string, value: string): void => {
        setCustomColors((prev) => ({ ...prev, [key]: value }))
    }

    const resetAllValues = (): void => {
        setCustomColors(DefaultColorsData)
    }

    const resetValue = (key: string): void => {
        setCustomColors((prev) => ({ ...prev, [key]: '' }))
    }

    return (
        <div className="screen-content">
            <div className="screen-header">
                <h1>Colors</h1>
                <div className="actions">
                    <div className="action tertiary">
                        <a onClick={resetAllValues}>
                            <ClearSvg />
                            Resetear todo
                        </a>
                    </div>
                </div>
            </div>

            <div className="assets-grid scrolleable">
                {Object.entries(ogColors).map(([k, v]) => (
                    <div className="assets-container color-asset-container" key={k}>
                        <div>
                            <p>{k}</p>
                            <p onClick={() => resetValue(k)}>reset</p>
                        </div>

                        <p className="tag">Original</p>
                        <div className="original-color-sample">
                            <p>{v || 'Sin indicar'}</p>
                            <div className="color-sample" style={{ backgroundColor: v }}></div>
                        </div>

                        <p className="tag">Custom</p>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                placeholder="Sin indicar"
                                className="color-input"
                                value={customColors?.[k]}
                                onChange={(e) => updateCustom(k, e.target.value)}
                            ></input>
                            <label
                                className="custom-color-sample"
                                style={{ backgroundColor: customColors?.[k] }}
                            >
                                <input
                                    hidden
                                    type="color"
                                    value={customColors?.[k]}
                                    onChange={(e) => updateCustom(k, e.target.value)}
                                />
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Colors
