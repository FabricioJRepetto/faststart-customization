import { Screens, StylesParentKeys } from '@shared/types'
import { PreviewScreenProps } from '../Previewer'
import { navigate } from '@renderer/utils/navigate'
import Logo from './components/Logo'
import LangButton from './components/LangButton'

const Info = ({ currBg, currIcon, currStyle, currLang }: PreviewScreenProps): React.JSX.Element => {
    return (
        <div className="preview-content">
            {currBg() && <img className="preview-bg" src={currBg('background_Info')!} />}
            <Logo currIcon={currIcon} currStyle={currStyle} />
            <LangButton currIcon={currIcon} currStyle={currStyle} />

            <h1 style={{ color: currStyle(StylesParentKeys.infoScreen, 'primaryColor') }}>
                {currLang('es', 'info', 'wait')}
            </h1>

            <div
                className="preview-menu-container"
                style={{ color: currStyle(StylesParentKeys.infoScreen, 'primaryColor') }}
            >
                <div
                    className="preview-info-image preview-hilight-area"
                    onClick={() => navigate(Screens.icons)}
                >
                    {currIcon('icon_wait')}
                </div>
            </div>
        </div>
    )
}

export default Info
