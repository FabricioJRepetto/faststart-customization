import { Screens, StylesParentKeys } from '@shared/types'
import { PreviewScreenProps } from '../Previewer'
import QrSvg from '../../assets/QR_example.svg?react'
import { navigate, SECT } from '@renderer/utils/navigate'

const Idle = ({ currBg, currIcon, currStyle, currLang }: PreviewScreenProps): React.JSX.Element => {
    return (
        <div className="preview-content">
            <img className="preview-bg" src={currBg()} />
            <span
                className="preview-hilight-area"
                onClick={() => navigate(Screens.styles, SECT.logo_style_edit)}
            >
                <div
                    className="preview-logo"
                    style={{ color: currStyle(StylesParentKeys.logo, 'dark') }}
                >
                    {currIcon('icon_logo')}
                </div>
            </span>

            <span
                className="preview-hilight-area"
                onClick={() => navigate(Screens.styles, SECT.sec_button_style_edit)}
            >
                <div
                    className="preview-lang-btn"
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
            </span>

            <div
                className="preview-qr-container"
                style={{
                    backgroundColor: currStyle(StylesParentKeys.general, 'secondaryColor'),
                    color: currStyle(StylesParentKeys.general, 'primaryColor'),
                    borderRadius: currStyle(StylesParentKeys.secondaryButton, 'borderRadius')
                }}
            >
                <QrSvg />
            </div>

            <span
                className="preview-hilight-area"
                onClick={() => navigate(Screens.styles, SECT.sec_button_style_edit)}
            >
                <button
                    className="preview-start-btn"
                    style={{
                        color: currStyle(StylesParentKeys.secondaryButton, 'color'),
                        backgroundColor: currStyle(StylesParentKeys.secondaryButton, 'background'),
                        border: `2px solid ${currStyle(StylesParentKeys.secondaryButton, 'border') === 'true' ? currStyle(StylesParentKeys.secondaryButton, 'color') : 'transparent'}`,
                        borderRadius: currStyle(StylesParentKeys.secondaryButton, 'borderRadius')
                    }}
                >
                    {currLang('es', 'button_start')}
                </button>
            </span>
        </div>
    )
}

export default Idle
