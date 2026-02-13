import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClientDashboard from './ClientDashboard'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Get user's full name from metadata, fallback to email
  const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User'

  return <ClientDashboard userName={userName} />
}
