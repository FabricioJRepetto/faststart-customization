import { navigate, SECT } from '@renderer/utils/navigate'
import { Screens, StylesParentKeys } from '@shared/types'

interface Props {
    currStyle: (parent: StylesParentKeys, key: string) => string
    currIcon: (v: string) => React.JSX.Element | null
    theme?: 'dark' | 'light'
}

const LangButton = ({ currStyle, currIcon }: Props): React.JSX.Element => {
    return (
        <div
            className="preview-lang-btn preview-hilight-area"
            onClick={() => navigate(Screens.styles, SECT.sec_button_style_edit)}
            style={{
                color: currStyle(StylesParentKeys.secondaryButton, 'color'),
                backgroundColor: currStyle(StylesParentKeys.secondaryButton, 'background'),
                border: `3px solid ${currStyle(StylesParentKeys.secondaryButton, 'color')}`,
                borderRadius: currStyle(StylesParentKeys.secondaryButton, 'borderRadius')
            }}
        >
            <div className="preview-lang-icon">{currIcon('icon_world')}</div>
            es
        </div>
    )
}

export default LangButton
