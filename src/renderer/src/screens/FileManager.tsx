import mediaServiceController from '@renderer/utils/controllers/mediaServer/mediaServiceController'
import { DBFile } from '@shared/types'
import { useEffect, useState } from 'react'
import OptionsSvg from '../assets/options.svg?react'
import UploadSvg from '../assets/upload.svg?react'
import DropZone from '@renderer/components/DropZone'
import { DEFAULT_CONFIG_FILENAME, TEMPLATE_CONFIG_FILENAME } from '@shared/CONSTANTS'
import { loadDefaultConfigurations, loadTemplate } from '@renderer/utils/bootSequence'

const FileManager = (): React.JSX.Element => {
    const [list, setlist] = useState<object | null>(null)
    const [expanded, setExpanded] = useState<string | null>(null)

    const parser = (files: DBFile[]): object => {
        const aux = {}
        for (const file of files) {
            const data = file.path.split('/')
            const group = data[0]
            const subGroup = data[1]
            const fileName = data.pop()
            if (!aux?.[group]?.[subGroup]) aux[group] = { ...aux?.[group], [subGroup]: [] }
            aux[group] = { ...aux?.[group], [subGroup]: [...aux[group][subGroup], fileName] }
        }
        return aux
    }

    useEffect(() => {
        ;(async () => {
            const files = await mediaServiceController.getFileList()
            setlist(parser(files))
        })()
    }, [])

    const deleteElement = async (path: string): Promise<void> => {
        console.log('[SIMULATE_DELETE]', path)
    }

    const uploadTemplate = async (f: File): Promise<void> => {
        try {
            if (f.name !== TEMPLATE_CONFIG_FILENAME) {
                console.error('nombre de archivo malo')
                return
            }
            const res = await mediaServiceController.uploadTemplateConfig(f)
            if (!res) {
                console.error('respondio mal el server')
                return
            }

            console.log(res)
            await loadTemplate()
        } catch (error) {
            console.error(error)
        }
    }

    const uploadDefaultConfig = async (f: File): Promise<void> => {
        try {
            if (f.name !== DEFAULT_CONFIG_FILENAME) {
                console.error('nombre de archivo malo', f.name)
                return
            }
            const res = await mediaServiceController.uploadDefaultConfig(f)
            if (!res) {
                console.error('respondio mal el server')
                return
            }

            console.log(res)
            await loadDefaultConfigurations()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="screen-content">
            <div className="screen-header">
                <h1>Administrador de Archivos</h1>

                <div className="header-group">
                    <DropZone
                        fileHandler={uploadTemplate}
                        configuration={{ allowedExtensions: ['.json'] }}
                    >
                        <div className="actions">
                            <div className="action primary">
                                <a>
                                    <UploadSvg />
                                    Subir Template
                                </a>
                            </div>
                        </div>
                    </DropZone>

                    <DropZone
                        fileHandler={uploadDefaultConfig}
                        configuration={{ allowedExtensions: ['.json'] }}
                    >
                        <div className="actions">
                            <div className="action primary">
                                <a>
                                    <UploadSvg />
                                    Subir Default Config
                                </a>
                            </div>
                        </div>
                    </DropZone>
                </div>
            </div>

            {list && (
                <div className="file-manager-container scrolleable">
                    {Object.keys(list).map((group) => {
                        return (
                            <div key={group} className="file-manager-group">
                                <p>{group}</p>
                                {Object.keys(list[group]).map((subGroup, i, array) => (
                                    <div
                                        key={group + subGroup}
                                        onClick={() =>
                                            setExpanded((p) =>
                                                p === group + subGroup ? null : group + subGroup
                                            )
                                        }
                                    >
                                        <div className="file-manager-subgroup">
                                            <span>{i + 1 === array.length ? '└' : '├'}</span>
                                            <p>{subGroup}</p>
                                            <span>({list[group][subGroup]?.length ?? 0})</span>
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    deleteElement(`${group}/${subGroup}`)
                                                }}
                                            >
                                                <OptionsSvg />
                                            </div>
                                        </div>
                                        {expanded === group + subGroup && (
                                            <div>
                                                {list[group][subGroup].map((file, i, array) => (
                                                    <div
                                                        key={group + subGroup + file}
                                                        className="file-manager-files"
                                                    >
                                                        <div>
                                                            <span>
                                                                {i + 1 === array.length ? '└' : '├'}
                                                            </span>
                                                            <p>{file}</p>
                                                        </div>
                                                        <div
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                deleteElement(
                                                                    `${group}/${subGroup}/${file}`
                                                                )
                                                            }}
                                                        >
                                                            <OptionsSvg />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default FileManager
