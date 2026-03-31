import './assets/main.css'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Provider } from 'jotai'
import { store } from './utils/context/context'

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <App />
    </Provider>
)
