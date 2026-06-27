import { useEffect, useState } from 'react'
import { assetName } from '@renderer/utils/assetsUtils'
import { EditedBackgroundsDataAtom } from '@renderer/utils/context/context'
import { AssetData } from '@shared/types'
import { useAtomValue } from 'jotai'
import UploadSvg from '../assets/upload.svg?react'
import ResetSvg from '../assets/trash.svg?react'
import EyeSvg from '../assets/eye.svg?react'
import Tooltip from './Tooltip'

interface Props {
    bg: AssetData
    setValue: (v: string) => void
    resetValue: (v: string) => void
}

export const BackgroundCard = ({ bg, setValue, resetValue }: Props): React.JSX.Element => {
    const backgrounds = useAtomValue(EditedBackgroundsDataAtom)
    const [showOriginal, setShowOriginal] = useState(false)
    const [hasCustom, setHasCustom] = useState<boolean>(false)

    useEffect(() => {
        const f = (): void => {
            setHasCustom(() => Boolean(backgrounds?.find((e) => e.name === bg.name)?.customBase64))
        }
        f()
    }, [bg.name, backgrounds])

    return (
        <div
            key={bg.name}
            className={`assets-container bg-asset-container ${hasCustom ? 'asset-card-has-custom' : 'asset-card-initial'}`}
        >
            <div className="asset-card-header">
                <p>{assetName(bg.name)}</p>
                {hasCustom && (
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
                {!hasCustom || showOriginal ? (
                    <img src={bg.base64} />
                ) : (
                    <img src={bg.customBase64} />
                )}
            </div>

            <div className="actions">
                {hasCustom && (
                    <Tooltip text="Volver al fondo original">
                        <div className="button delete-buton">
                            <a onClick={() => resetValue(bg.name)}>
                                <ResetSvg />
                            </a>
                        </div>
                    </Tooltip>
                )}

                <Tooltip text="Remplazar fondo">
                    <div className="button delete-buton">
                        <a onClick={() => setValue(bg.name)}>
                            <UploadSvg />
                        </a>
                    </div>
                </Tooltip>
            </div>
        </div>
    )
}
