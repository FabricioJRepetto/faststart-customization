import ClearSvg from '../assets/clear.svg?react'
import { useSetAtom } from 'jotai'
import { DefaultConfigAtom, EditedStylesDataAtom, store } from '@renderer/utils/context/context'
import StyleCard from '@renderer/components/StyleCard'
import { DefaultStylesData } from '@shared/types'

const Styles = (): React.JSX.Element => {
    // const [ogStyles] = useState(getStylesData())
    const defStyles = store.get(DefaultConfigAtom)
    const ogStyles = defStyles!.styles
    const setCustomStyles = useSetAtom(EditedStylesDataAtom)

    const updateCustom = (key: string, value: string): void => {
        if (key === 'buttonBorder') {
            setCustomStyles((prev) => ({ ...prev, [key]: prev.buttonBorder ? 'false' : 'true' }))
        }
        if (key === 'buttonBorderRadius') {
            setCustomStyles((prev) => ({ ...prev, [key]: value + 'px' }))
        }
        setCustomStyles((prev) => ({ ...prev, [key]: value }))
    }

    const resetAllValues = (): void => {
        setCustomStyles(DefaultStylesData)
    }

    const resetValue = (key: string): void => {
        setCustomStyles((prev) => ({ ...prev, [key]: '' }))
    }

    return (
        <div className="screen-content">
            <div className="screen-header">
                <h1>Styles</h1>
                <div className="actions">
                    <div className="action tertiary">
                        <a onClick={resetAllValues}>
                            <ClearSvg />
                            Resetear todo
                        </a>
                    </div>
                </div>
            </div>

            <div className="assets-grid scrolleable">
                <StyleCard
                    key={'primaryColor'}
                    keyName={'primaryColor'}
                    value={ogStyles.primaryColor}
                    reset={resetValue}
                    update={updateCustom}
                />
                <StyleCard
                    key={'secondaryColor'}
                    keyName={'secondaryColor'}
                    value={ogStyles.secondaryColor}
                    reset={resetValue}
                    update={updateCustom}
                />
                <StyleCard
                    key={'errorMessageColor'}
                    keyName={'errorMessageColor'}
                    value={ogStyles.errorMessageColor}
                    reset={resetValue}
                    update={updateCustom}
                />

                <div className="grid-divider"></div>

                <StyleCard
                    key={'buttonColor'}
                    keyName={'buttonColor'}
                    value={ogStyles.buttonColor}
                    reset={resetValue}
                    update={updateCustom}
                />
                <StyleCard
                    key={'buttonBackground'}
                    keyName={'buttonBackground'}
                    value={ogStyles.buttonBackground}
                    reset={resetValue}
                    update={updateCustom}
                />

                <StyleCard
                    type="pixel"
                    key={'buttonBorderRadius'}
                    keyName={'buttonBorderRadius'}
                    value={ogStyles.buttonBorderRadius}
                    reset={resetValue}
                    update={updateCustom}
                />
                <StyleCard
                    type="boolean"
                    key={'buttonBorder'}
                    keyName={'buttonBorder'}
                    value={ogStyles.buttonBorder ? 'true' : 'false'}
                    reset={resetValue}
                    update={updateCustom}
                />
            </div>
        </div>
    )
}

export default Styles
