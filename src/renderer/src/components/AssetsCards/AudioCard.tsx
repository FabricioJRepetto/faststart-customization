import { AssetData } from '@shared/types'
import ResetSvg from '../../assets/undo.svg?react'
import UploadSvg from '../../assets/upload.svg?react'
import Tooltip from '../Tooltip'

interface Props {
    audio: AssetData
    setValue: (v: string) => void
    resetValue: (v: string) => void
}

const AudioCard = ({ audio, setValue, resetValue }: Props): React.JSX.Element => {
    return (
        <div
            key={audio.name}
            className={`assets-container audio-asset-container ${audio.customBase64 ? 'asset-card-has-custom' : 'asset-card-initial'}`}
        >
            <div className="asset-card-header">
                <p>{audio.name.split('_')[1]}</p>
            </div>

            {!audio.customBase64 ? (
                audio?.blobUrl ? (
                    <audio src={audio.blobUrl} controls />
                ) : (
                    <div className="asset-placeholder">Sin definir</div>
                )
            ) : (
                <audio src={audio.customBase64} controls />
            )}

            <div className="actions">
                {audio.customBase64 && (
                    <Tooltip text="Volver al audio original">
                        <div className="button">
                            <a onClick={() => resetValue(audio.name)}>
                                <ResetSvg />
                            </a>
                        </div>
                    </Tooltip>
                )}

                <Tooltip text="Remplazar audio">
                    <div className="button">
                        <a onClick={() => setValue(audio.name)}>
                            <UploadSvg />
                        </a>
                    </div>
                </Tooltip>
            </div>
        </div>
    )
}
export default AudioCard
