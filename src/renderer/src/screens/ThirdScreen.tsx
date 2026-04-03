import { assetName } from '@renderer/utils/assetsUtils'
import { AssetsDataAtom, EditedThirdScreenDataAtom } from '@renderer/utils/context/context'
import { filterType } from '@renderer/utils/types'
import { useAtom, useAtomValue } from 'jotai'
import { useState } from 'react'
import ClearSvg from '../assets/clear.svg?react'
import ResetSvg from '../assets/cancel.svg?react'

const ThirdScreen = (): React.JSX.Element => {
    const OgAssets = useAtomValue(AssetsDataAtom)
    const [asset, setAsset] = useAtom(EditedThirdScreenDataAtom)

    const [loaded, setLoaded] = useState<boolean>(false)

    const resetAllValues = (): void => {
        setAsset([...OgAssets!.thirdscreen])
    }

    const resetValue = (key: string): void => {
        setAsset((prev) =>
            prev!.map((e) => (e.name === key ? { ...e, customPath: '', customBase64: '' } : e))
        )
    }

    const setValue = async (key: string): Promise<void> => {
        console.log(key)
        const res = await window.electronAPI.selectFile(filterType.ImgVideo)
        console.log(res)

        if (res.success) {
            const { filePath, base64 } = res.data
            console.log(filePath)

            setAsset((prev) =>
                prev!.map((e) =>
                    e.name === key ? { ...e, customPath: filePath, customBase64: base64 } : e
                )
            )
        }
    }

    return (
        <div className="screen-content">
            <div className="screen-header">
                <h1>Third Screen</h1>
                <div className="actions">
                    <div className="action tertiary">
                        <a onClick={resetAllValues}>
                            <ClearSvg />
                            Resetear todo
                        </a>
                    </div>
                </div>
            </div>

            <div className="assets-grid grid-third">
                {asset!.map((_asset) => (
                    <div key={_asset.name} className="assets-container thirdscreen-asset-container">
                        <p>{assetName(_asset.name)}</p>

                        <div className="thirscreen-container">
                            {_asset.mimeType.match('video') ? (
                                <video
                                    src={_asset.base64}
                                    width={350}
                                    muted
                                    autoPlay
                                    loop
                                    onLoadedData={() => setLoaded(true)}
                                    className={loaded ? 'fade-in' : ''}
                                />
                            ) : (
                                <img src={_asset.base64} />
                            )}
                            {_asset.customBase64 ? (
                                <div className="custom-thirscreen-container">
                                    {_asset.mimeType.match('video') ? (
                                        <video
                                            src={_asset.customBase64}
                                            width={350}
                                            muted
                                            autoPlay
                                            loop
                                            onLoadedData={() => setLoaded(true)}
                                            className={loaded ? 'fade-in' : ''}
                                        />
                                    ) : (
                                        <img src={_asset.customBase64} />
                                    )}
                                    <ResetSvg onClick={() => resetValue(_asset.name)} />
                                </div>
                            ) : (
                                <div
                                    className="thirdscreen-placeholder"
                                    onClick={() => setValue(_asset.name)}
                                >
                                    <p>Seleccionar</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default ThirdScreen
