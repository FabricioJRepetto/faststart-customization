import { StylesParentKeys } from '@shared/types'
import { PreviewScreenProps } from '../Previewer'

const Menu = ({ currBg, currIcon, currStyle, currLang }: PreviewScreenProps): React.JSX.Element => {
    return (
        <div className="preview-content">
            <img className="preview-bg" src={currBg('background_UserAction')} />
            <div className="preview-logo">{currIcon('icon_logo')}</div>

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

            <h1 style={{ color: currStyle(StylesParentKeys.general, 'secondaryColor') }}>
                {currLang('es', 'menuTitle')}
            </h1>

            <div className="preview-menu-container">
                <button
                    style={{
                        color: currStyle(StylesParentKeys.button, 'color'),
                        backgroundColor: currStyle(StylesParentKeys.button, 'background'),
                        border: `3px solid ${currStyle(StylesParentKeys.button, 'border') === 'true' ? currStyle(StylesParentKeys.button, 'color') : 'transparent'}`,
                        borderRadius: currStyle(StylesParentKeys.button, 'borderRadius')
                    }}
                >
                    {currIcon('icon_bills')}
                    {currLang('es', 'withdrawOption')}
                </button>
                <button
                    style={{
                        color: currStyle(StylesParentKeys.button, 'color'),
                        backgroundColor: currStyle(StylesParentKeys.button, 'background'),
                        border: `3px solid ${currStyle(StylesParentKeys.button, 'border') === 'true' ? currStyle(StylesParentKeys.button, 'color') : 'transparent'}`,
                        borderRadius: currStyle(StylesParentKeys.button, 'borderRadius')
                    }}
                >
                    {currIcon('icon_exchange')}
                    {currLang('es', 'exchangeOption')}
                </button>
            </div>

            <div className="preview-nav-container">
                <button
                    style={{
                        color: currStyle(StylesParentKeys.button, 'color'),
                        backgroundColor: currStyle(StylesParentKeys.button, 'background'),
                        border: `3px solid ${currStyle(StylesParentKeys.button, 'border') === 'true' ? currStyle(StylesParentKeys.button, 'color') : 'transparent'}`,
                        borderRadius: currStyle(StylesParentKeys.button, 'borderRadius')
                    }}
                >
                    {currIcon('icon_button_exit')}
                    {currLang('es', 'button_exit')}
                </button>
                <button
                    style={{
                        color: currStyle(StylesParentKeys.button, 'color'),
                        backgroundColor: currStyle(StylesParentKeys.button, 'background'),
                        border: `3px solid ${currStyle(StylesParentKeys.button, 'border') === 'true' ? currStyle(StylesParentKeys.button, 'color') : 'transparent'}`,
                        borderRadius: currStyle(StylesParentKeys.button, 'borderRadius')
                    }}
                >
                    {currLang('es', 'button_confirm')}
                    {currIcon('icon_button_continue')}
                </button>
            </div>
        </div>
    )
}

export default Menu
