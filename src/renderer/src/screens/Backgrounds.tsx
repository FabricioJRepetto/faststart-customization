import { assetName } from '@renderer/utils/assetName'
import { AssetsDataAtom } from '@renderer/utils/context/context'
import { useAtom } from 'jotai'
import { useState } from 'react'

const Backgrounds = (): React.JSX.Element => {
    const [assets, setAssets] = useAtom(AssetsDataAtom)
    const [background, setBackground] = useState([...assets!.background])

    return (
        <div className="screen-content">
            <h1>Backgrounds</h1>
            <ul>
                <li>idle</li>
                <li>user_action</li>
                <li>info</li>
                <li>supervisor</li>
                <li>out_of_service</li>
            </ul>
            {background.map((bg, i) => (
                <div key={bg.name + '_' + i} className="bg-asset-container">
                    <img src={bg.base64} />
                    <p>{assetName(bg.name)}</p>
                </div>
            ))}
        </div>
    )
}

export default Backgrounds
