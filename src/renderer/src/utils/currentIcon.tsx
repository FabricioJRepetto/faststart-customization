import { EditedIconsDataAtom, EditedImagesDataAtom, store } from './context/context'
import DynamicSvg from '@renderer/components/DynSvg'

export const defaultIcon = (name: string): React.JSX.Element => {
    try {
        const iconData = store.get(EditedIconsDataAtom) || []
        const imageData = store.get(EditedImagesDataAtom) || []
        const data = [...iconData, ...imageData]
        const asset = data?.find((e) => e?.name === name)

        const isSVG = (asset?.mimeType ?? '').match('svg')
        const path = asset?.blobUrl

        if (!path) return <></>

        return isSVG ? <DynamicSvg config={{ assetName: asset!.name }} /> : <img src={path} />
    } catch (error) {
        console.error(error)
        return <></>
    }
}

export const currentIcon = (name: string): React.JSX.Element => {
    try {
        const iconData = store.get(EditedIconsDataAtom) || []
        const imageData = store.get(EditedImagesDataAtom) || []
        const data = [...iconData, ...imageData]
        const asset = data?.find((e) => e?.name === name)
        const isSVG = (asset?.customMimeType || (asset?.mimeType ?? '')).match('svg')
        const path = asset?.customBase64 || asset?.name

        if (!path) return <></>

        const config = !asset?.customBase64 ? { assetName: path } : { path: path }

        return isSVG ? <DynamicSvg config={config} /> : <img src={path} />
    } catch (error) {
        console.error(error)
        return <></>
    }
}
