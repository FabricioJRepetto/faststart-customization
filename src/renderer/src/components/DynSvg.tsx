import { useEffect, useState } from 'react'

interface Props {
    path: string
}

const DynamicSvg = ({ path }: Props): React.JSX.Element | null => {
    const [svgContent, setSvgContent] = useState<string | null>(null)

    useEffect(() => {
        fetch(path)
            .then((res) => res.text())
            .then((text) => {
                const colored = text
                    .replace(/fill="[^"]*"/g, `fill="currentColor"`)
                    .replace(/stroke="[^"]*"/g, `stroke="currentColor"`)
                setSvgContent(colored)
            })
    }, [path])

    if (!svgContent) return null

    return <div dangerouslySetInnerHTML={{ __html: svgContent }}></div>
}

export default DynamicSvg
