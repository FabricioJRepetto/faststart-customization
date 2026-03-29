import { assetName } from '@renderer/utils/assetName'
import { AssetsDataAtom } from '@renderer/utils/context/context'
import { useAtom } from 'jotai'
import { useState } from 'react'

const Audio = (): React.JSX.Element => {
    const [assets, setAssets] = useAtom(AssetsDataAtom)
    const [asset, setAsset] = useState([...assets!.audio])

    return (
        <>
            <h1>Audio</h1>
            {asset.map((audio, i) => (
                <div key={audio.name + '_' + i} className="audio-asset-container">
                    <p>{assetName(audio.name)}</p>
                    <audio src={audio.base64} controls />

                    <div className="actions">
                        <div className="action primary">
                            <a onClick={() => {}}>Seleccionar nuevo</a>
                        </div>
                        <div className="action">
                            <a onClick={() => {}}>Resetear</a>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}
export default Audio
