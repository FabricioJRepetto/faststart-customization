import { Screens, StylesParentKeys } from '@shared/types'
import { PreviewScreenProps } from '../Previewer'
import { IMAGES, navigate, TEXT } from '@renderer/utils/navigate'
import Logo from './components/Logo'
import LangButton from './components/LangButton'

const Info = ({ currBg, currIcon, currStyle, currLang }: PreviewScreenProps): React.JSX.Element => {
    return (
        <div className="preview-content">
            {currBg('background_Info')}
            <Logo currIcon={currIcon} currStyle={currStyle} />
            <LangButton currIcon={currIcon} currStyle={currStyle} />

            <h1
                style={{ color: currStyle(StylesParentKeys.infoScreen, 'primaryColor') }}
                className="preview-highlight-area"
                onClick={() => navigate(Screens.languages, TEXT.info.wait)}
            >
                {currLang('es', 'info', 'wait')}
            </h1>

            <div
                className="preview-menu-container"
                style={{ color: currStyle(StylesParentKeys.infoScreen, 'primaryColor') }}
            >
                <div
                    className="preview-info-image preview-highlight-area"
                    onClick={() => navigate(Screens.icons, IMAGES.wait)}
                >
                    {currIcon('image_wait')}
                </div>
            </div>
        </div>
    )
}

export default Info
