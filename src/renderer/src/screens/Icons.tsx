import { AssetsDataAtom, EditedIconsDataAtom } from '@renderer/utils/context/context'
import { useAtom, useAtomValue } from 'jotai'
import ClearSvg from '../assets/clear.svg?react'
import { filterType } from '@shared/types'
import Tooltip from '@renderer/components/Tooltip'
import DropZone from '@renderer/components/DropZone'
import { fileToBase64 } from '@renderer/utils/filesManager'
import { IconCard } from '@renderer/components/IconCard'

const Icons = (): React.JSX.Element => {
    const OgAssets = useAtomValue(AssetsDataAtom)
    const [icons, setIcons] = useAtom(EditedIconsDataAtom)

    const resetAllValues = (): void => {
        setIcons([...OgAssets!.icon])
    }

    const resetValue = (key: string): void => {
        setIcons((prev) =>
            prev!.map((e) => (e.name === key ? { ...e, customPath: '', customBase64: '' } : e))
        )
    }

    const setValue = async (assetName: string): Promise<void> => {
        const res = await window.electronAPI.selectFile(filterType.ImgSvg)
        if (res.success) {
            const { filePath, base64, customMimeType } = res.data
            setIcons((prev) =>
                prev!.map((e) =>
                    e.name === assetName
                        ? { ...e, customPath: filePath, customBase64: base64, customMimeType }
                        : e
                )
            )
        }
    }

    //_-_-_-_-_-_-_- Drop _-_-_-_-_-_-_-
    const allowedExtensions = ['.svg', '.png', '.jpg', '.jpeg', '.webp', '.gif']

    const setValueFromDrop = async (f: File, key: string): Promise<void> => {
        const filePath = f.webkitRelativePath
        const base64 = (await fileToBase64(f)) as string
        const customMimeType = f.type

        console.log('filePath', filePath)
        console.log('base64', !!base64)
        console.log('customMimeType', customMimeType)

        setIcons((prev) =>
            prev!.map((e) =>
                e.name === key
                    ? { ...e, customPath: filePath, customBase64: base64, customMimeType }
                    : e
            )
        )
    }

    return (
        <div className="screen-content">
            <div className="screen-header">
                <h1>
                    Iconos
                    <Tooltip
                        text={
                            'Iconos y algunas imagenes que se utilizan a lo largo de toda la aplicación. Pueden ser SVG o cualquier tipo de imágen.'
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

            {icons?.length ? (
                <div className="assets-grid scrolleable">
                    {icons.map((icon, i) => (
                        <DropZone
                            key={i}
                            fileHandler={(f) => setValueFromDrop(f as File, icon.name)}
                            configuration={{ allowedExtensions }}
                        >
                            <IconCard
                                key={icon.name}
                                icon={icon}
                                setValue={setValue}
                                resetValue={resetValue}
                            />
                        </DropZone>
                    ))}
                </div>
            ) : (
                <h2>No icons</h2>
            )}
        </div>
    )
}

export default Icons
