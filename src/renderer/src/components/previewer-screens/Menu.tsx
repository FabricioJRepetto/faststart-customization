import { Screens, StylesParentKeys } from '@shared/types'
import { PreviewScreenProps } from '../Previewer'
import { navigate, SECT } from '@renderer/utils/navigate'
import NavBar from './components/NavBar'
import Logo from './components/Logo'
import LangButton from './components/LangButton'

const Menu = ({ currBg, currIcon, currStyle, currLang }: PreviewScreenProps): React.JSX.Element => {
    return (
        <div className="preview-content">
            {currBg() && <img className="preview-bg" src={currBg('background_UserAction')!} />}
            <Logo currIcon={currIcon} currStyle={currStyle} theme="light" />
            <LangButton currIcon={currIcon} currStyle={currStyle} />

            <div className="preview-menu-container">
                <button
                    className="preview-hilight-area"
                    onClick={() => navigate(Screens.styles, SECT.button_style_edit)}
                    style={{
                        color: currStyle(StylesParentKeys.button, 'color'),
                        backgroundColor: currStyle(StylesParentKeys.button, 'background'),
                        border: `3px solid ${currStyle(StylesParentKeys.button, 'border') === 'true' ? currStyle(StylesParentKeys.button, 'color') : 'transparent'}`,
                        borderRadius: currStyle(StylesParentKeys.button, 'borderRadius')
                    }}
                >
                    <label
                        className="preview-hilight-area"
                        onClick={(e) => {
                            e.stopPropagation()
                            navigate(Screens.icons)
                        }}
                    >
                        {currIcon('icon_bills')}
                    </label>
                    {currLang('es', 'dispense', 'withdrawOption')}
                </button>
                <button
                    className="preview-hilight-area"
                    onClick={() => navigate(Screens.styles, SECT.button_style_edit)}
                    style={{
                        color: currStyle(StylesParentKeys.button, 'color'),
                        backgroundColor: currStyle(StylesParentKeys.button, 'background'),
                        border: `3px solid ${currStyle(StylesParentKeys.button, 'border') === 'true' ? currStyle(StylesParentKeys.button, 'color') : 'transparent'}`,
                        borderRadius: currStyle(StylesParentKeys.button, 'borderRadius')
                    }}
                >
                    <label
                        className="preview-hilight-area"
                        onClick={(e) => {
                            e.stopPropagation()
                            navigate(Screens.icons)
                        }}
                    >
                        {currIcon('icon_exchange')}
                    </label>
                    {currLang('es', 'exchange', 'exchangeOption')}
                </button>
            </div>

            <NavBar currIcon={currIcon} currStyle={currStyle} currLang={currLang} />
        </div>
    )
}

export default Menu
