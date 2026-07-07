import { TemplateConfigAtom } from '@renderer/utils/context/context'
import { useAtomValue } from 'jotai'
import UploadSvg from '../assets/upload.svg?react'
import DropZone from '@renderer/components/DropZone'
import mediaServiceController from '@renderer/utils/controllers/mediaServer/mediaServiceController'
import { TEMPLATE_CONFIG_FILENAME } from '@shared/CONSTANTS'
import { loadTemplate } from '@renderer/utils/bootSequence'

const Template = (): React.JSX.Element => {
    const template = useAtomValue(TemplateConfigAtom)

    const upload = async (f: File): Promise<void> => {
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

    return (
        <div className="screen-content">
            <div className="screen-header">
                <h1>Template</h1>
                <div className="header-group">
                    <DropZone
                        fileHandler={(f: File) => upload(f)}
                        configuration={{ allowedExtensions: ['.json'] }}
                    >
                        <div className="actions">
                            <div className="action primary">
                                <a>
                                    <UploadSvg />
                                    Subir nuevo
                                </a>
                            </div>
                        </div>
                    </DropZone>
                </div>
            </div>

            <pre className="scrolleable" style={{height: '75vh'}}>
                {JSON.stringify(template, undefined, 1).replaceAll('"', '')}
            </pre>
        </div>
    )
}

export default Template
