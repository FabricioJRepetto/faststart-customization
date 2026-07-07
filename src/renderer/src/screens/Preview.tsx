import { useAtom } from 'jotai'
import { CustomEnabledAtom } from '@renderer/utils/context/context'
import { Previewer } from '@renderer/components/Previewer'
import { useState } from 'react'
import PowerSvg from '../assets/powerb.svg?react'
import Modal from '@renderer/components/Modal'
import SpinnerSvg from '../assets/spinner.svg?react'
import UploadSvg from '../assets/upload.svg?react'
import RemotePill from '@renderer/components/RemotePill'
import UploadDialog from '@renderer/components/ModalBodies/UploadDialog'
import mediaServiceController from '@renderer/utils/controllers/mediaServer/mediaServiceController'

export const Preview = (): React.JSX.Element => {
    const [customEnabled, setCustomEnabled] = useAtom(CustomEnabledAtom)
    const [loadingApply, setLoadingApply] = useState<boolean>(false)

    const toggleCustomEnabled = async (): Promise<void> => {
        setLoadingApply(true)
        setCustomEnabled(!customEnabled)

        const res = await mediaServiceController.toggleCustomization()
        if (res) console.log('Customization toggled')
        else console.log('Error toggling customizations')

        setLoadingApply(false)
    }

    //_-_-_-_-_-_-_-_-_-_- REMOTE _-_-_-_-_-_-_-_-_-_-

    const [loadingUpload, setLoadingUpload] = useState<boolean>(false)
    const [modalUpload, setModalUpload] = useState<boolean>(false)

    const openUploadModal = (): void => {
        setModalUpload(true)
        setLoadingUpload(true)
    }

    return (
        <div className={`screen-content main-screen-container`}>
            <>
                <div className="screen-header">
                    <h1>Previsualización</h1>
                    <div className="toggler">
                        <div
                            className="input-wrapper"
                            onClick={() => !loadingApply && toggleCustomEnabled()}
                        >
                            Customización
                            <button className={customEnabled ? '' : 'power-off'}>
                                {loadingApply ? <SpinnerSvg className="spinner" /> : <PowerSvg />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="main-screen-content">
                    <Previewer />

                    <div className="actions main-actions">
                        <div
                            className="action primary"
                            style={{
                                pointerEvents: !loadingApply ? 'all' : 'none'
                            }}
                        >
                            <a onClick={openUploadModal}>
                                Subir
                                <UploadSvg />
                            </a>
                        </div>
                    </div>

                    <RemotePill />

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
