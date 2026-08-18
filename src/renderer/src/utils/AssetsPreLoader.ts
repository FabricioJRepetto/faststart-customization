import {
    DefaultThemeConfigAtom,
    store,
    svgCache,
    svgCacheElement,
    ThemeConfigAtom,
    ThemesLibraryDataAtom
} from './context/context'
import { AssetData, AssetType, FinalAssetData, TemplateConfig, ThemeConfig } from '@renderer/types/types.d'

const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve()
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
        img.src = url
    })
}

const preloadAudio = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const audio = new Audio()
        audio.oncanplaythrough = () => resolve()
        audio.onerror = () => reject(new Error(`Failed to load audio: ${url}`))
        audio.src = url
    })
}

const preloadVideo = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video')
        video.oncanplaythrough = () => resolve()
        video.onerror = () => reject(new Error(`Failed to load video: ${url}`))
        video.src = url
    })
}

const preloadSvg = async (url: string, name: string): Promise<{ name: string; value: string }> => {
    const res = await fetch(url)
    const text = await res.text()
    return { name: name, value: text }
}

const preloadMedia = async (element: FinalAssetData, assetType: AssetType): Promise<AssetData> => {
    if (element.fileType === 'svg')
        return {
            assetName: element.name,
            assetType: assetType,
            original: {
                source: element.path,
                mime: 'svg',
                fileName: element.path.split('/').pop()
            },
            custom: {}
        }

    const res = await fetch(element.path)
    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)

    return {
        assetName: element.name,
        assetType: assetType,
        original: {
            source: blobUrl,
            fileName: element.path.split('/').pop()
        },
        custom: {}
    }
}

export const preloadThemeMedia = async (theme: ThemeConfig): Promise<ThemeConfig> => {
    const { background, logo } = theme
    const res = await fetch(background.base64) // en realidad es la url
    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)

    const svg = await preloadSvg(logo.base64, logo.name)
    const prevCache = store.get(svgCache)
    store.set(svgCache, { ...prevCache, [`${theme.themeName}_${svg.name}`]: svg.value })

    return { ...theme, background: { ...theme.background, blobUrl } }
}

type __AllAssetType = __AssetType | 'svg'
type __AssetType = 'image' | 'audio' | 'video'

const loaders: Record<__AssetType, (url: string) => Promise<void>> = {
    image: preloadImage,
    audio: preloadAudio,
    video: preloadVideo
}

/** REMOTO - Cachea los assets remotos necesarios para evitar popping */
export const preloadAssets = async (
    method: 'httpCache' | 'blobUrl' = 'httpCache'
): Promise<void> => {
    try {
        console.log('Caching Assets with method:', method)
        const start = performance.now()
        const config = store.get(DefaultThemeConfigAtom)

        if (!config) {
            console.warn('Trying to preload assets but there is no default config')
            return
        }

        let assetsQuantity = 0

        if (method === 'httpCache') {
            //: HTTP CACHE
            const aux = [
                ...config.icon,
                ...config.image,
                ...config.background,
                ...config.thirdscreen.assets,
                ...config.audio
            ].map((e) => ({
                url: e.path,
                name: e.name,
                type: e.fileType as __AllAssetType
            }))

            const assets: { url: string; type: __AllAssetType; name: string }[] = aux.filter(
                (e) => e.type !== 'svg'
            )
            assetsQuantity += assets.length

            await Promise.all(assets.map(({ type, url }) => loaders[type as AssetType](url)))
        } else {
            //: BLOB URL CACHE
            console.log(' - Generating blobs for icons')
            const loadedIcons = await Promise.all(config.icon.map((e) => preloadMedia(e, 'icon')))
            assetsQuantity += loadedIcons.length

            console.log(' - Generating blobs for images')
            const loadedImages = await Promise.all(
                config.image.map((e) => preloadMedia(e, 'image'))
            )
            assetsQuantity += loadedImages.length

            console.log(' - Generating blobs for backgrounds')
            const loadedBgs = await Promise.all(
                config.background.map((e) => preloadMedia(e, 'background'))
            )
            assetsQuantity += loadedBgs.length

            console.log(' - Generating blobs for third screen assets')
            const loadedThirds = await Promise.all(
                config.thirdscreen.assets.map((e) => preloadMedia(e, 'thirdscreen'))
            )
            assetsQuantity += loadedThirds.length

            console.log(' - Generating blobs for audios')
            const loadedAudios = await Promise.all(
                config.audio.map((e) => preloadMedia(e, 'audio'))
            )
            assetsQuantity += loadedAudios.length

            const _config: TemplateConfig = {
                ...config,
                icon: loadedIcons,
                image: loadedImages,
                background: loadedBgs,
                thirdscreen: loadedThirds,
                audio: loadedAudios
            }

            store.set(ThemeConfigAtom, _config)
        }

        console.log(' - Generating svg cache...')
        const svgAssets: { url: string; type: __AllAssetType; name: string }[] = [
            ...config.icon,
            ...config.image
        ]
            .filter((e) => e.fileType === 'svg')
            .map((e) => ({
                url: e.path,
                name: e.name,
                type: e.fileType as __AllAssetType
            }))
        const svgListTemp = await Promise.all(
            svgAssets.map((asset) => preloadSvg(asset.url, asset.name))
        )
        assetsQuantity += svgListTemp.length

        const svgList: svgCacheElement = {...store.get(svgCache)}
        for (const e of svgListTemp) {
            svgList[e.name] = e.value
        }
        store.set(svgCache, svgList)

        console.log(
            `Cache of ${assetsQuantity} assets finished in ${Math.floor(performance.now() - start)}ms`
        )
    } catch (error) {
        console.error(error)
    }
}

/** Limpia todos los blobs cacheados (incluidos los de la libreria de temas) */
export const clearMediaCache = (): void => {
    const config = store.get(DefaultThemeConfigAtom)!
    const themes = store.get(ThemesLibraryDataAtom)!
    const aux = [
        ...(config?.icon || []),
        ...(config?.background || []),
        ...(config?.thirdscreen.assets || []),
        ...(config?.audio || []),
        ...(themes?.map((t) => t.background || null)?.filter((e) => e) || [])
    ]
    aux.forEach(({ blobUrl }) => {
        if (blobUrl) URL.revokeObjectURL(blobUrl)
    })
}
