import ClearSvg from '../assets/clear.svg?react'
import { useSetAtom } from 'jotai'
import { EditedStylesDataAtom, store, TemplateConfigAtom } from '@renderer/utils/context/context'
import {
    ColorStyleCard,
    BorderStyleCard,
    PreviewStyleCard
} from '@renderer/components/AssetsCards/StyleCard'
import { DefaultStylesData, StylesParentKeys } from '@shared/types'
import Tooltip from '@renderer/components/Tooltip'
import { SECT } from '@renderer/utils/navigate'

const Styles = (): React.JSX.Element => {
    const ogStyles = store.get(TemplateConfigAtom)?.styles
    const setCustomStyles = useSetAtom(EditedStylesDataAtom)

    const updateCustom = (key: string, parent: string, value: string): void => {
        if (parent === 'button' || parent === 'secondaryButton' || parent === 'inputButton') {
            if (key === 'border') {
                const _v = value === 'true'
                const new_v = _v === ogStyles![parent].border ? undefined : value

                setCustomStyles((prev) => ({
                    ...prev,
                    [parent]: { ...prev[parent], [key]: new_v }
                }))
            }
            if (key === 'borderRadius') {
                setCustomStyles((prev) => ({
                    ...prev,
                    [parent]: { ...prev[parent], [key]: value }
                }))
            }
        }

        setCustomStyles((prev) => ({ ...prev, [parent]: { ...prev[parent], [key]: value } }))
    }

    const resetAllValues = (): void => {
        setCustomStyles(DefaultStylesData)
    }

    const resetValue = (key: string, parent: string): void => {
        if (key === 'borderRadius') {
            setCustomStyles((prev) => ({
                ...prev,
                [parent]: { ...prev[parent], [key]: undefined, border: undefined }
            }))
        } else {
            setCustomStyles((prev) => ({ ...prev, [parent]: { ...prev[parent], [key]: '' } }))
        }
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
                <div className="grid-divider target" id={SECT.logo_style_edit}>
                    <h3>Logo</h3>
                    <p>
                        Colores del logo. La aplicación calcula el contraste entre el color de los
                        fondos y el logo, para que siempre sea distinguible de los fondos de
                        pantalla.
                    </p>
                    <p>
                        <i>
                            Importante utilizar un logo <span className="gradient-text">svg</span>{' '}
                            para que esta feature funcione.
                        </i>
                    </p>
                </div>
                <ColorStyleCard
                    parentName={'logo'}
                    keyName={'dark'}
                    description={'Color del logo cuando el fondo es claro'}
                    value={ogStyles?.logo?.dark}
                    reset={resetValue}
                    update={updateCustom}
                />
                <ColorStyleCard
                    parentName={'logo'}
                    keyName={'light'}
                    description={'Color del logo cuando el fondo es oscuro'}
                    value={ogStyles?.logo?.light}
                    reset={resetValue}
                    update={updateCustom}
                />

                <div className="grid-divider target" id={SECT.idle_style_edit}>
                    <h3>Pantalla Inicio</h3>
                    <p>Estilos de la pantalla de inicio.</p>
                </div>
                <ColorStyleCard
                    parentName={'idle'}
                    keyName={'primaryColor'}
                    description={'Color de texto e iconos en las pantallas de éxito'}
                    value={ogStyles?.idle?.primaryColor}
                    reset={resetValue}
                    update={updateCustom}
                />
                <ColorStyleCard
                    parentName={'idle'}
                    keyName={'secondaryColor'}
                    value={ogStyles?.idle?.secondaryColor}
                    reset={resetValue}
                    update={updateCustom}
                />

                <div className="grid-divider target" id={SECT.user_action_style_edit}>
                    <h3>UserAction</h3>
                    <p>Colores de la mayoría de los flujos.</p>
                </div>
                <ColorStyleCard
                    parentName={'userAction'}
                    keyName={'primaryColor'}
                    description={'Color de texto e iconos en la mayoría de las pantallas'}
                    value={ogStyles?.userAction?.primaryColor}
                    reset={resetValue}
                    update={updateCustom}
                />
                <ColorStyleCard
                    parentName={'userAction'}
                    keyName={'secondaryColor'}
                    description={'Color de texto en cajas de texto'}
                    value={ogStyles?.userAction?.secondaryColor}
                    reset={resetValue}
                    update={updateCustom}
                />
                <ColorStyleCard
                    parentName={'userAction'}
                    keyName={'errorMessageColor'}
                    description={'Color de texto en mensajes de error'}
                    value={ogStyles?.userAction?.errorMessageColor}
                    reset={resetValue}
                    update={updateCustom}
                />

                <div className="grid-divider target" id={SECT.info_style_edit}>
                    <h3>Pantallas de Información</h3>
                    <p>Estilos de pantalla de exito, etc.</p>
                </div>
                <ColorStyleCard
                    parentName={'infoScreen'}
                    keyName={'primaryColor'}
                    description={'Color de texto e iconos en las pantallas de éxito'}
                    value={ogStyles?.infoScreen?.primaryColor}
                    reset={resetValue}
                    update={updateCustom}
                />
                <ColorStyleCard
                    parentName={'infoScreen'}
                    keyName={'secondaryColor'}
                    value={ogStyles?.infoScreen?.secondaryColor}
                    reset={resetValue}
                    update={updateCustom}
                />

                <div className="grid-divider target" id={SECT.success_style_edit}>
                    <h3>Pantallas de éxito</h3>
                    <p>Estilos de pantalla de exito, etc.</p>
                </div>
                <ColorStyleCard
                    parentName={'successScreen'}
                    keyName={'primaryColor'}
                    description={'Color de texto e iconos en las pantallas de éxito'}
                    value={ogStyles?.successScreen?.primaryColor}
                    reset={resetValue}
                    update={updateCustom}
                />
                <ColorStyleCard
                    parentName={'successScreen'}
                    keyName={'secondaryColor'}
                    value={ogStyles?.successScreen?.secondaryColor}
                    reset={resetValue}
                    update={updateCustom}
                />

                <div className="grid-divider target" id={SECT.error_style_edit}>
                    <h3>Pantallas de error</h3>
                    <p>Estilos de pantalla de error.</p>
                </div>
                <ColorStyleCard
                    parentName={'errorScreen'}
                    keyName={'primaryColor'}
                    description={'Color de texto e iconos en las pantallas de error'}
                    value={ogStyles?.errorScreen?.primaryColor}
                    reset={resetValue}
                    update={updateCustom}
                />
                <ColorStyleCard
                    parentName={'errorScreen'}
                    keyName={'secondaryColor'}
                    value={ogStyles?.errorScreen?.secondaryColor}
                    reset={resetValue}
                    update={updateCustom}
                />

                <div className="grid-divider target" id={SECT.button_style_edit}>
                    <h3>Botones</h3>
                    <p>Estilo de los botones en los flujos de la aplicación.</p>
                </div>
                <ColorStyleCard
                    parentName={'button'}
                    keyName={'color'}
                    value={ogStyles?.button?.color}
                    reset={resetValue}
                    update={updateCustom}
                />
                <ColorStyleCard
                    parentName={'button'}
                    keyName={'background'}
                    value={ogStyles?.button?.background}
                    reset={resetValue}
                    update={updateCustom}
                />
                <BorderStyleCard
                    parentName={'button'}
                    value={{
                        borderRadius: ogStyles?.button?.borderRadius,
                        border: ogStyles?.button?.border
                    }}
                    reset={resetValue}
                    update={updateCustom}
                />
                <PreviewStyleCard parentName={StylesParentKeys.button} />

                <div className="grid-divider target" id={SECT.sec_button_style_edit}>
                    <h3>Botones pantalla de Inicio</h3>
                    <p>Estilos de botones en la pantalla inicial. También aplica al códico QR.</p>
                </div>
                <ColorStyleCard
                    parentName={'secondaryButton'}
                    keyName={'color'}
                    value={ogStyles?.secondaryButton?.color}
                    reset={resetValue}
                    update={updateCustom}
                />
                <ColorStyleCard
                    parentName={'secondaryButton'}
                    keyName={'background'}
                    value={ogStyles?.secondaryButton?.background}
                    reset={resetValue}
                    update={updateCustom}
                />
                <BorderStyleCard
                    parentName={'secondaryButton'}
                    value={{
                        borderRadius: ogStyles?.secondaryButton?.borderRadius,
                        border: ogStyles?.secondaryButton?.border
                    }}
                    reset={resetValue}
                    update={updateCustom}
                />
                <PreviewStyleCard parentName={StylesParentKeys.secondaryButton} />

                <div className="grid-divider target" id={SECT.input_button_style_edit}>
                    <h3>Input</h3>
                    <p>Estilo de botones en las pantallas de ingreso de monto.</p>
                </div>
                <ColorStyleCard
                    parentName={'inputButton'}
                    keyName={'color'}
                    value={ogStyles?.inputButton?.color}
                    reset={resetValue}
                    update={updateCustom}
                />
                <ColorStyleCard
                    parentName={'inputButton'}
                    keyName={'background'}
                    value={ogStyles?.inputButton?.background}
                    reset={resetValue}
                    update={updateCustom}
                />
                <BorderStyleCard
                    parentName={'inputButton'}
                    value={{
                        borderRadius: ogStyles?.inputButton?.borderRadius,
                        border: ogStyles?.inputButton?.border
                    }}
                    reset={resetValue}
                    update={updateCustom}
                />
                <PreviewStyleCard parentName={StylesParentKeys.inputButton} />
            </div>
        </div>
    )
}

export default Styles
