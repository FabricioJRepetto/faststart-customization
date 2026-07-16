import { useState } from 'react'
import { assetName } from '@renderer/utils/assetsUtils'
import { AssetData } from '@shared/types'
import UploadSvg from '../../assets/upload.svg?react'
import ResetSvg from '../../assets/undo.svg?react'
import EyeSvg from '../../assets/eye.svg?react'
import Tooltip from '../Tooltip'

interface Props {
    bg: AssetData
    setValue: (v: string) => void
    resetValue: (v: string) => void
    id?: string
}

export const BackgroundCard = ({ bg, setValue, resetValue, id }: Props): React.JSX.Element => {
    const [showOriginal, setShowOriginal] = useState(false)

    return (
        <div
            id={id}
            key={bg.assetName}
            className={`assets-container bg-asset-container ${bg.custom.source ? 'asset-card-has-custom' : 'asset-card-initial'}`}
        >
            <div className="asset-card-header">
                <p>{assetName(bg.assetName)}</p>
                {bg.custom.source && bg.original.source && (
                    <Tooltip text="Ver fondo original">
                        <div
                            className="button asset-card-show-buton"
                            onMouseDown={() => setShowOriginal(true)}
                            onMouseUp={() => setShowOriginal(false)}
                        >
                            <EyeSvg />
                        </div>
                    </Tooltip>
                )}
            </div>

            <div className="bg-container asset-card-asset-trasition">
                {!bg.custom.source || showOriginal ? (
                    bg.original.source ? (
                        <img src={bg.original.source} />
                    ) : (
                        <div className="asset-placeholder">Sin definir</div>
                    )
                ) : (
                    <img src={bg.custom.source} />
                )}
            </div>

            <div className="actions">
                {bg.custom.source && (
                    <Tooltip text="Volver al fondo original">
                        <div className="button">
                            <a onClick={() => resetValue(bg.assetName)}>
                                <ResetSvg />
                            </a>
                        </div>
                    </Tooltip>
                )}

                <Tooltip text="Remplazar fondo">
                    <div className="button">
                        <a onClick={() => setValue(bg.assetName)}>
                            <UploadSvg />
                        </a>
                    </div>
                </Tooltip>
            </div>
        </div>
    )
}
