import { useState } from 'react'
import { assetName } from '@renderer/utils/assetsUtils'
import { AssetData } from '@shared/types'
import UploadSvg from '../../assets/upload.svg?react'
import ResetSvg from '../../assets/undo.svg?react'
import EyeSvg from '../../assets/eye.svg?react'
import { currentIcon, defaultIcon } from '@renderer/utils/currentIcon'
import Tooltip from '../Tooltip'

interface Props {
    icon: AssetData
    setValue: (v: string) => void
    resetValue: (v: string) => void
    id?: string
}

export const IconCard = ({ icon, setValue, resetValue, id }: Props): React.JSX.Element => {
    const [showOriginal, setShowOriginal] = useState(false)

    return (
        <div
            key={icon.assetName}
            id={id}
            className={`assets-container icon-asset-container ${icon.custom.source ? 'asset-card-has-custom' : 'asset-card-initial'}`}
        >
            <div className="asset-card-header">
                <p>{assetName(icon.assetName)}</p>
                {icon.custom.source && icon.original.source && (
                    <Tooltip text="Ver icono original">
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

            <div className="icons-container">
                {!icon.custom.source || showOriginal ? (
                    icon.original.source ? (
                        defaultIcon(icon.assetName)
                    ) : (
                        <div className="asset-placeholder">Sin definir</div>
                    )
                ) : (
                    currentIcon(icon.assetName)
                )}
            </div>

            <div className="actions">
                {icon.custom.source && (
                    <Tooltip text="Volver al icono original">
                        <div className="button">
                            <a onClick={() => resetValue(icon.assetName)}>
                                <ResetSvg />
                            </a>
                        </div>
                    </Tooltip>
                )}

                <Tooltip text="Remplazar icono">
                    <div className="button">
                        <a onClick={() => setValue(icon.assetName)}>
                            <UploadSvg />
                        </a>
                    </div>
                </Tooltip>
            </div>
        </div>
    )
}
