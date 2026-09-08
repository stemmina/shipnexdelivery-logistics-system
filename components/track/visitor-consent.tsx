"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function getSessionId() {
  const key = "shipnex-visitor-session"
  const existing = sessionStorage.getItem(key)
  if (existing) return existing
  const id = crypto.randomUUID()
  sessionStorage.setItem(key, id)
  return id
}

export function VisitorConsent({ trackingNumber }: { trackingNumber: string }) {
  const [name, setName] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [locationRequested, setLocationRequested] = useState(false)
  const [notice, setNotice] = useState("")

  useEffect(() => {
    const sessionId = getSessionId()
    void fetch("/api/tracking-visitors", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sessionId, trackingNumber, event: "page_view", locationConsent: false }),
    })
  }, [trackingNumber])

  const submit = () => {
    const sessionId = getSessionId()
    const base = { sessionId, trackingNumber, visitorName: name, event: "visitor_identified", locationConsent: false }
    if (!locationRequested || !navigator.geolocation) {
      void fetch("/api/tracking-visitors", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(base) })
      setSubmitted(true)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        void fetch("/api/tracking-visitors", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...base, locationConsent: true, latitude: position.coords.latitude, longitude: position.coords.longitude, accuracyMeters: position.coords.accuracy, interaction: "location_consent_granted" }) })
        setSubmitted(true)
      },
      () => {
        void fetch("/api/tracking-visitors", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...base, interaction: "location_consent_denied" }) })
        setNotice("Location was not shared. Your name was still saved.")
        setSubmitted(true)
      },
      { enableHighAccuracy: true, maximumAge: 300000, timeout: 10000 },
    )
  }

  if (submitted) return <p className="text-sm text-muted-foreground">Thanks. Your preferences have been saved. {notice}</p>

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="font-semibold">Help us personalize your tracking visit</h2>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">Your name is optional. We only collect your exact location if you explicitly allow your browser to share it.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-2"><Label htmlFor="visitor-name">Your name (optional)</Label><Input id="visitor-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter your name" /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={locationRequested} onChange={(event) => setLocationRequested(event.target.checked)} /> Share exact location</label>
      </div>
      <Button className="mt-4" onClick={submit}>Save preferences</Button>
    </section>
  )
}
