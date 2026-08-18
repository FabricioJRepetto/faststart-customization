import {
    AssetsDataAtom,
    EditedThirdScreenAssetsDataAtom,
    EditedThirdScreenConfigDataAtom
} from '@renderer/utils/context/context'
import { useAtom, useAtomValue } from 'jotai'
import ClearSvg from '../assets/clear.svg?react'
import { AssetData, filterType } from '@renderer/types/types.d'
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
        setAsset((prev) => prev!.filter((e) => e.assetName !== key))
    }

    const setNewConfig = (key: string, value: number | string): void => {
        const aux = { ...config }
        if (key === 'intervalSeconds') {
            aux[key] = (value || 5) as number
        }
        setConfig(aux)
    }

    const addNew = async (): Promise<void> => {
        //TODO Reemplazar el uso de electron por inputs
        const res = await window.electronAPI.selectFile(filterType.ImgVideo)
        console.log(res)

        if (res.success) {
            const { fileName, filePath, base64, customMimeType } = res.data
            console.log(res.data)

            setAsset((prev): AssetData[] => {
                const aux = prev ? [...prev] : []
                const ext = filePath.split('\\')?.pop()?.split('.').pop()

                let _fileName = 'thirdscreen_asset_' + fileName
                const used = aux.find((e) => e.assetName === _fileName)
                if (used) {
                    _fileName =
                        'thirdscreen_asset_' +
                        fileName.splt('.')[0] +
                        '_' +
                        (aux.length + 1) +
                        '.' +
                        ext
                }
                return [
                    ...aux,
                    {
                        assetName: _fileName,
                        assetType: 'thirdscreen',
                        original: {},
                        custom: {
                            source: base64,
                            mime: customMimeType,
                            fileName: fileName
                        }
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
                let newFileName = 'thirdscreen_asset_' + fileName
                const used = aux.find((e) => e.assetName === newFileName)
                if (used) {
                    const aux = f.name.split('.')
                    const _name = aux[0]
                    const ext = aux.pop()
                    newFileName = 'thirdscreen_asset_' + _name + '_' + (aux.length + 1) + '.' + ext
                }
                return [
                    ...aux,
                    {
                        assetName: newFileName,
                        assetType: 'thirdscreen',
                        original: {},
                        custom: {
                            source: base64,
                            mime: customMimeType,
                            fileName: fileName
                        }
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

            <div className="third-interval-section">
                <p>
                    Intervalo de tiempo (en segundos) en el que se muestra cada imagen/video. Solo
                    aplicable cuando hay mas de un elemento.
                </p>
                <input
                    type="number"
                    placeholder="5"
                    onChange={(e) => setNewConfig('intervalSeconds', e.target.value)}
                ></input>
            </div>

            <div className="assets-grid grid-third scrolleable">
                <div className="grid-divider"></div>
                {asset?.length ? (
                    asset!.map((_asset, i) => {
                        if (!_asset.original?.source && !_asset.custom.source) return null
                        if (_asset.original?.source && !_asset.custom.source)
                            return <ThirdCard key={i} data={_asset} deleteValue={deleteValue} />
                        else return <NewAssetCard key={i} data={_asset} deleteValue={deleteValue} />
                    })
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
