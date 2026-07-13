import { Screens, StylesParentKeys } from '@shared/types'
import { PreviewScreenProps } from '../Previewer'
import { IMAGES, navigate, TEXT } from '@renderer/utils/navigate'
import Logo from './components/Logo'
import LangButton from './components/LangButton'

const Success = ({
    currBg,
    currIcon,
    currStyle,
    currLang
}: PreviewScreenProps): React.JSX.Element => {
    return (
        <div className="preview-content">
            {currBg('background_success')}
            <Logo currIcon={currIcon} currStyle={currStyle} />
            <LangButton currIcon={currIcon} currStyle={currStyle} />

            <h1
                className="preview-highlight-area"
                onClick={() => navigate(Screens.languages, TEXT.info.thankYou)}
                style={{ color: currStyle(StylesParentKeys.successScreen, 'primaryColor') }}
            >
                {currLang('es', 'info', 'thankYou')}
            </h1>

            <div
                className="preview-menu-container"
                style={{ color: currStyle(StylesParentKeys.successScreen, 'primaryColor') }}
            >
                <div
                    className="preview-info-image preview-highlight-area"
                    onClick={() => navigate(Screens.icons, IMAGES.thankyou)}
                >
                    {currIcon('image_thankyou')}
                </div>
            </div>
        </div>
    )
}

export default Success
