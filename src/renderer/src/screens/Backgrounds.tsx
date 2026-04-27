import { assetName } from '@renderer/utils/assetsUtils'
import { AssetsDataAtom, EditedBackgroundsDataAtom } from '@renderer/utils/context/context'
import { useAtom, useAtomValue } from 'jotai'
import ClearSvg from '../assets/clear.svg?react'
import ResetSvg from '../assets/cancel.svg?react'
import { filterType } from '@shared/types'

// TODO Aceptar videos tambien

const Backgrounds = (): React.JSX.Element => {
    const OgAssets = useAtomValue(AssetsDataAtom)
    const [backgrounds, setBackgrounds] = useAtom(EditedBackgroundsDataAtom)

    const resetAllValues = (): void => {
        setBackgrounds([...OgAssets!.background])
    }

    const resetValue = (key: string): void => {
        setBackgrounds((prev) =>
            prev!.map((e) => (e.name === key ? { ...e, customPath: '', customBase64: '' } : e))
        )
    }

    const setValue = async (key: string): Promise<void> => {
        console.log(key)
        const res = await window.electronAPI.selectFile(filterType.Imagenes)
        console.log(res)

        if (res.success) {
            const { filePath, base64 } = res.data
            console.log(filePath)

            setBackgrounds((prev) =>
                prev!.map((e) =>
                    e.name === key ? { ...e, customPath: filePath, customBase64: base64 } : e
                )
            )
        }
    }

    return (
        <div className="screen-content">
            <div className="screen-header">
                <h1>Backgrounds</h1>
                <div className="actions">
                    <div className="action tertiary">
                        <a onClick={resetAllValues}>
                            <ClearSvg />
                            Resetear todo
                        </a>
                    </div>
                </div>
            </div>

            {backgrounds?.length ? (
                <div className="assets-grid grid-bg scrolleable">
                    {backgrounds.map((bg) => (
                        <div key={bg.name} className="assets-container bg-asset-container">
                            <p>{assetName(bg.name)}</p>

                            <div className="bg-container">
                                <img src={bg.base64} />
                                {bg.customBase64 ? (
                                    <div className="custom-bg-container">
                                        <img src={bg.customBase64} />
                                        <ResetSvg onClick={() => resetValue(bg.name)} />
                                    </div>
                                ) : (
                                    <div
                                        className="bg-placeholder"
                                        onClick={() => setValue(bg.name)}
                                    >
                                        <p>Seleccionar</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <h2>No backgrounds</h2>
            )}
        </div>
    )
}

export default Backgrounds
