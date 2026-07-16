import { assetName } from '@renderer/utils/assetsUtils'
import { AssetData } from '@shared/types'
import { useState } from 'react'
import ResetSvg from '../../assets/trash.svg?react'
import AddSvg from '../../assets/add.svg?react'
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
            key={data.assetName}
            className="assets-container thirdscreen-asset-container asset-card-has-custom"
        >
            <div className="asset-card-header third-new-asset">
                <p>{assetName(data.assetName)}</p>

                <Tooltip text="Borrar elemento">
                    <span
                        className="button delete-buton"
                        onClick={() => deleteValue(data.assetName)}
                    >
                        <ResetSvg />
                    </span>
                </Tooltip>
            </div>
            <div className="custom-thirscreen-container">
                {data.custom.mime?.match('video') ? (
                    <video
                        src={data.custom.source}
                        width={350}
                        muted
                        autoPlay
                        loop
                        className={loaded ? 'fade-in' : ''}
                        onLoadedData={() => setLoaded(true)}
                    />
                ) : (
                    <img src={data.custom.source} className={'fade-in'} />
                )}
            </div>
        </div>
    )
}

export const ThirdCard = ({ data, deleteValue }: NewProps): React.JSX.Element => {
    const [loaded, setLoaded] = useState<boolean>(false)

    return (
        <div key={data.assetName} className="assets-container thirdscreen-asset-container">
            <div className="asset-card-header">
                <p>{assetName(data.assetName)}</p>

                <Tooltip text="Borrar elemento">
                    <span
                        className="button delete-buton"
                        onClick={() => deleteValue(data.assetName)}
                    >
                        <ResetSvg />
                    </span>
                </Tooltip>
            </div>

            <div className="custom-thirscreen-container">
                {data.original.mime?.match('video') ? (
                    <video
                        src={data.original.source}
                        width={350}
                        muted
                        autoPlay
                        loop
                        className={loaded ? 'fade-in' : ''}
                        onLoadedData={() => setLoaded(true)}
                    />
                ) : (
                    <img
                        src={data.original.source}
                        onLoad={() => setLoaded(true)}
                        className={loaded ? 'fade-in' : ''}
                    />
                )}
            </div>
        </div>
    )
}
