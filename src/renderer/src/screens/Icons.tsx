import { assetName } from '@renderer/utils/assetName'
import { AssetsDataAtom, EditedIconsDataAtom } from '@renderer/utils/context/context'
import { useAtom, useAtomValue } from 'jotai'
import ClearSvg from '../assets/clear.svg?react'
import { filterType } from '@renderer/utils/types'

const Icons = (): React.JSX.Element => {
    const OgAssets = useAtomValue(AssetsDataAtom)
    const [icons, setIcons] = useAtom(EditedIconsDataAtom)

    const resetAllValues = (): void => {
        setIcons([...OgAssets!.icon])
    }

    const resetValue = (key: string): void => {
        setIcons((prev) =>
            prev!.map((e) => (e.name === key ? { ...e, customPath: '', customBase64: '' } : e))
        )
    }

    const setValue = async (key: string): Promise<void> => {
        console.log(key)
        const res = await window.electronAPI.selectFile(filterType.Imagenes)
        console.log(res)

        if (res.success) {
            const { filePath, base64 } = res.data
            console.log(filePath)

            setIcons((prev) =>
                prev!.map((e) =>
                    e.name === key ? { ...e, customPath: filePath, customBase64: base64 } : e
                )
            )
        }
    }

    return (
        <div className="screen-content">
            <div className="screen-header">
                <h1>Icons</h1>
                <div className="actions">
                    <div className="action tertiary">
                        <a onClick={resetAllValues}>
                            <ClearSvg />
                            Resetear todo
                        </a>
                    </div>
                </div>
            </div>

            <div className="assets-grid">
                {icons!.map((icon) => (
                    <div key={icon.name} className="assets-container icon-asset-container">
                        <p>{assetName(icon.name)}</p>

                        <div className="icons-container">
                            <img src={icon.base64} />
                            {icon.customBase64 && <img src={icon.customBase64} />}
                        </div>

                        <div className="actions">
                            <div className="action primary">
                                <a onClick={() => setValue(icon.name)}>Cambiar</a>
                            </div>
                            <div className="action">
                                <a onClick={() => resetValue(icon.name)}>Resetear</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Icons
