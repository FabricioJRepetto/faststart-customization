import { useEffect, useState } from 'react'
import { assetName } from '@renderer/utils/assetsUtils'
import { EditedIconsDataAtom } from '@renderer/utils/context/context'
import { AssetData } from '@shared/types'
import { useAtomValue } from 'jotai'
import UploadSvg from '../assets/upload.svg?react'
import ResetSvg from '../assets/trash.svg?react'
import EyeSvg from '../assets/eye.svg?react'
import { currentIcon, defaultIcon } from '@renderer/utils/currentIcon'
import Tooltip from './Tooltip'

interface Props {
    icon: AssetData
    setValue: (v: string) => void
    resetValue: (v: string) => void
}

export const IconCard = ({ icon, setValue, resetValue }: Props): React.JSX.Element => {
    const icons = useAtomValue(EditedIconsDataAtom)
    const [showOriginal, setShowOriginal] = useState(false)
    const [hasCustom, setHasCustom] = useState<boolean>(false)

    useEffect(() => {
        const f = (): void => {
            setHasCustom(() => Boolean(icons?.find((e) => e.name === icon.name)?.customBase64))
        }
        f()
    }, [icon.name, icons])

    return (
        <div
            key={icon.name}
            className={`assets-container icon-asset-container ${hasCustom ? 'asset-card-has-custom' : 'asset-card-initial'}`}
        >
            <div className="asset-card-header">
                <p>{assetName(icon.name)}</p>
                {hasCustom && (
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
                {!hasCustom || showOriginal ? defaultIcon(icon.name) : currentIcon(icon.name)}
            </div>

            <div className="actions">
                {hasCustom && (
                    <Tooltip text="Volver al icono original">
                        <div className="button delete-buton">
                            <a onClick={() => resetValue(icon.name)}>
                                <ResetSvg />
                            </a>
                        </div>
                    </Tooltip>
                )}

                <Tooltip text="Remplazar icono">
                    <div className="button delete-buton">
                        <a onClick={() => setValue(icon.name)}>
                            <UploadSvg />
                        </a>
                    </div>
                </Tooltip>
            </div>
        </div>
    )
}
