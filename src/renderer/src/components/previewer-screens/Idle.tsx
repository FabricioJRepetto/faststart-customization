import { Screens, StylesParentKeys } from '@shared/types'
import { PreviewScreenProps } from '../Previewer'
import QrSvg from '../../assets/QR_example.svg?react'
import { navigate, SECT } from '@renderer/utils/navigate'
import Logo from './components/Logo'
import LangButton from './components/LangButton'

const Idle = ({ currBg, currIcon, currStyle, currLang }: PreviewScreenProps): React.JSX.Element => {
    return (
        <div className="preview-content">
            <img className="preview-bg" src={currBg()} />
            <Logo currIcon={currIcon} currStyle={currStyle} />

            <LangButton currIcon={currIcon} currStyle={currStyle} />

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

            <button
                className="preview-start-btn preview-hilight-area"
                onClick={() => navigate(Screens.styles, SECT.sec_button_style_edit)}
                style={{
                    color: currStyle(StylesParentKeys.secondaryButton, 'color'),
                    backgroundColor: currStyle(StylesParentKeys.secondaryButton, 'background'),
                    border: `2px solid ${currStyle(StylesParentKeys.secondaryButton, 'border') === 'true' ? currStyle(StylesParentKeys.secondaryButton, 'color') : 'transparent'}`,
                    borderRadius: currStyle(StylesParentKeys.secondaryButton, 'borderRadius')
                }}
            >
                {currLang('es', 'button_start')}
            </button>
        </div>
    )
}

export default Idle
