import ClearSvg from '../assets/clear.svg?react'
import { useSetAtom } from 'jotai'
import { DefaultStylesDataAtom, EditedStylesDataAtom, store } from '@renderer/utils/context/context'
import StyleCard from '@renderer/components/StyleCard'
import { DefaultStylesData } from '@shared/types'

const Styles = (): React.JSX.Element => {
    const ogStyles = store.get(DefaultStylesDataAtom)
    const setCustomStyles = useSetAtom(EditedStylesDataAtom)

    console.log(ogStyles)
    if (!ogStyles?.general)
        return (
            <>
                <h1>No hay estilos</h1>
            </>
        )

    const updateCustom = (key: string, parent: string, value: string): void => {
        if (parent === 'button') {
            if (key === 'border') {
                // setCustomStyles((prev) => ({ ...prev, [key]: prev.buttonBorder ? 'false' : 'true' }))
                setCustomStyles((prev) => ({
                    ...prev,
                    [parent]: { ...prev[parent], [key]: prev[parent][key] ? 'false' : 'true' }
                }))
            }
            if (key === 'borderRadius') {
                // setCustomStyles((prev) => ({ ...prev, [key]: value + 'px' }))
                setCustomStyles((prev) => ({
                    ...prev,
                    [parent]: { ...prev[parent], [key]: '' }
                }))
            }
        }

        setCustomStyles((prev) => ({ ...prev, [parent]: { ...prev[parent], [key]: value } }))
    }

    const resetAllValues = (): void => {
        setCustomStyles(DefaultStylesData)
    }

    const resetValue = (key: string, parent: string): void => {
        setCustomStyles((prev) => ({ ...prev, [parent]: { ...prev[parent], [key]: '' } }))
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
                <div className="grid-divider">General</div>
                <StyleCard
                    parentName={'general'}
                    keyName={'primaryColor'}
                    value={ogStyles.general.primaryColor}
                    reset={resetValue}
                    update={updateCustom}
                />
                <StyleCard
                    parentName={'general'}
                    keyName={'secondaryColor'}
                    value={ogStyles.general.secondaryColor}
                    reset={resetValue}
                    update={updateCustom}
                />
                <StyleCard
                    parentName={'general'}
                    keyName={'errorMessageColor'}
                    value={ogStyles.general.errorMessageColor}
                    reset={resetValue}
                    update={updateCustom}
                />

                <div className="grid-divider">Succes Screen</div>
                <StyleCard
                    parentName={'succesScreen'}
                    keyName={'primaryColor'}
                    value={ogStyles.successScreen.primaryColor}
                    reset={resetValue}
                    update={updateCustom}
                />
                <StyleCard
                    parentName={'succesScreen'}
                    keyName={'secondaryColor'}
                    value={ogStyles.successScreen.secondaryColor}
                    reset={resetValue}
                    update={updateCustom}
                />

                <div className="grid-divider">Error Screen</div>
                <StyleCard
                    parentName={'errorScreen'}
                    keyName={'primaryColor'}
                    value={ogStyles.errorScreen.primaryColor}
                    reset={resetValue}
                    update={updateCustom}
                />
                <StyleCard
                    parentName={'errorScreen'}
                    keyName={'secondaryColor'}
                    value={ogStyles.errorScreen.secondaryColor}
                    reset={resetValue}
                    update={updateCustom}
                />

                <div className="grid-divider">Button</div>
                <StyleCard
                    parentName={'button'}
                    keyName={'color'}
                    value={ogStyles.button.color}
                    reset={resetValue}
                    update={updateCustom}
                />
                <StyleCard
                    parentName={'button'}
                    keyName={'background'}
                    value={ogStyles.button.background}
                    reset={resetValue}
                    update={updateCustom}
                />
                <StyleCard
                    type="pixel"
                    parentName={'button'}
                    keyName={'borderRadius'}
                    value={ogStyles.button.borderRadius}
                    reset={resetValue}
                    update={updateCustom}
                />
                <StyleCard
                    type="boolean"
                    parentName={'button'}
                    keyName={'border'}
                    value={ogStyles.button.border ? 'true' : 'false'}
                    reset={resetValue}
                    update={updateCustom}
                />
            </div>
        </div>
    )
}

export default Styles
