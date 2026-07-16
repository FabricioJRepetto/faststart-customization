import {
    CurrentScreenAtom,
    CustomEnabledAtom,
    FirstLoadAtom,
    ServerStatusAtom,
    store,
    TerminalsStatusAtom,
    ThemesLibraryDataAtom,
    WebSocketStatusAtom
} from '@renderer/utils/context/context'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import SpinnerSvg from '../assets/spinner.svg?react'
import NewSvg from '../assets/theme.svg?react'
import FilesSvg from '../assets/folder_management.svg?react'
import GearSvg from '../assets/gear.svg?react'
import TestSvg from '../assets/test.svg?react'
import ExitSvg from '../assets/logout.svg?react'
import PowerSvg from '../assets/powerb.svg?react'
import mediaServiceController from '@renderer/utils/controllers/mediaServer/mediaServiceController'
import { Screens, WSMessage } from '@shared/types'
import DynamicSvg from '@renderer/components/DynSvg'
import { reset } from '@renderer/utils/reset'
import { WS_BASE_URL } from '@shared/CONSTANTS'

const NewMain = (): React.JSX.Element => {
    const ServerStatus = useAtomValue(ServerStatusAtom)
    const WsStatus = useAtomValue(WebSocketStatusAtom)
    const terminals = useAtomValue(TerminalsStatusAtom)
    const setScreen = useSetAtom(CurrentScreenAtom)

    const [customEnabled, setCustomEnabled] = useAtom(CustomEnabledAtom)
    const themes = useAtomValue(ThemesLibraryDataAtom)

    const [loadingApply, setLoadingApply] = useState<boolean>(false)
    const [firstLoad, setFirstLoad] = useAtom(FirstLoadAtom)

    useEffect(() => {
        // Para la animación fade in de esta pantalla
        setTimeout(() => setFirstLoad(false), 1500) // el delay es la duración de la animación
    }, [setFirstLoad])

    const toggleCustomEnabled = async (): Promise<void> => {
        setLoadingApply(true)

        const res = await mediaServiceController.toggleCustomization()
        if (res) {
            console.log('Customization toggled')
            setCustomEnabled(!customEnabled)
        } else console.log('Error toggling customizations')

        setLoadingApply(false)
    }

    async function waitOnceAsync(
        uri: string,
        timeoutMs = 60000
    ): Promise<{ ok: boolean; message: string }> {
        return new Promise((resolve) => {
            let done = false

            const client = new WebSocket(uri)

            const finish = (ok: boolean, message: string): void => {
                if (done) return
                done = true
                try {
                    client.close()
                } catch (e) {
                    console.error(e)
                }
                resolve({ ok, message })
            }

            const to = setTimeout(() => finish(false, 'Timeout esperando confirmación'), timeoutMs)

            client.onopen = () => {
                clearTimeout(to)
                console.log('[SWS Client] Conectado al servidor')
                store.set(WebSocketStatusAtom, true)
                client.send(
                    JSON.stringify({ type: 'login', data: { type: 'admin', name: 'ARC_admin' } })
                )
            }

            client.onmessage = (event: MessageEvent) => {
                console.log('[SWS Client] Mensaje recibido')
                try {
                    const msg = JSON.parse(event.data) as WSMessage
                    console.log('[SWS Client] Parseado:', msg)

                    switch (msg.type) {
                        case 'update_connections':
                            console.log(
                                'update_connections',
                                msg.data.filter((e) => e.type === 'terminal').map((t) => t.name)
                            )
                            store.set(
                                TerminalsStatusAtom,
                                msg.data.filter((e) => e.type === 'terminal')
                            )

                            break

                        default:
                            console.log(`Tipo de mensaje ${msg.type} no contemplado`)
                            break
                    }
                } catch (error) {
                    // No era JSON
                    console.error('Error parseando mensaje', error)
                }
            }

            client.onclose = (event: CloseEvent) => {
                console.log(
                    `[SWS Client] Conexión cerrada. Code: ${event.code}, Reason: ${event.reason}`
                )
                store.set(WebSocketStatusAtom, false)
            }

            client.onerror = (event: Event) => {
                console.error('[SWS Client] Error en la conexión', event)
                store.set(WebSocketStatusAtom, false)
            }

            return client
        })
    }

    const TEST = async (): Promise<void> => {
        try {
            const res = await waitOnceAsync(WS_BASE_URL)
            console.log(res)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className={`screen-content new-main-screen-container ${firstLoad ? 'fade-in' : ''}`}>
            <div className="screen-header">
                <h1>FabStart</h1>

                <div className="header-group">
                    <div className="header-server-status">
                        <div>
                            <code>Servidor</code>
                            <span
                                className={
                                    ServerStatus == undefined
                                        ? 'getting-status'
                                        : ServerStatus
                                          ? 'green-status'
                                          : 'red-status'
                                }
                            ></span>
                        </div>
                        <div>
                            <code>WebSocket</code>
                            <span
                                className={
                                    WsStatus == undefined
                                        ? 'getting-status'
                                        : ServerStatus
                                          ? 'green-status'
                                          : 'red-status'
                                }
                            ></span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="main-screen-content">
                <div>
                    <p>Terminales (WIP)</p>
                    <div className="card-row-container">
                        {terminals.length ? (
                            terminals.map((e, i) => (
                                <div className="assets-container main-screen-theme-card" key={i}>
                                    <p>{e.name}</p>
                                    <p>{e.ip}</p>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: '#bebebe41' }}>Sin terminales conectadas</p>
                        )}
                    </div>
                </div>

                <div>
                    <p onClick={() => setScreen(Screens.collections)} style={{ cursor: 'pointer' }}>
                        Temas
                    </p>
                    <div className="card-row-container">
                        {themes?.length ? (
                            themes?.map((e, i) => (
                                <div className="assets-container main-screen-theme-card" key={i}>
                                    <p>{e.themeName}</p>
                                    <div className="logo-container">
                                        {e.logo.mime.match('svg') ? (
                                            <DynamicSvg
                                                color={e?.color?.primaryColor}
                                                config={{
                                                    assetName: `${e.themeName}_${e.logo.name}`
                                                }}
                                            />
                                        ) : (
                                            <img src={e.logo.base64} />
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: '#bebebe41' }}>Sin temas guardados</p>
                        )}
                    </div>
                </div>

                <div className="shortcuts-container">
                    <div
                        className={customEnabled ? 'custom-enabled' : ''}
                        onClick={() => !loadingApply && toggleCustomEnabled()}
                    >
                        <p>Customización</p>
                        <div className={customEnabled ? '' : 'power-off'}>
                            {loadingApply ? <SpinnerSvg className="spinner" /> : <PowerSvg />}
                        </div>
                    </div>

                    <div onClick={() => setScreen(Screens.preview)}>
                        <NewSvg />
                        Nuevo Tema
                    </div>
                    {/* <div style={{ opacity: '.75', pointerEvents: 'none' }}> 
                        <FastUploadSvg />
                        Carga Rápida
                    </div> */}
                    <div style={{ color: 'lime' }} onClick={TEST}>
                        <TestSvg />
                        TEST
                    </div>

                    <div onClick={() => setScreen(Screens.template)}>
                        <GearSvg />
                        Actualizar template base
                    </div>

                    <div onClick={() => setScreen(Screens.fileManager)}>
                        <FilesSvg />
                        Gestión de Archivos
                    </div>
                    <div onClick={reset}>
                        Salir
                        <ExitSvg />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default NewMain
