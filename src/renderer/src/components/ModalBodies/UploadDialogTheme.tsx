import {
    DefaultThemeConfigAtom,
    UploadProgressAtom,
    UploadSetAsDefaultThemeAtom,
    UploadStageAtom
} from '@renderer/utils/context/context'
import { validName, unicName, permittedName } from '@renderer/utils/themesUtils'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import UploadSvg from '../../assets/upload.svg?react'
import SpinnerSvg from '../../assets/spinner.svg?react'
import mediaServiceController from '@renderer/utils/controllers/mediaServer/mediaServiceController'
import { getThemeConfig } from '@renderer/utils/getRawConfig'
import { Screens, UPLOAD_STAGE } from '@renderer/types/types.d'
import { navigate } from '@renderer/utils/navigate'
import { loadDefaultConfigurations, loadThemesCollection } from '@renderer/utils/bootSequence'

interface Props {
    closeModal: () => void
}

const UploadDialogTheme = ({ closeModal }: Props): React.JSX.Element => {
    const defaultConfig = useAtomValue(DefaultThemeConfigAtom)
    const [themeName, setThemeName] = useState<string>(defaultConfig?.themeName || '')
    const setAsDefault = useSetAtom(UploadSetAsDefaultThemeAtom)

    const [loading, setLoading] = useState<boolean>(false)
    const [progress] = useAtom(UploadProgressAtom)
    const [stage, setStage] = useAtom(UploadStageAtom)

    // eslint-disable-next-line
    useEffect(() => setStage(UPLOAD_STAGE.NAME), [])

    const infoMessage = (ev: UPLOAD_STAGE | undefined): React.JSX.Element => {
        switch (ev) {
            case UPLOAD_STAGE.DONE:
                return (
                    <div style={{ marginTop: '60px' }}>
                        <p className="info-message">
                            Tema <span className="gradient-text">{themeName}</span> cargado
                            correctamente
                        </p>
                        <p
                            className="upload-modal-aditional-info"
                            style={{ marginTop: '10px', paddingLeft: '10px' }}
                        >
                            Para administrar temas predefinidos y aplicarlos a terminales, hacerlo
                            desde la sección{' '}
                            <span
                                style={{ cursor: 'pointer' }}
                                className="gradient-text"
                                onClick={() => {
                                    exit()
                                    navigate(Screens.collections)
                                }}
                            >
                                Colleciones
                            </span>
                            .
                        </p>
                    </div>
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
                        className={`info-message ${!validName(themeName) ? 'error-messagge' : !unicName(themeName) ? 'warning-messagge' : ''}`}
                    >
                        {!validName(themeName) && 'Solo se permiten letras, números, puntos y guiones'}
                        {!unicName(themeName) && 'Se actualizará el tema actual'}
                        {!permittedName(themeName) && 'Nombre no permitido'}
                    </p>
                )
        }
    }

    const uploadTheme = async (): Promise<void> => {
        if (!permittedName(themeName)) return

        try {
            setLoading(true)

            //* Preparar y subir archivos
            const filesRes = await mediaServiceController.uploadThemeAssets(themeName)
            if (!filesRes.length) console.warn('Ningún archivo subido')                
            console.warn(filesRes)

            //* Generar y subir el *_themeConfig.json con los paths correctos
            const config = getThemeConfig(filesRes, themeName)
            console.warn(config)
            
            const configRes = await mediaServiceController.uploadThemeConfig(config, themeName)
            if (!configRes?.path) throw new Error('Error al subir *_themeConfig.json')

            // //* Actualizar Collection
            await loadThemesCollection()
            // //* Actualizar Default Configs
            await loadDefaultConfigurations()

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
        setStage(UPLOAD_STAGE.NAME)
        setAsDefault(false)
    }

    const toggleDefault = (v: React.ChangeEvent<HTMLInputElement>): void => {
        console.log(v.target.checked)
        setAsDefault(v.target.checked)
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

                    <label htmlFor="toggleDefaultCheckbox" className="upload-modal-checkbox">
                        <input
                            type="checkbox"
                            value={'true'}
                            id="toggleDefaultCheckbox"
                            onChange={toggleDefault}
                        />

                        <span>Definir como predeterminado al concluir</span>
                    </label>

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

                    <div className="upload-modal-info-box">{infoMessage(stage)}</div>

                    <div className="actions">
                        <div className="action">
                            <a onClick={exit}>Cancelar</a>
                        </div>
                        <div
                            className="action primary"
                            style={{ pointerEvents: validName(themeName) ? 'all' : 'none' }}
                        >
                            <a onClick={uploadTheme}>
                                Subir
                                <UploadSvg />
                            </a>
                        </div>
                    </div>
                </>
            )}

            {stage && stage !== UPLOAD_STAGE.NAME && (
                <div className="upload-modal-info-box">
                    {loading && <SpinnerSvg className="spinner" />}
                    {infoMessage(stage)}
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

export default UploadDialogTheme
