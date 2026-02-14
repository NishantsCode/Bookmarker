'use client'

import LoginButton from '@/components/LoginButton'

export default function LoginPage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}
    >
      <div className="w-full max-w-lg">
        {/* Animated Title */}
        <div className="text-center mb-8">
          <h1 
            className="text-5xl md:text-6xl font-bold mb-6"
            style={{ 
              letterSpacing: '0.125rem',
              position: 'relative',
              color: '#2d3748',
              WebkitBoxReflect: 'below -20px linear-gradient(transparent, rgba(0, 0, 0, 0.103))'
            }}
          >
            BOOKMARKER
          </h1>
          <p className="text-lg flex items-center justify-center gap-2" style={{ letterSpacing: '0.125rem', color: '#2d3748' }}>
            Your personal bookmark vault
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 512 512">
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
            </svg>
          </p>
        </div>
        
        {/* Main Card */}
        <div 
          className="rounded-2xl p-8 shadow-2xl mb-6"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            animation: 'fadeInUp 0.6s ease-out'
          }}
        >
          {/* Features */}
          <div className="mb-8 space-y-4">
            <div className="flex items-start gap-3" style={{ color: '#2d3748' }}>
              <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 512 512">
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
              </svg>
              <div>
                <h3 className="font-semibold text-lg">Organize Your Links</h3>
                <p className="text-sm" style={{ color: 'rgba(45, 55, 72, 0.8)' }}>Save and manage all your favorite websites in one place</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3" style={{ color: '#2d3748' }}>
              <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 448 512">
                <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/>
              </svg>
              <div>
                <h3 className="font-semibold text-lg">Secure & Private</h3>
                <p className="text-sm" style={{ color: 'rgba(45, 55, 72, 0.8)' }}>Your bookmarks are protected with Google authentication</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3" style={{ color: '#2d3748' }}>
              <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 512 512">
                <path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"/>
              </svg>
              <div>
                <h3 className="font-semibold text-lg">Access Anywhere</h3>
                <p className="text-sm" style={{ color: 'rgba(45, 55, 72, 0.8)' }}>Access your bookmarks from any device, anytime</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t mb-8" style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}></div>
          
          {/* Login Button */}
          <LoginButton />
        </div>

        {/* Footer */}
        <p className="text-center text-sm" style={{ color: 'rgba(45, 55, 72, 0.7)' }}>
          Secure authentication powered by Google
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
