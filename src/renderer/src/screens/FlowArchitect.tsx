import Tooltip from '@renderer/components/Tooltip'
import HomeSvg from '../assets/home.svg?react'
import { useSetAtom } from 'jotai'
import { CurrentScreenAtom } from '@renderer/utils/context/context'
import { Screens } from '@shared/types'
import CanvasOverlay from '@renderer/components/Architect/CanvasOverlay'
import Canvas from '@renderer/components/Architect/Canvas'

const FlowArchitect = (): React.JSX.Element => {
    const setScreen = useSetAtom(CurrentScreenAtom)

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

                <h1>Arquitecto de flujos</h1>

                <code className="architect-key-shortcuts">[wheel] zoom, [supr]/[backspace]borra conexión</code>
            </div>

            <div className="architect-blueprint-container">
                <Canvas />

                <CanvasOverlay />
            </div>
        </div>
    )
}

export default FlowArchitect
