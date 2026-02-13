'use client'

import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import AddBookmarkForm from '@/components/AddBookmarkForm'
import LogoutButton from '@/components/LogoutButton'

type Bookmark = {
  id: string
  title: string
  url: string
  created_at: string
  user_id: string
}

export default function ClientDashboard({ userEmail, userId }: { userEmail: string, userId: string }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookmarks = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) {
        setBookmarks(data)
      }
      setLoading(false)
    }

    fetchBookmarks()
  }, [])

  const handleBookmarkAdded = useCallback((newBookmark: Bookmark) => {
    setBookmarks(prev => [newBookmark, ...prev])
  }, [])

  const handleBookmarkDeleted = useCallback((id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id))
  }, [])

  return (
    <main className="min-h-screen py-3" style={{
      backgroundImage: 'linear-gradient(rgba(91, 64, 140, 0.454), rgba(91, 64, 140, 0.653)), url(/background.jpg)',
      backgroundSize: 'cover',
      backgroundPositionY: 'center',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontWeight: 500,
      fontSize: '1.0625rem',
      letterSpacing: '0.125rem'
    }}>
      <section className="max-w-4xl mx-auto p-3 sm:p-5">
        {/* Animated Title */}
        <div className="flex flex-col gap-12 justify-center items-center text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-widest flex justify-center gap-1 flex-wrap" style={{ 
            position: 'relative',
            WebkitBoxReflect: 'below -20px linear-gradient(transparent, rgba(0, 0, 0, 0.103))'
          }}>
            {'BOOKMARKER'.split('').map((letter, i) => (
              <span
                key={i}
                className="inline-block"
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  animation: 'waviy 1s infinite',
                  animationDelay: `${i * 0.1}s`
                }}
              >
                {letter}
              </span>
            ))}
          </h1>
          <h2 className="text-xl flex items-center justify-center gap-2">
            Bookmark your favorite sites
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 512 512" style={{ fontSize: '1.125rem' }}>
              <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"/>
            </svg>
          </h2>
        </div>

        {/* Add Bookmark Form */}
        <div className="mt-3 flex flex-col items-center justify-center">
          <AddBookmarkForm onBookmarkAdded={handleBookmarkAdded} />
        </div>
      </section>

      {/* Bookmarks Table */}
      <section className="max-w-4xl mx-auto pt-2 px-3 sm:px-5">
        {loading ? (
          <div className="bg-white rounded shadow-lg p-8">
            <p className="text-gray-500 text-center">Loading bookmarks...</p>
          </div>
        ) : (
          <table className="w-full bg-white rounded shadow-lg text-center" style={{ fontSize: '1rem' }}>
            <thead>
              <tr style={{ color: '#6d42b6' }}>
                <th className="p-3 font-bold">Index</th>
                <th className="p-3 font-bold">Website Name</th>
                <th className="p-3 font-bold">Visit</th>
                <th className="p-3 font-bold">Delete</th>
              </tr>
            </thead>
            <tbody>
              {bookmarks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-gray-500">
                    No bookmarks yet. Add your first one above!
                  </td>
                </tr>
              ) : (
                bookmarks.map((bookmark, index) => (
                  <tr key={bookmark.id} className="border-t border-gray-200">
                    <td className="p-3" style={{ color: 'rgba(88, 63, 128, 0.9)' }}>{index + 1}</td>
                    <td className="p-3" style={{ color: 'rgba(88, 63, 128, 0.9)' }}>{bookmark.title}</td>
                    <td className="p-3">
                      <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded border-2 transition text-sm font-medium"
                        style={{ 
                          color: 'rgba(88, 63, 128, 0.9)',
                          borderColor: 'rgba(88, 63, 128, 0.9)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(88, 63, 128, 0.9)'
                          e.currentTarget.style.borderColor = 'rgba(88, 63, 128, 0.9)'
                          e.currentTarget.style.color = '#fff'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                          e.currentTarget.style.borderColor = 'rgba(88, 63, 128, 0.9)'
                          e.currentTarget.style.color = 'rgba(88, 63, 128, 0.9)'
                        }}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 576 512">
                          <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>
                        </svg>
                        Visit
                      </a>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={async () => {
                          const supabase = createClient()
                          const { error } = await supabase.from('bookmarks').delete().eq('id', bookmark.id)
                          if (!error) {
                            handleBookmarkDeleted(bookmark.id)
                          }
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded border-2 transition text-sm font-medium"
                        style={{ 
                          color: 'rgba(88, 63, 128, 0.9)',
                          borderColor: 'rgba(88, 63, 128, 0.9)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(88, 63, 128, 0.9)'
                          e.currentTarget.style.borderColor = 'rgba(88, 63, 128, 0.9)'
                          e.currentTarget.style.color = '#fff'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                          e.currentTarget.style.borderColor = 'rgba(88, 63, 128, 0.9)'
                          e.currentTarget.style.color = 'rgba(88, 63, 128, 0.9)'
                        }}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 448 512">
                          <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </section>

      {/* Logout Button */}
      <div className="mt-6 text-center">
        <LogoutButton />
      </div>

      <style jsx>{`
        @keyframes waviy {
          0%, 40%, 100% {
            transform: translateY(0);
          }
          20% {
            transform: translateY(-15px);
          }
        }
      `}</style>
    </main>
  )
}
