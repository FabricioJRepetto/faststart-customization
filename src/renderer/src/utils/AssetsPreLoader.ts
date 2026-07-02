import {
    DefaultConfigAtom,
    store,
    svgCache,
    svgCacheElement,
    ThemesLibraryDataAtom
} from './context/context'
import { CustomConfig, FinalAssetData, ThemeConfig } from '@shared/types'

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

const preloadMedia = async (element: FinalAssetData): Promise<FinalAssetData> => {
    if (element.fileType === 'svg') return element

    const res = await fetch(element.path)
    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)

    return { ...element, blobUrl }
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

type AllAssetType = AssetType | 'svg'
type AssetType = 'image' | 'audio' | 'video'

const loaders: Record<AssetType, (url: string) => Promise<void>> = {
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
        const config = store.get(DefaultConfigAtom)

        if (!config) {
            console.warn('Trying to preload assets but there is no default config')
            return
        }

        let assetsQuantity = 0

        if (method === 'httpCache') {
            //: HTTP CACHE
            const aux = [
                ...config.icon,
                ...config.background,
                ...config.thirdscreen.assets,
                ...config.audio
            ].map((e) => ({
                url: e.path,
                name: e.name,
                type: e.fileType as AllAssetType
            }))

            const assets: { url: string; type: AllAssetType; name: string }[] = aux.filter(
                (e) => e.type !== 'svg'
            )
            assetsQuantity += assets.length

            await Promise.all(assets.map(({ type, url }) => loaders[type as AssetType](url)))

        } else {
            //: BLOB URL CACHE
            console.log(' - Generating blobs for icons')
            const loadedIcons = await Promise.all(config.icon.map((e) => preloadMedia(e)))
            assetsQuantity += loadedIcons.length

            console.log(' - Generating blobs for backgrounds')
            const loadedBgs = await Promise.all(config.background.map((e) => preloadMedia(e)))
            assetsQuantity += loadedBgs.length

            console.log(' - Generating blobs for third screen assets')
            const loadedThirds = await Promise.all(
                config.thirdscreen.assets.map((e) => preloadMedia(e))
            )
            assetsQuantity += loadedThirds.length

            console.log(' - Generating blobs for audios')
            const loadedAudios = await Promise.all(config.audio.map((e) => preloadMedia(e)))
            assetsQuantity += loadedAudios.length

            const _config: CustomConfig = {
                ...config,
                icon: loadedIcons,
                background: loadedBgs,
                thirdscreen: { config: config.thirdscreen.config, assets: loadedThirds },
                audio: loadedAudios
            }
            store.set(DefaultConfigAtom, _config)
        }

        console.log(' - Generating svg files cache...')
        const svgAssets: { url: string; type: AllAssetType; name: string }[] = [...config.icon]
            .filter((e) => e.fileType === 'svg')
            .map((e) => ({
                url: e.path,
                name: e.name,
                type: e.fileType as AllAssetType
            }))
        const svgListTemp = await Promise.all(
            svgAssets.map((asset) => preloadSvg(asset.url, asset.name))
        )
        assetsQuantity += svgListTemp.length

        const svgList: svgCacheElement = {}
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
    const config = store.get(DefaultConfigAtom)!
    const themes = store.get(ThemesLibraryDataAtom)!
    const aux = [
        ...config.icon,
        ...config.background,
        ...config.thirdscreen.assets,
        ...config.audio,
        ...themes.map((t) => t.background)
    ]
    aux.forEach(({ blobUrl }) => {
        if (blobUrl) URL.revokeObjectURL(blobUrl)
    })
}
