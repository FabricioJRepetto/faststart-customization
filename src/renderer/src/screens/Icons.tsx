import { assetName } from '@renderer/utils/assetName'
import { AssetsDataAtom } from '@renderer/utils/context/context'
import { useAtom } from 'jotai'
import { useState } from 'react'

const Icons = (): React.JSX.Element => {
    const [assets, setAssets] = useAtom(AssetsDataAtom)
    const [icons, setIcons] = useState([...assets!.icon])

    return (
        <div className="screen-content">
            <h1>Icons</h1>
            <ul>
                <li>logo</li>
                <li>bills</li>
                <li>exchange</li>
                <li>left_arrow</li>
                <li>right_arrow</li>
                <li>back</li>
                <li>world</li>
            </ul>
            {icons.map((icon, i) => (
                <div key={icon.name + '_' + i}>
                    <img src={icon.base64} />
                    <p>{assetName(icon.name)}</p>
                </div>
            ))}
        </div>
    )
}

export default Icons
