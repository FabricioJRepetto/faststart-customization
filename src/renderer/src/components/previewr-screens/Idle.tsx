import { StylesParentKeys } from '@shared/types'
import { PreviewScreenProps } from '../Previewer'
import QrSvg from '../../assets/QR_example.svg?react'

const Idle = ({ currBg, currIcon, currStyle, currLang }: PreviewScreenProps): React.JSX.Element => {
    return (
        <div className="preview-content">
            <img className="preview-bg" src={currBg()} />
            <div
                className="preview-logo"
                style={{ color: currStyle(StylesParentKeys.logo, 'dark') }}
            >
                {currIcon('icon_logo')}
            </div>

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
        </div>
    )
}

export default Idle
