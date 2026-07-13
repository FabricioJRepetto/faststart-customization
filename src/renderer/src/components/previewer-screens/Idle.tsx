import { Screens, StylesParentKeys } from '@shared/types'
import { PreviewScreenProps } from '../Previewer'
import QrSvg from '../../assets/QR_example.svg?react'
import { navigate, STYLES, TEXT } from '@renderer/utils/navigate'
import Logo from './components/Logo'
import LangButton from './components/LangButton'

const Idle = ({ currBg, currIcon, currStyle, currLang }: PreviewScreenProps): React.JSX.Element => {
    return (
        <div className="preview-content">
            {currBg()}
            <Logo currIcon={currIcon} currStyle={currStyle} />

            <LangButton currIcon={currIcon} currStyle={currStyle} />

            <div
                className="preview-qr-container preview-highlight-area"
                onClick={() => navigate(Screens.styles, STYLES.idle)}
                style={{
                    backgroundColor: currStyle(StylesParentKeys.idle, 'secondaryColor'),
                    color: currStyle(StylesParentKeys.idle, 'primaryColor'),
                    borderRadius: currStyle(StylesParentKeys.secondaryButton, 'borderRadius')
                }}
            >
                <QrSvg />
            </div>

            <button
                className="preview-start-btn preview-highlight-area"
                onClick={() => navigate(Screens.styles, STYLES.sec_button)}
                style={{
                    color: currStyle(StylesParentKeys.secondaryButton, 'color'),
                    backgroundColor: currStyle(StylesParentKeys.secondaryButton, 'background'),
                    border: `2px solid ${currStyle(StylesParentKeys.secondaryButton, 'border') === 'true' ? currStyle(StylesParentKeys.secondaryButton, 'color') : 'transparent'}`,
                    borderRadius: currStyle(StylesParentKeys.secondaryButton, 'borderRadius')
                }}
            >
                <span
                    className="preview-highlight-area"
                    onClick={(e) => {
                        e.stopPropagation()
                        navigate(Screens.languages, TEXT.idle.button_start)
                    }}
                >
                    {currLang('es', 'idle', 'button_start')}
                </span>
            </button>
        </div>
    )
}

export default Idle
