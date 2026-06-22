import { assetName } from '@renderer/utils/assetsUtils'
import { AssetsDataAtom, DistributionMethodAtom, EditedIconsDataAtom } from '@renderer/utils/context/context'
import { useAtom, useAtomValue } from 'jotai'
import ClearSvg from '../assets/clear.svg?react'
import { DistributionMethod, filterType } from '@shared/types'
import Tooltip from '@renderer/components/Tooltip'

const Icons = (): React.JSX.Element => {
    const OgAssets = useAtomValue(AssetsDataAtom)
    const [icons, setIcons] = useAtom(EditedIconsDataAtom)
    const isRemote = useAtomValue(DistributionMethodAtom) === DistributionMethod.REMOTE

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
        const res = await window.electronAPI.selectFile(filterType.ImgSvg)
        console.log(res)

        if (res.success) {
            const { filePath, base64, customMimeType } = res.data
            setIcons((prev) =>
                prev!.map((e) =>
                    e.name === key ? { ...e, customPath: filePath, customBase64: base64, customMimeType } : e
                )
            )
        }
    }

    return (
        <div className="screen-content">
            <div className="screen-header">
                <h1>
                    Iconos
                    <Tooltip
                        text={
                            'Iconos y algunas imagenes que se utilizan a lo largo de toda la aplicación. Pueden ser SVG o cualquier tipo de imágen.'
                        }
                    />
                </h1>
                <div className="actions">
                    <div className="action tertiary">
                        <a onClick={resetAllValues}>
                            <ClearSvg />
                            Resetear todo
                        </a>
                    </div>
                </div>
            </div>

            {icons?.length ? (
                <div className="assets-grid scrolleable">
                    {icons.map((icon) => (
                        <div key={icon.name} className="assets-container icon-asset-container">
                            <p>{assetName(icon.name)}</p>

                            <div className="icons-container">
                                <img src={isRemote ? icon.filePath : icon.base64} />
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
            ) : (
                <h2>No icons</h2>
            )}
        </div>
    )
}

export default Icons
