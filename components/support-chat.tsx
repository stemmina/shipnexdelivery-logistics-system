'use client'

import { useEffect } from 'react'

const TAWK_WIDGET_URL = 'https://embed.tawk.to/6aa1c8e1094d073447a184ce/default'

declare global {
  interface Window {
    Tawk_API?: Record<string, unknown>
    Tawk_LoadStart?: Date
  }
}

export function SupportChat() {
  useEffect(() => {
    if (window.location.pathname.startsWith('/admin')) return
    if (document.querySelector(`script[src="${TAWK_WIDGET_URL}"]`)) return

    window.Tawk_API = window.Tawk_API || {}
    window.Tawk_LoadStart = new Date()

    const script = document.createElement('script')
    script.async = true
    script.src = TAWK_WIDGET_URL
    script.charset = 'UTF-8'
    script.setAttribute('crossorigin', '*')
    document.head.appendChild(script)

    return () => {
      script.remove()
    }
  }, [])

  return null
}
