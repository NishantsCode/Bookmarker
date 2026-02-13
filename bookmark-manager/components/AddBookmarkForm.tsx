'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Bookmark = {
  id: string
  title: string
  url: string
  created_at: string
  user_id: string
}

export default function AddBookmarkForm({ onBookmarkAdded }: { onBookmarkAdded?: (bookmark: Bookmark) => void }) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !url.trim()) return

    setLoading(true)
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .insert([{ title, url, user_id: user.id }])
      .select()
      .single()

    if (!error && data) {
      setTitle('')
      setUrl('')
      if (onBookmarkAdded) {
        onBookmarkAdded(data)
      }
    } else {
      console.error('Insert error:', error)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3 w-full">
      <div className="w-full">
        <label className="flex items-center gap-2 text-white mb-2 font-medium" style={{ fontSize: '1.0625rem', letterSpacing: '0.125rem' }}>
          <svg className="w-5 h-5 text-pink-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
          </svg>
          Name
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Bookmark Name"
          className="w-full px-3 py-2 rounded border border-gray-300 bg-white focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-300 transition text-gray-800"
          style={{ fontSize: '1rem' }}
          required
        />
      </div>
      
      <div className="w-full pt-3">
        <label className="flex items-center gap-2 text-white mb-2 font-medium" style={{ fontSize: '1.0625rem', letterSpacing: '0.125rem' }}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
          </svg>
          URL
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Website URL"
          className="w-full px-3 py-2 rounded border border-gray-300 bg-white focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-300 transition text-gray-800"
          style={{ fontSize: '1rem' }}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 px-4 py-2 text-white font-medium rounded transition duration-200"
        style={{ 
          backgroundColor: 'rgba(88, 63, 128, 0.9)',
          fontSize: '1rem',
          letterSpacing: '0.125rem'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(91, 64, 140, 0.87)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(88, 63, 128, 0.9)'}
      >
        {loading ? 'Adding...' : 'Add bookmark'}
      </button>
    </form>
  )
}
