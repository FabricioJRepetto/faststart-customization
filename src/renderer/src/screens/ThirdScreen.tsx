import {
    AssetsDataAtom,
    EditedThirdScreenAssetsDataAtom,
    EditedThirdScreenConfigDataAtom
} from '@renderer/utils/context/context'
import { useAtom, useAtomValue } from 'jotai'
import ClearSvg from '../assets/clear.svg?react'
import { AssetData, filterType } from '@shared/types'
import {
    ThirdCard,
    AddNewAsset,
    NewAssetCard
} from '@renderer/components/AssetsCards/ThirdScreenAssetsCard'
import Tooltip from '@renderer/components/Tooltip'
import DropZone from '@renderer/components/DropZone'
import { fileToBase64 } from '@renderer/utils/filesManager'

const ThirdScreen = (): React.JSX.Element => {
    const OgAssets = useAtomValue(AssetsDataAtom)
    const [asset, setAsset] = useAtom(EditedThirdScreenAssetsDataAtom)
    const [config, setConfig] = useAtom(EditedThirdScreenConfigDataAtom)

    const resetAllValues = (): void => {
        setAsset([...OgAssets!.thirdscreen])
    }

    const deleteValue = (key: string): void => {
        setAsset((prev) => prev!.filter((e) => e.name !== key))
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
                let fileName =
                    'thirdscreen_asset_' +
                    (filePath.split('\\')?.pop()?.split('.')?.[0] ?? 'defname')
                const used = aux.find((e) => e.name === fileName)
                if (used) {
                    fileName = fileName + '_' + (aux.length + 1)
                }
                return [
                    ...aux,
                    {
                        name: fileName,
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

    const allowedExtensions = ['.webm', '.png', '.jpg', '.jpeg', '.webp', '.gif']

    const addNewDrop = async (files: File[]): Promise<void> => {
        for await (const f of files) {
            const fileName = f.name
            const base64 = (await fileToBase64(f)) as string
            const customMimeType = f.type

            setAsset((prev): AssetData[] => {
                const aux = prev ? [...prev] : []
                let newFileName = 'thirdscreen_asset_' + (fileName.split('.')?.[0] ?? 'defname')
                const used = aux.find((e) => e.name === newFileName)
                if (used) {
                    newFileName = newFileName + '_' + (aux.length + 1)
                }
                return [
                    ...aux,
                    {
                        name: newFileName,
                        customPath: '',
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
                            Descartar cambios
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
                            <ThirdCard key={i} data={_asset} deleteValue={deleteValue} />
                        ) : (
                            <NewAssetCard key={i} data={_asset} deleteValue={deleteValue} />
                        )
                    )
                ) : (
                    <h2>No assets</h2>
                )}

                <DropZone
                    fileHandler={addNewDrop}
                    configuration={{ allowedExtensions, allowMultiple: true }}
                >
                    <AddNewAsset addNew={addNew} />
                </DropZone>
            </div>
        </div>
    )
}
export default ThirdScreen
