import { store, TerminalsStatusAtom, WebSocketStatusAtom } from '@renderer/utils/context/context'
import {
    WSClientType,
    WSIncomingMessagePayload,
    WSIncomingMessageType,
    WSMessagePayload,
    WSMessageType
} from '@shared/types'

class Service {
    private inited = false
    private ws: WebSocket | null = null
    private type: WSClientType = 'admin'
    private name: string = ''
    private id = ''
    // TODO - OnMessageHandlers

    public get clientID(): string {
        return this.id
    }

    private logger = {
        info: (...a: unknown[]) => console.info('[INFO] [SWS Client]', ...a),
        warn: (...a: unknown[]) => console.warn('[WARN] [SWS Client]', ...a),
        error: (...a: unknown[]) => console.error('[ERROR] [SWS Client]', ...a)
    }

    private parse = <T>(arg: string): T => {
        return JSON.parse(arg) as T
    }

    private changeInit = (v: boolean): void => {
        this.inited = v
        store.set(WebSocketStatusAtom, v)
    }

    private onOpen = (): void => {
        this.logger.info('Conexión establecida al servidor')
        this.changeInit(true)
        this.emit({ type: WSMessageType.login, data: { type: this.type, name: this.name } })
    }

    private onClose = (event: CloseEvent): void => {
        this.logger.info(`Conexión cerrada. Code: ${event.code}, Reason: ${event.reason}`)
        this.changeInit(false)
        this.id = ''
        store.set(TerminalsStatusAtom, [])
    }

    private onError = (event: Event): void => {
        this.logger.error('Error en la conexión', event)
        this.changeInit(false)
        this.id = ''
        store.set(TerminalsStatusAtom, [])
    }

    private onMessage = (event: MessageEvent<string>): void => {
        try {
            const { type, data } = this.parse<WSIncomingMessagePayload>(event.data)
            this.logger.info('Mensaje recibido <--', type)
            this.logger.info('Data:', data)

            switch (type) {
                case WSIncomingMessageType.login_confirmation:
                    this.id = data.loginID
                    break

                case WSIncomingMessageType.update_connections:
                    store.set(
                        TerminalsStatusAtom,
                        data.filter((e) => e.type === 'terminal').map(t => ({...t, ip: t.ip.split(':').pop() || t.ip}))
                    )
                    break

                case WSIncomingMessageType.run_task:
                default:
                    this.logger.warn(`Tipo de mensaje ${type} no contemplado`)
                    break
            }
        } catch (error) {
            this.logger.error('Error parseando mensaje', error)
        }
    }

    init = (URL: string, name: string): void => {
        store.set(WebSocketStatusAtom, undefined)

        if (this.ws && this.ws.readyState < 2) {
            this.changeInit(true)
            return this.logger.info('Servicio ya inicializado')
        }
        this.logger.info('Inicializando Servicio WebSocket...')

        this.ws?.close()

        this.name = name
        this.ws = new WebSocket(URL)
        this.ws.onopen = this.onOpen
        this.ws.onmessage = this.onMessage
        this.ws.onclose = this.onClose
        this.ws.onerror = this.onError
    }

    emit = (payload: WSMessagePayload): void => {
        if (!this.inited) {
            this.logger.error('Servicio no inicializado')
            return
        }
        if (!this.ws) {
            this.logger.error('Servicio no definido')
            return
        }
        this.logger.info('Enviando mensaje -->', payload.type)
        this.ws.send(JSON.stringify(payload))
    }

    close = (): void => {
        if (!this.ws) {
            this.logger.error('Servicio no definido')
            return
        }
        this.logger.info('Cerrando conexión')
        this.ws.close()
        this.changeInit(false)
    }
}

const WSService = new Service()
export default WSService
