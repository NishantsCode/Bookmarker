'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

type Bookmark = {
  id: string
  title: string
  url: string
  created_at: string
}

export default function BookmarkList({ userId }: { userId: string }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBookmarks = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) {
      setBookmarks(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchBookmarks()
  }, [fetchBookmarks])

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('bookmarks').delete().eq('id', id)
    
    if (!error) {
      // Optimistically update UI
      setBookmarks((prev) => prev.filter((b) => b.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-500 text-center">Loading bookmarks...</p>
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-500 text-center">No bookmarks yet. Add your first one above!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Your Bookmarks ({bookmarks.length})
      </h2>
      <div className="space-y-3">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{bookmark.title}</h3>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline truncate block"
              >
                {bookmark.url}
              </a>
            </div>
            <button
              onClick={() => handleDelete(bookmark.id)}
              className="ml-4 text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded hover:bg-red-50 transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
