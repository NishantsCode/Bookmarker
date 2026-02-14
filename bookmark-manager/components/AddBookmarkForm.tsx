'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AddBookmarkForm({ onBookmarkAdded, isDarkTheme = true }: { onBookmarkAdded?: () => void; isDarkTheme?: boolean }) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    // If user pastes or types a URL that already has http:// or https://, use it as is
    if (value.startsWith('http://') || value.startsWith('https://')) {
      setUrl(value)
    } 
    // If user clears the field completely, allow it
    else if (value === '') {
      setUrl('')
    }
    // If user is typing after https://, keep it
    else if (url.startsWith('https://') && value.length > 0) {
      setUrl(value)
    }
    // Otherwise, add https:// prefix
    else if (value.length > 0) {
      setUrl('https://' + value)
    }
  }

  const handleUrlFocus = () => {
    // When user clicks/focuses, prefill with https:// if empty
    if (url === '') {
      setUrl('https://')
    }
  }

  const handleUrlBlur = () => {
    // If user leaves the field with only "https://", clear it
    if (url === 'https://') {
      setUrl('')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title.trim() || !url.trim() || url === 'https://') return

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
        onBookmarkAdded()
      }
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3 w-full" style={{ position: 'relative', zIndex: 20 }}>
      <div className="w-full">
        <label htmlFor="bookmark-name" className="mb-2 font-medium block" style={{ position: 'relative', zIndex: 20, fontSize: '1.0625rem', letterSpacing: '0.125rem', color: isDarkTheme ? '#fff' : '#2d3748' }}>
          Name
        </label>
        <input
          id="bookmark-name"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Bookmark Name"
          className="w-full px-3 py-2 rounded border focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-300 transition"
          style={{ 
            position: 'relative', 
            zIndex: 30, 
            fontSize: '1rem',
            backgroundColor: isDarkTheme ? '#fff' : '#fff',
            color: '#1a202c',
            borderColor: isDarkTheme ? '#d1d5db' : '#cbd5e0'
          }}
          required
        />
      </div>
      
      <div className="w-full pt-3">
        <label htmlFor="bookmark-url" className="flex items-center gap-2 mb-2 font-medium" style={{ position: 'relative', zIndex: 20, fontSize: '1.0625rem', letterSpacing: '0.125rem', color: isDarkTheme ? '#fff' : '#2d3748' }}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
          </svg>
          URL
        </label>
        <input
          id="bookmark-url"
          type="url"
          value={url}
          onChange={handleUrlChange}
          onFocus={handleUrlFocus}
          onBlur={handleUrlBlur}
          placeholder="https://google.com"
          className="w-full px-3 py-2 rounded border focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-300 transition"
          style={{ 
            position: 'relative', 
            zIndex: 30, 
            fontSize: '1rem',
            backgroundColor: isDarkTheme ? '#fff' : '#fff',
            color: '#1a202c',
            borderColor: isDarkTheme ? '#d1d5db' : '#cbd5e0'
          }}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 px-4 py-2 text-white font-medium rounded transition duration-200"
        style={{ 
          position: 'relative',
          zIndex: 30,
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
