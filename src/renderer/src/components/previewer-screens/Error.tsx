import { Screens, StylesParentKeys } from '@shared/types'
import { PreviewScreenProps } from '../Previewer'
import { IMAGES, navigate, TEXT } from '@renderer/utils/navigate'
import Logo from './components/Logo'
import LangButton from './components/LangButton'

const Error = ({
    currBg,
    currIcon,
    currStyle,
    currLang
}: PreviewScreenProps): React.JSX.Element => {
    return (
        <div className="preview-content">
            {currBg('background_error')}
            <Logo currIcon={currIcon} currStyle={currStyle} />
            <LangButton currIcon={currIcon} currStyle={currStyle} />

            <h1
                style={{ color: currStyle(StylesParentKeys.errorScreen, 'primaryColor') }}
                className="preview-highlight-area"
                onClick={() => navigate(Screens.languages, TEXT.info.contactSupport)}
            >
                {currLang('es', 'info', 'contactSupport')}
            </h1>

            <div
                className="preview-menu-container"
                style={{ color: currStyle(StylesParentKeys.successScreen, 'primaryColor') }}
            >
                <div
                    className="preview-info-image preview-highlight-area"
                    onClick={() => navigate(Screens.icons, IMAGES.error)}
                >
                    {currIcon('image_error')}
                </div>
            </div>
        </div>
    )
}

export default Error
