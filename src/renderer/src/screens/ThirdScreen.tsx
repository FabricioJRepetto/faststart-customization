import {
    AssetsDataAtom,
    EditedThirdScreenAssetsDataAtom,
    EditedThirdScreenConfigDataAtom
} from '@renderer/utils/context/context'
import { useAtom, useAtomValue } from 'jotai'
import ClearSvg from '../assets/clear.svg?react'
import { AssetData, filterType } from '@shared/types'
import { ThirdCard, AddNewAsset, NewAssetCard } from '@renderer/components/ThirdScreenAssetsCard'
import Tooltip from '@renderer/components/Tooltip'

const ThirdScreen = (): React.JSX.Element => {
    const OgAssets = useAtomValue(AssetsDataAtom)
    const [asset, setAsset] = useAtom(EditedThirdScreenAssetsDataAtom)
    const [config, setConfig] = useAtom(EditedThirdScreenConfigDataAtom)

    const resetAllValues = (): void => {
        setAsset([...OgAssets!.thirdscreen])
    }

    const resetValue = (key: string): void => {
        setAsset((prev) =>
            prev!.map((e) => (e.name === key ? { ...e, customPath: '', customBase64: '' } : e))
        )
    }

    const deleteValue = (key: string): void => {
        setAsset((prev) => prev!.filter((e) => e.name !== key))
    }

    const setValue = async (key: string): Promise<void> => {
        console.log(key)
        const res = await window.electronAPI.selectFile(filterType.ImgVideo)
        console.log(res)

        if (res.success) {
            const { filePath, base64, customMimeType } = res.data
            console.log(filePath)

            setAsset((prev) =>
                prev!.map((e) =>
                    e.name === key
                        ? { ...e, customPath: filePath, customBase64: base64, customMimeType }
                        : e
                )
            )
        }
    }

    const setNewConfig = (key: string, value: number | string): void => {
        const aux = { ...config }
        if (key === 'intervalSeconds') {
            aux[key] = (value || 5) as number
        }
        setConfig(aux)
    }

    const addNew = async (): Promise<void> => {
        const res = await window.electronAPI.selectFile(filterType.ImgVideo)
        console.log(res)

        if (res.success) {
            const { filePath, base64, customMimeType } = res.data
            console.log(res.data)

            setAsset((prev): AssetData[] => {
                const aux = prev ? [...prev] : []
                return [
                    ...aux,
                    {
                        name: `thirdscreen_asset_${aux.length + 1}`,
                        customPath: filePath,
                        customBase64: base64,
                        assetType: 'thirdscreen',
                        filePath: '',
                        base64: '',
                        mimeType: '',
                        customMimeType
                    }
                ]
            })
        }
    }

    return (
        <div className="screen-content">
            <div className="screen-header">
                <h1>
                    Tercer pantalla
                    <Tooltip
                        text={
                            'Estos elementos de mostrarán en la tercer pantalla (SR). Pueden ser imagenes y/o videos. Si se indican varios, se mostrará cada uno el tiempo indicado.'
                        }
                    />
                </h1>
                <div className="actions">
                    <div className="action tertiary">
                        <a onClick={resetAllValues}>
                            <ClearSvg />
                            Resetear todo
                        </a>
                    </div>
                </div>
            </div>

            {asset && asset.length > 1 && (
                <div className="third-interval-section">
                    <p>Intervalo de tiempo (en segundos) en el que se muestra cada imagen/video.</p>
                    <input
                        type="number"
                        placeholder="5"
                        onChange={(e) => setNewConfig('intervalSeconds', e.target.value)}
                    ></input>
                </div>
            )}

            <div className="assets-grid grid-third scrolleable">
                {asset?.length ? (
                    asset!.map((_asset, i) =>
                        _asset.filePath ? (
                            <ThirdCard
                                key={i}
                                data={_asset}
                                setValue={setValue}
                                resetValue={resetValue}
                            />
                        ) : (
                            <NewAssetCard key={i} data={_asset} deleteValue={deleteValue} />
                        )
                    )
                ) : (
                    <h2>No assets</h2>
                )}

                <AddNewAsset addNew={addNew} />
            </div>
        </div>
    )
}
export default ThirdScreen
