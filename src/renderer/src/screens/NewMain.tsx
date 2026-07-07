import {
    ClientAppVersionDirAtom,
    CurrentScreenAtom,
    CustomEnabledAtom,
    DistributionMethodAtom,
    FirstLoadAtom,
    ServerStatusAtom,
    SupervisorAppVersionDirAtom,
    ThemesLibraryDataAtom,
    ThirdAppVersionDirAtom
} from '@renderer/utils/context/context'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import SpinnerSvg from '../assets/spinner.svg?react'
import NewSvg from '../assets/theme.svg?react'
import FilesSvg from '../assets/folder_management.svg?react'
import GearSvg from '../assets/gear.svg?react'
import FastUploadSvg from '../assets/rocket.svg?react'
import ExitSvg from '../assets/logout.svg?react'
import PowerSvg from '../assets/powerb.svg?react'
import mediaServiceController from '@renderer/utils/controllers/mediaServer/mediaServiceController'
import { DistributionMethod, Screens } from '@shared/types'
import DynamicSvg from '@renderer/components/DynSvg'
import { reset } from '@renderer/utils/reset'

const NewMain = (): React.JSX.Element => {
    const status = useAtomValue(ServerStatusAtom)
    const isRemote = useAtomValue(DistributionMethodAtom) === DistributionMethod.REMOTE
    const setScreen = useSetAtom(CurrentScreenAtom)

    const clientDir = useAtomValue(ClientAppVersionDirAtom)
    const thirdDir = useAtomValue(ThirdAppVersionDirAtom)
    const supDir = useAtomValue(SupervisorAppVersionDirAtom)

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

        if (isRemote) {
            const res = await mediaServiceController.toggleCustomization()
            if (res) {
                console.log('Customization toggled')
                setCustomEnabled(!customEnabled)
            } else console.log('Error toggling customizations')
        } else {
            const res = await window.electronAPI.toggleEnabled(
                !customEnabled,
                clientDir,
                thirdDir,
                supDir
            )
            setCustomEnabled(!customEnabled)
            if (res.success) {
                setCustomEnabled(!customEnabled)
                console.log(res.data + '/3 custom files updated correctly')
            } else console.error('Error enabling customs')
        }
        setLoadingApply(false)
    }

    return (
        <div className={`screen-content new-main-screen-container ${firstLoad ? 'fade-in' : ''}`}>
            <div className="screen-header">
                <h1>FabStart</h1>

                <div className="header-group">
                    <div className="header-server-status">
                        Servidor
                        <span
                            className={
                                status == undefined
                                    ? 'getting-status'
                                    : status
                                      ? 'green-status'
                                      : 'red-status'
                            }
                        ></span>
                    </div>
                </div>
            </div>

            <div className="main-screen-content">
                <div>
                    <p>Terminales (WIP)</p>
                    <div className="card-row-container">
                        {[
                            { name: 'SR (17)', ip: '192.0.170.172', status: 'online' },
                            { name: 'SR (lab)', ip: '192.0.170.63', status: 'undefined' },
                            { name: 'BRM', ip: '192.0.170.63', status: 'offline' },
                            { name: 'BNA', ip: '192.0.170.65', status: 'offline' },
                            { name: 'GBRU', ip: '192.0.170.171', status: 'offline' },
                            { name: 'S2', ip: '192.0.170.69', status: 'offline' },
                            { name: 'HEADLESS', ip: '192.0.170.170', status: 'offline' }
                        ].map((e, i) => (
                            <div className="assets-container main-screen-theme-card" key={i}>
                                <p>{e.name}</p>
                                <p>{e.ip}</p>
                                <p>{e.status}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <p>Temas</p>
                    <div className="card-row-container">
                        {themes?.map((e, i) => (
                            <div className="assets-container main-screen-theme-card" key={i}>
                                <p>{e.themeName}</p>
                                <div className="logo-container">
                                    {e.logo.mime.match('svg') ? (
                                        <DynamicSvg
                                            color={e?.color?.primaryColor}
                                            config={
                                                isRemote
                                                    ? { assetName: `${e.themeName}_${e.logo.name}` }
                                                    : { path: e.logo.base64 }
                                            }
                                        />
                                    ) : (
                                        <img src={e.logo.base64} />
                                    )}
                                </div>
                            </div>
                        ))}
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

                    <div style={{ opacity: '.75', pointerEvents: 'none' }}>
                        <NewSvg />
                        Nuevo Tema
                    </div>
                    <div style={{ opacity: '.75', pointerEvents: 'none' }}>
                        <FastUploadSvg />
                        Carga Rápida
                    </div>

                    <div onClick={() => setScreen(Screens.template)}>
                        <GearSvg />
                        Actualizar template base
                    </div>

                    <div style={{ opacity: '.75', pointerEvents: 'none' }}>
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
