import { useEffect } from 'react'

type ModalProps = {
    confirm: () => void
    close: () => void
    children: React.ReactNode // Explicitly defining the children prop
    minimodal?: boolean
}
const Modal = ({ confirm, close, children, minimodal = false }: ModalProps): React.JSX.Element => {
    useEffect(() => {
        const keysListener = (e: KeyboardEvent): void => {
            switch (e.key) {
                case 'Enter':
                    confirm()
                    break
                case 'Escape':
                    close()
                    break
                default:
                    break
            }
        }

        addEventListener('keyup', keysListener)

        return () => {
            removeEventListener('keyup', keysListener)
        }
    }, [close, confirm])

    return (
        <>
            <div className="modal-backdrop" onClick={close} style={{zIndex: minimodal ? 102 : 101}}></div>
            <div className="lang-editor-modal" style={{zIndex: minimodal ? 103 : 102}}>{children}</div>
        </>
    )
}
export default Modal
