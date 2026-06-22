import {
    DefaultConfigAtom,
    UploadProgressAtom,
    UploadStageAtom
} from '@renderer/utils/context/context'
import { test, unicName } from '@renderer/utils/themesUtils'
import { useAtom, useAtomValue } from 'jotai'
import { useState } from 'react'
import UploadSvg from '../../assets/upload.svg?react'
import SpinnerSvg from '../../assets/spinner.svg?react'
import mediaServiceController from '@renderer/utils/controllers/mediaServer/mediaServiceController'
import { getThemeConfig } from '@renderer/utils/getRawConfig'
import { Screens, UPLOAD_STAGE } from '@shared/types'
import { navigate } from '@renderer/utils/navigate'
import { loadRemoteThemesCollection } from '@renderer/utils/bootSequence'

interface Props {
    closeModal: () => void
}

const UploadDialog = ({ closeModal }: Props): React.JSX.Element => {
    const defaultConfig = useAtomValue(DefaultConfigAtom)
    const [themeName, setThemeName] = useState<string>(defaultConfig?.themeName || '')

    const [loading, setLoading] = useState<boolean>(false)
    const [progress] = useAtom(UploadProgressAtom)
    const [stage, setStage] = useAtom(UploadStageAtom)

    const infoMessage = (ev: UPLOAD_STAGE | undefined): React.JSX.Element => {
        switch (ev) {
            case UPLOAD_STAGE.DONE:
                return (
                    <>
                        <p className="info-message">
                            Tema <span className="gradient-text">{themeName}</span> cargado
                            correctamente
                        </p>
                        <p className="upload-modal-aditional-info">
                            Para administrar temas predefinidos y aplicarlos a terminales, hacerlo desde la sección <span className='gradient-text' onClick={() => {
                                exit()
                                navigate(Screens.collections)
                            }}>Colleciones</span>.
                        </p>
                    </>
                )
            case UPLOAD_STAGE.ERROR:
                return <p className="info-message error-message">Ocurrió un error</p>
            case UPLOAD_STAGE.NOTHING_TO_DO:
                return (
                    <p className="info-message warning-message">
                        No hay archivos que necesiten ser subidos
                    </p>
                )
            case UPLOAD_STAGE.PROCESSING:
                return <p className="info-message">Convirtiendo archivos...</p>
            case UPLOAD_STAGE.UPLOADING:
                return <p className="info-message">Subiendo archivos...</p>
            case UPLOAD_STAGE.FINISHING:
                return <p className="info-message">Finalizando...</p>
            case UPLOAD_STAGE.NAME:
            default:
                return (
                    <p
                        className={`info-message ${!test(themeName) ? 'error-messagge' : !unicName(themeName) ? 'warning-messagge' : ''}`}
                    >
                        {!test(themeName) && 'Solo se permiten letras, números, puntos y guiones'}
                        {!unicName(themeName) && 'Se actualizará el tema actual'}
                    </p>
                )
        }
    }

    const uploadTheme = async (): Promise<void> => {
        try {
            setLoading(true)

            //* Preparar y subir archivos
            const filesRes = await mediaServiceController.uploadThemeAssets(themeName)
            if (!filesRes.length) {
                setLoading(false)
                return
            }

            //* Generar y subir el *_themeConfig.json con los paths correctos
            const config = getThemeConfig(filesRes, themeName)
            const configRes = await mediaServiceController.uploadThemeConfig(config, themeName)
            if (!configRes?.path) throw new Error('Error al subir *_themeConfig.json')
            
            //* Actualizar Collection
            await loadRemoteThemesCollection()

            setStage(UPLOAD_STAGE.DONE)
        } catch (error) {
            console.error(error)
            setStage(UPLOAD_STAGE.ERROR)
        } finally {
            setLoading(false)
        }
    }

    const exit = (): void => {
        closeModal()
        setStage(undefined)
    }

    return (
        <div className="upload-modal-container">
            <h1>
                {stage === UPLOAD_STAGE.DONE ? (
                    'Carga completa'
                ) : (
                    <>
                        {loading ? 'Cargando' : 'Cargar'}{' '}
                        <span className="gradient-text">{loading ? themeName : 'tema'}</span> al
                        servidor
                    </>
                )}
            </h1>
            {(!stage || stage === UPLOAD_STAGE.NAME) && (
                <>
                    <h2>Indicar un nombre para identificarlo</h2>
                    <p className="upload-modal-aditional-info">
                        Si se mantiene el mismo nombre, se actualizará el tema existente.
                    </p>

                    <input
                        style={{
                            pointerEvents: loading ? 'none' : 'all'
                        }}
                        type="text"
                        autoFocus
                        value={themeName}
                        id="lang-value-input"
                        onChange={(e) => !loading && setThemeName(e.target.value)}
                    />
                </>
            )}

            <div className="upload-modal-info-box">
                {loading && <SpinnerSvg className="spinner" />}
                {infoMessage(stage)}
            </div>

            {(!stage || stage === UPLOAD_STAGE.NAME) && (
                <div className="actions">
                    <div className="action">
                        <a onClick={exit}>Cancelar</a>
                    </div>
                    <div
                        className="action primary"
                        style={{ pointerEvents: test(themeName) ? 'all' : 'none' }}
                    >
                        <a onClick={uploadTheme}>
                            Subir
                            <UploadSvg />
                        </a>
                    </div>
                </div>
            )}

            {stage === UPLOAD_STAGE.UPLOADING && (
                <div className="upload-progress-container">
                    <p className="info-message">
                        Progreso{' '}
                        {Math.floor(((progress.ok + progress.failed) * 100) / progress.total || 0)}%
                    </p>
                    <div className="upload-progress-bar">
                        <div
                            style={{
                                width: `${((progress.ok + progress.failed) * 100) / progress.total}%`
                            }}
                        ></div>
                    </div>
                    <div className="upload-progress-details">
                        <code>
                            <p>
                                {progress.currentFile && (
                                    <>
                                        <span className={'getting-status'}></span>
                                        {progress.currentFile}
                                    </>
                                )}
                            </p>
                            <div>
                                <p className="success-messagge">{progress.ok}</p>
                                <p className="error-messagge">{progress.failed}</p>
                                <p>/ {progress.total}</p>
                            </div>
                        </code>
                    </div>
                </div>
            )}

            {stage && stage !== UPLOAD_STAGE.NAME && (
                <div className="actions">
                    <div
                        className="action"
                        style={{
                            pointerEvents: !loading ? 'all' : 'none',
                            opacity: !loading ? '1' : '.35'
                        }}
                    >
                        <a onClick={exit}>Continuar</a>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UploadDialog
