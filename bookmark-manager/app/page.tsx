import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LoginButton from '@/components/LoginButton'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: 'linear-gradient(rgba(91, 64, 140, 0.454), rgba(91, 64, 140, 0.653)), url(/background.jpg)',
        backgroundSize: 'cover',
        backgroundPositionY: 'center'
      }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 
            className="text-5xl font-bold text-white mb-4"
            style={{ 
              letterSpacing: '0.125rem',
              position: 'relative',
              WebkitBoxReflect: 'below -20px linear-gradient(transparent, rgba(0, 0, 0, 0.103))'
            }}
          >
            Bookmark Manager
          </h1>
          <p className="text-xl text-white" style={{ letterSpacing: '0.125rem' }}>
            Save your favorite links securely.
          </p>
        </div>
        
        <div 
          className="rounded-2xl p-8 shadow-2xl"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <LoginButton />
        </div>
      </div>
    </div>
  )
}
