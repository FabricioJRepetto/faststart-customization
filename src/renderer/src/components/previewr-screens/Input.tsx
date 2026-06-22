import { StylesParentKeys } from '@shared/types'
import { PreviewScreenProps } from '../Previewer'

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

            <div className="preview-input-container">
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        // justifyContent: 'space-between',
                        padding: '10px'
                    }}
                >
                    <div className="preview-input-input-container">
                        <span>$</span>
                        <input />
                        {currIcon('icon_return')}
                    </div>
                    <p
                        style={{
                            color: currStyle(StylesParentKeys.general, 'errorMessageColor'),
                            fontSize: '24px',
                            margin: '0 auto'
                        }}
                    >
                        error Message Test
                    </p>
                </div>

                <div className="preview-input-numpad-container">
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
                            {currLang('es', 'clear')}
                        </button>
                    </div>
                </div>
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

export default Input
