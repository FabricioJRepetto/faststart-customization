import { AssetsDataAtom, EditedBackgroundsDataAtom } from '@renderer/utils/context/context'
import { useAtom, useAtomValue } from 'jotai'
import ClearSvg from '../assets/clear.svg?react'
import { filterType } from '@shared/types'
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

    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif']

    const setDropValue = async (f: File, key: string): Promise<void> => {
        const base64 = (await fileToBase64(f)) as string
        setBackgrounds((prev) =>
            prev!.map((e) => (e.name === key ? { ...e, customPath: '', customBase64: base64 } : e))
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
                            key={bg.name}
                            fileHandler={(f: File) => setDropValue(f, bg.name)}
                            configuration={{ allowedExtensions }}
                        >
                            <BackgroundCard
                                key={bg.name}
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
