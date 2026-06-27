import { CurrentScreenAtom } from '@renderer/utils/context/context'
import { useAtom } from 'jotai'
import MainSvg from '../assets/preview.svg?react'
import IconsSvg from '../assets/sticker.svg?react'
import ColorsSvg from '../assets/palette.svg?react'
import BackgroundsSvg from '../assets/image.svg?react'
import LanguageSvg from '../assets/dictionary.svg?react'
import ScreenSvg from '../assets/screen.svg?react'
import AudioSvg from '../assets/audio.svg?react'
import CollectionSvg from '../assets/storage.svg?react'
import ThePittSvg from '../assets/black-hole.svg?react'
import ExitSvg from '../assets/logout.svg?react'
import { Screens } from '@shared/types'
import { reset } from '@renderer/utils/reset'
import Tooltip from './Tooltip'

const SidebarMenu = (): React.JSX.Element => {
    const [screen, setScreen] = useAtom(CurrentScreenAtom)
    const renderSidebar = screen !== Screens.landing

    return renderSidebar ? (
        <div className={`sidebar closed`}>
            <Tooltip text="Main">
                <a
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setScreen(Screens.main)}
                    className={screen === Screens.main ? 'selected' : ''}
                >
                    <MainSvg />
                </a>
            </Tooltip>

            <div className="sidebard-divider"></div>

            <Tooltip text="Iconos">
                <a
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setScreen(Screens.icons)}
                    className={screen === Screens.icons ? 'selected' : ''}
                >
                    <IconsSvg />
                </a>
            </Tooltip>

            <Tooltip text="Estilos">
                <a
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setScreen(Screens.styles)}
                    className={screen === Screens.styles ? 'selected' : ''}
                >
                    <ColorsSvg />
                </a>
            </Tooltip>
            <Tooltip text="Fondos de pantalla">
                <a
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setScreen(Screens.backgrounds)}
                    className={screen === Screens.backgrounds ? 'selected' : ''}
                >
                    <BackgroundsSvg />
                </a>
            </Tooltip>
            <Tooltip text="Diccionario">
                <a
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setScreen(Screens.languages)}
                    className={screen === Screens.languages ? 'selected' : ''}
                >
                    <LanguageSvg />
                </a>
            </Tooltip>
            <Tooltip text="Tercer pantalla">
                <a
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setScreen(Screens.thirdScreen)}
                    className={screen === Screens.thirdScreen ? 'selected' : ''}
                >
                    <ScreenSvg />
                </a>
            </Tooltip>
            <Tooltip text="Audios">
                <a
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setScreen(Screens.audio)}
                    className={screen === Screens.audio ? 'selected' : ''}
                >
                    <AudioSvg />
                </a>
            </Tooltip>

            <Tooltip text="Colecciones">
                <a
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setScreen(Screens.collections)}
                    className={screen === Screens.collections ? 'selected' : ''}
                >
                    <CollectionSvg />
                </a>
            </Tooltip>
            <Tooltip text="the_Pit">
                <a
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setScreen(Screens.thePit)}
                    className={screen === Screens.thePit ? 'selected' : ''}
                >
                    <ThePittSvg />
                </a>
            </Tooltip>

            <div className="sidebard-divider"></div>

            <Tooltip text="Salir">
                <a target="_blank" rel="noreferrer" onClick={reset}>
                    <ExitSvg />
                </a>
            </Tooltip>
        </div>
    ) : (
        <></>
    )
}

export default SidebarMenu
