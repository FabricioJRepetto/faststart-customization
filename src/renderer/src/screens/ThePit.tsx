import { assetExtention } from '@renderer/utils/assetsUtils'
import {
    extractFilesFromDataTransfer,
    getAssetNameFromFile,
    hasAllowedExtension,
    isConfigFile
} from '@renderer/utils/filesManager'
import { CUSTOM_CONFIG_FILE_NAME } from '@shared/CONSTANTS'
import { CustomConfig } from '@shared/types'
import React, { useState, useRef, useCallback, DragEvent } from 'react'

export default function ThePit(): React.JSX.Element {
    const [files, setFiles] = useState<{ file: File; assetName: string }[]>([])
    const [config, setConfig] = useState<CustomConfig | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [isDraggingOver, setIsDraggingOver] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const filesInputRef = useRef<HTMLInputElement>(null)
    const folderInputRef = useRef<HTMLInputElement>(null)

    const handleDrop = useCallback(async (event: DragEvent<HTMLInputElement>) => {
        event.preventDefault()
        setIsDraggingOver(false)

        const droppedFiles = await extractFilesFromDataTransfer(event.dataTransfer)
        const justOne = droppedFiles.length

        const configFile = droppedFiles.find(isConfigFile)
        const assetFiles = droppedFiles.filter(
            (file) => !isConfigFile(file) && hasAllowedExtension(file)
        )

        const mapped = assetFiles
            .map((file) => ({
                file,
                assetName: getAssetNameFromFile(file.name),
                fileType: assetExtention(file.name)
            }))
            .filter((f) => f)

        setFiles((prev) => [...prev, ...mapped])
        setError(null)

        if (configFile) {
            const config = await configFile
                .text()
                .then((text) => JSON.parse(text))
                .then((r) => r as CustomConfig)
                .catch(() => {
                    setError(`No se pudo leer el archivo ${CUSTOM_CONFIG_FILE_NAME}.`)
                    return null
                })

            if (config) {
                setConfig(config)
                console.log(justOne ? '### Cambiar tema default' : '### Tema default')
            } else {
                setConfig(null)
            }
        } else {
            setConfig(null)
        }
    }, [])

    function handleDragOver(event): void {
        event.preventDefault()
        setIsDraggingOver(true)
    }

    function handleDragLeave(event): void {
        event.preventDefault()
        setIsDraggingOver(false)
    }

    async function handleUpload(): Promise<void> {
        if (files.length === 0) {
            setError('Seleccioná al menos un archivo para subir.')
            return
        }

        if (!config || !config.themeName) {
            setError(`Seleccioná un ${CUSTOM_CONFIG_FILE_NAME} válido con el campo "themeName".`)
            return
        }

        setIsUploading(true)
        setError(null)

        try {
            // TODO
            // const result = await mediaServiceController.uploadThemeAssets(files, config.themeName)
            console.log('Assets subidos:', 'WIP_result')
            setFiles([])
            setConfig(null)
            if (filesInputRef.current) filesInputRef.current.value = ''
            if (folderInputRef.current) folderInputRef.current.value = ''
        } catch (err) {
            setError((err as Error).message)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div>
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                style={{
                    border: '2px dashed',
                    borderColor: isDraggingOver ? '#4a90d9' : '#ccc',
                    borderRadius: 8,
                    padding: 24,
                    textAlign: 'center',
                    marginBottom: 16
                }}
            >
                <p>Arrastrá aquí archivos o una carpeta completa</p>
                <p>(debe incluir {CUSTOM_CONFIG_FILE_NAME})</p>
            </div>

            <div className="actions main-actions">
                <div
                    className="action"
                    style={{
                        pointerEvents: 'none'
                    }}
                >
                    <a
                        onClick={() => !isUploading && handleUpload()}
                        style={{ opacity: '0.5' }}
                    >
                        {isUploading ? 'Subiendo...' : 'Subir archivos'}
                    </a>
                </div>

                <div
                    className="action primary"
                    style={{
                        pointerEvents: !isUploading ? 'all' : 'none'
                    }}
                >
                    <a
                        onClick={() => !isUploading && setFiles([])}
                        style={{ opacity: !isUploading ? 'unset' : '0.5' }}
                    >
                        Reset
                    </a>
                </div>
            </div>

            {config && <p>Nombre de tema detectado: {config.themeName}</p>}

            {files.length > 0 && (
                <div className="scrolleable" style={{ maxHeight: '400px' }}>
                    <ul>
                        {files.map(({ file }) => (
                            <li key={file.webkitRelativePath || file.name}>
                                {file.webkitRelativePath || file.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    )
}
