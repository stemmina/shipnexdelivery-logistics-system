import { createClient } from "@/lib/supabase/server"

export type EmailTemplateSettings = {
  subject: string
  body: string
  updated_at: string
}

export async function getEmailTemplateSettings(): Promise<EmailTemplateSettings | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("email_template_settings").select("subject, body, updated_at").eq("id", true).maybeSingle()
  if (error) {
    console.error("Error fetching email template settings:", error)
    return null
  }
  return data
}

export async function saveEmailTemplateSettings(subject: string, body: string): Promise<EmailTemplateSettings | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("email_template_settings")
    .upsert({ id: true, subject, body, updated_at: new Date().toISOString() })
    .select("subject, body, updated_at")
    .single()
  if (error) {
    console.error("Error saving email template settings:", error)
    return null
  }
  return data
}
