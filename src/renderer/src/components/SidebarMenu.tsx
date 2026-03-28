import { CurrentScreenAtom } from '@renderer/utils/context/context'
import { Screens } from '@renderer/utils/types'
import { useAtom } from 'jotai'
import { useState } from 'react'
import CloseSvg from '../assets/left.svg'
import OpenSvg from '../assets/right.svg'
import IconsSvg from '../assets/sticker.svg?react'
import ColorsSvg from '../assets/palette.svg?react'
import BackgroundsSvg from '../assets/image.svg?react'
import LanguageSvg from '../assets/dictionary.svg?react'
import ScreenSvg from '../assets/screen.svg?react'
import ExitSvg from '../assets/door.svg?react'

const SidebarMenu = (): React.JSX.Element => {
    const [screen, setScreen] = useAtom(CurrentScreenAtom)
    const [isOpen, setIsOpen] = useState<boolean>(true)
    const renderSidebar = screen !== Screens.landing

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
                onClick={() => setScreen(Screens.icons)}
                className={screen === Screens.icons ? 'selected' : ''}
            >
                <IconsSvg />
                {isOpen ? <span>Iconos</span> : ''}
            </a>
            <a
                target="_blank"
                rel="noreferrer"
                onClick={() => setScreen(Screens.colors)}
                className={screen === Screens.colors ? 'selected' : ''}
            >
                <ColorsSvg />
                {isOpen ? <span>Colores</span> : null}
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

            <a target="_blank" rel="noreferrer" onClick={() => setScreen(Screens.landing)}>
                <ExitSvg />
                {isOpen ? <span>Salir</span> : null}
            </a>
        </div>
    ) : (
        <></>
    )
}

export default SidebarMenu
