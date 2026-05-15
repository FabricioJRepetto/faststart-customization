import {
    DefaultConfigAtom,
    // DefaultConfigAtom,
    DefaultLanguageDataAtom,
    DefaultStylesDataAtom,
    EditedBackgroundsDataAtom,
    EditedIconsDataAtom,
    EditedLanguageDataAtom,
    EditedStylesDataAtom
} from '@renderer/utils/context/context'
import { StylesParentKeys } from '@shared/types'
import { useAtom } from 'jotai'
import ThemeSvg from '../assets/theme.svg?react'

export const Previewer = (): React.JSX.Element => {
    const [ogData] = useAtom(DefaultConfigAtom)

    const [bgData] = useAtom(EditedBackgroundsDataAtom)
    const [iconData] = useAtom(EditedIconsDataAtom)
    const [lngData] = useAtom(EditedLanguageDataAtom)
    const [ogLngData] = useAtom(DefaultLanguageDataAtom)
    const [stylesData] = useAtom(EditedStylesDataAtom)
    const [ogStylesData] = useAtom(DefaultStylesDataAtom)

    const currBg = (): string => {
        try {
            const bg = bgData?.find((e) => e?.name === 'background_Idle')
            return bg?.customBase64 || bg!.base64
        } catch (error) {
            console.error(error)
            return ''
        }
    }

    const currIcon = (name: string): string => {
        try {
            const ico = iconData?.find((e) => e?.name === name)
            return ico?.customBase64 || ico!.base64
        } catch (error) {
            console.error(error)
            return ''
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

    const currStyle = (parentKey: StylesParentKeys, name: string): string => {
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

    return (
        <div className="preview-container">
            {ogData?.themeName && (
                <span className="preview-theme-name">
                    <ThemeSvg />
                    <p>{ogData?.themeName}</p>
                </span>
            )}
            <div className="preview-content">
                <img className="preview-bg" src={currBg()} />
                <img className="preview-logo" src={currIcon('icon_logo')} />

                <div
                    className="preview-lang-btn"
                    style={{
                        color: currStyle(StylesParentKeys.secondaryButton, 'color'),
                        backgroundColor: currStyle(StylesParentKeys.secondaryButton, 'background'),
                        border: `3px solid ${currStyle(StylesParentKeys.secondaryButton, 'color')}`,
                        borderRadius: currStyle(StylesParentKeys.secondaryButton, 'borderRadius')
                    }}
                >
                    <img className="preview-lang-icon" src={currIcon('icon_world')} />
                    es
                </div>

                <h1 style={{ color: currStyle(StylesParentKeys.general, 'primaryColor') }}>
                    {currLang('es', 'thankYou')}
                </h1>

                <button
                    className="preview-start-btn"
                    style={{
                        color: currStyle(StylesParentKeys.secondaryButton, 'color'),
                        backgroundColor: currStyle(StylesParentKeys.secondaryButton, 'background'),
                        border: `2px solid ${currStyle(StylesParentKeys.secondaryButton, 'border') === 'true' ? currStyle(StylesParentKeys.secondaryButton, 'color') : 'transparent'}`,
                        borderRadius: currStyle(StylesParentKeys.secondaryButton, 'borderRadius')
                    }}
                >
                    {currLang('es', 'button.start')}
                </button>
            </div>
        </div>
    )
}
