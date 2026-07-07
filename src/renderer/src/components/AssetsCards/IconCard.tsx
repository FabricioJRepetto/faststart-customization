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
}

export const IconCard = ({ icon, setValue, resetValue }: Props): React.JSX.Element => {
    const [showOriginal, setShowOriginal] = useState(false)

    return (
        <div
            key={icon.name}
            className={`assets-container icon-asset-container ${icon.customBase64 ? 'asset-card-has-custom' : 'asset-card-initial'}`}
        >
            <div className="asset-card-header">
                <p>{assetName(icon.name)}</p>
                {icon.customBase64 && icon.mimeType && (
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
                {!icon.customBase64 || showOriginal
                    ? defaultIcon(icon.name)
                    : currentIcon(icon.name)}
            </div>

            <div className="actions">
                {icon.customBase64 && (
                    <Tooltip text="Volver al icono original">
                        <div className="button">
                            <a onClick={() => resetValue(icon.name)}>
                                <ResetSvg />
                            </a>
                        </div>
                    </Tooltip>
                )}

                <Tooltip text="Remplazar icono">
                    <div className="button">
                        <a onClick={() => setValue(icon.name)}>
                            <UploadSvg />
                        </a>
                    </div>
                </Tooltip>
            </div>
        </div>
    )
}
