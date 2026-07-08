import {
    DefaultConfigAtom,
    DefaultLanguageDataAtom,
    DefaultStylesDataAtom,
    EditedBackgroundsDataAtom,
    EditedLanguageDataAtom,
    EditedStylesDataAtom,
    EditingThemeAtom,
    PreviewScreenIndexAtom
} from '@renderer/utils/context/context'
import { Screens, StylesParentKeys } from '@shared/types'
import { useAtom, useAtomValue } from 'jotai'
import ThemeSvg from '../assets/theme.svg?react'
import NotDefinedSVG from '../assets/not_defined.svg?react'
import Idle from './previewer-screens/Idle'
import Menu from './previewer-screens/Menu'
import Input from './previewer-screens/Input'
import { currentIcon } from '@renderer/utils/currentIcon'
import Success from './previewer-screens/Success'
import Error from './previewer-screens/Error'
import Info from './previewer-screens/Info'
import { navigate } from '@renderer/utils/navigate'

export interface PreviewScreenProps {
    currBg: (name?: string) => string | null
    currIcon: (name: string) => React.JSX.Element | null
    currLang: (lang: string, sect: string, name: string) => string
    currStyle: (parentKey: StylesParentKeys, name: string) => string
}

export const Previewer = (): React.JSX.Element => {
    const [screen, setScreen] = useAtom(PreviewScreenIndexAtom)
    const edinting = useAtomValue(EditingThemeAtom)

    const [ogData] = useAtom(DefaultConfigAtom)
    const [OgStyleData] = useAtom(DefaultStylesDataAtom)

    const [bgData] = useAtom(EditedBackgroundsDataAtom)
    const [styleData] = useAtom(EditedStylesDataAtom)
    const [lngData] = useAtom(EditedLanguageDataAtom)
    const [ogLngData] = useAtom(DefaultLanguageDataAtom)

    const currBg = (name?: string): string | null => {
        try {
            const bg = bgData?.find((e) => e?.name === (name ?? 'background_Idle'))
            return bg?.customBase64 || bg?.blobUrl || null
        } catch (error) {
            console.error(error)
            return null
        }
    }

    const currIcon = (name: string): React.JSX.Element | null => {
        return currentIcon(name) ?? <NotDefinedSVG />
    }

    const currLang = (lang: string, sect: string, name: string): string => {
        try {
            const word =
                lngData?.[lang][sect][name] || ogLngData?.[lang][sect][name] || '[Sin indicar]'
            return word
        } catch (error) {
            console.error(error)
            return '[error]'
        }
    }

    const currStyle = (parentKey: StylesParentKeys, name: string): string => {
        if (name === 'border') {
            const _b = styleData?.[parentKey]?.['border'] ?? OgStyleData?.[parentKey]?.['border']
            return _b
        }

        if (name === 'borderRadius') {
            const customBR = styleData?.[parentKey]?.['borderRadius']
            const _br =
                customBR != null ? customBR + 'px' : OgStyleData?.[parentKey]?.['borderRadius']
            return _br
        }

        const _c = styleData?.[parentKey]?.[name] || OgStyleData?.[parentKey]?.[name]
        return _c
    }

    const editBackground = (): void => {
        const currScreen = SCREENS[screen].key

        switch (currScreen) {
            case 'Idle':
                navigate(Screens.backgrounds)
                break;

            case 'Menu':
                navigate(Screens.backgrounds)
                break;
                
            case 'Input':
                navigate(Screens.backgrounds)
                break;
                
            case 'Success':
                navigate(Screens.backgrounds)
                break;
                
            case 'Error':
                navigate(Screens.backgrounds)
                break;
                
            case 'Info':
                navigate(Screens.backgrounds)
                break;
                        
            default:
                break;
        }
    }

    const SCREENS = [
        <Idle
            key={'Idle'}
            currBg={currBg}
            currIcon={currIcon}
            currLang={currLang}
            currStyle={currStyle}
        />,
        <Menu
            key={'Menu'}
            currBg={currBg}
            currIcon={currIcon}
            currLang={currLang}
            currStyle={currStyle}
        />,
        <Input
            key={'Input'}
            currBg={currBg}
            currIcon={currIcon}
            currLang={currLang}
            currStyle={currStyle}
        />,
        <Success
            key={'Success'}
            currBg={currBg}
            currIcon={currIcon}
            currLang={currLang}
            currStyle={currStyle}
        />,
        <Error
            key={'Error'}
            currBg={currBg}
            currIcon={currIcon}
            currLang={currLang}
            currStyle={currStyle}
        />,
        <Info
            key={'Info'}
            currBg={currBg}
            currIcon={currIcon}
            currLang={currLang}
            currStyle={currStyle}
        />
    ]

    return (
        <div className="preview-wrapper">
            <div className="preview-container">
                <span className="preview-theme-name">
                    {edinting && (
                        <div>
                            <ThemeSvg />
                            <p>{ogData?.themeName}</p>
                        </div>
                    )}
                    <p>{SCREENS[screen].key}</p>
                    <div className="actions">
                        <div className="action" onClick={editBackground}>
                            <a>editar fondo</a>
                        </div>
                        <div className="action">
                            <a>b</a>
                        </div>
                        <div className="action">
                            <a>c</a>
                        </div>
                    </div>
                </span>

                {SCREENS[screen]}

                {SCREENS.length > 1 && (
                    <div className="preview-control">
                        {SCREENS.map((e, i) => (
                            <div
                                key={e.key}
                                onClick={() => setScreen(i)}
                                style={{ backgroundColor: screen === i ? 'white' : '' }}
                            ></div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
