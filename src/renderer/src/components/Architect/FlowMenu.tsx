import { useAtom } from 'jotai'
import NewSvg from '../../assets/add.svg?react'
import CloseSvg from '../../assets/cancel.svg?react'
import { SelectedNode } from './FlowStorage'

const FlowMenu = (): React.JSX.Element => {
    const [selectedNode, setSelectedNode] = useAtom(SelectedNode)

    const closeProperties = (): void => {
        setSelectedNode(undefined)
    }

    return (
        <div className="architect-blueprint-sidemenu-container">
            <div className="bubble-menu">
                <div className="bubble-menu-option">
                    <NewSvg />
                </div>
            </div>

            {selectedNode && (
                <div className="properties-menu">
                    <div onClick={closeProperties}>
                        <CloseSvg />
                    </div>

                    <div className="properties-menu-content scrollable">
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FlowMenu
