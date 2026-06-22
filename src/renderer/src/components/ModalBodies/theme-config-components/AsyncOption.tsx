import { ReactNode, useState } from 'react'

interface Props {
    title: string
    action: () => Promise<void>
    status: boolean | null
    disabled: boolean
    style?: 'primary' | 'secondary' | 'tertiary'
    Icon?: ReactNode
}

const AsyncOption = ({ title, action, status, disabled, Icon, style = 'secondary' }: Props): React.JSX.Element => {
    const [loading, setLoading] = useState(false)

    const waitForCallback = async (): Promise<void> => {
        if (loading || disabled) return
        setLoading(true)
        await action()
        setLoading(false)
    }

    return (
        <div
            className={`theme-config-option ${style} ${disabled ? 'disabled' : ''}`}
            onClick={waitForCallback}
        >
            <p>{title}</p>
            {!Icon || loading ? (
                <div
                    className={
                        loading || status === null
                            ? 'getting-status'
                            : status
                              ? 'green-status'
                              : 'red-status'
                    }
                ></div>
            ) : (
                Icon
            )}
        </div>
    )
}

export default AsyncOption
