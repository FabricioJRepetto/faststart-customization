import { ThemeConfig } from '@shared/types'
import ApplySvg from '../assets/apply.svg?react'
import DeleteSvg from '../assets/trash.svg?react'
import ThemeSvg from '../assets/theme.svg?react'
import { DEFAULT_THEME } from '@shared/CONSTANTS'
import { useEffect, useState } from 'react'

interface Props {
    theme: ThemeConfig
    applyCb: (v: string) => void
    deleteCb: (v: string) => void
}
const ThemeCard = ({ theme, applyCb, deleteCb }: Props): React.JSX.Element => {
    const notDefaultTheme = theme.themeName !== DEFAULT_THEME
    const [COLOR, setCOLOR] = useState('white')

    useEffect(() => {        
        ;(async () => {
            const themeSchema = await calculateContrast(
                theme.color.primaryColor,
                theme.background.base64
            )
            const _color =
                themeSchema === 'DARK' ? theme.color.primaryColor : theme.color.secondaryColor
            setCOLOR(_color)
        })()
        // eslint-disable-next-line
    }, [])

    return (
        <div className="theme-card-container">
            <span className="theme-card-name">
                <ThemeSvg />
                {theme.themeName}
            </span>
            <div className="theme-card" style={{ color: COLOR }}>
                <img src={theme.background.base64} className="theme-card-background" />
                <img src={theme.logo.base64} className="theme-card-logo" />
                <p>{theme.themeName.toUpperCase()}</p>
            </div>
            <div className="theme-card-footer">
                <span className="button apply-buton" onClick={() => applyCb(theme.themeName)}>
                    <ApplySvg />
                </span>
                {notDefaultTheme && (
                    <span className="button delete-buton" onClick={() => deleteCb(theme.themeName)}>
                        <DeleteSvg />
                    </span>
                )}
            </div>
        </div>
    )
}
export default ThemeCard

const getContrastRatio = (color1: string, color2: string): number => {
    const lum1 = getLuminance(color1)
    const lum2 = getLuminance(color2)
    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)
    return (brightest + 0.05) / (darkest + 0.05)
}

const getLuminance = (hex: string): number => {
    // Convert hex to RGB values 0-255
    let r = parseInt(hex.slice(1, 3), 16) / 255
    let g = parseInt(hex.slice(3, 5), 16) / 255
    let b = parseInt(hex.slice(5, 7), 16) / 255

    // Apply gamma correction
    ;[r, g, b] = [r, g, b].map((c) =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    )

    return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const getDominantColor = (
    imgEl: CanvasImageSource
): { r: number; g: number; b: number; hex: string } => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    canvas.width = 1
    canvas.height = 1

    // Draw image to a 1x1 square
    ctx.drawImage(imgEl, 0, 0, 1, 1)

    // Get the RGBA data for that single pixel
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
    return { r, g, b, hex: `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}` }
}

const getDominantColorFromUrl = async (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => resolve(getDominantColor(img).hex)
        img.onerror = reject
        img.src = url
    })
}

const calculateContrast = async (
    primaryColor: string,
    bgPath: string
): Promise<'DARK' | 'LIGHT'> => {
    const bgColor = await getDominantColorFromUrl(bgPath)    
    const ratio = getContrastRatio(primaryColor, bgColor)
    return ratio >= 4.5 ? 'DARK' : 'LIGHT'
}
