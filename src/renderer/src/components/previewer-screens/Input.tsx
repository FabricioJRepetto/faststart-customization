import { Screens, StylesParentKeys } from '@shared/types'
import { PreviewScreenProps } from '../Previewer'
import { navigate, SECT } from '@renderer/utils/navigate'
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
            {currBg() && <img className="preview-bg" src={currBg('background_UserAction')!} />}
            <Logo currIcon={currIcon} currStyle={currStyle} theme="light" />
            <LangButton currIcon={currIcon} currStyle={currStyle} />

            <h1
                className="preview-hilight-area"
                onClick={() => navigate(Screens.languages)}
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
                        {currIcon('icon_return')}
                    </div>
                    <p
                        className="preview-hilight-area"
                        onClick={() => navigate(Screens.styles, SECT.user_action_style_edit)}
                        style={{
                            color: currStyle(StylesParentKeys.userAction, 'errorMessageColor'),
                            fontSize: '24px',
                            margin: '0 auto'
                        }}
                    >
                        error Message Test
                    </p>
                </div>

                <div
                    className="preview-input-numpad-container preview-hilight-area"
                    onClick={() => navigate(Screens.styles, SECT.input_button_style_edit)}
                >
                    <div>
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
                            {currLang('es', 'general', 'clear')}
                        </button>
                    </div>
                </div>
            </div>

            <NavBar currIcon={currIcon} currStyle={currStyle} currLang={currLang} />
        </div>
    )
}

export default Input
