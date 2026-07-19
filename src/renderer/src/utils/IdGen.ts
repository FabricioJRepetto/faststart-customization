import { v4 as uuidv4 } from 'uuid'

export const getID = (): string => {
    return uuidv4()
}
