import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import Versions from '../components/Versions'
import NATL from '../assets/NATL-logo.svg?react'
import {
    CurrentScreenAtom,
    ServerStatusAtom
} from '@renderer/utils/context/context'
import { Screens } from '@shared/types'
import { BACKEND_BASE_URL, WS_BASE_URL } from '../../../../shared/CONSTANTS'
import SpinnerSvg from '../assets/spinner.svg?react'
import { remoteBootSequence } from '@renderer/utils/bootSequence'
import RemoteSvg from '../assets/wifi.svg?react'
import { delay } from '@renderer/utils/delays'
import WSService from '@renderer/utils/controllers/WebSocketService/WebSocketServiceController'

const Landing = (): React.JSX.Element => {
    const setScreen = useSetAtom(CurrentScreenAtom)
    const [serverStatus, setStatus] = useAtom(ServerStatusAtom)
    const WsStatus = useAtomValue(ServerStatusAtom)

    const [fadeout, setFadeout] = useState(false)

    const [loading, setLoading] = useState(false)

    const ping = async (r: number = 0): Promise<boolean> => {
        const retries = r
        setStatus(undefined)

        const res = await fetch(BACKEND_BASE_URL+ '/ping', {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-cache'
        })
            .then(() => true)
            .catch(() => false)

        if (res) {
            setStatus(true)
            setLoading(false)
            return true
        } else {
            console.debug('retry =', retries)
            if (retries === 0) {
                console.debug('stop pings')
                setLoading(false)
                setStatus(false)
                return false
            }
            await delay(5000)
            return await ping(r - 1)
        }
    }

    useEffect(() => {
        ping(5)
        WSService.init(WS_BASE_URL, 'ƒAB')
        // eslint-disable-next-line
    }, [])

    const remoteStartUp = async (): Promise<void> => {
        setLoading(true)

        if (!WsStatus) WSService.init(WS_BASE_URL, 'ƒAB')

        if (serverStatus === false) {
            const res = await ping()
            if (!res) return
        }

        const start = performance.now()
        try {
            await remoteBootSequence()

            setFadeout(true)
            await delay(500)
            setScreen(Screens.main)
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
                <h1 style={{display: 'flex', justifyContent: 'center'}}>
                    <code style={{ background: 'none', fontSize: '4rem' }}>ƒ</code>
                    <p
                        style={{
                            fontSize: '3.25rem',
                            marginTop: '3px',
                            fontWeight: '550'
                        }}
                    >
                        luid✦
                    </p>
                </h1>
                <div className="text">
                    <span className="gradient-text">Flow Logic UI Designer</span>
                </div>
            </div>

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

            <Versions></Versions>
        </div>
    )
}

export default Landing
