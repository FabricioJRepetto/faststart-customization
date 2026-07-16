import { EditedAudiosDataAtom, TemplateConfigAtom } from '@renderer/utils/context/context'
import { useAtom, useAtomValue } from 'jotai'
import ClearSvg from '../assets/clear.svg?react'
import { filterType } from '@shared/types'
import Tooltip from '@renderer/components/Tooltip'
import DropZone from '@renderer/components/DropZone'
import AudioCard from '@renderer/components/AssetsCards/AudioCard'
import { fileToBase64 } from '@renderer/utils/filesManager'

const Audio = (): React.JSX.Element => {
    const OgAssets = useAtomValue(TemplateConfigAtom)
    const [audios, setAudios] = useAtom(EditedAudiosDataAtom)

    const resetAllValues = (): void => {
        setAudios([...OgAssets!.audio])
    }

    const resetValue = (key: string): void => {
        setAudios((prev) => prev!.map((e) => (e.assetName === key ? { ...e, custom: {} } : e)))
    }

    const setValue = async (key: string): Promise<void> => {
        const res = await window.electronAPI.selectFile(filterType.Audio)
        if (res.success) {
            const { fileName, base64, customMimeType } = res.data
            setAudios((prev) =>
                prev!.map((e) =>
                    e.assetName === key
                        ? { ...e, custom: { source: base64, mime: customMimeType, fileName } }
                        : e
                )
            )
        }
    }

    const allowedExtensions = ['.mp3', '.wav', '.ogg']

    const setDropedValue = async (f: File, key: string): Promise<void> => {
        const base64 = (await fileToBase64(f)) as string

        setAudios((prev) =>
            prev!.map((e) =>
                e.assetName === key
                    ? { ...e, custom: { source: base64, mime: f.type, fileName: f.name } }
                    : e
            )
        )
    }

    return (
        <div className="screen-content">
            <div className="screen-header">
                <h1>
                    Audios
                    <Tooltip
                        text={'Sonidos que se reproducen ante distintos eventos de la aplicación.'}
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

            <div className="assets-grid grid-audio scrolleable">
                {audios?.map((audio) => (
                    <DropZone
                        key={audio.assetName}
                        fileHandler={(f: File) => setDropedValue(f, audio.assetName)}
                        configuration={{ allowedExtensions }}
                    >
                        <AudioCard audio={audio} setValue={setValue} resetValue={resetValue} />
                    </DropZone>
                ))}
            </div>
        </div>
    )
}
export default Audio
