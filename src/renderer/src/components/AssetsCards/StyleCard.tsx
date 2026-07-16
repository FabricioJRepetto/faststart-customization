import { DefaultStylesDataAtom, EditedStylesDataAtom } from '@renderer/utils/context/context'
import { useAtom } from 'jotai'
import CheckSvg from '../../assets/check.svg?react'
import CancelSvg from '../../assets/cancel.svg?react'
import UndoSvg from '../../assets/undo.svg?react'
import Tooltip from '../Tooltip'
import React, { useEffect, useRef, useState } from 'react'
import { StylesParentKeys } from '@shared/types'

const DICT = {
    dark: 'Oscuro',
    light: 'Claro',
    primaryColor: 'Color primario',
    secondaryColor: 'Color secundario',
    errorMessageColor: 'Color de Error',
    color: 'Color',
    background: 'Fondo'
}

const b = (v: string): boolean => {
    return v === 'true'
}

interface Props {
    keyName: string
    description?: string
    parentName: string
    value: string | undefined
    reset: (key: string, parent: string) => void
    update: (key: string, parent: string, value: string) => void
}

export const ColorStyleCard = ({
    keyName,
    description,
    parentName,
    value,
    reset,
    update
}: Props): React.JSX.Element => {
    const [customStyles] = useAtom(EditedStylesDataAtom)
    const hasCustom = customStyles?.[parentName]?.[keyName]
    const colorRef = useRef<HTMLInputElement>(null)

    return (
        <div
            className={`assets-container color-asset-container ${hasCustom ? 'asset-card-has-custom' : 'asset-card-initial'}`}
        >
            <div className="header">
                <Tooltip text={description ?? keyName}>
                    <p>{DICT[keyName] ?? keyName}</p>
                </Tooltip>
                {hasCustom && (
                    <Tooltip text="Restablecer valor">
                        <span
                            className="button delete-buton"
                            onClick={() => reset(keyName, parentName)}
                        >
                            <UndoSvg />
                        </span>
                    </Tooltip>
                )}
            </div>
            <p className="tag">Inicial</p>
            <div className="original-color-sample">
                <p>{value || 'Sin indicar'}</p>
                <div className="color-sample" style={{ backgroundColor: value }}></div>
            </div>

            <p className="tag">Custom</p>
            <div className="input-wrapper">
                <input
                    type="text"
                    placeholder="Sin indicar"
                    value={customStyles?.[parentName]?.[keyName] || ''}
                    onChange={(e) => update(keyName, parentName, e.target.value)}
                ></input>
                <label
                    className="custom-color-sample"
                    style={{ backgroundColor: customStyles?.[parentName]?.[keyName] || '' }}
                >
                    <input
                        className="hidden-color-input"
                        type="color"
                        ref={colorRef}
                        onBlur={() => update(keyName, parentName, colorRef.current!.value)}
                        onChange={() => null}
                    />
                </label>
            </div>
        </div>
    )
}

interface BorderProps {
    description?: string
    parentName: string
    value: { border: boolean | undefined; borderRadius: string | undefined }
    reset: (key: string, parent: string) => void
    update: (key: string, parent: string, value: string) => void
}

export const BorderStyleCard = ({
    description,
    parentName,
    value,
    reset,
    update
}: BorderProps): React.JSX.Element => {
    const [customStyles] = useAtom(EditedStylesDataAtom)
    const hasCustom = customStyles?.[parentName]?.borderRadius || customStyles?.[parentName]?.border

    return (
        <div
            className={`assets-container color-asset-container ${hasCustom ? 'asset-card-has-custom' : 'asset-card-initial'}`}
        >
            <div className="header">
                <Tooltip text={description ?? 'Borde'}>
                    <p>Borde</p>
                </Tooltip>
                {hasCustom && (
                    <Tooltip text="Restablecer valor">
                        <span
                            className="button delete-buton"
                            onClick={() => reset('borderRadius', parentName)}
                        >
                            <UndoSvg />
                        </span>
                    </Tooltip>
                )}
            </div>
            <p className="tag">
                Mostrar borde (Inicial: {value?.border ? 'si' : 'no'})
            </p>
            <div
                className="original-color-sample input-wrapper"
                onClick={() =>
                    update(
                        'border',
                        parentName,
                        b(customStyles?.[parentName]?.border) ? 'false' : 'true'
                    )
                }
            >
                <p>{customStyles?.[parentName]?.border || 'false'}</p>
                <button className={b(customStyles?.[parentName]?.border) ? '' : 'inactive'}>
                    {b(customStyles?.[parentName]?.border) ? <CheckSvg /> : <CancelSvg />}
                </button>
            </div>

            <p className="tag">Suavizado (Inicial: {value?.borderRadius ?? '0px'})</p>
            <div className="input-wrapper">
                <input
                    type="number"
                    placeholder="Sin indicar"
                    min={0}
                    value={parseInt(customStyles?.[parentName]?.borderRadius ?? 0)}
                    onChange={(e) => update('borderRadius', parentName, e.target.value)}
                ></input>
            </div>
        </div>
    )
}

interface PreviewProps {
    parentName: StylesParentKeys
}

export const PreviewStyleCard = ({ parentName }: PreviewProps): React.JSX.Element => {
    const [ogStyle] = useAtom(DefaultStylesDataAtom)
    const [customStyles] = useAtom(EditedStylesDataAtom)

    const [border, setBorder] = useState<boolean | null>(null)
    const [borderRadius, setBorderRadius] = useState<string | null>(null)
    const [color, setColor] = useState<string | null>(null)
    const [background, setBackground] = useState<string | null>(null)

    useEffect(() => {
        const f = (): void => {
            const _b =
                (customStyles?.[parentName]?.['border'] ?? ogStyle?.[parentName]?.['border']) ===
                'true'
            setBorder(_b)

            const customBR = customStyles?.[parentName]?.['borderRadius']
            const _br = customBR != null ? customBR + 'px' : ogStyle?.[parentName]?.['borderRadius']
            setBorderRadius(_br)

            const _c = customStyles?.[parentName]?.['color'] || ogStyle?.[parentName]?.['color']
            setColor(_c)

            const _bg =
                customStyles?.[parentName]?.['background'] || ogStyle?.[parentName]?.['background']
            setBackground(_bg)
        }
        f()
        // eslint-disable-next-line
    }, [ogStyle, customStyles?.[parentName]])

    return (
        <div
            className="style-button-preview"
            style={{
                borderRadius: borderRadius!,
                border: `3px solid ${border ? color : 'transparent'}`,
                color: color!,
                background: background!
            }}
        >
            PREVIEW
        </div>
    )
}
