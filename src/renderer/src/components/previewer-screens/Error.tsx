import { StylesParentKeys } from '@shared/types'
import { PreviewScreenProps } from '../Previewer'

const Error = ({
    currBg,
    currIcon,
    currStyle,
    currLang
}: PreviewScreenProps): React.JSX.Element => {
    return (
        <div className="preview-content">
            <img className="preview-bg" src={currBg('background_error')} />
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

            <h1 style={{ color: currStyle(StylesParentKeys.errorScreen, 'primaryColor') }}>
                {currLang('es', 'contactSupport')}
            </h1>

            <div
                className="preview-menu-container"
                style={{ color: currStyle(StylesParentKeys.successScreen, 'primaryColor') }}
            >
                <div className="preview-info-image">{currIcon('icon_error')}</div>
            </div>
        </div>
    )
}

export default Error
