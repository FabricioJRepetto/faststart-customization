import { assetName } from '@renderer/utils/assetsUtils'
import { AssetsDataAtom, EditedAudiosDataAtom } from '@renderer/utils/context/context'
import { useAtom, useAtomValue } from 'jotai'
import ClearSvg from '../assets/clear.svg?react'
import ResetSvg from '../assets/cancel.svg?react'
import { filterType } from '@shared/types'

const Audio = (): React.JSX.Element => {
    const OgAssets = useAtomValue(AssetsDataAtom)
    const [audios, setAudios] = useAtom(EditedAudiosDataAtom)

    const resetAllValues = (): void => {
        setAudios([...OgAssets!.audio])
    }

    const resetValue = (key: string): void => {
        setAudios((prev) =>
            prev!.map((e) => (e.name === key ? { ...e, customPath: '', customBase64: '' } : e))
        )
    }

    const setValue = async (key: string): Promise<void> => {
        console.log(key)
        const res = await window.electronAPI.selectFile(filterType.Audio)
        console.log(res)

        if (res.success) {
            const { filePath, base64 } = res.data
            console.log(filePath)

            setAudios((prev) =>
                prev!.map((e) =>
                    e.name === key ? { ...e, customPath: filePath, customBase64: base64 } : e
                )
            )
        }
    }

    return (
        <div className="screen-content">
            <div className="screen-header">
                <h1>Audio</h1>
                <div className="actions">
                    <div className="action tertiary">
                        <a onClick={resetAllValues}>
                            <ClearSvg />
                            Resetear todo
                        </a>
                    </div>
                </div>
            </div>

            {audios?.length ? (
                <div className="assets-grid grid-audio scrolleable">
                    {audios.map((audio) => (
                        <div key={audio.name} className="assets-container audio-asset-container">
                            <p>{assetName(audio.name)}</p>
                            <audio src={audio.base64} controls />
                            {audio.customBase64 ? (
                                <audio src={audio.customBase64} controls />
                            ) : (
                                <div
                                    className="custom-placeholder"
                                    onClick={() => setValue(audio.name)}
                                >
                                    Seleccionar
                                </div>
                            )}
                            {audio.customBase64 && (
                                <ResetSvg
                                    className="audio-reset-btn"
                                    onClick={() => resetValue(audio.name)}
                                />
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <h2>No audios</h2>
            )}
        </div>
    )
}
export default Audio
