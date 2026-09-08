import { createClient } from "@/lib/supabase/server"

export type VisitorActivity = {
  id: string
  session_id: string
  tracking_number: string
  visitor_name: string | null
  location_consent: boolean
  latitude: number | null
  longitude: number | null
  accuracy_meters: number | null
  city: string | null
  country: string | null
  user_agent: string | null
  first_seen_at: string
  last_seen_at: string
  page_views: number
  interactions: Array<{ type: string; at: string }>
}

export async function getVisitorActivity() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("tracking_visitors")
    .select("*")
    .order("last_seen_at", { ascending: false })
    .limit(250)

  if (error) {
    console.error("Failed to load visitor activity:", error)
    return []
  }

  return (data ?? []) as VisitorActivity[]
}
