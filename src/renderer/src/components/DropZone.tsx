import { extractFilesFromDataTransfer, hasAllowedExtension } from '@renderer/utils/filesManager'
import { DragEvent, ReactNode, useState } from 'react'

type HandlerArgs = File | File[]

interface DropZoneProps {
    fileHandler(args: HandlerArgs): void
    configuration?: {
        allowMultiple?: boolean
        allowedExtensions?: string[]
    }
    children: ReactNode
}

const DropZone = ({
    configuration = {},
    children,
    fileHandler
}: DropZoneProps): React.JSX.Element => {
    const { allowMultiple, allowedExtensions } = configuration
    const [isDraggingOver, setIsDraggingOver] = useState(false)

    const handleDrop = async (
        event: DragEvent<HTMLInputElement>
    ): Promise<File | File[] | undefined> => {
        event.preventDefault()
        setIsDraggingOver(false)

        const droppedFiles = await extractFilesFromDataTransfer(event.dataTransfer)

        if (!allowMultiple && droppedFiles.length > 1) {
            console.error('Seleccionado de multiples archivos no permitida')
            return
        }

        const assetFiles = droppedFiles.filter((file) =>
            hasAllowedExtension(file, allowedExtensions)
        )

        if (!assetFiles.length) {
            console.error('Tipos de archivos no aceptados')
            return
        }

        if (allowMultiple) {
            fileHandler(assetFiles)
            return
        }
        fileHandler(assetFiles[0])
        return
    }

    function handleDragOver(event): void {
        event.preventDefault()
        setIsDraggingOver(true)
    }

    function handleDragLeave(event): void {
        event.preventDefault()
        setIsDraggingOver(false)
    }

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            style={{
                borderColor: isDraggingOver ? '#4a90d9' : 'none'
            }}
            className={isDraggingOver ? `dragging-over` : ''}
        >
            {children}
        </div>
    )
}

export default DropZone
