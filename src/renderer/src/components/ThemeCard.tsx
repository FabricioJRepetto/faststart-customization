import { ThemeConfig } from '@shared/types'

interface Props {
    theme: ThemeConfig
}
const ThemeCard = ({ theme }: Props): React.JSX.Element => {
    return (
        <div className="theme-card" style={{ color: theme.color }}>
            <img src={theme.background.base64} className="theme-card-background" />
            <img src={theme.logo.base64} className="theme-card-logo" />
            <p>{theme.themeName.toUpperCase()}</p>
        </div>
    )
}
export default ThemeCard
