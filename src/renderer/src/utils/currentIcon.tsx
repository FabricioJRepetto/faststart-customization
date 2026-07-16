import { EditedIconsDataAtom, EditedImagesDataAtom, store } from './context/context'
import DynamicSvg from '@renderer/components/DynSvg'

export const defaultIcon = (name: string): React.JSX.Element => {
    try {
        const iconData = store.get(EditedIconsDataAtom) || []
        const imageData = store.get(EditedImagesDataAtom) || []
        const data = [...iconData, ...imageData]
        const asset = data?.find((e) => e?.assetName === name)

        const isSVG = (asset?.original?.mime ?? '').match('svg')
        const path = asset?.original.source

        if (!path) return <></>

        return isSVG ? <DynamicSvg config={{ assetName: asset!.assetName }} /> : <img src={path} />
    } catch (error) {
        console.error(error)
        return <></>
    }
}

export const currentIcon = (name: string): React.JSX.Element | null => {
    try {
        const iconData = store.get(EditedIconsDataAtom) || []
        const imageData = store.get(EditedImagesDataAtom) || []
        const data = [...iconData, ...imageData]
        const asset = data?.find((e) => e?.assetName === name)
        const isSVG = (asset?.custom.mime || (asset?.original.mime ?? '')).match('svg')
        const path = asset?.custom.source || (asset?.original.mime ? asset.assetName : null)

        if (!path) return null

        const config = !asset?.custom.source ? { assetName: path } : { path: path }

        return isSVG ? <DynamicSvg config={config} /> : <img src={path} />
    } catch (error) {
        console.error(error)
        return null
    }
}
