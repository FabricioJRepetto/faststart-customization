import {
    DefaultConfigAtom,
    DefaultLanguageDataAtom,
    EditedBackgroundsDataAtom,
    EditedIconsDataAtom,
    EditedLanguageDataAtom,
    EditedStylesDataAtom
} from '@renderer/utils/context/context'
import { useAtom } from 'jotai'

export const Previewer = (): React.JSX.Element => {
    const [ogData] = useAtom(DefaultConfigAtom)
    const [bgData] = useAtom(EditedBackgroundsDataAtom)
    const [iconData] = useAtom(EditedIconsDataAtom)
    const [lngData] = useAtom(EditedLanguageDataAtom)
    const [ogLngData] = useAtom(DefaultLanguageDataAtom)
    const [stylesData] = useAtom(EditedStylesDataAtom)

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
            const logo = iconData?.find((e) => e?.name === name)
            return logo?.customBase64 || logo!.base64
        } catch (error) {
            console.error(error)
            return ''
        }
    }

    const currLang = (lang: string, name: string): string => {
        try {
            const word = lngData?.[lang][name] || ogLngData?.[lang][name]
            return word
        } catch (error) {
            console.error(error)
            return ''
        }
    }

    const currStyle = (name: string): string => {
        try {
            const style = stylesData?.[name] || ogData?.styles?.[name]

            if (name === 'buttonBorderRadius') return style + (stylesData?.[name] ? 'px' : '')

            return style
        } catch (error) {
            console.error(error)
            return ''
        }
    }

    return (
        <div className="preview-container">
            <div className="preview-content">
                <img className="preview-bg" src={currBg()} />
                <img className="preview-logo" src={currIcon('icon_logo')} />

                <div
                    className="preview-lang-btn"
                    style={{
                        color: currStyle('buttonBackground'),
                        backgroundColor: currStyle('buttonColor'),
                        border: `3px solid ${currStyle('buttonBackground')}`,
                        borderRadius: currStyle('buttonBorderRadius')
                    }}
                >
                    <img className="preview-lang-icon" src={currIcon('icon_world')} />
                    es
                </div>

                <h1 style={{ color: currStyle('primaryColor') }}>{currLang('es', 'thankYou')}</h1>

                <button
                    className="preview-start-btn"
                    style={{
                        color: currStyle('buttonColor'),
                        backgroundColor: currStyle('buttonBackground'),
                        border: `2px solid ${currStyle('buttonBorder') === 'true' ? currStyle('buttonColor') : 'transparent'}`,
                        borderRadius: currStyle('buttonBorderRadius')
                    }}
                >
                    {currLang('es', 'button.start')}
                </button>
            </div>
        </div>
    )
}
