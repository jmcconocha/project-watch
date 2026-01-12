import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { listen } from '@tauri-apps/api/event'
import { isTauri } from '../services'

export function NavigationListener() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isTauri()) return

    // Listen for navigate events from the backend (menu items)
    const unlisten = listen<string>('navigate', (event) => {
      navigate(event.payload)
    })

    return () => {
      unlisten.then((fn) => fn())
    }
  }, [navigate])

  return null
}
