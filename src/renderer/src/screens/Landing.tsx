import { useAtom, useSetAtom } from 'jotai'
import NATL from '../assets/NATL-logo.svg'
import Versions from '../components/Versions'
import {
    AppSettingsAtom,
    ClientAppVersionDirAtom,
    AssetsDataAtom,
    RootDirectoryAtom,
    CurrentScreenAtom,
    DefaultLanguageDataAtom,
    EditedAppSettingsAtom,
    EditedLanguageDataAtom,
    SupervisorAppVersionDirAtom,
    ThirdAppVersionDirAtom,
    EditedIconsDataAtom
} from '@renderer/utils/context/context'
import { AppSettingsData, AssetData, AssetList, LanguageData, Screens } from '@renderer/utils/types'
import { langDataShell } from '@renderer/utils/LangStructureBuilder'
import {
    DEFAULT_ASSETS_DIR,
    DEFAULT_LANGUAGE_DATA_DIR,
    SERVICES_APPSETTINGS_DIR,
    VERSIONS_DIR
} from '../utils/CONSTANTS'
import RightSvg from '../assets/right.svg?react'
import { useEffect, useState } from 'react'

// TODO Guardar versiones de supervisor y tercera pantalla
// TODO Checkear que los directorios seleccionados tienen la estructura correcta antes de avanzar

interface modalData {
    version_name: string
    versions: string[]
}

