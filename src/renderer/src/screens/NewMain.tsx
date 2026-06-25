import { CustomEnabledAtom } from '@renderer/utils/context/context'
import { useAtom } from 'jotai'
import { useState } from 'react'
import SpinnerSvg from '../assets/spinner.svg?react'
import PowerSvg from '../assets/powerb.svg?react'
import RemotePill from '@renderer/components/RemotePill'

const NewMain = (): React.JSX.Element => {
    // const isRemote = useAtomValue(DistributionMethodAtom) === DistributionMethod.REMOTE
    const [customEnabled, setCustomEnabled] = useAtom(CustomEnabledAtom)
    const [loading, setLoading] = useState<boolean>(false)

    return (
        <div className={`screen-content main-screen-container`}>
            <div className="screen-header">
                <h1>FabStart</h1>
                <div className="toggler">
                    <div className="input-wrapper" onClick={() => null}>
                        Customización
                        <button className={customEnabled ? '' : 'power-off'}>
                            {loading ? <SpinnerSvg className="spinner" /> : <PowerSvg />}
                        </button>
                    </div>
                </div>
            </div>

            <p>Terminales</p>
            <div className="card-row-container">
                {[
                    { name: 'FastStart', ip: '192.0.170.1', status: 'online' },
                    { name: 'VIP', ip: '192.0.170.2', status: 'undefined' },
                    { name: 'BBVA', ip: '192.0.170.3', status: 'offline' },
                    { name: 'BNA', ip: '192.0.170.4', status: 'offline' },
                    { name: 'BNA', ip: '192.0.170.4', status: 'offline' },
                    { name: 'Galicia', ip: '192.0.170.5', status: 'offline' }
                ].map((e, i) => (
                    <div className="assets-container" key={i}>
                        <p>{e.name}</p>
                        <p>{e.ip}</p>
                        <p>{e.status}</p>
                    </div>
                ))}
            </div>

            <p>Temas</p>
            <div className="card-row-container">
                {[
                    { name: 'FastStart', logo: 'isDefault', status: 'active' },
                    { name: 'VIP', logo: 'notDefault', status: 'active' },
                    { name: 'BBVA', logo: 'notDefault', status: 'active' },
                    { name: 'BNA', logo: 'notDefault', status: 'active' },
                    { name: 'BNA', logo: 'notDefault', status: 'active' },
                    { name: 'Galicia', logo: 'notDefault', status: 'active' }
                ].map((e, i) => (
                    <div className="assets-container" key={i}>
                        <p>{e.name}</p>
                        <p>{e.logo}</p>
                        <p>{e.status}</p>
                    </div>
                ))}
            </div>

            <div></div>

            <RemotePill />
        </div>
    )
}
export default NewMain
