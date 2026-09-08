import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

function isValidCoordinate(value: unknown, min: number, max: number) {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body.trackingNumber !== "string" || typeof body.sessionId !== "string") {
    return NextResponse.json({ error: "Invalid visitor activity" }, { status: 400 })
  }

  const locationConsent = body.locationConsent === true
  const latitude = locationConsent && isValidCoordinate(body.latitude, -90, 90) ? body.latitude : null
  const longitude = locationConsent && isValidCoordinate(body.longitude, -180, 180) ? body.longitude : null
  const accuracy = locationConsent && typeof body.accuracyMeters === "number" && body.accuracyMeters >= 0 ? body.accuracyMeters : null
  const interaction = typeof body.interaction === "string" ? { type: body.interaction.slice(0, 80), at: new Date().toISOString() } : null
  const supabase = await createClient()
  const { data: existing } = await supabase
    .from("tracking_visitors")
    .select("id, page_views, interactions")
    .eq("session_id", body.sessionId)
    .eq("tracking_number", body.trackingNumber.slice(0, 120))
    .maybeSingle()

  const payload = {
    session_id: body.sessionId,
    tracking_number: body.trackingNumber.slice(0, 120),
    visitor_name: typeof body.visitorName === "string" ? body.visitorName.trim().slice(0, 120) || null : null,
    location_consent: locationConsent,
    latitude,
    longitude,
    accuracy_meters: accuracy,
    city: typeof body.city === "string" ? body.city.slice(0, 120) : null,
    country: typeof body.country === "string" ? body.country.slice(0, 120) : null,
    user_agent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
    last_seen_at: new Date().toISOString(),
    page_views: (existing?.page_views ?? 0) + (body.event === "page_view" ? 1 : 0),
    interactions: [...((existing?.interactions as Array<{ type: string; at: string }>) ?? []), ...(interaction ? [interaction] : [])].slice(-50),
  }

  const query = existing
    ? supabase.from("tracking_visitors").update(payload).eq("id", existing.id)
    : supabase.from("tracking_visitors").insert({ ...payload, first_seen_at: new Date().toISOString() })
  const { error } = await query
  if (error) return NextResponse.json({ error: "Unable to record activity" }, { status: 500 })
  return NextResponse.json({ ok: true })
}