const Landing = (): React.JSX.Element => {
    const setScreen = useSetAtom(CurrentScreenAtom)
    const setLangData = useSetAtom(DefaultLanguageDataAtom)
    const setNewLangData = useSetAtom(EditedLanguageDataAtom)

    const setAppsettings = useSetAtom(AppSettingsAtom)
    const setNewAppsettings = useSetAtom(EditedAppSettingsAtom)

    const setAssetList = useSetAtom(AssetsDataAtom)
    const setIconsList = useSetAtom(EditedIconsDataAtom)

    const [baseDir, setBaseDir] = useAtom(RootDirectoryAtom)
    const [clientVersionDir, setClientVersionDir] = useAtom(ClientAppVersionDirAtom)
    const [superVersionDir, setSuperVersionDir] = useAtom(SupervisorAppVersionDirAtom)
    const [thirdVersionDir, setThirdVersionDir] = useAtom(ThirdAppVersionDirAtom)

    const openSelectDirectory = async (): Promise<void> => {
        const path = await window.electronAPI.selectDirectory()
        if (path) {
            console.log(path)
            setBaseDir(path)
        }
    }

    const [modal, setModal] = useState<modalData[] | null>(null)

    const continueHandler = async (): Promise<void> => {
        try {
            if (!clientVersionDir)
                return alert('Por favor, seleccione las aplicaciones para continuar')

            //* language.json
            const res = await window.electronAPI.getJsonData(
                clientVersionDir + DEFAULT_LANGUAGE_DATA_DIR
            )
            if (res.success) {
                console.log('language_default.json data OK')

                setLangData(res.data as LanguageData)
                setNewLangData(langDataShell(res.data as LanguageData))
            } else {
                console.error('Error al cargar archivo de idioma por defecto: ' + res.error)
                throw res.error
            }

            //* appsettings.json TS
            const resSettings = await window.electronAPI.getJsonData(
                baseDir + SERVICES_APPSETTINGS_DIR
            )
            if (resSettings.success) {
                console.log('appsettings.json data OK')

                setAppsettings(resSettings.data as AppSettingsData)
                setNewAppsettings(resSettings.data as AppSettingsData)
            } else {
                console.error('Error al cargar archivo appsettings: ' + resSettings.error)
                throw resSettings.error
            }

            //* assets
            const resAssets = await window.electronAPI.getFilesList([
                clientVersionDir + DEFAULT_ASSETS_DIR,
                thirdVersionDir
            ])
            if (resAssets.success) {
                console.log('assets data OK')
                const data = resAssets.data as AssetList
                console.log(data)
                setAssetList(data as AssetList)
                setIconsList([...data.icon] as AssetData[])
                // setBackgroundList([...data.background] as AssetData[])
                // setAudioList([...data.audio] as AssetData[])
                // setThirdList([...data.thirdscreen] as AssetData[])
            } else {
                console.error('Error al cargar assets: ' + resAssets.error)
                throw resAssets.error
            }
            setScreen(Screens.main)
        } catch (error) {
            alert('Error al cargar archivos: ' + error)
        }
    }

    const getVersions = async (): Promise<void> => {
        try {
            if (!baseDir) return alert('Por favor, seleccione el directorio base para continuar')

            const res = await window.electronAPI.getFoldersList(baseDir + VERSIONS_DIR)
            if (res.success) {
                if (!res.data.length)
                    return alert(
                        `No se encontraron versiones de aplicación en el directorio:\n${baseDir + VERSIONS_DIR}`
                    )

                console.log('Lista Versiones obtenidas.\nPotenciales versiones:', res.data.length)
                console.log(res.data)
                const potentialClientApps = res.data.filter((v) => v.match('client'))
                const potentialSupervisorApps = res.data.filter((v) => v.match('supervisor'))
                const potentialThirdApps = res.data.filter((v) => v.match('thirdscreen'))

                if (!potentialClientApps.length || !potentialThirdApps.length) {
                    return alert(
                        `No se encontraron versiones de Cliente y/o Tercera pantalla en el directorio:\n${baseDir + VERSIONS_DIR}`
                    )
                }

                const aux: modalData[] = []

                if (potentialClientApps.length > 1) {
                    aux.push({
                        version_name: 'cliente',
                        versions: potentialClientApps
                    })
                } else if (potentialClientApps.length) {
                    setClientVersionDir(baseDir + VERSIONS_DIR + potentialClientApps[0])
                }

                if (potentialSupervisorApps.length > 1) {
                    aux.push({
                        version_name: 'supervisor',
                        versions: potentialSupervisorApps
                    })
                } else if (potentialSupervisorApps.length) {
                    setSuperVersionDir(baseDir + VERSIONS_DIR + potentialSupervisorApps[0])
                }

                if (potentialThirdApps.length > 1) {
                    aux.push({
                        version_name: 'tercera pantalla',
                        versions: potentialThirdApps
                    })
                } else if (potentialThirdApps.length) {
                    setThirdVersionDir(baseDir + VERSIONS_DIR + potentialThirdApps[0])
                    console.warn('Guardar versiones de tercera pantalla')
                }

                setModal(aux.length ? aux : null)
            }
        } catch (error) {
            console.error(error)
            return
        }
    }

    const versionSelected = (vName: string, versionName: string): void => {
        switch (vName) {
            case 'cliente':
                setClientVersionDir(baseDir + VERSIONS_DIR + versionName)
                break

            case 'supervisor':
                setSuperVersionDir(baseDir + VERSIONS_DIR + versionName)
                break

            case 'tercera pantalla':
                setThirdVersionDir(baseDir + VERSIONS_DIR + versionName)
                break

            default:
                break
        }

        // continuar o cerrar modal
        setModal((prev) => {
            if (!prev || prev.length === 1) return null
            const aux = [...prev]
            aux.shift()
            return aux
        })
    }

    useEffect(() => {
        if (!modal && clientVersionDir && superVersionDir && thirdVersionDir) continueHandler()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modal])

    return (
        <>
            <img alt="logo" className="logo" src={NATL} />
            <div className="creator">Versión de desarrollo</div>
            <div className="text">
                Administrador de assets custom para <span className="gradient-text">FastStart</span>
            </div>
            <p className="tip">
                Seleccione el directorio base de faststart para comenzar a administrar sus assets.
            </p>
            <p className="tip">
                Root Dir: <code>{baseDir}</code>
            </p>
            <div className="actions landing-buttons">
                <div className="action">
                    <input type="file" id="base-dir-input" style={{ display: 'none' }} />
                    <a target="_blank" rel="noreferrer" onClick={() => openSelectDirectory()}>
                        Seleccionar Directorio Base
                    </a>
                </div>
                <div className="action primary">
                    <a target="_blank" rel="noreferrer" onClick={getVersions}>
                        Continuar
                        <RightSvg />
                    </a>
                </div>
            </div>
            <Versions></Versions>

            {modal && modal[0] && (
                <>
                    <div className="modal-backdrop" onClick={() => {}}></div>
                    <div className="lang-editor-modal">
                        <p>Vesiones encontradas en el directorio base indicado</p>
                        <h2>
                            Seleccione la versión de aplicación{' '}
                            <code className="gradient-text">Cliente</code> que desea modificar
                        </h2>

                        <div className="select-version-container">
                            {modal[0].versions.map((v) => (
                                <div
                                    key={v}
                                    onClick={() => versionSelected(modal[0].version_name, v)}
                                >
                                    {v}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Landing
