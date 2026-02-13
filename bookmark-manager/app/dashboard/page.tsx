import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClientDashboard from './ClientDashboard'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  return <ClientDashboard userEmail={user.email!} userId={user.id} />
}
