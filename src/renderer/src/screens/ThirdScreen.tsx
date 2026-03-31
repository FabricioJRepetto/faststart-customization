import { assetName } from '@renderer/utils/assetName'
import { AssetsDataAtom } from '@renderer/utils/context/context'
import { useAtom } from 'jotai'
import { useState } from 'react'

const ThirdScreen = (): React.JSX.Element => {
    const [assets, setAssets] = useAtom(AssetsDataAtom)
    const [asset, setAsset] = useState([...assets!.thirdscreen])

    const [loaded, setLoaded] = useState<boolean>(false)

    return (
        <div className="screen-content">
            <div>ThirdScreen</div>

            {asset.map((e, i) => (
                <div key={e.name + '_' + i} className="thirscreen-asset-container">
                    {e.mimeType.match('video') ? (
                        <video
                            src={e.base64}
                            width={350}
                            muted
                            autoPlay
                            loop
                            onLoadedData={() => setLoaded(true)}
                            className={loaded ? 'fade-in' : ''}
                        />
                    ) : (
                        <img src={e.base64} />
                    )}
                    <p>{assetName(e.name)}</p>
                </div>
            ))}
        </div>
    )
}
export default ThirdScreen
