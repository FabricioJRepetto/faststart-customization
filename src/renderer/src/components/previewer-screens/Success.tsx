import { Screens, StylesParentKeys } from '@shared/types'
import { PreviewScreenProps } from '../Previewer'
import { navigate } from '@renderer/utils/navigate'
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
            <img className="preview-bg" src={currBg('background_success')} />
            <Logo currIcon={currIcon} currStyle={currStyle} />
            <LangButton currIcon={currIcon} currStyle={currStyle} />

            <h1
                className="preview-hilight-area"
                onClick={() => navigate(Screens.languages)}
                style={{ color: currStyle(StylesParentKeys.successScreen, 'primaryColor') }}
            >
                {currLang('es', 'thankYou')}
            </h1>

            <div
                className="preview-menu-container"
                style={{ color: currStyle(StylesParentKeys.successScreen, 'primaryColor') }}
            >
                <div
                    className="preview-info-image preview-hilight-area"
                    onClick={() => navigate(Screens.icons)}
                >
                    {currIcon('icon_thankyou')}
                </div>
            </div>
        </div>
    )
}

export default Success
