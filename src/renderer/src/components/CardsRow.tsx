import {
    CurrentScreenAtom,
    TerminalsStatusAtom,
    ThemesLibraryDataAtom
} from '@renderer/utils/context/context'
import { smallDate, stateStyle, terminalSmallState } from '@renderer/utils/stringUtils'
import { Screens, WSConnectedClient } from '@shared/types'
import { useAtomValue, useSetAtom } from 'jotai'
import DynamicSvg from './DynSvg'

interface Props {
    cardClick: (v: WSConnectedClient) => void
}

export const TerminalsCardRow = ({ cardClick }: Props): React.JSX.Element => {
    const terminals = useAtomValue(TerminalsStatusAtom)
    const setScreen = useSetAtom(CurrentScreenAtom)

    return (
        <div>
            <p onClick={() => setScreen(Screens.collections)} style={{ cursor: 'pointer' }}>
                Terminales
            </p>
            <div className="card-row-container">
                {terminals.length ? (
                    terminals.map((e, i) => (
                        <div
                            className="assets-container card-row-card"
                            key={i}
                            onClick={() => cardClick(e)}
                        >
                            <p>{e.name}</p>
                            <p className="terminal-ip">{e.ip}</p>
                            <p className={stateStyle(e.status)}>{`${terminalSmallState(e.status)} ${e.description ?? ''}`}</p>
                            <p className="terminal-small-date">{smallDate(e.lastUpdate)}</p>
                        </div>
                    ))
                ) : (
                    <p style={{ color: '#bebebe41' }}>Sin terminales conectadas</p>
                )}
            </div>
        </div>
    )
}

export const ThemesCardRow = (): React.JSX.Element => {
    const themes = useAtomValue(ThemesLibraryDataAtom)
    const setScreen = useSetAtom(CurrentScreenAtom)

    return (
        <div>
            <p onClick={() => setScreen(Screens.collections)} style={{ cursor: 'pointer' }}>
                Temas
            </p>
            <div className="card-row-container">
                {themes?.length ? (
                    themes?.map((e, i) => (
                        <div className="assets-container card-row-card" key={i}>
                            <p>{e.themeName}</p>
                            <div className="logo-container">
                                {e.logo.mime.match('svg') ? (
                                    <DynamicSvg
                                        color={e?.color?.primaryColor}
                                        config={{
                                            assetName: `${e.themeName}_${e.logo.name}`
                                        }}
                                    />
                                ) : (
                                    <img src={e.logo.base64} />
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ color: '#bebebe41' }}>Sin temas guardados</p>
                )}
            </div>
        </div>
    )
}
