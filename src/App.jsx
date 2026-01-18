import './App.css'
import { HomePageWithLogin } from './page/home'
import { Solicitudes } from './page/dashboard/Solicitudes'

function App() {
  const path = window.location.pathname.toLowerCase()
  const isSolicitudes = path.startsWith('/dashboard/solicitudes')

  return isSolicitudes ? <Solicitudes /> : <HomePageWithLogin />
}

export default App
