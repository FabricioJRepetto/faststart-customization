import { ICONS, navigate, STYLES, TEXT } from '@renderer/utils/navigate'
import { Screens, StylesParentKeys } from '@shared/types'

interface Props {
    currStyle: (parent: StylesParentKeys, key: string) => string
    currLang: (lang: string, parent: string, key: string) => string
    currIcon: (v: string) => React.JSX.Element | null
}

const NavBar = ({ currStyle, currIcon, currLang }: Props): React.JSX.Element => {
    return (
        <div
            className="preview-nav-container preview-highlight-area"
            onClick={() => navigate(Screens.styles, STYLES.button)}
        >
            <button
                style={{
                    color: currStyle(StylesParentKeys.button, 'color'),
                    backgroundColor: currStyle(StylesParentKeys.button, 'background'),
                    border: `3px solid ${currStyle(StylesParentKeys.button, 'border') === 'true' ? currStyle(StylesParentKeys.button, 'color') : 'transparent'}`,
                    borderRadius: currStyle(StylesParentKeys.button, 'borderRadius')
                }}
            >
                <label
                    className="preview-highlight-area"
                    onClick={(e) => {
                        e.stopPropagation()
                        navigate(Screens.icons, ICONS.button_exit)
                    }}
                >
                    {currIcon('icon_button_exit')}
                </label>

                <label
                    className="preview-highlight-area"
                    onClick={(e) => {
                        e.stopPropagation()
                        navigate(Screens.languages, TEXT.general.button_exit)
                    }}
                >
                    {currLang('es', 'general', 'button_exit')}
                </label>
            </button>

            <button
                style={{
                    color: currStyle(StylesParentKeys.button, 'color'),
                    backgroundColor: currStyle(StylesParentKeys.button, 'background'),
                    border: `3px solid ${currStyle(StylesParentKeys.button, 'border') === 'true' ? currStyle(StylesParentKeys.button, 'color') : 'transparent'}`,
                    borderRadius: currStyle(StylesParentKeys.button, 'borderRadius')
                }}
            >
                <label
                    className="preview-highlight-area"
                    onClick={(e) => {
                        e.stopPropagation()
                        navigate(Screens.languages, TEXT.general.button_confirm)
                    }}
                >
                    {currLang('es', 'general', 'button_confirm')}
                </label>
                <label
                    className="preview-highlight-area"
                    onClick={(e) => {
                        e.stopPropagation()
                        navigate(Screens.icons, ICONS.button_continue)
                    }}
                >
                    {currIcon('icon_button_continue')}
                </label>
            </button>
        </div>
    )
}

export default NavBar
