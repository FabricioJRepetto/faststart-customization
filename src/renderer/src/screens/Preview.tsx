import { Previewer } from '@renderer/components/Previewer'
import { useState } from 'react'
import Modal from '@renderer/components/Modal'
import UploadSvg from '../assets/upload.svg?react'
import IconsSvg from '../assets/sticker.svg?react'
import ColorsSvg from '../assets/colors.svg?react'
import BackgroundsSvg from '../assets/image.svg?react'
import LanguageSvg from '../assets/translate.svg?react'
import ScreenSvg from '../assets/screen.svg?react'
import AudioSvg from '../assets/audio.svg?react'
import UploadDialog from '@renderer/components/ModalBodies/UploadDialog'
import { useAtomValue, useSetAtom } from 'jotai'
import { CurrentScreenAtom, EditingThemeAtom } from '@renderer/utils/context/context'
import { Screens } from '@shared/types'

export const Preview = (): React.JSX.Element => {
    const setScreen = useSetAtom(CurrentScreenAtom)

    const [loadingUpload, setLoadingUpload] = useState<boolean>(false)
    const [modalUpload, setModalUpload] = useState<boolean>(false)
    const edinting = useAtomValue(EditingThemeAtom)

    const openUploadModal = (): void => {
        setModalUpload(true)
        setLoadingUpload(true)
    }

    return (
        <div className={`screen-content main-screen-container`}>
            <>
                <div className="screen-header">
                    <h1>{edinting ? 'Editando tema' : 'Creando nuevo tema'}</h1>

                    <div className="header-group">
                        <div
                            className="action primary"
                            style={{
                                pointerEvents: !loadingUpload ? 'all' : 'none'
                            }}
                        >
                            <a onClick={openUploadModal}>
                                Subir
                                <UploadSvg />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="main-screen-content">
                    <Previewer />

                    <div className="actions preview-actions">
                        <div className="action">
                            <a
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setScreen(Screens.icons)}
                            >
                                <IconsSvg />
                                Iconos
                            </a>
                        </div>
                        <div className="action">
                            <a
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setScreen(Screens.backgrounds)}
                            >
                                <BackgroundsSvg />
                                Fondos
                            </a>
                        </div>
                        <div className="action">
                            <a
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setScreen(Screens.audio)}
                            >
                                <AudioSvg />
                                Audios
                            </a>
                        </div>
                        <div className="action">
                            <a
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setScreen(Screens.thirdScreen)}
                            >
                                <ScreenSvg />
                                Tercer pantalla
                            </a>
                        </div>
                        <div className="action">
                            <a
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setScreen(Screens.styles)}
                            >
                                <ColorsSvg />
                                Estilos
                            </a>
                        </div>
                        <div className="action">
                            <a
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setScreen(Screens.languages)}
                            >
                                <LanguageSvg />
                                Textos
                            </a>
                        </div>
                    </div>

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
