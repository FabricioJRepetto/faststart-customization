import {
    DefaultConfigAtom,
    DefaultLanguageDataAtom,
    DefaultStylesDataAtom,
    DistributionMethodAtom,
    EditedBackgroundsDataAtom,
    EditedIconsDataAtom,
    EditedLanguageDataAtom,
    EditedStylesDataAtom,
    PreviewScreenIndexAtom
} from '@renderer/utils/context/context'
import { DistributionMethod, StylesParentKeys } from '@shared/types'
import { useAtom, useAtomValue } from 'jotai'
import ThemeSvg from '../assets/theme.svg?react'
import Idle from './previewr-screens/Idle'
import Menu from './previewr-screens/Menu'
import Input from './previewr-screens/Input'
import DynamicSvg from './DynSvg'

export interface PreviewScreenProps {
    currBg: (name?: string) => string
    currIcon: (name: string) => React.JSX.Element
    currLang: (lang: string, name: string) => string
    currStyle: (parentKey: StylesParentKeys, name: string) => string
}

export const Previewer = (): React.JSX.Element => {
    const isRemote = useAtomValue(DistributionMethodAtom) === DistributionMethod.REMOTE
    const [screen, setScreen] = useAtom(PreviewScreenIndexAtom)

    const [ogData] = useAtom(DefaultConfigAtom)

    const [bgData] = useAtom(EditedBackgroundsDataAtom)
    const [iconData] = useAtom(EditedIconsDataAtom)
    const [lngData] = useAtom(EditedLanguageDataAtom)
    const [ogLngData] = useAtom(DefaultLanguageDataAtom)
    const [stylesData] = useAtom(EditedStylesDataAtom)
    const [ogStylesData] = useAtom(DefaultStylesDataAtom)

    const currBg = (name?: string): string => {
        try {
            const bg = bgData?.find((e) => e?.name === (name ?? 'background_Idle'))
            return bg?.customBase64 || (isRemote ? bg!.filePath : bg!.base64)
        } catch (error) {
            console.error(error)
            return ''
        }
    }

    const currIcon = (name: string): React.JSX.Element => {
        try {            
            const ico = iconData?.find((e) => e?.name === name)
            const isSVG = (ico?.customMimeType || (isRemote ? ico!.mimeType : ico!.mimeType)).match('svg')
            const path = ico?.customBase64 || (isRemote ? ico!.filePath : ico!.base64)

            return isSVG ? <DynamicSvg path={path} /> : <img src={path} />
        } catch (error) {
            console.error(error)
            return <></>
        }
    }

    const currLang = (lang: string, name: string): string => {
        try {
            const word = lngData?.[lang][name] || ogLngData?.[lang][name] || ''
            return word
        } catch (error) {
            console.error(error)
            return ''
        }
    }

    function currStyle(parentKey: StylesParentKeys, name: string): string {
        try {
            const style = stylesData?.[parentKey]?.[name] || ogStylesData?.[parentKey]?.[name]
            if (name === 'borderRadius')
                return style + (stylesData?.[parentKey]?.[name] ? 'px' : '')

            return style
        } catch (error) {
            console.error(error)
            return ''
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
        />
    ]

    return (
        <div className="preview-wrapper">
            <div className="preview-container">
                <span className="preview-theme-name">
                    {ogData?.themeName && (
                        <div>
                            <ThemeSvg />
                            <p>{ogData?.themeName}</p>
                        </div>
                    )}
                    <p>{SCREENS[screen].key}</p>
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
