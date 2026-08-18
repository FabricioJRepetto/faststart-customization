import { AssetData } from '@renderer/types/types.d'
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
            key={audio.assetName}
            className={`assets-container audio-asset-container ${audio.custom.source ? 'asset-card-has-custom' : 'asset-card-initial'}`}
        >
            <div className="asset-card-header">
                <p>{audio.assetName.split('_')[1]}</p>
            </div>

            {!audio.custom.source ? (
                audio?.original?.source ? (
                    <audio src={audio.original.source} controls />
                ) : (
                    <div className="asset-placeholder">Sin definir</div>
                )
            ) : (
                <audio src={audio.custom.source} controls />
            )}

            <div className="actions">
                {audio.custom.source && (
                    <Tooltip text="Volver al audio original">
                        <div className="button">
                            <a onClick={() => resetValue(audio.assetName)}>
                                <ResetSvg />
                            </a>
                        </div>
                    </Tooltip>
                )}

                <Tooltip text="Remplazar audio">
                    <div className="button">
                        <a onClick={() => setValue(audio.assetName)}>
                            <UploadSvg />
                        </a>
                    </div>
                </Tooltip>
            </div>
        </div>
    )
}
export default AudioCard
