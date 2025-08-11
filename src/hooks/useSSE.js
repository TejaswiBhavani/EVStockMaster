import { useEffect, useRef, useState } from 'react'

export function useSSE(url) {
  const [messages, setMessages] = useState([])
  const [error, setError] = useState(null)
  const esRef = useRef(null)

  useEffect(() => {
    const es = new EventSource(url)
    esRef.current = es

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        setMessages((prev) => [...prev, data])
      } catch {
        // ignore malformed
      }
    }
    es.onerror = () => {
      setError('SSE connection error')
      es.close()
    }

    return () => {
      es.close()
    }
  }, [url])

  return { messages, error }
}