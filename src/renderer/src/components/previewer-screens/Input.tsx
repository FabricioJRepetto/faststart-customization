import { Screens, StylesParentKeys } from '@shared/types'
import { PreviewScreenProps } from '../Previewer'
import { ICONS, navigate, STYLES, TEXT } from '@renderer/utils/navigate'
import Logo from './components/Logo'
import LangButton from './components/LangButton'
import NavBar from './components/NavBar'

const Input = ({
    currBg,
    currIcon,
    currStyle,
    currLang
}: PreviewScreenProps): React.JSX.Element => {
    const buttonStyle = {
        backgroundColor: currStyle(StylesParentKeys.inputButton, 'background'),
        borderRadius: currStyle(StylesParentKeys.inputButton, 'borderRadius'),
        border: `1px solid ${currStyle(StylesParentKeys.inputButton, 'border') === 'true' ? currStyle(StylesParentKeys.inputButton, 'color') : 'transparent'}`,
        color: currStyle(StylesParentKeys.inputButton, 'color')
    }

    return (
        <div className="preview-content">
            {currBg('background_UserAction')}
            <Logo currIcon={currIcon} currStyle={currStyle} theme="light" />
            <LangButton currIcon={currIcon} currStyle={currStyle} />

            <h1
                className="preview-highlight-area"
                onClick={() => navigate(Screens.languages, TEXT.dispense.enterAmount)}
                style={{ color: currStyle(StylesParentKeys.idle, 'secondaryColor') }}
            >
                {currLang('es', 'dispense', 'enterAmount')}
            </h1>

            <div className="preview-input-container">
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '10px',
                        color: 'black'
                    }}
                >
                    <div className="preview-input-input-container">
                        <span>$</span>
                        <input />

                        <span
                            className="preview-highlight-area"
                            onClick={() => navigate(Screens.icons, ICONS.return)}
                        >
                            {currIcon('icon_return')}
                        </span>
                    </div>
                    <p
                        className="preview-highlight-area"
                        onClick={() => navigate(Screens.styles, STYLES.user_action)}
                        style={{
                            color: currStyle(StylesParentKeys.userAction, 'errorMessageColor'),
                            fontSize: '24px',
                            margin: '0 auto'
                        }}
                    >
                        Ejemplo mensaje de error
                    </p>
                </div>

                <div
                    className="preview-input-numpad-container"
                    onClick={() => navigate(Screens.styles, STYLES.input_button)}
                >
                    <div className="preview-highlight-area">
                        <button style={buttonStyle}>1</button>
                        <button style={buttonStyle}>2</button>
                        <button style={buttonStyle}>3</button>
                        <button style={buttonStyle}>4</button>
                        <button style={buttonStyle}>5</button>
                        <button style={buttonStyle}>6</button>
                        <button style={buttonStyle}>7</button>
                        <button style={buttonStyle}>8</button>
                        <button style={buttonStyle}>9</button>
                        <button style={buttonStyle}>0</button>
                        <button style={{ ...buttonStyle, gridColumn: 'span 2' }}>
                            <span
                                className="preview-highlight-area"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    navigate(Screens.languages, TEXT.general.clear)
                                }}
                            >
                                {currLang('es', 'general', 'clear')}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <NavBar currIcon={currIcon} currStyle={currStyle} currLang={currLang} />
        </div>
    )
}

export default Input
