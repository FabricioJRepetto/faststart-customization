import { ThemeConfig } from '@shared/types'
import ApplySvg from '../assets/apply.svg?react'
import DeleteSvg from '../assets/trash.svg?react'
import { DEFAULT_THEME } from '@shared/CONSTANTS'

interface Props {
    theme: ThemeConfig
    applyCb: (v: string) => void
    deleteCb: (v: string) => void
}
const ThemeCard = ({ theme, applyCb, deleteCb }: Props): React.JSX.Element => {
    const defaultTheme = theme.themeName !== DEFAULT_THEME
    return (
        <div className="theme-card-container">
            <span>{theme.themeName}</span>
            <div className="theme-card" style={{ color: theme.color }}>
                <img src={theme.background.base64} className="theme-card-background" />
                <img src={theme.logo.base64} className="theme-card-logo" />
                <p>{theme.themeName.toUpperCase()}</p>
            </div>
            <div className="theme-card-footer">
                <span className="apply-buton" onClick={() => applyCb(theme.themeName)}>
                    <ApplySvg />
                </span>
                {defaultTheme && (
                    <span className="delete-buton" onClick={() => deleteCb(theme.themeName)}>
                        <DeleteSvg />
                    </span>
                )}
            </div>
        </div>
    )
}
export default ThemeCard
