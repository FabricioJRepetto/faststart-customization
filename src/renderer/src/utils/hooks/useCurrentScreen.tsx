import { useAtomValue } from 'jotai'
import { CurrentScreenAtom } from '../context/context'
import Landing from '@renderer/screens/Landing'
import Icons from '@renderer/screens/Icons'
import Backgrounds from '@renderer/screens/Backgrounds'
import Languages from '@renderer/screens/Languages'
import { Screens } from '../types'
import ScreenWrapper from '@renderer/components/ScreenWrapper'
import Colors from '@renderer/screens/Colors'
import ThirdScreen from '@renderer/screens/ThirdScreen'

// TODO: Saltearse la landing si no hace falta input del usuario

/** Hook para manejar la pantalla actual que se muestra en la aplicación.
 * Retorna el componente correspondiente a la pantalla actual.*/
const useCurrentScreen = (): React.JSX.Element => {
    const currentScreen = useAtomValue(CurrentScreenAtom)

    const allScreens: Record<Screens, React.JSX.Element> = {
        [Screens.landing]: <Landing />,
        [Screens.main]: <p>hola con todo respeto</p>,
        [Screens.icons]: <Icons />,
        [Screens.colors]: <Colors />,
        [Screens.backgrounds]: <Backgrounds />,
        [Screens.languages]: <Languages />,
        [Screens.thirdScreen]: <ThirdScreen />
    }

    return <ScreenWrapper>{allScreens[currentScreen]}</ScreenWrapper>
}

export default useCurrentScreen
