import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex min-h-dvh">
      <AdminSidebar />
      <main className="flex-1 ml-64 flex flex-col">
        <div className="flex-1 overflow-auto bg-background p-6 md:p-8">{children}</div>
      </main>
    </div>
  )
}
