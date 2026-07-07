import { EditedLanguageDataAtom, TemplateConfigAtom } from '@renderer/utils/context/context'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import SearchSvg from '../assets/search.svg?react'
import CancelSvg from '../assets/cancel.svg?react'
import ClearSvg from '../assets/clear.svg?react'
import { objectFullStructure } from '@renderer/utils/LangStructureBuilder'

// TODO Considerar que ya exista un archivo modificado previamente y cargarlo para seguir editando desde ahi en lugar de cargar siempre el default
//: Guardar un backup de las modificaciones en localstorage (no me acuerdo por que)

const Languages = (): React.JSX.Element => {
    //* Original
    const OGLangData = useAtomValue(TemplateConfigAtom)?.language || {}
    //* Nuevo
    const [newLangData, setNewLangData] = useAtom(EditedLanguageDataAtom)

    const [modal, setModal] = useState<{ key: string; sect: string; lang: string } | null>(null)
    const [modalValue, setModalValue] = useState<string>('')

    const langKeys = Object.keys(OGLangData)
    const sectionKeys = Object.keys(OGLangData[langKeys[0]])
    const textKeys = sectionKeys.map((sect) => Object.keys(OGLangData[langKeys[0]][sect])).flat()
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
        const { key, sect, lang } = modal!
        setNewLangData((prev) => {
            delete prev[lang][sect][key]
            return prev
        })

        closeModal()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const saveValue = (): void => {
        const { key, sect, lang } = modal!
        const newValue = modalValue

        // actualiza nuevo
        setNewLangData((prev) => ({
            ...prev,
            [lang]: { ...prev[lang], [sect]: { ...prev[lang][sect], [key]: newValue } }
        }))

        closeModal()
    }

    const closeModal = (): void => {
        setModal(null)
        setModalValue('')
    }

    const openModal = (key: string, sect: string, lang: string): void => {
        if (newLangData[lang][sect][key]) setModalValue(newLangData[lang][sect][key])
        setModal({ key, sect, lang })
    }

    const resetAllValues = (): void => {
        setNewLangData(objectFullStructure(OGLangData))
    }

    /** Define un estilo a la casilla dependiendo si existe en el original o si se editó */
    const valueStyle = (key: string, section: string, lang: string): string => {
        if (newLangData?.[lang]?.[section]?.[key]) return 'edited'
        if (!OGLangData?.[lang]?.[section]?.[key]) return 'missing'
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
    }, [modal, saveValue, newLangData])

    return (
        <div className="screen-content">
            <div className="screen-header">
                <h1>Idiomas</h1>

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
                                Descartar cambios
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
                {sectionKeys.map((section) => (
                    <>
                        <div key={section} className="section-row">
                            <p className="">{section}</p>
                            {keysList.langK.map((lang) => (
                                <p key={lang}></p>
                            ))}
                        </div>
                        {Object.keys(OGLangData[langKeys[0]][section]).map((key) => (
                            <div key={key} className="lang-row">
                                <p className="lang-key-column">{key}</p>
                                {keysList.langK.map((lang) => (
                                    <p
                                        key={lang}
                                        onClick={() => openModal(key, section, lang)}
                                        className={valueStyle(key, section, lang)}
                                    >
                                        {newLangData[lang][section][key] ||
                                            OGLangData[lang][section][key] ||
                                            '-'}
                                    </p>
                                ))}
                            </div>
                        ))}
                    </>
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
                        <p>Valor actual: {OGLangData[modal.lang][modal.sect][modal.key]}</p>
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
