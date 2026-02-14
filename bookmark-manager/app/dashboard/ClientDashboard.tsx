'use client'

import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import AddBookmarkForm from '@/components/AddBookmarkForm'
import Navbar from '@/components/Navbar'

type Bookmark = {
  id: string
  title: string
  url: string
  created_at: string
  user_id: string
}

export default function ClientDashboard({ userName }: { userName: string }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editUrl, setEditUrl] = useState('')
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  // Listen for theme changes
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

  useEffect(() => {
    const supabase = createClient()

    const fetchBookmarks = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) {
        setBookmarks(data)
      }
      setLoading(false)

      // Subscribe to real-time changes
      const channel = supabase
        .channel('bookmarks-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'bookmarks',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            setBookmarks(prev => {
              // Prevent duplicates
              const exists = prev.some(b => b.id === payload.new.id)
              if (exists) return prev
              return [payload.new as Bookmark, ...prev]
            })
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'bookmarks'
          },
          (payload) => {
            setBookmarks(prev => prev.filter(b => b.id !== payload.old.id))
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'bookmarks',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            setBookmarks(prev => prev.map(b => 
              b.id === payload.new.id ? payload.new as Bookmark : b
            ))
          }
        )
        .subscribe()

      // Cleanup subscription on unmount
      return () => {
        supabase.removeChannel(channel)
      }
    }

    fetchBookmarks()
  }, [])

  const handleBookmarkAdded = useCallback(() => {
    // Realtime subscription will handle the update automatically
    // No need for manual state update
  }, [])

  const handleBookmarkDeleted = useCallback(() => {
    // Realtime subscription will handle the update automatically
    // No need for manual state update
  }, [])

  const startEditing = useCallback((bookmark: Bookmark) => {
    setEditingId(bookmark.id)
    setEditTitle(bookmark.title)
    setEditUrl(bookmark.url)
  }, [])

  const cancelEditing = useCallback(() => {
    setEditingId(null)
    setEditTitle('')
    setEditUrl('')
  }, [])

  const saveEdit = useCallback(async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('bookmarks')
      .update({ title: editTitle, url: editUrl })
      .eq('id', id)

    if (!error) {
      // Realtime subscription will handle the update automatically
      cancelEditing()
    }
  }, [editTitle, editUrl, cancelEditing])

  return (
    <div 
      className="min-h-screen"
      style={{
        background: isDarkTheme 
          ? 'linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 50%, #1a0b2e 100%)'
          : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        color: isDarkTheme ? '#fff' : '#1a202c',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontWeight: 500,
        fontSize: '1.0625rem',
        letterSpacing: '0.125rem',
        transition: 'background 0.3s ease, color 0.3s ease'
      }}
    >
      {/* Navbar */}
      <div style={{ position: 'relative', zIndex: 50 }}>
        <Navbar userName={userName} />
      </div>

      {/* Main Content */}
      <main className="py-8" style={{ position: 'relative', zIndex: 10 }}>
        <section className="max-w-4xl mx-auto p-3 sm:p-5">
          {/* Animated Title */}
          <div className="flex flex-col gap-8 justify-center items-center text-center mb-8" style={{ position: 'relative', zIndex: 20 }}>
            <h1 className="text-4xl md:text-5xl font-bold tracking-widest flex justify-center gap-1 flex-wrap" style={{ 
              position: 'relative',
              zIndex: 20,
              color: isDarkTheme ? '#fff' : '#1a202c',
              WebkitBoxReflect: 'below -15px linear-gradient(transparent, rgba(0, 0, 0, 0.103))'
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
            <h2 className="text-lg flex items-center justify-center gap-2" style={{ position: 'relative', zIndex: 20, color: isDarkTheme ? '#fff' : '#2d3748' }}>
              Bookmark your favorite sites
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 512 512" style={{ fontSize: '1.125rem' }}>
                <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"/>
              </svg>
            </h2>
          </div>

          {/* Add Bookmark Form */}
          <div className="mt-3 flex flex-col items-center justify-center" style={{ position: 'relative', zIndex: 20 }}>
            <AddBookmarkForm onBookmarkAdded={handleBookmarkAdded} isDarkTheme={isDarkTheme} />
          </div>
        </section>

        {/* Bookmarks Table */}
        <section className="max-w-4xl mx-auto pt-6 px-3 sm:px-5" style={{ position: 'relative', zIndex: 20 }}>
          {loading ? (
            <div 
              className="rounded-xl shadow-2xl p-8"
              style={{ 
                position: 'relative',
                zIndex: 20,
                backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: isDarkTheme ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)'
              }}
            >
              <p className="text-center" style={{ position: 'relative', zIndex: 20, color: isDarkTheme ? '#fff' : '#2d3748' }}>Loading bookmarks...</p>
            </div>
          ) : bookmarks.length === 0 ? (
            <div 
              className="rounded-xl shadow-2xl p-8"
              style={{ 
                position: 'relative',
                zIndex: 20,
                backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: isDarkTheme ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)'
              }}
            >
              <p className="text-center" style={{ position: 'relative', zIndex: 20, color: isDarkTheme ? '#fff' : '#2d3748' }}>No bookmarks yet. Add your first one above!</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div 
                className="hidden md:block rounded-xl shadow-2xl overflow-hidden"
                style={{ 
                  position: 'relative',
                  zIndex: 20,
                  backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: isDarkTheme ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)'
                }}
              >
                <table className="w-full text-center" style={{ fontSize: '1rem', position: 'relative', zIndex: 20 }}>
                  <thead>
                    <tr style={{ 
                      backgroundColor: isDarkTheme ? 'rgba(109, 66, 182, 0.3)' : 'rgba(109, 66, 182, 0.15)',
                      borderBottom: isDarkTheme ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)'
                    }}>
                      <th className="p-4 font-bold" style={{ position: 'relative', zIndex: 20, color: isDarkTheme ? '#fff' : '#2d3748' }}>Index</th>
                      <th className="p-4 font-bold" style={{ position: 'relative', zIndex: 20, color: isDarkTheme ? '#fff' : '#2d3748' }}>Website Name</th>
                      <th className="p-4 font-bold" style={{ position: 'relative', zIndex: 20, color: isDarkTheme ? '#fff' : '#2d3748' }}>Visit</th>
                      <th className="p-4 font-bold" style={{ position: 'relative', zIndex: 20, color: isDarkTheme ? '#fff' : '#2d3748' }}>Edit</th>
                      <th className="p-4 font-bold" style={{ position: 'relative', zIndex: 20, color: isDarkTheme ? '#fff' : '#2d3748' }}>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(
                    bookmarks.map((bookmark, index) => (
                      <tr 
                        key={bookmark.id} 
                        className="transition"
                        style={{ 
                          borderBottom: isDarkTheme ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
                          backgroundColor: editingId === bookmark.id 
                            ? (isDarkTheme ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)')
                            : 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          if (editingId !== bookmark.id) {
                            e.currentTarget.style.backgroundColor = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(109, 66, 182, 0.05)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (editingId !== bookmark.id) {
                            e.currentTarget.style.backgroundColor = 'transparent'
                          } else {
                            e.currentTarget.style.backgroundColor = isDarkTheme ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)'
                          }
                        }}
                      >
                        <td className="p-4 font-semibold" style={{ position: 'relative', zIndex: 20, color: isDarkTheme ? '#fff' : '#2d3748' }}>{index + 1}</td>
                        <td className="p-4 font-medium" style={{ position: 'relative', zIndex: 20, color: isDarkTheme ? '#fff' : '#2d3748' }}>
                          {editingId === bookmark.id ? (
                            <div className="flex flex-col gap-2">
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="px-3 py-1.5 rounded-lg text-sm"
                                style={{
                                  position: 'relative',
                                  zIndex: 30,
                                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                  color: 'rgba(88, 63, 128, 0.9)',
                                  border: '1px solid rgba(255, 255, 255, 0.3)'
                                }}
                                placeholder="Website Name"
                              />
                              <input
                                type="url"
                                value={editUrl}
                                onChange={(e) => setEditUrl(e.target.value)}
                                className="px-3 py-1.5 rounded-lg text-sm"
                                style={{
                                  position: 'relative',
                                  zIndex: 30,
                                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                  color: 'rgba(88, 63, 128, 0.9)',
                                  border: '1px solid rgba(255, 255, 255, 0.3)'
                                }}
                                placeholder="URL"
                              />
                            </div>
                          ) : (
                            bookmark.title
                          )}
                        </td>
                        <td className="p-4" style={{ position: 'relative', zIndex: 20 }}>
                          <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition text-sm font-medium"
                            style={{ 
                              position: 'relative',
                              zIndex: 30,
                              color: isDarkTheme ? '#fff' : '#2d3748',
                              borderColor: isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(109, 66, 182, 0.5)',
                              backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(109, 66, 182, 0.1)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = isDarkTheme ? 'rgba(255, 255, 255, 0.25)' : 'rgba(109, 66, 182, 0.25)'
                              e.currentTarget.style.borderColor = isDarkTheme ? 'rgba(255, 255, 255, 0.8)' : 'rgba(109, 66, 182, 0.8)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(109, 66, 182, 0.1)'
                              e.currentTarget.style.borderColor = isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(109, 66, 182, 0.5)'
                            }}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 576 512">
                              <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>
                            </svg>
                            Visit
                          </a>
                        </td>
                        <td className="p-4" style={{ position: 'relative', zIndex: 20 }}>
                          {editingId === bookmark.id ? (
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => saveEdit(bookmark.id)}
                                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border-2 transition text-sm font-medium"
                                style={{ 
                                  position: 'relative',
                                  zIndex: 30,
                                  color: isDarkTheme ? '#fff' : '#2d3748',
                                  borderColor: isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(34, 197, 94, 0.5)',
                                  backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(34, 197, 94, 0.1)'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.3)'
                                  e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.8)'
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(34, 197, 94, 0.1)'
                                  e.currentTarget.style.borderColor = isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(34, 197, 94, 0.5)'
                                }}
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 448 512">
                                  <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                                </svg>
                                Save
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border-2 transition text-sm font-medium"
                                style={{ 
                                  position: 'relative',
                                  zIndex: 30,
                                  color: isDarkTheme ? '#fff' : '#2d3748',
                                  borderColor: isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(156, 163, 175, 0.5)',
                                  backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(156, 163, 175, 0.1)'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(156, 163, 175, 0.3)'
                                  e.currentTarget.style.borderColor = 'rgba(156, 163, 175, 0.8)'
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(156, 163, 175, 0.1)'
                                  e.currentTarget.style.borderColor = isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(156, 163, 175, 0.5)'
                                }}
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 384 512">
                                  <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                                </svg>
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEditing(bookmark)}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition text-sm font-medium"
                              style={{ 
                                position: 'relative',
                                zIndex: 30,
                                color: isDarkTheme ? '#fff' : '#2d3748',
                                borderColor: isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(59, 130, 246, 0.5)',
                                backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(59, 130, 246, 0.1)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.3)'
                                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.8)'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(59, 130, 246, 0.1)'
                                e.currentTarget.style.borderColor = isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(59, 130, 246, 0.5)'
                              }}
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 512 512">
                                <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/>
                              </svg>
                              Edit
                            </button>
                          )}
                        </td>
                        <td className="p-4" style={{ position: 'relative', zIndex: 20 }}>
                          <button
                            onClick={async () => {
                              const supabase = createClient()
                              await supabase.from('bookmarks').delete().eq('id', bookmark.id)
                              // Realtime subscription will handle the UI update
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition text-sm font-medium"
                            style={{ 
                              position: 'relative',
                              zIndex: 30,
                              color: isDarkTheme ? '#fff' : '#2d3748',
                              borderColor: isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(239, 68, 68, 0.5)',
                              backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(239, 68, 68, 0.1)'
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
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {bookmarks.map((bookmark, index) => (
                <div
                  key={bookmark.id}
                  className="rounded-xl shadow-2xl p-4"
                  style={{ 
                    position: 'relative',
                    zIndex: 20,
                    backgroundColor: editingId === bookmark.id
                      ? (isDarkTheme ? 'rgba(59, 130, 246, 0.25)' : 'rgba(59, 130, 246, 0.2)')
                      : (isDarkTheme ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.95)'),
                    backdropFilter: 'blur(10px)',
                    border: editingId === bookmark.id
                      ? (isDarkTheme ? '2px solid rgba(59, 130, 246, 0.5)' : '2px solid rgba(59, 130, 246, 0.6)')
                      : (isDarkTheme ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)')
                  }}
                >
                  {editingId === bookmark.id ? (
                    <div className="mb-4">
                      <div className="flex items-start gap-3 mb-3">
                        <span className="font-bold text-lg flex-shrink-0" style={{ position: 'relative', zIndex: 20, color: isDarkTheme ? '#fff' : '#2d3748' }}>{index + 1}</span>
                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-sm"
                            style={{
                              position: 'relative',
                              zIndex: 30,
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              color: 'rgba(88, 63, 128, 0.9)',
                              border: '1px solid rgba(255, 255, 255, 0.3)'
                            }}
                            placeholder="Website Name"
                          />
                          <input
                            type="url"
                            value={editUrl}
                            onChange={(e) => setEditUrl(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-sm"
                            style={{
                              position: 'relative',
                              zIndex: 30,
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              color: 'rgba(88, 63, 128, 0.9)',
                              border: '1px solid rgba(255, 255, 255, 0.3)'
                            }}
                            placeholder="URL"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 mb-4">
                      <span className="font-bold text-lg flex-shrink-0" style={{ position: 'relative', zIndex: 20, color: isDarkTheme ? '#fff' : '#2d3748' }}>{index + 1}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1" style={{ position: 'relative', zIndex: 20, color: isDarkTheme ? '#fff' : '#2d3748' }}>{bookmark.title}</h3>
                        <p className="text-sm break-all" style={{ position: 'relative', zIndex: 20, color: isDarkTheme ? 'rgba(255, 255, 255, 0.7)' : 'rgba(45, 55, 72, 0.7)' }}>{bookmark.url}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {editingId === bookmark.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(bookmark.id)}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition text-sm font-medium"
                          style={{ 
                            position: 'relative',
                            zIndex: 30,
                            color: isDarkTheme ? '#fff' : '#2d3748',
                            borderColor: isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(34, 197, 94, 0.5)',
                            backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(34, 197, 94, 0.1)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.3)'
                            e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.8)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(34, 197, 94, 0.1)'
                            e.currentTarget.style.borderColor = isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(34, 197, 94, 0.5)'
                          }}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 448 512">
                            <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                          </svg>
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition text-sm font-medium"
                          style={{ 
                            position: 'relative',
                            zIndex: 30,
                            color: isDarkTheme ? '#fff' : '#2d3748',
                            borderColor: isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(156, 163, 175, 0.5)',
                            backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(156, 163, 175, 0.1)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(156, 163, 175, 0.3)'
                            e.currentTarget.style.borderColor = 'rgba(156, 163, 175, 0.8)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(156, 163, 175, 0.1)'
                            e.currentTarget.style.borderColor = isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(156, 163, 175, 0.5)'
                          }}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 384 512">
                            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                          </svg>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <a
                          href={bookmark.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition text-sm font-medium"
                          style={{ 
                            position: 'relative',
                            zIndex: 30,
                            color: isDarkTheme ? '#fff' : '#2d3748',
                            borderColor: isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(109, 66, 182, 0.5)',
                            backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(109, 66, 182, 0.1)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isDarkTheme ? 'rgba(255, 255, 255, 0.25)' : 'rgba(109, 66, 182, 0.25)'
                            e.currentTarget.style.borderColor = isDarkTheme ? 'rgba(255, 255, 255, 0.8)' : 'rgba(109, 66, 182, 0.8)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(109, 66, 182, 0.1)'
                            e.currentTarget.style.borderColor = isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(109, 66, 182, 0.5)'
                          }}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 576 512">
                            <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>
                          </svg>
                          Visit
                        </a>
                        <button
                          onClick={() => startEditing(bookmark)}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition text-sm font-medium"
                          style={{ 
                            position: 'relative',
                            zIndex: 30,
                            color: isDarkTheme ? '#fff' : '#2d3748',
                            borderColor: isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(59, 130, 246, 0.5)',
                            backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(59, 130, 246, 0.1)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.3)'
                            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.8)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(59, 130, 246, 0.1)'
                            e.currentTarget.style.borderColor = isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(59, 130, 246, 0.5)'
                          }}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 512 512">
                            <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/>
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            const supabase = createClient()
                            await supabase.from('bookmarks').delete().eq('id', bookmark.id)
                            // Realtime subscription will handle the UI update
                          }}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition text-sm font-medium"
                          style={{ 
                            position: 'relative',
                            zIndex: 30,
                            color: isDarkTheme ? '#fff' : '#2d3748',
                            borderColor: isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(239, 68, 68, 0.5)',
                            backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(239, 68, 68, 0.1)'
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
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 448 512">
                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                          </svg>
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
          )}
        </section>
      </main>

      <style jsx>{`
        @keyframes waviy {
          0% {
            transform: translateY(0);
          }
          25% {
            transform: translateY(-15px);
          }
          50% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
