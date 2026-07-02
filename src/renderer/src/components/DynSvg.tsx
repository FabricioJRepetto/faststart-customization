import { store, svgCache } from '@renderer/utils/context/context'
import { useEffect, useState } from 'react'

type config =
    | {
          path: string
          assetName?: never
      }
    | {
          assetName: string
          path?: never
      }
type Props = { config: config, color?: string }

const DynamicSvg = ({ config: { path, assetName }, color }: Props): React.JSX.Element | null => {
    const [svgContent, setSvgContent] = useState<string | null>(null)

    useEffect(() => {
        const getSvg = async (): Promise<void> => {
            let text: string = ''
            if (path) {
                text = await fetch(path).then((res) => res.text())
            }
            if (assetName) {
                text = store.get(svgCache)?.[assetName]
            }
            const content = text
                .replace(/fill="[^"]*"/g, `fill="currentColor"`)
                .replace(/stroke="[^"]*"/g, `stroke="currentColor"`)

            setSvgContent(content)
        }
        getSvg()
    }, [assetName, path])

    if (!svgContent) return null

    return (
        <div dangerouslySetInnerHTML={{ __html: svgContent }} style={color ? { color } : {}}></div>
    )
}

export default DynamicSvg
