import { useAtom, useAtomValue } from 'jotai'
import {
    ClientAppVersionDirAtom,
    CustomEnabledAtom,
    FirstLoadAtom,
    ThirdAppVersionDirAtom,
    SupervisorAppVersionDirAtom,
    DistributionMethodAtom
} from '@renderer/utils/context/context'
import { Previewer } from '@renderer/components/Previewer'
import { useEffect, useState } from 'react'
import PowerSvg from '../assets/powerb.svg?react'
import AppsVersions from '@renderer/components/AppsVersions'
import Modal from '@renderer/components/Modal'
import { getRawConfig } from '@renderer/utils/getRawConfig'
import SpinnerSvg from '../assets/spinner.svg?react'
import { loadLocalThemesLibrary } from '@renderer/utils/bootSequence'
import ApplySvg from '../assets/apply.svg?react'
import StorageSvg from '../assets/storage.svg?react'
import UploadSvg from '../assets/upload.svg?react'
import { DistributionMethod } from '@shared/types'
import RemotePill from '@renderer/components/RemotePill'
import UploadDialog from '@renderer/components/ModalBodies/UploadDialog'
import { test, unicName } from '@renderer/utils/themesUtils'
import mediaServiceController from '@renderer/utils/controllers/mediaServer/mediaServiceController'

