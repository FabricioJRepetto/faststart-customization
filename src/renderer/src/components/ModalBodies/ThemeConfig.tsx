import { ThemeConfig } from '@shared/types'
import DynamicSvg from '../DynSvg'
import DownloadSvg from '../../assets/download.svg?react'
import DeleteSvg from '../../assets/trash.svg?react'
import StarSvg from '../../assets/star.svg?react'
import BlockSvg from '../../assets/block.svg?react'
import AsyncOption from './theme-config-components/AsyncOption'
import mediaServiceController from '@renderer/utils/controllers/mediaServer/mediaServiceController'
import Modal from '../Modal'
import { useState } from 'react'
import { loadRemoteThemesCollection } from '@renderer/utils/bootSequence'
import Tooltip from '../Tooltip'

interface Props {
    themeData: ThemeConfig
    closeModal: () => void
}

const ThemeSettings = ({ themeData, closeModal }: Props): React.JSX.Element => {
    const [deleteModal, setDeleteModal] = useState<boolean>(false)
    const [modalRes, setModalRes] = useState<{ r: (v: unknown) => void }>()
    const [loading, setLoading] = useState<boolean>(false)

    const exit = (): void => {
        closeModal()
    }

    const setAsDefault = async (): Promise<void> => {
        await mediaServiceController.setDefaultTheme(themeData.themeName)
    }
    const deleteTheme = async (): Promise<void> => {
        const res = await new Promise((res) => {
            setModalRes({ r: res })
            setDeleteModal(true)
            setLoading(true)
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

    const toggleActive = async (): Promise<void> => {}
    const downloadTheme = async (): Promise<void> => {}

    return (
        <div className="theme-config-modal-container">
            <div
                className="theme-config-modal-header"
                style={{ color: themeData.color.primaryColor }}
            >
                {themeData.logo.mime.match('svg') ? (
                    <DynamicSvg path={themeData.logo.base64} />
                ) : (
                    <img src={themeData.logo.base64} />
                )}
                <h1>{themeData.themeName}</h1>
            </div>

            <div className="theme-config-state-icons-container">
                {themeData.isDefaultTheme && (
                    <div className="theme-config-default-icon">
                        <Tooltip text={'Designado como tema por defecto'}>
                            <StarSvg />
                        </Tooltip>
                    </div>
                )}
                {themeData.isActive && (
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
                    status={themeData.isDefaultTheme}
                    disabled={loading || false}
                />
                <AsyncOption
                    title={themeData.isActive ? 'Activo' : 'Inactivo'}
                    action={toggleActive}
                    status={themeData.isActive}
                    disabled={loading || true}
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
                    disabled={loading || false}
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
                        <h2>Borrar tema?</h2>
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
        </div>
    )
}

export default ThemeSettings
