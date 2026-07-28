import { ScreenType } from '../types'
import { newNode } from '../utils/presets'
import CloseSvg from '../../../assets/close_small.svg?react'

interface Props {
    visible: boolean
    close: () => void
}

const NewNodeMiniMenu = ({ visible, close }: Props): React.JSX.Element => {
    const addNode = (t: ScreenType): void => {
        newNode(t)
        close()
    }

    if (!visible) return <></>

    return (
        <div className="minimenu-container">
            <div className="minimenu-container-header-button" onClick={close}>
                <CloseSvg />
            </div>
            <div className="actions">
                <div className="action">
                    <a target="_blank" rel="noreferrer" onClick={() => addNode(ScreenType.idle)}>
                        Idle
                    </a>
                </div>
                <div className="action">
                    <a
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => addNode(ScreenType.userAction)}
                    >
                        User Action
                    </a>
                </div>
                <div className="action">
                    <a
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => addNode(ScreenType.infoScreen)}
                    >
                        Info
                    </a>
                </div>
                <div className="action">
                    <a
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => addNode(ScreenType.successScreen)}
                    >
                        Success Screen
                    </a>
                </div>
                <div className="action">
                    <a
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => addNode(ScreenType.errorScreen)}
                    >
                        Error Screen
                    </a>
                </div>
                <div className="action">
                    <a target="_blank" rel="noreferrer" onClick={() => addNode(ScreenType.config)}>
                        Configuration
                    </a>
                </div>
                <div className="action">
                    <a target="_blank" rel="noreferrer" onClick={() => addNode(ScreenType.close)}>
                        Close
                    </a>
                </div>
            </div>
        </div>
    )
}

export default NewNodeMiniMenu
