import ClearSvg from '../assets/clear.svg?react'
import { useSetAtom } from 'jotai'
import { DefaultStylesDataAtom, EditedStylesDataAtom, store } from '@renderer/utils/context/context'
import StyleCard from '@renderer/components/StyleCard'
import { DefaultStylesData } from '@shared/types'
import Tooltip from '@renderer/components/Tooltip'

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
        if (parent === 'button' || parent === 'secondaryButton') {
            if (key === 'border') {
                setCustomStyles((prev) => ({
                    ...prev,
                    [parent]: { ...prev[parent], [key]: prev[parent][key] ? 'false' : 'true' }
                }))
            }
            if (key === 'borderRadius') {
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
                <h1>
                    Colores y Estilos{' '}
                    <Tooltip
                        text={`Colores de botones, logos, textos y pantallas. Además de algunos elementos como los bordes de botones.`}
                    />
                </h1>
                <div className="actions">
                    <div className="action tertiary">
                        <a onClick={resetAllValues}>
                            <ClearSvg />
                            Descartar cambios
                        </a>
                    </div>
                </div>
            </div>

            <div className="assets-grid grid-styles scrolleable">
                <div className="grid-divider">
                    <h3>Logo</h3>
                    <p>
                        Colores del logo. La aplicación calcula el contraste entre el color de los
                        fondos y el logo, para que siempre sea disitngible de los fondos de
                        pantalla.
                    </p>
                </div>
                <StyleCard
                    parentName={'logo'}
                    keyName={'dark'}
                    // description={'Color del logo cuando el fondo es claro'}
                    value={ogStyles?.logo?.dark}
                    reset={resetValue}
                    update={updateCustom}
                />
                <StyleCard
                    parentName={'logo'}
                    keyName={'light'}
                    // description={'Color del logo cuando el fondo es oscuro'}
                    value={ogStyles?.logo?.light}
                    reset={resetValue}
                    update={updateCustom}
                />

                <div className="grid-divider">
                    <h3>General</h3>
                    <p>Colores de la mayoría de los flujos.</p>
                </div>
                <StyleCard
                    parentName={'general'}
                    keyName={'primaryColor'}
                    // description={'Color de texto e iconos en la mayoría de las pantallas'}
                    value={ogStyles?.general?.primaryColor}
                    reset={resetValue}
                    update={updateCustom}
                />
                <StyleCard
                    parentName={'general'}
                    keyName={'secondaryColor'}
                    // description={'Color de texto en cajas de texto'}
                    value={ogStyles?.general?.secondaryColor}
                    reset={resetValue}
                    update={updateCustom}
                />
                <StyleCard
                    parentName={'general'}
                    keyName={'errorMessageColor'}
                    // description={'Color de texto en mensajes de error'}
                    value={ogStyles?.general?.errorMessageColor}
                    reset={resetValue}
                    update={updateCustom}
                />

                <div className="grid-divider">
                    <h3>Pantallas de éxito</h3>
                    <p>Estilos de pantalla de exito, etc.</p>
                </div>
                <StyleCard
                    parentName={'successScreen'}
                    keyName={'primaryColor'}
                    // description={'Color de texto e iconos en las pantallas de éxito'}
                    value={ogStyles?.successScreen?.primaryColor}
                    reset={resetValue}
                    update={updateCustom}
                />
                <StyleCard
                    parentName={'successScreen'}
                    keyName={'secondaryColor'}
                    value={ogStyles?.successScreen?.secondaryColor}
                    reset={resetValue}
                    update={updateCustom}
                />

                <div className="grid-divider">
                    <h3>Pantallas de error</h3>
                    <p>Estilos de pantalla de error.</p>
                </div>
                <StyleCard
                    parentName={'errorScreen'}
                    keyName={'primaryColor'}
                    // description={'Color de texto e iconos en las pantallas de error'}
                    value={ogStyles?.errorScreen?.primaryColor}
                    reset={resetValue}
                    update={updateCustom}
                />
                <StyleCard
                    parentName={'errorScreen'}
                    keyName={'secondaryColor'}
                    value={ogStyles?.errorScreen?.secondaryColor}
                    reset={resetValue}
                    update={updateCustom}
                />

                <div className="grid-divider">
                    <h3>Botones</h3>
                    <p>Estilo de los botones en los flujos de la aplicación.</p>
                </div>
                <StyleCard
                    parentName={'button'}
                    keyName={'color'}
                    value={ogStyles?.button?.color}
                    reset={resetValue}
                    update={updateCustom}
                />
                <StyleCard
                    parentName={'button'}
                    keyName={'background'}
                    value={ogStyles?.button?.background}
                    reset={resetValue}
                    update={updateCustom}
                />
                <StyleCard
                    type="pixel"
                    parentName={'button'}
                    keyName={'borderRadius'}
                    value={ogStyles?.button?.borderRadius}
                    reset={resetValue}
                    update={updateCustom}
                />
                <StyleCard
                    type="boolean"
                    parentName={'button'}
                    keyName={'border'}
                    value={ogStyles?.button?.border ? 'true' : 'false'}
                    reset={resetValue}
                    update={updateCustom}
                />

                <div className="grid-divider">
                    <h3>Pantalla de Inicio</h3>
                    <p>Estilos de botones en la pantalla inicial. También aplica al códico QR.</p>
                </div>
                <StyleCard
                    parentName={'secondaryButton'}
                    keyName={'color'}
                    value={ogStyles?.secondaryButton?.color}
                    reset={resetValue}
                    update={updateCustom}
                />
                <StyleCard
                    parentName={'secondaryButton'}
                    keyName={'background'}
                    value={ogStyles?.secondaryButton?.background}
                    reset={resetValue}
                    update={updateCustom}
                />
                <StyleCard
                    type="pixel"
                    parentName={'secondaryButton'}
                    keyName={'borderRadius'}
                    value={ogStyles?.secondaryButton?.borderRadius}
                    reset={resetValue}
                    update={updateCustom}
                />
                <StyleCard
                    type="boolean"
                    parentName={'secondaryButton'}
                    keyName={'border'}
                    value={ogStyles?.secondaryButton?.border ? 'true' : 'false'}
                    reset={resetValue}
                    update={updateCustom}
                />

                <div className="grid-divider">
                    <h3>Input</h3>
                    <p>Estilo de botones en la pantalla de ingreso de monto.</p>
                </div>
                <StyleCard
                    parentName={'inputButton'}
                    keyName={'color'}
                    value={ogStyles?.inputButton?.color}
                    reset={resetValue}
                    update={updateCustom}
                />
                <StyleCard
                    parentName={'inputButton'}
                    keyName={'background'}
                    value={ogStyles?.inputButton?.background}
                    reset={resetValue}
                    update={updateCustom}
                />
                <StyleCard
                    type="pixel"
                    parentName={'inputButton'}
                    keyName={'borderRadius'}
                    value={ogStyles?.inputButton?.borderRadius}
                    reset={resetValue}
                    update={updateCustom}
                />
                <StyleCard
                    type="boolean"
                    parentName={'inputButton'}
                    keyName={'border'}
                    value={ogStyles?.inputButton?.border ? 'true' : 'false'}
                    reset={resetValue}
                    update={updateCustom}
                />
            </div>
        </div>
    )
}

export default Styles
