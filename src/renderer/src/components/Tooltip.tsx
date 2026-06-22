import { useState } from 'react'
import InfoSvg from '../assets/info.svg?react'

interface Props {
    text: string
    children?: React.JSX.Element
}
const Tooltip = ({ text, children }: Props): React.JSX.Element => {
    const [showText, setShowText] = useState<boolean>(false)

    const hoverEnter = (): void => {
        setShowText(true)
    }

    const hoverLeave = (): void => {
        setShowText(false)
    }

    return (
        <div className="tooltip" onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
            {children || <InfoSvg />}
            {showText && <div className={`tooltip-text fade-in`}>{text}</div>}
        </div>
    )
}
export default Tooltip