export const Preview = (): React.JSX.Element => {
    const isRemote = useAtomValue(DistributionMethodAtom) === DistributionMethod.REMOTE

    const clientDir = useAtomValue(ClientAppVersionDirAtom)
    const thirdDir = useAtomValue(ThirdAppVersionDirAtom)
    const supDir = useAtomValue(SupervisorAppVersionDirAtom)

    const [customEnabled, setCustomEnabled] = useAtom(CustomEnabledAtom)

    const [loadingApply, setLoadingApply] = useState<boolean>(false)
    const [loadingSave, setLoadingSave] = useState<boolean>(false)
    const [firstLoad, setFirstLoad] = useAtom(FirstLoadAtom)

    const [modal, setModal] = useState<boolean>(false)
    const [themeName, setThemeName] = useState<string>('')

    const [modalNotif, setModalNotif] = useState<{ title: string; text?: string } | false>(false)

    useEffect(() => {
        // Para la animación fade in de esta pantalla
        // el delay es la duración de la animación
        setTimeout(() => setFirstLoad(false), 450)
    }, [setFirstLoad])

    const closeModal = (): void => {
        setModal(false)
        setThemeName('')
    }

    const openModal = (): void => {
        setModal(true)
    }

    const toggleCustomEnabled = async (): Promise<void> => {
        setLoadingApply(true)
        setCustomEnabled(!customEnabled)

        if (isRemote) {
            const res = await mediaServiceController.toggleCustomization()
            if (res) console.log('Customization toggled')                
            else console.log('Error toggling customizations');
            
        } else {
            const res = await window.electronAPI.toggleEnabled(
                !customEnabled,
                clientDir,
                thirdDir,
                supDir
            )
            res.success
                ? console.log(res.data + '/3 custom files updated correctly')
                : console.error('Error enabling customs')
        }
        setLoadingApply(false)
    }

    const saveConfig = async (): Promise<void> => {
        if (!test(themeName) || !unicName(themeName) || loadingApply) {
            return
        }

        setLoadingSave(true)
        const aux = getRawConfig(themeName)
        const res = await window.electronAPI.saveThemeData(aux)

        let notif = { title: '', text: '' }
        if (res.success) {
            console.log('[SAVE] Custom config file writen')
            await loadLocalThemesLibrary()
            notif = {
                title: `Tema ${themeName} guardado`,
                text: 'Puede verse en la sección "Colecciones"'
            }
        } else {
            console.error('[SAVE] Custom config file creation failed', res.error)
            notif = {
                title: 'Error al guardar tema',
                text: res.error
            }
        }

        setLoadingSave(false)
        closeModal()

        setModalNotif(notif)
    }

    const applyConfig = async (): Promise<void> => {
        console.log('apply')

        setLoadingApply(true)
        const rawConfig = getRawConfig()
        const res = await window.electronAPI.applyCurrentConfig(
            rawConfig,
            clientDir,
            thirdDir,
            supDir
        )

        if (res.success) {
            console.log('[APPLY] Custom config file writen')
            setModalNotif({
                title: 'Customización aplicada',
                text: 'Los cambios se reflejarán en las aplicaciones la próxima vez que cliente pase por la pantalla Idle.'
            })
        } else {
            console.error('[APPLY] Custom config file creation failed', res.error)
            setModalNotif({
                title: 'Error al aplicar Customización',
                text: res.error
            })
        }

        setLoadingApply(false)
    }

    //_-_-_-_-_-_-_-_-_-_- REMOTE _-_-_-_-_-_-_-_-_-_-

    const [loadingUpload, setLoadingUpload] = useState<boolean>(false)
    const [modalUpload, setModalUpload] = useState<boolean>(false)

    const openUploadModal = (): void => {
        setModalUpload(true)
        setLoadingUpload(true)
    }

    return (
        <div className={`screen-content main-screen-container ${firstLoad ? 'fade-in' : ''}`}>
            <>
                <div className="screen-header">
                    <h1>Previsualización</h1>
                    <div className="toggler">
                        <div
                            className="input-wrapper"
                            onClick={() => !loadingApply && toggleCustomEnabled()}
                        >
                            Customización
                            <button className={customEnabled ? '' : 'power-off'}>
                                {loadingApply ? <SpinnerSvg className="spinner" /> : <PowerSvg />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="main-screen-content">
                    <Previewer />

                    {isRemote ? (
                        <div className="actions main-actions">
                            <div
                                className="action primary"
                                style={{
                                    pointerEvents: !loadingApply && !loadingSave ? 'all' : 'none'
                                }}
                            >
                                <a onClick={openUploadModal}>
                                    Subir
                                    <UploadSvg />
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="actions main-actions">
                            <div
                                className="action"
                                style={{
                                    pointerEvents: !loadingApply && !loadingSave ? 'all' : 'none'
                                }}
                            >
                                <a onClick={() => !loadingApply && !loadingSave && openModal()}>
                                    Guardar
                                    <StorageSvg />
                                </a>
                            </div>

                            <div
                                className="action primary waiter"
                                style={{
                                    pointerEvents: !loadingApply && !loadingSave ? 'all' : 'none'
                                }}
                            >
                                <a onClick={() => !loadingApply && !loadingSave && applyConfig()}>
                                    {loadingApply && <SpinnerSvg className="spinner" />}
                                    {
                                        <span style={{ opacity: loadingApply ? '0' : 'unset' }}>
                                            Aplicar <ApplySvg />
                                        </span>
                                    }
                                </a>
                            </div>
                        </div>
                    )}

                    {isRemote ? <RemotePill /> : <AppsVersions />}

                    {modal && (
                        <Modal confirm={saveConfig} close={closeModal}>
                            <h2>
                                Guardar <span className="gradient-text">tema</span> nuevo
                            </h2>
                            <p>Indica un nombre para identificarlo</p>
                            <input
                                type="text"
                                autoFocus
                                value={themeName}
                                id="lang-value-input"
                                onChange={(e) => setThemeName(e.target.value)}
                            />
                            <p className="info-message error-messagge">
                                {!test(themeName)
                                    ? 'Solo se permiten letras, números, puntos y guiones'
                                    : unicName(themeName)
                                      ? ''
                                      : 'El nombre ya está en uso'}
                            </p>
                            <div className="actions">
                                <div
                                    className="action primary"
                                    style={{
                                        pointerEvents:
                                            test(themeName) && unicName(themeName) ? 'all' : 'none'
                                    }}
                                >
                                    <a onClick={saveConfig}>Aplicar</a>
                                </div>
                                <div className="action">
                                    <a onClick={closeModal}>Cancelar</a>
                                </div>
                            </div>
                        </Modal>
                    )}

                    {modalNotif && (
                        <Modal
                            confirm={() => setModalNotif(false)}
                            close={() => setModalNotif(false)}
                        >
                            <h2>{modalNotif.title}</h2>
                            <p>{modalNotif.text}</p>
                            <div className="actions">
                                <div className="action primary">
                                    <a onClick={() => setModalNotif(false)}>Continuar</a>
                                </div>
                            </div>
                        </Modal>
                    )}

                    {modalUpload && (
                        <Modal
                            confirm={() => !loadingUpload && setModalUpload(false)}
                            close={() => !loadingUpload && setModalUpload(false)}
                        >
                            <UploadDialog closeModal={() => setModalUpload(false)} />
                        </Modal>
                    )}
                </div>
            </>
        </div>
    )
}
export default Preview
