'use client'

import { useEffect, useState } from 'react'
import { Headset } from 'lucide-react'

const TAWK_WIDGET_URL = 'https://embed.tawk.to/6aa1c8e1094d073447a184ce/default'

declare global {
  interface Window {
    Tawk_API?: {
      maximize?: () => void
      onLoad?: () => void
    }
    Tawk_LoadStart?: Date
  }
}

export function SupportChat() {
  const [isCustomerPage, setIsCustomerPage] = useState(false)

  useEffect(() => {
    if (window.location.pathname.startsWith('/admin')) return
    const revealSupportButton = window.setTimeout(() => setIsCustomerPage(true), 0)
    if (document.querySelector(`script[src="${TAWK_WIDGET_URL}"]`)) {
      return () => window.clearTimeout(revealSupportButton)
    }

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

  if (!isCustomerPage) return null

  const openSupportChat = () => {
    if (window.Tawk_API?.maximize) {
      window.Tawk_API.maximize()
      return
    }

    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={openSupportChat}
      aria-label="Contact our support agent"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Headset className="size-4" />
      Contact our support agent
    </button>
  )
}
