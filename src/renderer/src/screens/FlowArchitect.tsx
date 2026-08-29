import Tooltip from '@renderer/components/Tooltip'
import HomeSvg from '../assets/home.svg?react'
import SaveSvg from '../assets/save.svg?react'
import { useSetAtom } from 'jotai'
import { CurrentScreenAtom } from '@renderer/utils/context/context'
import { Screens } from '@renderer/types/types.d'
import CanvasOverlay from '@renderer/components/Architect/CanvasOverlay'
import Canvas from '@renderer/components/Architect/Canvas'
import { useState } from 'react'
import Modal from '@renderer/components/Modal'
import UploadDialogDiagram from '@renderer/components/ModalBodies/UploadDialogDiagram'

const FlowArchitect = (): React.JSX.Element => {
    const setScreen = useSetAtom(CurrentScreenAtom)

    const [loadingUpload, setLoadingUpload] = useState<boolean>(false)
    const [modalUpload, setModalUpload] = useState<boolean>(false)

    const openUploadModal = (): void => {
        setModalUpload(true)
        setLoadingUpload(true)
    }

    return (
        <div className="architect-screen-content">
            <div className="architect-blueprint-header">
                <div className="header-group">
                    <Tooltip text="Main">
                        <div className="header-icon" onClick={() => setScreen(Screens.main)}>
                            <HomeSvg />
                        </div>
                    </Tooltip>
                </div>

                <h1>Architect</h1>
                <code className="architect-key-shortcuts">
                    [wheel] zoom, [supr]/[backspace]borra conexión
                </code>

                <div className="header-group">
                    <Tooltip text="Guardar">
                        <div
                            className="action primary"
                            style={{
                                pointerEvents: !loadingUpload ? 'all' : 'none'
                            }}
                        >
                            <a onClick={openUploadModal}>
                                Subir
                                <SaveSvg />
                            </a>
                        </div>
                    </Tooltip>
                </div>
            </div>

            <div className="architect-blueprint-container">
                <Canvas />

                <CanvasOverlay />
            </div>

            {modalUpload && (
                <Modal
                    confirm={() => !loadingUpload && setModalUpload(false)}
                    close={() => !loadingUpload && setModalUpload(false)}
                >
                    <UploadDialogDiagram
                        closeModal={() => {
                            setModalUpload(false)
                            setLoadingUpload(false)
                        }}
                    />
                </Modal>
            )}
        </div>
    )
}

export default FlowArchitect
