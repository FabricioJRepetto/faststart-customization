import useCurrentScreen from './utils/hooks/useCurrentScreen'

function App(): React.JSX.Element {
    const currentScreen = useCurrentScreen()

    return currentScreen
}

export default App
