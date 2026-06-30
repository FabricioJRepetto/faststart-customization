import { DistributionMethod } from '@shared/types'
import { DistributionMethodAtom, EditedIconsDataAtom, store } from './context/context'
import DynamicSvg from '@renderer/components/DynSvg'

export const defaultIcon = (name: string): React.JSX.Element => {
    try {
        const iconData = store.get(EditedIconsDataAtom)
        const isRemote = store.get(DistributionMethodAtom) === DistributionMethod.REMOTE
        const ico = iconData?.find((e) => e?.name === name)
        const isSVG = (isRemote ? ico!.mimeType : ico!.mimeType).match('svg')
        const path = isRemote ? ico!.name : ico!.base64

        const config = isRemote ? { assetName: path } : { path: path }

        return isSVG ? <DynamicSvg config={config} /> : <img src={path} />
    } catch (error) {
        console.error(error)
        return <></>
    }
}

export const currentIcon = (name: string): React.JSX.Element => {
    try {
        const iconData = store.get(EditedIconsDataAtom)
        const isRemote = store.get(DistributionMethodAtom) === DistributionMethod.REMOTE
        const ico = iconData?.find((e) => e?.name === name)
        const isSVG = (ico?.customMimeType || (isRemote ? ico!.mimeType : ico!.mimeType)).match(
            'svg'
        )
        const path = ico?.customBase64 || (isRemote ? ico!.name : ico!.base64)

        const config = (!ico?.customBase64 && isRemote) ? { assetName: path } : { path: path }

        return isSVG ? <DynamicSvg config={config} /> : <img src={path} />
    } catch (error) {
        console.error(error)
        return <></>
    }
}
