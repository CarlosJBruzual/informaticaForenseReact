import { useEffect, useState } from 'react'
import './App.css'
import { HomePageWithLogin } from './page/home'
import { DashboardHome } from './page/dashboard/Home'
import { DashboardSection } from './page/dashboard/Section'
import { Solicitudes } from './page/dashboard/Solicitudes'
import { Resguardo } from './page/dashboard/Resguardo'
import { RemisionLaboratorio } from './page/dashboard/RemisionLaboratorio'
import { DASHBOARD_SECTIONS } from './services/dashboardNavigation'
import { navigateTo } from './utils/navigation'

function App() {
  const [path, setPath] = useState(() => window.location.pathname.toLowerCase())

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname.toLowerCase())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const normalizedPath = path.replace(/\/+$/, '') || '/'
  const isDashboard = normalizedPath.startsWith('/dashboard')
  const isSolicitudes = normalizedPath.startsWith('/dashboard/solicitudes')
  const isResguardo = normalizedPath.startsWith('/dashboard/resguardo')
  const isLaboratorio = normalizedPath.startsWith('/dashboard/laboratorio')
  const isLogout = normalizedPath === '/dashboard/cerrar-sesion'

  useEffect(() => {
    if (!isLogout) return
    navigateTo('/')
  }, [isLogout])

  if (!isDashboard) return <HomePageWithLogin />
  if (isLogout) return <HomePageWithLogin />

  if (normalizedPath === '/dashboard') {
    return <DashboardHome activePath={normalizedPath} />
  }

  if (isSolicitudes) {
    return <Solicitudes activePath={normalizedPath} />
  }

  if (isResguardo) {
    return <Resguardo activePath={normalizedPath} />
  }

  if (isLaboratorio) {
    return <RemisionLaboratorio activePath={normalizedPath} />
  }

  const section = DASHBOARD_SECTIONS.find((item) => item.path === normalizedPath)
  if (section) {
    return (
      <DashboardSection
        activePath={normalizedPath}
        title={section.title}
        description={section.description}
      />
    )
  }

  return <DashboardHome activePath="/dashboard" />
}

export default App
