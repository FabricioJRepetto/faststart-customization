import { AssetsDataAtom, EditedBackgroundsDataAtom } from '@renderer/utils/context/context'
import { useAtom, useAtomValue } from 'jotai'
import ClearSvg from '../assets/clear.svg?react'
import { filterType } from '@renderer/types/types.d'
import Tooltip from '@renderer/components/Tooltip'
import { BackgroundCard } from '@renderer/components/AssetsCards/BackgroundCard'
import DropZone from '@renderer/components/DropZone'
import { fileToBase64 } from '@renderer/utils/filesManager'

// TODO Aceptar videos tambien

const Backgrounds = (): React.JSX.Element => {
    const OgAssets = useAtomValue(AssetsDataAtom)
    const [backgrounds, setBackgrounds] = useAtom(EditedBackgroundsDataAtom)

    const resetAllValues = (): void => {
        setBackgrounds([...OgAssets!.background])
    }

    const resetValue = (key: string): void => {
        setBackgrounds((prev) => prev!.map((e) => (e.assetName === key ? { ...e, custom: {} } : e)))
    }

    const setValue = async (key: string): Promise<void> => {
        const res = await window.electronAPI.selectFile(filterType.Imagenes)

        if (res.success) {
            const { fileName, base64, customMimeType } = res.data
            setBackgrounds((prev) =>
                prev!.map((e) =>
                    e.assetName === key
                        ? { ...e, custom: { source: base64, mime: customMimeType, fileName } }
                        : e
                )
            )
        }
    }

    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif']

    const setDropValue = async (f: File, key: string): Promise<void> => {
        const base64 = (await fileToBase64(f)) as string
        setBackgrounds((prev) =>
            prev!.map((e) =>
                e.assetName === key ? { ...e, custom: { source: base64, mime: f.type, fileName: f.name } } : e
            )
        )
    }

    return (
        <div className="screen-content">
            <div className="screen-header">
                <h1>
                    Fondos
                    <Tooltip text="Fondos de pantalla de diferentes momentos en los flujos de la aplicación." />
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

            {backgrounds?.length ? (
                <div className="assets-grid grid-bg scrolleable">
                    {backgrounds.map((bg) => (
                        <DropZone
                            key={bg.assetName}
                            fileHandler={(f: File) => setDropValue(f, bg.assetName)}
                            configuration={{ allowedExtensions }}
                        >
                            <BackgroundCard
                                id={'backgrounds-editor-' + bg.assetName.toLowerCase()}
                                bg={bg}
                                setValue={setValue}
                                resetValue={resetValue}
                            />
                        </DropZone>
                    ))}
                </div>
            ) : (
                <h2>No backgrounds</h2>
            )}
        </div>
    )
}

export default Backgrounds
