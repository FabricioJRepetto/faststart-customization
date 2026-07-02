import { DistributionMethod, ThemeConfig } from '@shared/types'
import DynamicSvg from '../DynSvg'
import DownloadSvg from '../../assets/download.svg?react'
import DeleteSvg from '../../assets/trash.svg?react'
import ShieldSvg from '../../assets/shield.svg?react'
import StarSvg from '../../assets/star.svg?react'
import ToolSvg from '../../assets/tool.svg?react'
import BlockSvg from '../../assets/block.svg?react'
import AsyncOption from './theme-config-components/AsyncOption'
import mediaServiceController from '@renderer/utils/controllers/mediaServer/mediaServiceController'
import Modal from '../Modal'
import { useState } from 'react'
import {
    loadRemoteThemesCollection,
    parseRemoteAssets,
    validateFiles
} from '@renderer/utils/bootSequence'
import Tooltip from '../Tooltip'
import { DEFAULT_THEME } from '@shared/CONSTANTS'
import { DefaultConfigAtom, DistributionMethodAtom } from '@renderer/utils/context/context'
import { useAtomValue, useSetAtom } from 'jotai'
import { softReset } from '@renderer/utils/reset'
import { preloadAssets } from '@renderer/utils/AssetsPreLoader'

interface Props {
    themeData: ThemeConfig
    closeModal: () => void
}

const ThemeSettings = ({ themeData, closeModal }: Props): React.JSX.Element => {
    const isRemote = useAtomValue(DistributionMethodAtom) === DistributionMethod.REMOTE
    const originalTheme = themeData.themeName === DEFAULT_THEME

    const setDefaultConfig = useSetAtom(DefaultConfigAtom)
    const defaultTheme = themeData.isDefaultTheme
    const [infoModal, setInfoModal] = useState<boolean>(false)

    const [deleteModal, setDeleteModal] = useState<boolean>(false)
    const [modalRes, setModalRes] = useState<{ r: (v: unknown) => void }>()
    const [loading, setLoading] = useState<boolean>(false)

    const exit = (): void => {
        closeModal()
    }

    const setAsDefault = async (): Promise<void> => {
        try {
            setLoading(true)

            const res = await mediaServiceController.setDefaultTheme(themeData.themeName)
            if (!res) {
                throw new Error('Error al definir tema como predefinido')
            }

            await loadRemoteThemesCollection()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const deleteTheme = async (): Promise<void> => {
        //? Modal promise, esperar interacción del usuario para continuar
        setLoading(true)

        const res = await new Promise((res) => {
            setModalRes({ r: res })
            setDeleteModal(true)
        })

        setModalRes(undefined)
        setDeleteModal(false)

        if (res) {
            const res = await mediaServiceController.deleteTheme(themeData.themeName)
            if (res) {
                await loadRemoteThemesCollection()
                setLoading(false)

                exit()
            }
        }
        setLoading(false)
    }

    const modifyTheme = async (): Promise<void> => {
        try {
            setLoading(true)
            softReset()

            const config = await mediaServiceController.getThemeConfig(themeData.themeName)
            if (!config) {
                throw new Error('Configuración no encontrada')
            }

            //* LOAD : Config
            setDefaultConfig(config)
            //* LOAD : Styles & Languages
            validateFiles()
            //* PRE-LOAD : Assets
            await preloadAssets('blobUrl')
            //* LOAD : Assets
            parseRemoteAssets()
            //* LOAD : Themes
            await loadRemoteThemesCollection()

            setInfoModal(true)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const toggleActive = async (): Promise<void> => {
        try {
            setLoading(true)

            const config = await mediaServiceController.getThemeConfig(themeData.themeName)
            if (!config) {
                throw new Error('Configuración no encontrada')
            }
            config.isActive = !config.isActive
            const res = await mediaServiceController.uploadThemeConfig(config, themeData.themeName)
            if (!res) {
                throw new Error('Error al actualizar datos del tema')
            }

            await loadRemoteThemesCollection()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    //TODO - descargar archivos
    const downloadTheme = async (): Promise<void> => {}

    return (
        <div className="theme-config-modal-container">
            <div
                className="theme-config-modal-header"
                style={{ color: themeData.color.primaryColor }}
            >
                {themeData.logo.mime.match('svg') ? (
                    <DynamicSvg
                        config={
                            isRemote
                                ? { assetName: `${themeData.themeName}_${themeData.logo.name}` }
                                : { path: themeData.logo.base64 }
                        }
                    />
                ) : (
                    <img src={themeData.logo.base64} />
                )}
                <h1>{themeData.themeName}</h1>
            </div>

            <div className="theme-config-state-icons-container">
                {originalTheme && (
                    <div className="theme-config-original-icon">
                        <Tooltip text={'Tema original de FastStart'}>
                            <ShieldSvg />
                        </Tooltip>
                    </div>
                )}
                {defaultTheme && (
                    <div className="theme-config-default-icon">
                        <Tooltip text={'Designado como tema por defecto'}>
                            <StarSvg />
                        </Tooltip>
                    </div>
                )}
                {!themeData.isActive && (
                    <div className="theme-config-disabled-icon">
                        <Tooltip text={'Tema desactivado'}>
                            <BlockSvg />
                        </Tooltip>
                    </div>
                )}
            </div>

            <div className="theme-config-modal-options">
                <AsyncOption
                    title={'Definir Default'}
                    action={setAsDefault}
                    status={defaultTheme}
                    disabled={loading || false}
                />
                <AsyncOption
                    title={themeData.isActive ? 'Activo' : 'Inactivo'}
                    action={toggleActive}
                    status={themeData.isActive}
                    disabled={loading || false}
                />
                <AsyncOption
                    title={'Modificar'}
                    action={modifyTheme}
                    status={null}
                    disabled={loading || false}
                    Icon={<ToolSvg />}
                />
                <AsyncOption
                    title={'Descargar'}
                    action={downloadTheme}
                    status={null}
                    disabled={loading || true}
                    Icon={<DownloadSvg />}
                />
                <AsyncOption
                    title={'Eliminar'}
                    action={deleteTheme}
                    status={null}
                    disabled={originalTheme || loading || false}
                    style="tertiary"
                    Icon={<DeleteSvg />}
                />
            </div>

            <div className="theme-config-modal-terminals">
                <h3>Terminales</h3>
                <p>Terminal 1</p>
                <p>Terminal 2</p>
                <p>Terminal 3</p>
                <p>Terminal 4</p>
                <p>Terminal 5</p>
                <p>Terminal 6</p>
                <p>Terminal 7</p>
            </div>

            <div className="actions">
                <div className="action">
                    <a onClick={exit}>Cerrar</a>
                </div>
            </div>

            {deleteModal && (
                <Modal
                    confirm={() => null}
                    close={() => {
                        modalRes!.r(false)
                        setDeleteModal(false)
                    }}
                    minimodal={true}
                >
                    <div className="mini-modal">
                        <h2>¿Borrar tema?</h2>
                        <div className="actions">
                            <div className="action tertiary">
                                <a onClick={() => modalRes!.r(true)}>Borrar</a>
                            </div>
                            <div className="action">
                                <a onClick={() => modalRes!.r(false)}>Cancelar</a>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {infoModal && (
                <Modal confirm={() => !loading && setInfoModal(false)} close={() => !loading && setInfoModal(false)}>
                    <div className="mini-modal">
                        <h2>Configuración de tema cargada</h2>
                        <p>Todo listo para aplicar modificaciones</p>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default ThemeSettings
