import mediaServiceController from '@renderer/utils/controllers/mediaServer/mediaServiceController'
import { CustomConfig } from '@shared/types'
import { useState, useRef, useCallback } from 'react'

const ACCEPTED_EXTENSIONS = [
    '.svg',
    '.png',
    '.jpg',
    '.jpeg',
    '.webp',
    '.gif',
    '.mp3',
    '.wav',
    '.ogg',
    '.mp4',
    '.webm',
    '.mov'
]

const CONFIG_FILE_NAME = 'customConfig.json'

function getAssetNameFromFile(fileName) {
    return fileName.replace(/\.[^/.]+$/, '')
}

function isConfigFile(file) {
    return file.name === CONFIG_FILE_NAME
}

function hasAllowedExtension(file) {
    const lowerName = file.name.toLowerCase()
    return ACCEPTED_EXTENSIONS.some((ext) => lowerName.endsWith(ext))
}

// Recorre recursivamente una carpeta soltada vía drag & drop
async function readEntry(entry) {
    if (entry.isFile) {
        return new Promise((resolve) => {
            entry.file((file) => resolve([file]))
        })
    }

    if (entry.isDirectory) {
        const reader = entry.createReader()
        const entries = await new Promise((resolve) => {
            reader.readEntries(resolve)
        })
        const nested = await Promise.all(entries.map(readEntry))
        return nested.flat()
    }

    return []
}

async function extractFilesFromDataTransfer(dataTransfer) {
    const items = Array.from(dataTransfer.items)
    const entries = items
        .map((item) => item.webkitGetAsEntry && item.webkitGetAsEntry())
        .filter(Boolean)

    if (entries.length === 0) {
        // Fallback para navegadores sin soporte de entries (no soporta carpetas)
        return Array.from(dataTransfer.files)
    }

    const nested = await Promise.all(entries.map(readEntry))
    return nested.flat()
}

export default function ThePit(): React.JSX.Element {
    const [files, setFiles] = useState([])
    const [config, setConfig] = useState<CustomConfig | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [isDraggingOver, setIsDraggingOver] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const filesInputRef = useRef(null)
    const folderInputRef = useRef(null)

    function processSelectedFiles(selectedFiles): void {
        const configFile = selectedFiles.find(isConfigFile)
        const assetFiles = selectedFiles.filter(
            (file) => !isConfigFile(file) && hasAllowedExtension(file)
        )

        const mapped = assetFiles.map((file) => ({
            file,
            assetName: getAssetNameFromFile(file.name)
        }))

        setFiles(mapped)
        setError(null)

        if (configFile) {
            configFile
                .text()
                .then((text) => {
                    try {
                        setConfig(JSON.parse(text))
                    } catch {
                        setError(`El archivo ${CONFIG_FILE_NAME} no es un JSON válido.`)
                        setConfig(null)
                    }
                })
                .catch(() => {
                    setError(`No se pudo leer el archivo ${CONFIG_FILE_NAME}.`)
                    setConfig(null)
                })
        } else {
            setConfig(null)
            setError(`No se encontró el archivo ${CONFIG_FILE_NAME} entre los seleccionados.`)
        }
    }

    function handleInputChange(event): void {
        const selectedFiles = Array.from(event.target.files)
        processSelectedFiles(selectedFiles)
    }

    const handleDrop = useCallback(async (event) => {
        event.preventDefault()
        setIsDraggingOver(false)

        const droppedFiles = await extractFilesFromDataTransfer(event.dataTransfer)
        processSelectedFiles(droppedFiles)
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
            setError(`Seleccioná un ${CONFIG_FILE_NAME} válido con el campo "folder".`)
            return
        }

        setIsUploading(true)
        setError(null)

        try {
            const result = await mediaServiceController.uploadThemeAssets(files, config.themeName)
            console.log('Assets subidos:', result)
            setFiles([])
            setConfig(null)
            if (filesInputRef.current) filesInputRef.current.value = ''
            if (folderInputRef.current) folderInputRef.current.value = ''
        } catch (err) {
            setError(err.message)
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
                <p>(debe incluir {CONFIG_FILE_NAME})</p>
            </div>

            <div>
                <label>Seleccionar archivos: </label>
                <input
                    ref={filesInputRef}
                    type="file"
                    multiple
                    accept={[...ACCEPTED_EXTENSIONS, '.json'].join(',')}
                    onChange={handleInputChange}
                />
            </div>

            <div>
                <label>Seleccionar carpeta: </label>
                <input
                    ref={folderInputRef}
                    type="file"
                    multiple
                    webkitdirectory=""
                    directory=""
                    onChange={handleInputChange}
                />
            </div>

            {config && <p>Folder detectado: {config.folder}</p>}

            {files.length > 0 && (
                <ul>
                    {files.map(({ file }) => (
                        <li key={file.webkitRelativePath || file.name}>
                            {file.webkitRelativePath || file.name}
                        </li>
                    ))}
                </ul>
            )}

            <button onClick={handleUpload} disabled={isUploading || files.length === 0}>
                {isUploading ? 'Subiendo...' : 'Subir archivos'}
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    )
}
