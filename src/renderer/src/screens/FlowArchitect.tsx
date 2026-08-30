import Tooltip from '@renderer/components/Tooltip'
import HomeSvg from '../assets/home.svg?react'
import ResetSvg from '../assets/undo.svg?react'
import SaveSvg from '../assets/save.svg?react'
import LoadSvg from '../assets/download.svg?react'
import { useSetAtom } from 'jotai'
import { CurrentScreenAtom } from '@renderer/utils/context/context'
import { Screens } from '@renderer/types/types.d'
import CanvasOverlay from '@renderer/components/Architect/CanvasOverlay'
import Canvas from '@renderer/components/Architect/Canvas'
import { useState } from 'react'
import Modal from '@renderer/components/Modal'
import UploadDiagramDialog from '@renderer/components/ModalBodies/UploadDiagramDialog'
import ChangeDiagram from '@renderer/components/ModalBodies/ChangeDiagram'
import { FlowEdges, FlowNodes } from '@renderer/components/Architect/FlowStorage'
import { initialEdges, initialNodes } from '@renderer/components/Architect/utils/presets'

const FlowArchitect = (): React.JSX.Element => {
    const setScreen = useSetAtom(CurrentScreenAtom)
    const setNodes = useSetAtom(FlowNodes)
    const setEdges = useSetAtom(FlowEdges)

    const [loadingUpload, setLoadingUpload] = useState<boolean>(false)
    const [modalUpload, setModalUpload] = useState<boolean>(false)
    const [modalChangeDiagram, setModalChangeDiagram] = useState<boolean>(false)

    const resetDiagram = (): void => {
        setNodes(initialNodes)
        setEdges(initialEdges)
    }

    const openUploadModal = (): void => {
        setModalUpload(true)
        setLoadingUpload(true)
    }

    const openChangeDiagramModal = (): void => {
        setModalChangeDiagram(true)
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

                <div className="header-group end-header">
                    <Tooltip text="Guardar diagrama">
                        <div
                            className="action primary"
                            style={{
                                pointerEvents: !loadingUpload ? 'all' : 'none'
                            }}
                        >
                            <a onClick={openUploadModal}>
                                <SaveSvg />
                            </a>
                        </div>
                    </Tooltip>
                    <Tooltip text="Cargar diagrama">
                        <div
                            className="action"
                            style={{
                                pointerEvents: !loadingUpload ? 'all' : 'none'
                            }}
                        >
                            <a onClick={openChangeDiagramModal}>
                                <LoadSvg />
                            </a>
                        </div>
                    </Tooltip>
                    <Tooltip text="Resetear diagrama">
                        <div
                            className="action tertiary"
                            style={{
                                pointerEvents: !loadingUpload ? 'all' : 'none'
                            }}
                        >
                            <a onClick={resetDiagram}>
                                <ResetSvg />
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
                    <UploadDiagramDialog
                        closeModal={() => {
                            setModalUpload(false)
                            setLoadingUpload(false)
                        }}
                    />
                </Modal>
            )}

            {modalChangeDiagram && (
                <Modal
                    confirm={() => !loadingUpload && setModalChangeDiagram(false)}
                    close={() => !loadingUpload && setModalChangeDiagram(false)}
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
