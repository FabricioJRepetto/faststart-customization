import { CurrentScreenAtom, FirstLoadAtom } from '@renderer/utils/context/context'
import { useAtom, useAtomValue } from 'jotai'
import HomeSvg from '../assets/home.svg?react'
import PreviewSvg from '../assets/preview.svg?react'
import { Screens } from '@shared/types'
import Tooltip from './Tooltip'

const SidebarMenu = (): React.JSX.Element => {
    const [screen, setScreen] = useAtom(CurrentScreenAtom)
    const renderSidebar = screen !== Screens.landing
    const firstLoad = useAtomValue(FirstLoadAtom)

    return renderSidebar ? (
        <div className={`sidebar closed ${firstLoad ? 'fade-in' : ''}`}>
            <div>
                <Tooltip text="Main">
                    <a
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setScreen(Screens.main)}
                        className={screen === Screens.main ? 'selected' : ''}
                    >
                        <HomeSvg />
                    </a>
                </Tooltip>

                <div className="sidebard-divider"></div>

                <Tooltip text="Preview">
                    <a
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setScreen(Screens.preview)}
                        className={screen === Screens.preview ? 'selected' : ''}
                    >
                        <PreviewSvg />
                    </a>
                </Tooltip>
            </div>

            <div></div>
        </div>
    ) : (
        <></>
    )
}

export default SidebarMenu
