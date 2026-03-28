import {
    DefaultLanguageDataAtom,
    EditedLanguageDataAtom,
    LanguageDataStructureAtom
} from '@renderer/utils/context/context'
import { LanguageData } from '@renderer/utils/types'
import { useAtom, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import SearchSvg from '../assets/search.svg?react'
import CancelSvg from '../assets/cancel.svg?react'
import ClearSvg from '../assets/clear.svg?react'

// TODO Considerar que ya exista un archivo modificado previamente y cargarlo para seguir editando desde ahi en lugar de cargar siempre el default
// TODO Scroll touch
//: Guardar un backup de las modificaciones en localstorage (no me acuerdo por que)

const Languages = (): React.JSX.Element => {
    //* Original
    const [OGLangData] = useAtom(DefaultLanguageDataAtom)
    //* Nuevo
    const setNewLangData = useSetAtom(EditedLanguageDataAtom)
    //* Estructura para el Temporal
    const [langDataStructure] = useAtom(LanguageDataStructureAtom)
    //* Temporal
    const [tempLang, setTempLang] = useState<LanguageData>(langDataStructure)

    const [modal, setModal] = useState<{ key: string; lang: string } | null>(null)
    const [modalValue, setModalValue] = useState<string>('')

    const langKeys = Object.keys(OGLangData)
    const textKeys = Object.keys(OGLangData[langKeys[0]])
    const [keysList, setKeysList] = useState({ langK: langKeys, textK: textKeys })
    const [filterValue, setFilterValue] = useState<string>('')

    const applyFilter = (): void => {
        const newKeys = textKeys.filter((k) => k.match(filterValue))
        setKeysList((prev) => ({ langK: prev.langK, textK: newKeys }))
    }

    const clearFilter = (): void => {
        setKeysList((prev) => ({ langK: prev.langK, textK: textKeys }))
        setFilterValue('')
    }

    const resetValue = (): void => {
        const { key, lang } = modal!

        // borra valor del temporal
        setTempLang((prev) => ({ ...prev, [lang]: { ...prev[lang], [key]: '' } }))

        // setea valor del og en el nuevo
        setNewLangData((prev) => ({
            ...prev,
            [lang]: { ...prev[lang], [key]: OGLangData[lang][key] }
        }))

        closeModal()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const saveValue = (): void => {
        const { key, lang } = modal!
        const newValue = modalValue

        // actualiza temporal
        setTempLang((prev) => ({ ...prev, [lang]: { ...prev[lang], [key]: newValue } }))

        // actualiza nuevo
        setNewLangData((prev) => ({
            ...prev,
            [lang]: { ...prev[lang], [key]: newValue }
        }))

        closeModal()
    }

    const closeModal = (): void => {
        setModal(null)
        setModalValue('')
    }

    const openModal = (key: string, lang: string): void => {
        if (tempLang[lang][key]) setModalValue(tempLang[lang][key])
        setModal({ key, lang })
    }

    const resetAllValues = (): void => {
        // reset temp a 0
        setTempLang(langDataStructure)
        // reset new a og
        setNewLangData(OGLangData)
    }

    /** Define un estilo a la casilla dependiendo si existe en el original o si se editó */
    const valueStyle = (key: string, lang: string): string => {
        if (tempLang[lang][key]) return 'edited'
        if (!OGLangData[lang][key]) return 'missing'
        return ''
    }

    useEffect(() => {
        const keysListener = (e: KeyboardEvent): void => {
            switch (e.key) {
                case 'Enter':
                    saveValue()
                    break
                case 'Escape':
                    closeModal()
                    break
                default:
                    break
            }
        }

        if (modal) {
            addEventListener('keydown', keysListener)
        } else {
            removeEventListener('keydown', keysListener)
        }

        return () => removeEventListener('keydown', keysListener)
    }, [modal, saveValue, OGLangData, tempLang])

    return (
        <div className="screen-content">
            <div className="screen-header">
                <h1>Languages</h1>

                <div className="header-group">
                    <div className="input-wrapper">
                        <input
                            type="text"
                            value={filterValue}
                            placeholder="Buscar Keys"
                            onChange={(e) => setFilterValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
                        />
                        {keysList.textK.length === textKeys.length ? (
                            <SearchSvg onClick={applyFilter} />
                        ) : (
                            <CancelSvg onClick={clearFilter} />
                        )}
                    </div>
                    <div className="actions">
                        <div className="action tertiary">
                            <a onClick={resetAllValues}>
                                <ClearSvg />
                                Resetear todo
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lang-keys-container">
                <div className="lang-row">
                    <p>Key</p>
                    {keysList.langK.map((lang) => (
                        <p key={lang}>{lang.toUpperCase()}</p>
                    ))}
                </div>
                {keysList.textK.map((key) => (
                    <div key={key} className="lang-row">
                        <p>{key}</p>
                        {keysList.langK.map((lang) => (
                            <p
                                key={lang}
                                onClick={() => openModal(key, lang)}
                                className={valueStyle(key, lang)}
                            >
                                {tempLang[lang][key] || OGLangData[lang][key] || '-'}
                            </p>
                        ))}
                    </div>
                ))}
            </div>

            {modal && (
                <>
                    <div className="modal-backdrop" onClick={closeModal}></div>
                    <div className="lang-editor-modal">
                        <h2>
                            Editando entrada <code className="gradient-text">{modal.key}</code> del
                            idioma <code className="gradient-text">{modal.lang.toUpperCase()}</code>
                        </h2>
                        <p>Valor actual: {OGLangData[modal.lang][modal.key]}</p>
                        <textarea
                            autoFocus
                            value={modalValue}
                            id="lang-value-input"
                            onChange={(e) => setModalValue(e.target.value)}
                        />
                        <div className="actions">
                            <div className="action primary">
                                <a onClick={saveValue}>Aplicar</a>
                            </div>
                            <div className="action">
                                <a onClick={resetValue}>Resetear</a>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Languages
