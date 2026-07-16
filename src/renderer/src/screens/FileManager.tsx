import mediaServiceController from '@renderer/utils/controllers/mediaServer/mediaServiceController'
import { DBFile } from '@shared/types'
import { useEffect, useState } from 'react'
import OptionsSvg from '../assets/gears.svg?react'

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
        console.log('[DELETE]', path)
    }

    return (
        <div className="screen-content">
            <div className="screen-header">
                <h1>Administrador de Archivos</h1>
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
