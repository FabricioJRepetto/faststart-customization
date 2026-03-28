import {
    DefaultLanguageDataAtom,
    EditedLanguageDataAtom,
    LanguageDataStructureAtom
} from '@renderer/utils/context/context'
import { LanguageData } from '@renderer/utils/types'
import { useAtom, useSetAtom } from 'jotai'
import { useCallback, useEffect, useState } from 'react'

// TODO Considerar que ya exista un archivo modificado previamente y cargarlo para seguir editando desde ahi en lugar de cargar siempre el default
// TODO Guardar un backup de las modificaciones en localstorage (no me acuerdo por que)
// TODO Agregar un buscador para las keys
// TODO Agregar un boton para resetear el valor de una key a su valor por default
// TODO Agregar un boton para resetear todas las key a su valor por default
// TODO Combinación de teclas para borrar el valor de una key en el modal (ej: Ctrl+Supr)

const Languages = (): React.JSX.Element => {
    const [OGLangData] = useAtom(DefaultLanguageDataAtom)
    const setNewLangData = useSetAtom(EditedLanguageDataAtom)
    const [langDataStructure] = useAtom(LanguageDataStructureAtom)
    const [auxLang, setAuxLang] = useState<LanguageData>(langDataStructure)
    const [modal, setModal] = useState<{ key: string; lang: string } | null>(null)

    const langKeys = Object.keys(OGLangData)
    const textKeys = Object.keys(OGLangData[langKeys[0]])

    const updateValue = useCallback(
        (key: string, lang: string, value: string): void => {
            const newData = { ...auxLang }
            newData[lang][key] = value
            setAuxLang(newData)
        },
        [auxLang]
    )

    const updateNewData = useCallback(
        (key: string, lang: string): void => {
            console.log('Updating new data set')
            const newData = { ...OGLangData }
            newData[lang][key] = auxLang[lang][key]
            setNewLangData(newData)
        },
        [OGLangData, auxLang, setNewLangData]
    )

    useEffect(() => {
        const fn = (e: KeyboardEvent): void => {
            if (!modal) return
            console.log(e.key)

            switch (e.key) {
                case 'Enter':
                case 'Escape':
                    updateNewData(modal.key, modal.lang)
                    setModal(null)
                    break
                // case 'Delete':
                //     updateValue(modal.key, modal.lang, '')
                //     setModal(null)
                //     break
                default:
                    break
            }
        }

        if (modal) {
            addEventListener('keydown', fn)
        } else {
            removeEventListener('keydown', fn)
        }

        return () => {
            removeEventListener('keydown', fn)
        }
    }, [modal, updateValue, auxLang, updateNewData])

    return (
        <div>
            <h1>Languages</h1>

            <div className="lang-keys-container">
                <div className="lang-row">
                    <p>Key</p>
                    {langKeys.map((lang) => (
                        <p key={lang}>{lang.toUpperCase()}</p>
                    ))}
                </div>
                {textKeys.map((key) => (
                    <div key={key} className="lang-row">
                        <p>{key}</p>
                        {langKeys.map((lang) => (
                            <p
                                key={lang}
                                onClick={() => setModal({ key, lang })}
                                className={auxLang[lang][key] ? 'edited' : ''}
                            >
                                {auxLang[lang][key] || OGLangData[lang][key] || '-'}
                            </p>
                        ))}
                    </div>
                ))}
            </div>

            {modal && (
                <>
                    <div
                        className="modal-backdrop"
                        onClick={() => {
                            updateNewData(modal.key, modal.lang)
                            setModal(null)
                        }}
                    ></div>
                    <div className="lang-editor-modal">
                        <h2>
                            Editando entrada <code className="gradient-text">{modal.key}</code> del
                            idioma <code className="gradient-text">{modal.lang.toUpperCase()}</code>
                        </h2>
                        <p>Valor actual: {OGLangData[modal.lang][modal.key]}</p>
                        <textarea
                            autoFocus
                            value={auxLang[modal.lang][modal.key]}
                            id="lang-value-input"
                            onChange={(e) => updateValue(modal.key, modal.lang, e.target.value)}
                        />
                        <div className="actions">
                            <div className="action primary">
                                <a
                                    onClick={() => {
                                        updateNewData(modal.key, modal.lang)
                                        setModal(null)
                                    }}
                                >
                                    Aplicar
                                </a>
                            </div>
                            <div className="action">
                                <a
                                    onClick={() => {
                                        updateValue(modal.key, modal.lang, '')
                                        setModal(null)
                                    }}
                                >
                                    Resetear
                                </a>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Languages
