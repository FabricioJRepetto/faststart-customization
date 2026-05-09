import { useAtom, useAtomValue } from 'jotai'
import {
    ClientAppVersionDirAtom,
    CustomEnabledAtom,
    FirstLoadAtom,
    ThirdAppVersionDirAtom,
    SupervisorAppVersionDirAtom
} from '@renderer/utils/context/context'
import { Previewer } from '@renderer/components/Previewer'
import { useEffect, useState } from 'react'
import PowerSvg from '../assets/powerb.svg?react'
import AppsVersions from '@renderer/components/AppsVersions'
import Modal from '@renderer/components/Modal'
import { getRawConfig } from '@renderer/utils/getRawConfig'
import SpinnerSvg from '../assets/spinner.svg?react'

export const MainScreen = (): React.JSX.Element => {
    const clientDir = useAtomValue(ClientAppVersionDirAtom)
    const thirdDir = useAtomValue(ThirdAppVersionDirAtom)
    const supDir = useAtomValue(SupervisorAppVersionDirAtom)

    const [customEnabled, setCustomEnabled] = useAtom(CustomEnabledAtom)

    const [loadingApply, setLoadingApply] = useState<boolean>(false)
    const [loadingSave, setLoadingSave] = useState<boolean>(false)
    const [firstLoad, setFirstLoad] = useAtom(FirstLoadAtom)

    const [modal, setModal] = useState<boolean>(false)
    const [themeName, setThemeName] = useState<string>('')

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

    const test = (): boolean => {
        return /^[a-z0-9]+[a-z0-9 _.-]*$/gi.test(themeName)
    }

    const unicName = (): boolean => {
        const nameList: string[] = []
        return !nameList.includes(themeName)
    }

    const toggleCustomEnabled = async (): Promise<void> => {
        setLoadingApply(true)
        setCustomEnabled(!customEnabled)

        const res = await window.electronAPI.toggleEnabled(
            !customEnabled,
            clientDir,
            thirdDir,
            supDir
        )
        res.success
            ? console.log(res.data + '/3 custom files updated correctly')
            : console.error('Error enabling customs')

        setLoadingApply(false)
    }

    const saveConfig = async (): Promise<void> => {
        if (!test() || !unicName() || loadingApply) {
            return
        }
        console.log('OOOOOOO - saving')

        setLoadingSave(true)
        const aux = getRawConfig(themeName)
        const res = await window.electronAPI.saveThemeData(aux)

        if (res.success) console.log('[SAVE] Custom config file witen')
        else console.error('[SAVE] Custom config file creation failed')

        setLoadingSave(false)
        closeModal()
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

        if (res.success) console.log('[APPLY] Custom config file witen')
        else console.error('[APPLY] Custom config file creation failed')

        setLoadingApply(false)
    }

    return (
        <div className={`screen-content main-container ${firstLoad ? 'fade-in' : ''}`}>
            <div>
                <div className="main-header">
                    <h1>Previsualización</h1>
                    <div className="toggler">
                        <div
                            className="input-wrapper"
                            onClick={() => !loadingApply && toggleCustomEnabled()}
                        >
                            Customización
                            <button className={customEnabled ? '' : 'power-off'}>
                                <PowerSvg />
                            </button>
                        </div>
                    </div>
                </div>

                <AppsVersions />

                <Previewer />

                <div className="actions main-actions">
                    <div
                        className="action"
                        style={{ pointerEvents: !loadingApply && !loadingSave ? 'all' : 'none' }}
                    >
                        <a onClick={() => !loadingApply && !loadingSave && openModal()}>
                            Guardar en libreria
                        </a>
                    </div>

                    <div
                        className="action primary waiter"
                        style={{ pointerEvents: !loadingApply && !loadingSave ? 'all' : 'none' }}
                    >
                        <a onClick={() => !loadingApply && !loadingSave && applyConfig()}>
                            {loadingApply && <SpinnerSvg className="spinner" />}
                            {
                                <span style={{ opacity: loadingApply ? '0' : 'unset' }}>
                                    Aplicar Customización
                                </span>
                            }
                        </a>
                    </div>
                </div>

                {modal && (
                    <Modal confirm={saveConfig} close={closeModal}>
                        <div className="modal-backdrop" onClick={closeModal}></div>
                        <div className="lang-editor-modal">
                            <h2>
                                Guardar <code className="gradient-text">tema</code> nuevo
                            </h2>
                            <p>Indica un nombre para identificarlo</p>
                            <input
                                type="text"
                                autoFocus
                                value={themeName}
                                id="lang-value-input"
                                onChange={(e) => setThemeName(e.target.value)}
                            />
                            <p className="error-messagge">
                                {!test()
                                    ? 'Solo se permiten letras, números, puntos y guiones'
                                    : unicName()
                                      ? ''
                                      : 'El nombre ya está en uso'}
                            </p>
                            <div className="actions">
                                <div
                                    className="action primary"
                                    style={{ pointerEvents: test() && unicName() ? 'all' : 'none' }}
                                >
                                    <a onClick={saveConfig}>Aplicar</a>
                                </div>
                                <div className="action">
                                    <a onClick={closeModal}>Cancelar</a>
                                </div>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    )
}
export default MainScreen
