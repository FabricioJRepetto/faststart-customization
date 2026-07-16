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
            setIcons((prev) => prev!.map((e) => (e.assetName === key ? { ...e, custom: {} } : e)))
        } else {
            setImages((prev) => prev!.map((e) => (e.assetName === key ? { ...e, custom: {} } : e)))
        }
    }

    const setValue = async (assetName: string, assetType: 'icon' | 'image'): Promise<void> => {
        const res = await window.electronAPI.selectFile(filterType.ImgSvg)
        if (res.success) {
            const { fileName, base64, customMimeType } = res.data

            if (assetType === 'icon') {
                setIcons((prev) =>
                    prev!.map((e) =>
                        e.assetName === assetName
                            ? {
                                  ...e,
                                  custom: {
                                      source: base64,
                                      mime: customMimeType,
                                      fileName: fileName
                                  }
                              }
                            : e
                    )
                )
            } else {
                setImages((prev) =>
                    prev!.map((e) =>
                        e.assetName === assetName
                            ? {
                                  ...e,
                                  custom: {
                                      source: base64,
                                      mime: customMimeType,
                                      fileName: fileName
                                  }
                              }
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
        const base64 = (await fileToBase64(f)) as string
        console.log(f)

        if (assetType === 'icon') {
            setIcons((prev) =>
                prev!.map((e) =>
                    e.assetName === key
                        ? { ...e, custom: { source: base64, mime: f.type, fileName: f.name } }
                        : e
                )
            )
        } else {
            setImages((prev) =>
                prev!.map((e) =>
                    e.assetName === key
                        ? { ...e, custom: { source: base64, mime: f.type, fileName: f.name } }
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
                        fileHandler={(f) => setValueFromDrop(f as File, image.assetName, 'image')}
                        configuration={{ allowedExtensions }}
                    >
                        <IconCard
                            key={image.assetName}
                            id={'images-editor-' + image.assetName.toLowerCase()}
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
                        fileHandler={(f) => setValueFromDrop(f as File, icon.assetName, 'icon')}
                        configuration={{ allowedExtensions }}
                    >
                        <IconCard
                            key={icon.assetName}
                            id={'icons-editor-' + icon.assetName.toLowerCase()}
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
