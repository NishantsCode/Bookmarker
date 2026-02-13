'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-white/20 hover:bg-white/30 backdrop-blur text-white font-medium py-2 px-4 rounded-lg transition duration-200 border border-white/30 text-sm"
      style={{ letterSpacing: '0.05rem' }}
    >
      Logout
    </button>
  )
}
