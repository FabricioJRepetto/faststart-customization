import { EditedLanguageDataAtom, TemplateConfigAtom } from '@renderer/utils/context/context'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import SearchSvg from '../assets/search.svg?react'
import CancelSvg from '../assets/cancel.svg?react'
import ClearSvg from '../assets/clear.svg?react'
import { objectFullStructure } from '@renderer/utils/LangStructureBuilder'
import { scrollConfig } from '@renderer/utils/navigate'
import { useActiveSection } from '@renderer/utils/hooks/useActiveSection'

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
    const textKeys: string[] = []
    const sectionKeys: { name: string; keys: string[] }[] = Object.keys(
        OGLangData[langKeys[0]]
    ).map((s) => {
        const keys = Object.keys(OGLangData[langKeys[0]][s])
        textKeys.push(...keys)
        return { name: s, keys }
    })

    const [keysList, setKeysList] = useState({
        langK: langKeys,
        sectK: sectionKeys,
        textK: textKeys
    })
    const [filterValue, setFilterValue] = useState<string>('')

    const activeSection = useActiveSection(
        Object.keys(OGLangData[langKeys[0]]).map((s) => `language-section-${s}`)
    )

    const applyFilter = (): void => {
        const textKeys: string[] = []
        const newSects = Object.keys(OGLangData[langKeys[0]])
            .map((s) => {
                const keys = Object.keys(OGLangData[langKeys[0]][s]).filter((k) =>
                    k.match(filterValue)
                )
                if (!keys.length) return null
                textKeys.push(...keys)
                return { name: s, keys }
            })
            .filter((s) => s !== null)

        setKeysList((prev) => ({ langK: prev.langK, sectK: newSects, textK: textKeys }))
    }

    const clearFilter = (): void => {
        const textKeys: string[] = []
        const newSects = Object.keys(OGLangData[langKeys[0]]).map((s) => {
            const keys = Object.keys(OGLangData[langKeys[0]][s])
            textKeys.push(...keys)
            return { name: s, keys }
        })
        setKeysList((prev) => ({
            langK: prev.langK,
            sectK: newSects,
            textK: textKeys
        }))
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

    const scrollTo = (section: string): void => {
        const el = document.getElementById(section)
        if (!el) return
        el.scrollIntoView(scrollConfig)
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

            <div className="language-content">
                <div className="language-section-index">
                    {keysList.sectK.map((s) => (
                        <div
                            key={'index_' + s.name}
                            onClick={() => scrollTo(`language-section-${s.name}`)}
                            className={`${activeSection === `language-section-${s.name}` ? 'index-active' : ''}`}
                        >
                            <span></span>
                            {s.name}
                        </div>
                    ))}
                </div>

                <div className="lang-keys-container">
                    <div className="lang-row">
                        <p>Key</p>
                        {keysList.langK.map((lang) => (
                            <p key={lang}>{lang.toUpperCase()}</p>
                        ))}
                    </div>
                    {keysList.sectK.map((section) => (
                        <>
                            <div key={section.name} className="section-row">
                                <p id={`language-section-${section.name}`} className="text-target">
                                    {section.name}
                                </p>
                                {keysList.langK.map((lang) => (
                                    <p key={lang}></p>
                                ))}
                            </div>
                            {section.keys.map((key) => (
                                <div
                                    key={key}
                                    className="lang-row"
                                    id={`language-editor-${section.name}-${key}`}
                                >
                                    <p className="lang-key-column">{key}</p>
                                    {keysList.langK.map((lang) => (
                                        <p
                                            key={lang}
                                            onClick={() => openModal(key, section.name, lang)}
                                            className={valueStyle(key, section.name, lang)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {newLangData[lang][section.name][key] ||
                                                OGLangData[lang][section.name][key] ||
                                                '-'}
                                        </p>
                                    ))}
                                </div>
                            ))}
                        </>
                    ))}
                </div>
            </div>

            {modal && (
                <>
                    <div className="modal-backdrop" onClick={closeModal}></div>
                    <div className="lang-editor-modal">
                        <h2>
                            Editando entrada <code className="gradient-text">{modal.key}</code>{' '}
                            <code className="gradient-text">{modal.lang.toUpperCase()}</code>
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
