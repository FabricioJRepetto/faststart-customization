import {
    CurrentScreenAtom,
    CustomEnabledAtom,
    FirstLoadAtom,
    ServerStatusAtom,
    store,
    WebSocketStatusAtom
} from '@renderer/utils/context/context'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import SpinnerSvg from '../assets/spinner.svg?react'
import NewSvg from '../assets/theme.svg?react'
import FilesSvg from '../assets/folder_management.svg?react'
import RocketSvg from '../assets/rocket.svg?react'
import TestSvg from '../assets/test.svg?react'
import ExitSvg from '../assets/logout.svg?react'
import PowerSvg from '../assets/powerb.svg?react'
import mediaServiceController from '@renderer/utils/controllers/mediaServer/mediaServiceController'
import { Screens } from '@shared/types'
import { reset, resetEditions } from '@renderer/utils/reset'
import { TerminalsCardRow, ThemesCardRow } from '@renderer/components/CardsRow'

const NewMain = (): React.JSX.Element => {
    const ServerStatus = useAtomValue(ServerStatusAtom, { store })
    const WsStatus = useAtomValue(WebSocketStatusAtom, { store })
    const setScreen = useSetAtom(CurrentScreenAtom)

    const [customEnabled, setCustomEnabled] = useAtom(CustomEnabledAtom)

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

    return (
        <div className={`screen-content new-main-screen-container ${firstLoad ? 'fade-in' : ''}`}>
            <div className="screen-header">
                <h1>✦FabStart✦</h1>

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
                                        : WsStatus
                                          ? 'green-status'
                                          : 'red-status'
                                }
                            ></span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="main-screen-content">
                <TerminalsCardRow cardClick={() => null} />
                <ThemesCardRow />

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

                    <div
                        onClick={() => {
                            resetEditions()
                            setScreen(Screens.preview)
                        }}
                    >
                        <NewSvg />
                        Nuevo Tema
                    </div>
                    <div style={{ opacity: '.75', pointerEvents: 'none' }}>
                        <RocketSvg />
                        Carga Rápida
                    </div>
                    <div style={{ color: 'lime' }} onClick={() => setScreen(Screens.test)}>
                        <TestSvg />
                        TEST
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
