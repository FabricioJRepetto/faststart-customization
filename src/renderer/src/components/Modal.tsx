import { useEffect } from 'react'

type ModalProps = {
    confirm: () => void
    close: () => void
    children: React.ReactNode // Explicitly defining the children prop
}
const Modal = ({ confirm, close, children }: ModalProps): React.JSX.Element => {
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
            <div className="modal-backdrop" onClick={close}></div>
            <div className="lang-editor-modal">{children}</div>
        </>
    )
}
export default Modal
