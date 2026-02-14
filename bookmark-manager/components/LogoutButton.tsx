'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  const router = useRouter()
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    setIsDarkTheme(savedTheme === 'dark')

    const handleThemeChange = (e: CustomEvent) => {
      setIsDarkTheme(e.detail.isDark)
    }

    window.addEventListener('themeChange', handleThemeChange as EventListener)
    return () => {
      window.removeEventListener('themeChange', handleThemeChange as EventListener)
    }
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="font-medium py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg transition duration-200 border-2 text-xs sm:text-sm whitespace-nowrap"
      style={{ 
        letterSpacing: '0.05rem',
        color: isDarkTheme ? '#fff' : '#2d3748',
        borderColor: isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(239, 68, 68, 0.5)',
        backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        backdropFilter: 'blur(10px)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.3)'
        e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.8)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(239, 68, 68, 0.1)'
        e.currentTarget.style.borderColor = isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(239, 68, 68, 0.5)'
      }}
    >
      Logout
    </button>
  )
}
