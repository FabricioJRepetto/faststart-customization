import { navigate, SECT } from '@renderer/utils/navigate'
import { Screens, StylesParentKeys } from '@shared/types'
import React from 'react'

interface Props {
    currStyle: (parent: StylesParentKeys, key: string) => string
    currIcon: (v: string) => React.JSX.Element | null
    theme?: 'dark' | 'light'
}

const Logo = ({ currStyle, currIcon, theme = 'dark' }: Props): React.JSX.Element => {
    return (
        <div
            className="preview-logo preview-hilight-area"
            onClick={() => navigate(Screens.styles, SECT.logo_style_edit)}
            style={{ color: currStyle(StylesParentKeys.logo, theme) }}
        >
            {currIcon('icon_logo')}
        </div>
    )
}

export default Logo
