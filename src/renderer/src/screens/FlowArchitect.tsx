import CanvasOverlay from '@renderer/components/Architect/CanvasOverlay'
import Canvas from '@renderer/components/Architect/Canvas'
import { useState } from 'react'
import Modal from '@renderer/components/Modal'
import UploadDiagramDialog from '@renderer/components/ModalBodies/UploadDiagramDialog'
import ChangeDiagram from '@renderer/components/ModalBodies/ChangeDiagram'
import CanvasMenubar from '@renderer/components/Architect/CanvasMenubar'

const FlowArchitect = (): React.JSX.Element => {
    const [loading, setLoading] = useState<boolean>(false)
    const [modalUpload, setModalUpload] = useState<boolean>(false)
    const [modalChangeDiagram, setModalChangeDiagram] = useState<boolean>(false)

    const openUploadModal = (): void => {
        setModalUpload(true)
        setLoading(true)
    }

    const openChangeDiagramModal = (): void => {
        setModalChangeDiagram(true)
    }

    return (
        <div className="architect-screen-content">
            <CanvasMenubar
                loading={loading}
                openUploadModal={openUploadModal}
                openChangeDiagramModal={openChangeDiagramModal}
            />

            <div className="architect-blueprint-container">
                <Canvas />

                <CanvasOverlay />
            </div>
            {modalUpload && (
                <Modal
                    confirm={() => !loading && setModalUpload(false)}
                    close={() => !loading && setModalUpload(false)}
                >
                    <UploadDiagramDialog
                        closeModal={() => {
                            setModalUpload(false)
                            setLoading(false)
                        }}
                    />
                </Modal>
            )}
            {modalChangeDiagram && (
                <Modal
                    confirm={() => !loading && setModalChangeDiagram(false)}
                    close={() => !loading && setModalChangeDiagram(false)}
                >
                    <ChangeDiagram
                        closeModal={() => {
                            setModalChangeDiagram(false)
                        }}
                    />
                </Modal>
            )}
        </div>
    )
}

export default FlowArchitect
