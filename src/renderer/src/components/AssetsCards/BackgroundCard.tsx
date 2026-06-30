import { useState } from 'react'
import { assetName } from '@renderer/utils/assetsUtils'
import { AssetData, DistributionMethod } from '@shared/types'
import UploadSvg from '../../assets/upload.svg?react'
import ResetSvg from '../../assets/undo.svg?react'
import EyeSvg from '../../assets/eye.svg?react'
import Tooltip from '../Tooltip'
import { useAtomValue } from 'jotai'
import { DistributionMethodAtom } from '@renderer/utils/context/context'

interface Props {
    bg: AssetData
    setValue: (v: string) => void
    resetValue: (v: string) => void
}

export const BackgroundCard = ({ bg, setValue, resetValue }: Props): React.JSX.Element => {
    const [showOriginal, setShowOriginal] = useState(false)
    const isRemote = useAtomValue(DistributionMethodAtom) === DistributionMethod.REMOTE

    return (
        <div
            key={bg.name}
            className={`assets-container bg-asset-container ${bg.customBase64 ? 'asset-card-has-custom' : 'asset-card-initial'}`}
        >
            <div className="asset-card-header">
                <p>{assetName(bg.name)}</p>
                {bg.customBase64 && (
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
                {!bg.customBase64 || showOriginal ? (
                    <img src={isRemote ? bg.blobUrl : bg.base64} />
                ) : (
                    <img src={bg.customBase64} />
                )}
            </div>

            <div className="actions">
                {bg.customBase64 && (
                    <Tooltip text="Volver al fondo original">
                        <div className="button">
                            <a onClick={() => resetValue(bg.name)}>
                                <ResetSvg />
                            </a>
                        </div>
                    </Tooltip>
                )}

                <Tooltip text="Remplazar fondo">
                    <div className="button">
                        <a onClick={() => setValue(bg.name)}>
                            <UploadSvg />
                        </a>
                    </div>
                </Tooltip>
            </div>
        </div>
    )
}
