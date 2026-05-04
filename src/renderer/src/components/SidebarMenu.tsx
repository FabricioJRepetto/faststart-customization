import {
    ClientAppVersionDirAtom,
    CurrentScreenAtom,
    SupervisorAppVersionDirAtom,
    ThirdAppVersionDirAtom
} from '@renderer/utils/context/context'
import { useAtom, useSetAtom } from 'jotai'
import MainSvg from '../assets/preview.svg?react'
import IconsSvg from '../assets/sticker.svg?react'
import ColorsSvg from '../assets/palette.svg?react'
import BackgroundsSvg from '../assets/image.svg?react'
import LanguageSvg from '../assets/dictionary.svg?react'
import ScreenSvg from '../assets/screen.svg?react'
import AudioSvg from '../assets/audio.svg?react'
import CollectionSvg from '../assets/box.svg?react'
import ExitSvg from '../assets/logout.svg?react'
import { Screens } from '@shared/types'

const SidebarMenu = (): React.JSX.Element => {
    const [screen, setScreen] = useAtom(CurrentScreenAtom)
    const renderSidebar = screen !== Screens.landing

    // const rootDir = useAtomValue(RootDirectoryAtom)
    const setClientVersionDir = useSetAtom(ClientAppVersionDirAtom)
    const setSuperVersionDir = useSetAtom(SupervisorAppVersionDirAtom)
    const setThirdVersionDir = useSetAtom(ThirdAppVersionDirAtom)

    return renderSidebar ? (
        <div className={`sidebar closed`}>
            <a
                target="_blank"
                rel="noreferrer"
                onClick={() => setScreen(Screens.main)}
                className={screen === Screens.main ? 'selected' : ''}
            >
                <MainSvg />
            </a>

            <div className="sidebard-divider"></div>

            <a
                target="_blank"
                rel="noreferrer"
                onClick={() => setScreen(Screens.icons)}
                className={screen === Screens.icons ? 'selected' : ''}
            >
                <IconsSvg />
            </a>
            <a
                target="_blank"
                rel="noreferrer"
                onClick={() => setScreen(Screens.styles)}
                className={screen === Screens.styles ? 'selected' : ''}
            >
                <ColorsSvg />
            </a>
            <a
                target="_blank"
                rel="noreferrer"
                onClick={() => setScreen(Screens.backgrounds)}
                className={screen === Screens.backgrounds ? 'selected' : ''}
            >
                <BackgroundsSvg />
            </a>
            <a
                target="_blank"
                rel="noreferrer"
                onClick={() => setScreen(Screens.languages)}
                className={screen === Screens.languages ? 'selected' : ''}
            >
                <LanguageSvg />
            </a>
            <a
                target="_blank"
                rel="noreferrer"
                onClick={() => setScreen(Screens.thirdScreen)}
                className={screen === Screens.thirdScreen ? 'selected' : ''}
            >
                <ScreenSvg />
            </a>
            <a
                target="_blank"
                rel="noreferrer"
                onClick={() => setScreen(Screens.audio)}
                className={screen === Screens.audio ? 'selected' : ''}
            >
                <AudioSvg />
            </a>

            <a
                target="_blank"
                rel="noreferrer"
                onClick={() => setScreen(Screens.collections)}
                className={screen === Screens.collections ? 'selected' : ''}
            >
                <CollectionSvg />
            </a>

            <div className="sidebard-divider"></div>

            <a
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                    setClientVersionDir('')
                    setSuperVersionDir('')
                    setThirdVersionDir('')
                    setScreen(Screens.landing)
                }}
            >
                <ExitSvg />
            </a>
        </div>
    ) : (
        <></>
    )
}

export default SidebarMenu
