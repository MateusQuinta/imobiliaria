import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const FAVORITES_KEY = 'vivabelle_favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState(new Set())
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY)
      if (saved) {
        setFavorites(new Set(JSON.parse(saved)))
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
    } finally {
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]))
      } catch (error) {
        console.error('Error saving favorites:', error)
      }
    }
  }, [favorites, loaded])

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
        toast.success('Removido dos favoritos')
      } else {
        newSet.add(id)
        toast.success('Adicionado aos favoritos')
      }
      return newSet
    })
  }

  const isFavorite = (id) => favorites.has(id)

  const favoriteCount = favorites.size

  return { favorites, toggleFavorite, isFavorite, favoriteCount, loaded }
}
