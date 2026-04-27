import {
    ClientAppVersionDirAtom,
    CurrentScreenAtom,
    RootDirectoryAtom,
    SupervisorAppVersionDirAtom,
    ThirdAppVersionDirAtom
} from '@renderer/utils/context/context'
import { useAtom, useAtomValue } from 'jotai'
import { useState } from 'react'
import CloseSvg from '../assets/left.svg'
import OpenSvg from '../assets/right.svg'
import MainSvg from '../assets/main.svg?react'
import IconsSvg from '../assets/sticker.svg?react'
import ColorsSvg from '../assets/palette.svg?react'
import BackgroundsSvg from '../assets/image.svg?react'
import LanguageSvg from '../assets/dictionary.svg?react'
import ScreenSvg from '../assets/screen.svg?react'
import AudioSvg from '../assets/audio.svg?react'
import ExitSvg from '../assets/door.svg?react'
import { Screens } from '@shared/types'

const SidebarMenu = (): React.JSX.Element => {
    const [screen, setScreen] = useAtom(CurrentScreenAtom)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const renderSidebar = screen !== Screens.landing

    const rootDir = useAtomValue(RootDirectoryAtom)
    const [clientVersionDir, setClientVersionDir] = useAtom(ClientAppVersionDirAtom)
    const [superVersionDir, setSuperVersionDir] = useAtom(SupervisorAppVersionDirAtom)
    const [thirdVersionDir, setThirdVersionDir] = useAtom(ThirdAppVersionDirAtom)

    return renderSidebar ? (
        <div className={`sidebar ${isOpen ? '' : 'closed'}`}>
            <img
                alt="toggle sidebar"
                src={isOpen ? CloseSvg : OpenSvg}
                onClick={() => setIsOpen((v) => !v)}
            />
            <a
                target="_blank"
                rel="noreferrer"
                onClick={() => setScreen(Screens.main)}
                className={screen === Screens.main ? 'selected' : ''}
            >
                <MainSvg />
                {isOpen ? <span>Main</span> : ''}
            </a>
            <a
                target="_blank"
                rel="noreferrer"
                onClick={() => setScreen(Screens.icons)}
                className={screen === Screens.icons ? 'selected' : ''}
            >
                <IconsSvg />
                {isOpen ? <span>Iconos</span> : ''}
            </a>
            <a
                target="_blank"
                rel="noreferrer"
                onClick={() => setScreen(Screens.styles)}
                className={screen === Screens.styles ? 'selected' : ''}
            >
                <ColorsSvg />
                {isOpen ? <span>Estilos</span> : null}
            </a>
            <a
                target="_blank"
                rel="noreferrer"
                onClick={() => setScreen(Screens.backgrounds)}
                className={screen === Screens.backgrounds ? 'selected' : ''}
            >
                <BackgroundsSvg />
                {isOpen ? <span>Fondos</span> : null}
            </a>
            <a
                target="_blank"
                rel="noreferrer"
                onClick={() => setScreen(Screens.languages)}
                className={screen === Screens.languages ? 'selected' : ''}
            >
                <LanguageSvg />
                {isOpen ? <span>Lenguajes</span> : null}
            </a>
            <a
                target="_blank"
                rel="noreferrer"
                onClick={() => setScreen(Screens.thirdScreen)}
                className={screen === Screens.thirdScreen ? 'selected' : ''}
            >
                <ScreenSvg />
                {isOpen ? <span>Tercera Pantalla</span> : null}
            </a>
            <a
                target="_blank"
                rel="noreferrer"
                onClick={() => setScreen(Screens.audio)}
                className={screen === Screens.audio ? 'selected' : ''}
            >
                <AudioSvg />
                {isOpen ? <span>Sonidos</span> : null}
            </a>

            {isOpen ? <span>{rootDir}</span> : null}
            {isOpen ? <span>{clientVersionDir.split('/').pop()}</span> : null}
            {isOpen ? <span>{superVersionDir.split('/').pop()}</span> : null}
            {isOpen ? <span>{thirdVersionDir.split('/').pop()}</span> : null}

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
                {isOpen ? <span>Salir</span> : null}
            </a>
        </div>
    ) : (
        <></>
    )
}

export default SidebarMenu
