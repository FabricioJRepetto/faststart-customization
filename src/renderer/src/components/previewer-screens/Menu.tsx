import { Screens, StylesParentKeys } from '@renderer/types/types.d'
import { PreviewScreenProps } from '../Previewer'
import { ICONS, navigate, STYLES, TEXT } from '@renderer/utils/navigate'
import NavBar from './components/NavBar'
import Logo from './components/Logo'
import LangButton from './components/LangButton'

const Menu = ({ currBg, currIcon, currStyle, currLang }: PreviewScreenProps): React.JSX.Element => {
    return (
        <div className="preview-content">
            {currBg('background_UserAction')}
            <Logo currIcon={currIcon} currStyle={currStyle} theme="light" />
            <LangButton currIcon={currIcon} currStyle={currStyle} />

            <div className="preview-menu-container">
                <button
                    className="preview-highlight-area"
                    onClick={() => navigate(Screens.styles, STYLES.button)}
                    style={{
                        color: currStyle(StylesParentKeys.button, 'color'),
                        backgroundColor: currStyle(StylesParentKeys.button, 'background'),
                        border: `3px solid ${currStyle(StylesParentKeys.button, 'border') === 'true' ? currStyle(StylesParentKeys.button, 'color') : 'transparent'}`,
                        borderRadius: currStyle(StylesParentKeys.button, 'borderRadius')
                    }}
                >
                    <label
                        className="preview-highlight-area"
                        onClick={(e) => {
                            e.stopPropagation()
                            navigate(Screens.icons, ICONS.bills)
                        }}
                    >
                        {currIcon('icon_bills')}
                    </label>
                    <label
                        className="preview-highlight-area"
                        onClick={(e) => {
                            e.stopPropagation()
                            navigate(Screens.languages, TEXT.dispense.withdrawOption)
                        }}
                    >
                        {currLang('es', 'dispense', 'withdrawOption')}
                    </label>
                </button>
                <button
                    className="preview-highlight-area"
                    onClick={() => navigate(Screens.styles, STYLES.button)}
                    style={{
                        color: currStyle(StylesParentKeys.button, 'color'),
                        backgroundColor: currStyle(StylesParentKeys.button, 'background'),
                        border: `3px solid ${currStyle(StylesParentKeys.button, 'border') === 'true' ? currStyle(StylesParentKeys.button, 'color') : 'transparent'}`,
                        borderRadius: currStyle(StylesParentKeys.button, 'borderRadius')
                    }}
                >
                    <label
                        className="preview-highlight-area"
                        onClick={(e) => {
                            e.stopPropagation()
                            navigate(Screens.icons, ICONS.exchange)
                        }}
                    >
                        {currIcon('icon_exchange')}
                    </label>

                    <label
                        className="preview-highlight-area"
                        onClick={(e) => {
                            e.stopPropagation()
                            navigate(Screens.languages, TEXT.exchange.exchangeOption)
                        }}
                    >
                        {currLang('es', 'exchange', 'exchangeOption')}
                    </label>
                </button>
            </div>

            <NavBar currIcon={currIcon} currStyle={currStyle} currLang={currLang} />
        </div>
    )
}

export default Menu
