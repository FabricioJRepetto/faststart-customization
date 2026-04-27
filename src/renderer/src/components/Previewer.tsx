import {
    DefaultLanguageDataAtom,
    EditedBackgroundsDataAtom,
    EditedIconsDataAtom,
    EditedLanguageDataAtom
} from '@renderer/utils/context/context'
import { useAtom } from 'jotai'

export const Previewer = (): React.JSX.Element => {
    // const [ogData] = useAtom(DefaultConfigAtom)
    const [bgData] = useAtom(EditedBackgroundsDataAtom)
    const [iconData] = useAtom(EditedIconsDataAtom)
    const [lngData] = useAtom(EditedLanguageDataAtom)
    const [ogData] = useAtom(DefaultLanguageDataAtom)

    console.log(lngData)

    const currBg = (): string => {
        try {
            const bg = bgData?.find((e) => e?.name === 'background_Idle')
            return bg?.customBase64 || bg!.base64
        } catch (error) {
            console.error(error)
            return ''
        }
    }

    const currLogo = (): string => {
        try {
            const logo = iconData?.find((e) => e?.name === 'icon_logo')
            return logo?.customBase64 || logo!.base64
        } catch (error) {
            console.error(error)
            return ''
        }
    }

    return (
        <div className="preview-container">
            <div className="preview-content">
                <img className="preview-bg" src={currBg()} />
                <img className="preview-logo" src={currLogo()} />
                <button className="preview-start-btn">
                    {lngData.es['button.start'] || ogData.es['button.start']}
                </button>
            </div>
        </div>
    )
}
