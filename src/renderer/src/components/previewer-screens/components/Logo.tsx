import { ICONS, navigate } from '@renderer/utils/navigate'
import { Screens, StylesParentKeys } from '@renderer/types/types.d'
import React from 'react'

interface Props {
    currStyle: (parent: StylesParentKeys, key: string) => string
    currIcon: (v: string) => React.JSX.Element | null
    theme?: 'dark' | 'light'
}

const Logo = ({ currStyle, currIcon, theme = 'dark' }: Props): React.JSX.Element => {
    return (
        <div
            className="preview-logo preview-highlight-area"
            // onClick={() => navigate(Screens.styles, STYLES.logo)}
            onClick={() => navigate(Screens.icons, ICONS.logo)}
            style={{ color: currStyle(StylesParentKeys.logo, theme) }}
        >
            {currIcon('icon_logo')}
        </div>
    )
}

export default Logo
