import { assetName } from '@renderer/utils/assetsUtils'
import { AssetData } from '@shared/types'
import { useState } from 'react'
import ResetSvg from '../assets/trash.svg?react'
import AddSvg from '../assets/add.svg?react'

interface CardProps {
    data: AssetData
    setValue: (v: string) => void
    resetValue: (v: string) => void
}

export const ThirdCard = ({ data, setValue, resetValue }: CardProps): React.JSX.Element => {
    const [loaded, setLoaded] = useState<boolean>(false)

    return (
        <div key={data.name} className="assets-container thirdscreen-asset-container">
            <p>{assetName(data.name)}</p>

            <div className="thirdscreen-container">
                {data?.base64 ? (
                    data.mimeType.match('video') ? (
                        <video
                            src={data.base64}
                            muted
                            autoPlay
                            loop
                            onLoadedData={() => setLoaded(true)}
                            className={loaded ? 'fade-in' : ''}
                        />
                    ) : (
                        <img src={data.base64} />
                    )
                ) : null}
            </div>

            {data.customBase64 ? (
                <div className="custom-thirscreen-container">
                    {data.customMimeType.match('video') ? (
                        <video
                            src={data.customBase64}
                            muted
                            autoPlay
                            loop
                            className={'fade-in'}
                        />
                    ) : (
                        <img src={data.customBase64} />
                    )}

                    <span className="button delete-buton" onClick={() => resetValue(data.name)}>
                        <ResetSvg />
                    </span>
                </div>
            ) : (
                <div className="thirdscreen-placeholder" onClick={() => setValue(data.name)}>
                    <p>Cambiar</p>
                </div>
            )}
        </div>
    )
}

interface AddNewProps {
    addNew: () => void
}
export const AddNewAsset = ({ addNew }: AddNewProps): React.JSX.Element => {
    return (
        <div className="assets-container thirdscreen-add-new-container">
            <div className="thirdscreen-add-new-button" onClick={addNew}>
                <AddSvg />
                Agregar nuevo
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
        <div key={data.name} className="assets-container thirdscreen-asset-container">
            <p>{assetName(data.name)}</p>
            <div>
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
                        <img src={data.customBase64} />
                    )}

                    <span className="button delete-buton" onClick={() => deleteValue(data.name)}>
                        <ResetSvg />
                    </span>
                </div>
            </div>
        </div>
    )
}
