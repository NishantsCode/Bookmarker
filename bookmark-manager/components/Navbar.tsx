'use client'

import LogoutButton from './LogoutButton'

export default function Navbar({ userName }: { userName: string }) {
  return (
    <nav 
      className="w-full py-4 px-6"
      style={{
        backgroundColor: 'transparent'
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
          </svg>
          <span className="text-white font-bold text-xl" style={{ letterSpacing: '0.125rem' }}>
            BOOKMARKER
          </span>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
            </svg>
            <span className="text-sm" style={{ letterSpacing: '0.05rem' }}>{userName}</span>
          </div>
          <LogoutButton />
        </div>
      </div>
    </nav>
  )
}
