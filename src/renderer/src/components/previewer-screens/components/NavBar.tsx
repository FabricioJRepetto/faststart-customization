import { navigate, SECT } from "@renderer/utils/navigate"
import { Screens, StylesParentKeys } from "@shared/types"

interface Props {
    currStyle: (parent: StylesParentKeys, key: string) => string
    currIcon: (v: string) => React.JSX.Element
    currLang: (lang: string, key: string) => string
}

const NavBar = ({ currStyle, currIcon, currLang }: Props): React.JSX.Element => {
    return (
        <div
            className="preview-nav-container preview-hilight-area"
            onClick={() => navigate(Screens.styles, SECT.button_style_edit)}
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
                    className="preview-hilight-area"
                    onClick={(e) => {
                        e.stopPropagation()
                        navigate(Screens.icons)
                    }}
                >
                    {currIcon('icon_button_exit')}
                </label>
                {currLang('es', 'button_exit')}
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
                    className="preview-hilight-area"
                    onClick={(e) => {
                        e.stopPropagation()
                        navigate(Screens.icons)
                    }}
                >
                    {currIcon('icon_button_continue')}
                </label>
                {currLang('es', 'button_confirm')}
            </button>
        </div>
    )
}

export default NavBar