import { useAtomValue } from 'jotai'
import { CurrentScreenAtom } from '../context/context'
import Landing from '@renderer/screens/Landing'
import Icons from '@renderer/screens/Icons'
import Backgrounds from '@renderer/screens/Backgrounds'
import ThirdScreen from '@renderer/screens/ThirdScreen'
import Audio from '@renderer/screens/Audio'
import Languages from '@renderer/screens/Languages'
import { Screens } from '@shared/types'
import ScreenWrapper from '@renderer/components/ScreenWrapper'
import Styles from '@renderer/screens/Styles'
import Collections from '@renderer/screens/Collection'
import NewMain from '@renderer/screens/NewMain'
import Preview from '@renderer/screens/Preview'
import Testing from '@renderer/screens/Testing'
import FileManager from '@renderer/screens/FileManager'
import FlowArchitect from '@renderer/screens/FlowArchitect'


/** Hook para manejar la pantalla actual que se muestra en la aplicación.
 * Retorna el componente correspondiente a la pantalla actual.*/
const useCurrentScreen = (): React.JSX.Element => {
    const currentScreen = useAtomValue(CurrentScreenAtom)

    const allScreens: Record<Screens, React.JSX.Element> = {
        [Screens.landing]: <Landing />,
        [Screens.main]: <NewMain />,
        [Screens.test]: <Testing />,
        [Screens.architect]: <FlowArchitect />,
        [Screens.fileManager]: <FileManager />,
        [Screens.preview]: <Preview />,
        [Screens.collections]: <Collections />,
        [Screens.styles]: <Styles />,
        [Screens.languages]: <Languages />,
        [Screens.icons]: <Icons />,
        [Screens.backgrounds]: <Backgrounds />,
        [Screens.thirdScreen]: <ThirdScreen />,
        [Screens.audio]: <Audio />
    }

    return <ScreenWrapper>{allScreens[currentScreen]}</ScreenWrapper>
}

export default useCurrentScreen
