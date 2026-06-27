import { useLayoutEffect, useRef, useState } from 'react'
import InfoSvg from '../assets/info.svg?react'

interface Props {
    text: string
    children?: React.JSX.Element
}
const Tooltip = ({ text, children }: Props): React.JSX.Element => {
    const triggerRef = useRef<HTMLSpanElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState({ top: 0, left: 0 })
    const [visible, setVisible] = useState<boolean>(false)

    const hoverEnter = (): void => {
        setVisible(true)
    }

    const hoverLeave = (): void => {
        setVisible(false)
    }

    useLayoutEffect(() => {
        const f = (): void => {
            if (!visible || !triggerRef.current || !tooltipRef.current) return

            const triggerRect = triggerRef.current.getBoundingClientRect()
            const tooltipRect = tooltipRef.current.getBoundingClientRect()

            let left = triggerRect.left + 16
            let top = triggerRect.top - tooltipRect.height - 8

            // Se sale por la derecha
            if (left + tooltipRect.width > window.innerWidth) {
                left = window.innerWidth - tooltipRect.width - 8
            }

            // Se sale por la izquierda
            if (left < 0) {
                left = 8
            }

            // Se sale por arriba -> lo mando abajo del trigger
            if (top < 0) {
                top = triggerRect.bottom + 8
            }

            setPosition({ top, left })
        }
        f()
    }, [visible])

    return (
        <span
            ref={triggerRef}
            className="tooltip"
            onMouseEnter={hoverEnter}
            onMouseLeave={hoverLeave}
        >
            {children || <InfoSvg />}
            {visible && (
                <div
                    ref={tooltipRef}
                    className={`tooltip-text fade-in`}
                    style={{
                        position: 'fixed',
                        top: position.top,
                        left: position.left
                    }}
                >
                    {text}
                </div>
            )}
        </span>
    )
}
export default Tooltip
