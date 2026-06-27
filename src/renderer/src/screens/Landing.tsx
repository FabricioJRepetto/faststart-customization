import { useAtom, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import Versions from '../components/Versions'
import NATL from '../assets/NATL-logo.svg?react'
import RightSvg from '../assets/right.svg?react'
import {
    ClientAppVersionDirAtom,
    RootDirectoryAtom,
    CurrentScreenAtom,
    SupervisorAppVersionDirAtom,
    ThirdAppVersionDirAtom,
    DistributionMethodAtom,
    ServerStatusAtom
} from '@renderer/utils/context/context'
import { DistributionMethod, Screens } from '@shared/types'
import { BACKEND_BASE_URL, VERSIONS_DIR } from '../../../../shared/CONSTANTS'
import SpinnerSvg from '../assets/spinner.svg?react'
import {
    loadLocalAssets,
    loadLocalCustomConfigFile,
    loadLocalLanguageFile,
    loadLocalStylesFile,
    loadLocalThemesLibrary,
    loadRemoteCustomConfig,
    loadRemoteThemesCollection,
    parseRemoteAssets,
    validateFiles
} from '@renderer/utils/bootSequence'
import RemoteSvg from '../assets/wifi.svg?react'
import LocalSvg from '../assets/box.svg?react'

// TODO Checkear que los directorios seleccionados tienen la estructura correcta antes de avanzar

interface modalData {
    version_name: string
    versions: string[]
}

const Landing = (): React.JSX.Element => {
    const setScreen = useSetAtom(CurrentScreenAtom)
    const [serverStatus, setStatus] = useAtom(ServerStatusAtom)

    const [method, setMethod] = useAtom(DistributionMethodAtom)

    const [baseDir, setBaseDir] = useAtom(RootDirectoryAtom)
    const [clientVersionDir, setClientVersionDir] = useAtom(ClientAppVersionDirAtom)
    const [superVersionDir, setSuperVersionDir] = useAtom(SupervisorAppVersionDirAtom)
    const [thirdVersionDir, setThirdVersionDir] = useAtom(ThirdAppVersionDirAtom)

    const openSelectDirectory = async (): Promise<void> => {
        const res = await window.electronAPI.selectDirectory()
        if (res.success) {
            console.log(res.data)
            setBaseDir(res.data)
        } else {
            console.error('Error seleccionando directorio:', res.error)
        }
    }

    const [loading, setLoading] = useState(false)
    const [modal, setModal] = useState<modalData[] | null>(null)

    useEffect(() => {
        let _to: NodeJS.Timeout
        let retries = 0
        const ping = (): void => {
            setStatus(undefined)
            fetch(BACKEND_BASE_URL, {
                method: 'HEAD',
                mode: 'no-cors',
                cache: 'no-cache'
            })
                .then(() => setStatus(true))
                .catch(() => {
                    if (retries === 5) return
                    retries++
                    setStatus(false)
                    _to = setTimeout(() => {
                        ping()
                    }, 5000)
                })
        }
        ping()
        return () => {
            clearTimeout(_to)
        }
    }, [setStatus])

    //_-_-_-_-_-_-_-_-_-_- LOCAL _-_-_-_-_-_-_-_-_-_-_-

    const continueHandler = async (): Promise<void> => {
        try {
            setLoading(true)
            let _clientVer = ''
            let _thirdVer = ''

            if (!clientVersionDir || !thirdVersionDir) {
                console.log('no versions, checking')

                const versions = await getVersions()
                console.log(versions)

                if (!versions) {
                    console.log('no versions')
                    return
                }
                if (versions.modalList.length) {
                    console.log('open versions modal')
                    setModal(versions.modalList)
                    return
                }
                if (!versions.readyVersions.client || !versions.readyVersions.third) {
                    console.log('no client || third')
                    return
                }
                _clientVer = versions.readyVersions.client
                _thirdVer = versions.readyVersions.third
            }
            console.log('continuing...')

            //* LOAD : assets
            await loadLocalAssets(_clientVer || clientVersionDir, _thirdVer || thirdVersionDir)

            //* LOAD : language.json
            await loadLocalLanguageFile(_clientVer || clientVersionDir)

            //* LOAD : styles.json
            await loadLocalStylesFile(_clientVer || clientVersionDir)

            //* LOAD : customConfig.json
            await loadLocalCustomConfigFile(_clientVer || clientVersionDir)

            //* VALIDATE : language.json, styles.json / customConfig.json
            validateFiles()

            //* Libreria de temas
            await loadLocalThemesLibrary()

            setScreen(Screens.main)
        } catch (error) {
            alert('Error al cargar archivos: ' + error)
        } finally {
            setLoading(false)
        }
    }

    const getVersions = async (): Promise<
        | {
              modalList: modalData[]
              readyVersions: { client: string; supervisor: string; third: string }
          }
        | undefined
        | void
    > => {
        try {
            console.log('checking versions')
            const res = await window.electronAPI.getFoldersList(baseDir + VERSIONS_DIR)
            console.log('res', res)
            if (res.success) {
                if (!res.data.length)
                    return alert(
                        `No se encontraron versiones de aplicación en el directorio:\n${baseDir + VERSIONS_DIR}`
                    )

                console.log('Lista Versiones obtenidas.\nPotenciales versiones:', res.data.length)
                console.log(res.data)
                const potentialClientApps = res.data.filter((v) => v.match(/client/g))
                const potentialSupervisorApps = res.data.filter((v) => v.match(/supervisor/g))
                const potentialThirdApps = res.data.filter((v) => v.match(/thirdscreen/g))

                if (
                    !potentialClientApps.length ||
                    !potentialSupervisorApps.length ||
                    !potentialThirdApps.length
                ) {
                    return alert(
                        `No se encontraron versiones de aplicación para Cliente, Supervisor y/o Tercera pantalla en el directorio:\n${baseDir + VERSIONS_DIR}`
                    )
                }

                const modalList: modalData[] = []
                const readyVersions = {
                    client: '',
                    supervisor: '',
                    third: ''
                }

                if (potentialClientApps.length > 1) {
                    modalList.push({
                        version_name: 'cliente',
                        versions: potentialClientApps
                    })
                } else if (potentialClientApps.length) {
                    setClientVersionDir(baseDir + VERSIONS_DIR + potentialClientApps[0])
                    readyVersions.client = baseDir + VERSIONS_DIR + potentialClientApps[0]
                }

                if (potentialSupervisorApps.length > 1) {
                    modalList.push({
                        version_name: 'supervisor',
                        versions: potentialSupervisorApps
                    })
                } else if (potentialSupervisorApps.length) {
                    setSuperVersionDir(baseDir + VERSIONS_DIR + potentialSupervisorApps[0])
                    readyVersions.supervisor = baseDir + VERSIONS_DIR + potentialSupervisorApps[0]
                }

                if (potentialThirdApps.length > 1) {
                    modalList.push({
                        version_name: 'tercera pantalla',
                        versions: potentialThirdApps
                    })
                } else if (potentialThirdApps.length) {
                    setThirdVersionDir(baseDir + VERSIONS_DIR + potentialThirdApps[0])
                    readyVersions.third = baseDir + VERSIONS_DIR + potentialThirdApps[0]
                }

                console.log('found versions', { modalList, readyVersions })

                // if (!aux.length) continueHandler()
                // else setModal(aux)
                return { modalList, readyVersions }
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

    //_-_-_-_-_-_-_-_-_-_- REMOTE _-_-_-_-_-_-_-_-_-_-_-

    const remoteStartUp = async (): Promise<void> => {
        try {
            setLoading(true)

            //* LOAD : customConfig.json
            await loadRemoteCustomConfig()
            validateFiles()
            //* LOAD : Assets
            parseRemoteAssets()
            //* Libreria de temas
            await loadRemoteThemesCollection()

            setMethod(DistributionMethod.REMOTE)
            setScreen(Screens.main)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="landing-screen">
            <NATL className="logo" />
            <div className="creator">Versión demo</div>
            <div className="text">
                Administración Rápida de Customizaciones
                <div className="text">
                    para <span className="gradient-text">FastStart</span>
                </div>
            </div>

            {!method && (
                <>
                    <p className="tip">Seleccione el modo de distribución:</p>
                    <div className="actions landing-buttons">
                        <div
                            className={serverStatus ? 'action primary waiter' : 'action waiter'}
                            style={{
                                pointerEvents: serverStatus ? 'all' : 'none',
                                opacity: serverStatus ? '1' : '0.5'
                            }}
                        >
                            <a target="_blank" rel="noreferrer" onClick={remoteStartUp}>
                                {loading && <SpinnerSvg className="spinner" />}
                                <span style={{ opacity: loading ? '0' : 'unset' }}>
                                    <RemoteSvg /> Remoto
                                </span>
                            </a>
                        </div>
                        <div className="action">
                            <a
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setMethod(DistributionMethod.LOCAL)}
                            >
                                <LocalSvg />
                                Local
                            </a>
                        </div>
                    </div>
                </>
            )}

            {method === DistributionMethod.LOCAL && (
                <>
                    <p className="tip">
                        Seleccione directorio (<code>{baseDir}</code>) base de faststart a
                        modificar.
                    </p>
                    <div className="actions landing-buttons">
                        <div className="action">
                            <input type="file" id="base-dir-input" style={{ display: 'none' }} />
                            <a
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => openSelectDirectory()}
                            >
                                Cambiar Directorio Base
                            </a>
                        </div>
                        <div
                            className="action primary waiter"
                            style={{ pointerEvents: !loading ? 'all' : 'none' }}
                        >
                            <a target="_blank" rel="noreferrer" onClick={continueHandler}>
                                {loading && <SpinnerSvg className="spinner" />}
                                <span style={{ opacity: loading ? '0' : 'unset' }}>
                                    Continuar
                                    <RightSvg />
                                </span>
                            </a>
                        </div>
                    </div>
                </>
            )}

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

            <Versions></Versions>
        </div>
    )
}

export default Landing
