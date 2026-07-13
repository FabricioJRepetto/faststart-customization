import { ICONS, navigate, STYLES } from '@renderer/utils/navigate'
import { Screens, StylesParentKeys } from '@shared/types'

interface Props {
    currStyle: (parent: StylesParentKeys, key: string) => string
    currIcon: (v: string) => React.JSX.Element | null
    theme?: 'dark' | 'light'
}

const LangButton = ({ currStyle, currIcon }: Props): React.JSX.Element => {
    return (
        <div
            className="preview-lang-btn preview-highlight-area"
            onClick={() => navigate(Screens.styles, STYLES.sec_button)}
            style={{
                color: currStyle(StylesParentKeys.secondaryButton, 'color'),
                backgroundColor: currStyle(StylesParentKeys.secondaryButton, 'background'),
                border: `3px solid ${currStyle(StylesParentKeys.secondaryButton, 'color')}`,
                borderRadius: currStyle(StylesParentKeys.secondaryButton, 'borderRadius')
            }}
        >
            <div
                className="preview-lang-icon preview-highlight-area"
                onClick={(e) => {
                    e.stopPropagation()
                    navigate(Screens.icons, ICONS.world)
                }}
            >
                {currIcon('icon_world')}
            </div>
            es
        </div>
    )
}

export default LangButton
