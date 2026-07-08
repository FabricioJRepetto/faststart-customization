import { assetName } from '@renderer/utils/assetsUtils'
import { AssetData, DistributionMethod } from '@shared/types'
import { useState } from 'react'
import ResetSvg from '../../assets/trash.svg?react'
import AddSvg from '../../assets/add.svg?react'
import { DistributionMethodAtom } from '@renderer/utils/context/context'
import { useAtomValue } from 'jotai'
import Tooltip from '../Tooltip'

interface AddNewProps {
    addNew: () => void
}
export const AddNewAsset = ({ addNew }: AddNewProps): React.JSX.Element => {
    return (
        <div className="assets-container thirdscreen-add-new-container">
            <div className="thirdscreen-add-new-button" onClick={addNew}>
                <AddSvg />
                Agregar elemento
            </div>
        </div>
    )
}

interface NewProps {
    data: AssetData
    deleteValue: (v: string) => void
}
export const NewAssetCard = ({ data, deleteValue }: NewProps): React.JSX.Element => {
    const [loaded, setLoaded] = useState<boolean>(false)

    return (
        <div
            key={data.name}
            className="assets-container thirdscreen-asset-container asset-card-has-custom"
        >
            <div className="asset-card-header third-new-asset">
                <p>{assetName(data.name)}</p>

                <Tooltip text="Borrar elemento">
                    <span className="button delete-buton" onClick={() => deleteValue(data.name)}>
                        <ResetSvg />
                    </span>
                </Tooltip>
            </div>
            <div className="custom-thirscreen-container">
                {data.customMimeType.match('video') ? (
                    <video
                        src={data.customBase64}
                        width={350}
                        muted
                        autoPlay
                        loop
                        className={loaded ? 'fade-in' : ''}
                        onLoadedData={() => setLoaded(true)}
                    />
                ) : (
                    <img src={data.customBase64} className={'fade-in'} />
                )}
            </div>
        </div>
    )
}

export const ThirdCard = ({ data, deleteValue }: NewProps): React.JSX.Element => {
    const [loaded, setLoaded] = useState<boolean>(false)
    const isRemote = useAtomValue(DistributionMethodAtom) === DistributionMethod.REMOTE

    return (
        <div key={data.name} className="assets-container thirdscreen-asset-container">
            <div className="asset-card-header">
                <p>{assetName(data.name)}</p>

                <Tooltip text="Borrar elemento">
                    <span className="button delete-buton" onClick={() => deleteValue(data.name)}>
                        <ResetSvg />
                    </span>
                </Tooltip>
            </div>

            <div className="custom-thirscreen-container">
                {data.mimeType.match('video') ? (
                    <video
                        src={isRemote ? data.blobUrl : data.base64}
                        width={350}
                        muted
                        autoPlay
                        loop
                        className={loaded ? 'fade-in' : ''}
                        onLoadedData={() => setLoaded(true)}
                    />
                ) : (
                    <img
                        src={data.base64}
                        onLoad={() => setLoaded(true)}
                        className={loaded ? 'fade-in' : ''}
                    />
                )}
            </div>
        </div>
    )
}
