import { useAtom, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import Versions from '../components/Versions'
import NATL from '../assets/NATL-logo.svg?react'
import {
    CurrentScreenAtom,
    DistributionMethodAtom,
    ServerStatusAtom
} from '@renderer/utils/context/context'
import { DistributionMethod, Screens } from '@shared/types'
import { BACKEND_BASE_URL } from '../../../../shared/CONSTANTS'
import SpinnerSvg from '../assets/spinner.svg?react'
import { remoteBootSequence } from '@renderer/utils/bootSequence'
import RemoteSvg from '../assets/wifi.svg?react'
import { delay } from '@renderer/utils/delays'

const Landing = (): React.JSX.Element => {
    const setScreen = useSetAtom(CurrentScreenAtom)
    const [serverStatus, setStatus] = useAtom(ServerStatusAtom)

    const [method, setMethod] = useAtom(DistributionMethodAtom)
    const [fadeout, setFadeout] = useState(false)

    const [loading, setLoading] = useState(false)

    let _to: NodeJS.Timeout
    const ping = (r: number = 0): void => {
        const retries = r
        setStatus(undefined)
        fetch(BACKEND_BASE_URL, {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-cache'
        })
            .then(() => setStatus(true))
            .catch(() => {
                console.debug('retry =', retries)
                if (retries === 0) {
                    console.debug('stop pings')
                    setLoading(false)
                    setStatus(false)
                    return
                }
                clearTimeout(_to)
                _to = setTimeout(() => {
                    ping(r - 1)
                }, 5000)
            })
    }

    useEffect(() => {
        ping(5)
        return () => clearTimeout(_to)
    }, [setStatus])

    const remoteStartUp = async (): Promise<void> => {
        setLoading(true)

        if (serverStatus === false) {
            ping()
            return
        }

        const start = performance.now()
        try {
            await remoteBootSequence()

            setFadeout(true)
            await delay(500)
            setScreen(Screens.main)
            setMethod(DistributionMethod.REMOTE)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
            console.log(
                `# Remote Start Sequence finished in ${Math.floor(performance.now() - start)}ms`
            )
        }
    }

    return (
        <div
            className={`landing-screen ${fadeout ? 'fade-out' : ''}`}
            style={{ paddingTop: '158px' }}
        >
            <NATL className={`logo ${loading ? 'logo-loading logo-loading-position' : ''}`} />
            <div className={`creator ${loading ? 'fade-out' : ''}`}>Versión de escritorio</div>
            <div className={`text ${loading ? 'fade-out' : ''}`}>
                Administración Rápida de Customizaciones
                <div className="text">
                    para <span className="gradient-text">FastStart</span>
                </div>
            </div>

            {!method && (
                <div className={`${loading ? 'fade-out' : ''}`}>
                    <div className="actions landing-buttons">
                        <div
                            className={serverStatus ? 'action primary waiter' : 'action waiter'}
                            style={{
                                pointerEvents: serverStatus !== undefined ? 'all' : 'none',
                                opacity: serverStatus !== undefined ? '1' : '0.5'
                            }}
                        >
                            <a target="_blank" rel="noreferrer" onClick={remoteStartUp}>
                                {loading && <SpinnerSvg className="spinner" />}
                                <span style={{ opacity: loading ? '0' : 'unset' }}>
                                    <RemoteSvg /> Conectar
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            )}

            <Versions></Versions>
        </div>
    )
}

export default Landing
