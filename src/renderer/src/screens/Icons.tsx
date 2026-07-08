import {
    EditedIconsDataAtom,
    EditedImagesDataAtom,
    TemplateConfigAtom
} from '@renderer/utils/context/context'
import { useAtom, useAtomValue } from 'jotai'
import ClearSvg from '../assets/clear.svg?react'
import { filterType } from '@shared/types'
import Tooltip from '@renderer/components/Tooltip'
import DropZone from '@renderer/components/DropZone'
import { fileToBase64 } from '@renderer/utils/filesManager'
import { IconCard } from '@renderer/components/AssetsCards/IconCard'

const Icons = (): React.JSX.Element => {
    const OgAssets = useAtomValue(TemplateConfigAtom)
    const [icons, setIcons] = useAtom(EditedIconsDataAtom)
    const [images, setImages] = useAtom(EditedImagesDataAtom)    

    const resetAllValues = (): void => {
        setIcons([...OgAssets!.icon])
        setImages([...OgAssets!.image])
    }

    const resetValue = (key: string, assetType: 'icon' | 'image'): void => {
        if (assetType === 'icon') {
            setIcons((prev) =>
                prev!.map((e) => (e.name === key ? { ...e, customPath: '', customBase64: '' } : e))
            )
        } else {
            setImages((prev) =>
                prev!.map((e) => (e.name === key ? { ...e, customPath: '', customBase64: '' } : e))
            )
        }
    }

    const setValue = async (assetName: string, assetType: 'icon' | 'image'): Promise<void> => {
        const res = await window.electronAPI.selectFile(filterType.ImgSvg)
        if (res.success) {
            const { filePath, base64, customMimeType } = res.data
            if (assetType === 'icon') {
                setIcons((prev) =>
                    prev!.map((e) =>
                        e.name === assetName
                            ? { ...e, customPath: filePath, customBase64: base64, customMimeType }
                            : e
                    )
                )
            } else {
                setImages((prev) =>
                    prev!.map((e) =>
                        e.name === assetName
                            ? { ...e, customPath: filePath, customBase64: base64, customMimeType }
                            : e
                    )
                )
            }
        }
    }

    //_-_-_-_-_-_-_- Drop _-_-_-_-_-_-_-
    const allowedExtensions = ['.svg', '.png', '.jpg', '.jpeg', '.webp', '.gif']

    const setValueFromDrop = async (
        f: File,
        key: string,
        assetType: 'icon' | 'image'
    ): Promise<void> => {
        const filePath = f.webkitRelativePath
        const base64 = (await fileToBase64(f)) as string
        const customMimeType = f.type

        if (assetType === 'icon') {
            setIcons((prev) =>
                prev!.map((e) =>
                    e.name === key
                        ? { ...e, customPath: filePath, customBase64: base64, customMimeType }
                        : e
                )
            )
        } else {
            setImages((prev) =>
                prev!.map((e) =>
                    e.name === key
                        ? { ...e, customPath: filePath, customBase64: base64, customMimeType }
                        : e
                )
            )
        }
    }

    return (
        <div className="screen-content">
            <div className="screen-header">
                <h1>
                    Iconos e imágenes
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

            <div className="assets-grid scrolleable">
                <div className="grid-divider">
                    <h3>Imagenes de feedback</h3>
                    <p>Imagenes ilustrativas para pantallas de información.</p>
                </div>

                {images?.map((image, i) => (
                    <DropZone
                        key={i}
                        fileHandler={(f) => setValueFromDrop(f as File, image.name, 'image')}
                        configuration={{ allowedExtensions }}
                    >
                        <IconCard
                            key={image.name}
                            icon={image}
                            setValue={(k: string) => setValue(k, 'image')}
                            resetValue={(k: string) => resetValue(k, 'image')}
                        />
                    </DropZone>
                ))}

                <div className="grid-divider">
                    <h3>Iconos</h3>
                    <p>Iconos que se utilizan en botones y elementos de la UI.</p>
                </div>

                {icons?.map((icon, i) => (
                    <DropZone
                        key={i}
                        fileHandler={(f) => setValueFromDrop(f as File, icon.name, 'icon')}
                        configuration={{ allowedExtensions }}
                    >
                        <IconCard
                            key={icon.name}
                            icon={icon}
                            setValue={(k: string) => setValue(k, 'icon')}
                            resetValue={(k: string) => resetValue(k, 'icon')}
                        />
                    </DropZone>
                ))}
            </div>
        </div>
    )
}

export default Icons
