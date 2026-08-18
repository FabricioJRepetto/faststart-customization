import {
    CurrentScreenAtom,
    DefaultConfigurationsAtom,
    TerminalsStatusAtom,
    ThemesLibraryDataAtom,
    WebSocketStatusAtom
} from '@renderer/utils/context/context'
import { smallDate, stateStyle, terminalSmallState } from '@renderer/utils/stringUtils'
import { Screens, WSConnectedClient } from '@renderer/types/types.d'
import { useAtomValue, useSetAtom } from 'jotai'
import DynamicSvg from './DynSvg'
import InfoSvg from '../assets/info.svg?react'

interface Props {
    cardClick: (v: WSConnectedClient) => void
}

export const TerminalsCardRow = ({ cardClick }: Props): React.JSX.Element => {
    const terminals = useAtomValue(TerminalsStatusAtom)
    const setScreen = useSetAtom(CurrentScreenAtom)
    const WsStatus = useAtomValue(WebSocketStatusAtom)

    return (
        <div>
            <div onClick={() => setScreen(Screens.collections)} className="card-row-header">
                <p>Terminales</p>
                {!WsStatus && (
                    <div className="header-group">
                        <InfoSvg />
                        <p>Sin conexión al servidor WS</p>
                    </div>
                )}
            </div>
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
                            <p
                                className={stateStyle(e.status)}
                            >{`${terminalSmallState(e.status)} ${e.description ?? ''}`}</p>
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
    const defaultTheme = useAtomValue(DefaultConfigurationsAtom)?.theme?.name

    return (
        <div>
            <div
                onClick={() => setScreen(Screens.collections)}
                className="card-row-header"
            >
                <p>Temas</p>
                {!defaultTheme && (
                    <div className="header-group">
                        <InfoSvg />
                        <p>No hay un tema definido por defecto</p>
                    </div>
                )}
            </div>
            <div className="card-row-container">
                {themes?.length ? (
                    themes?.map((e, i) => (
                        <div className={`assets-container card-row-card ${defaultTheme === e.themeName ? 'highlighted-theme-card' : ''}`} key={i}>
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
