import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Redirecting...",
  description: "Redirecting to the destination URL",
}

export default async function RedirectPage({ params }: { params: { code: string } }) {
  const { code } = params
  const supabase = createClient()

  // Query the database for the URL
  const { data, error } = await supabase.from("urls").select("original_url, expires_at").eq("short_code", code).single()

  // If there's an error or no data, redirect to the expired page
  if (error || !data) {
    redirect("/expired")
  }

  // Check if the URL has expired
  const expiresAt = new Date(data.expires_at)
  if (expiresAt < new Date()) {
    redirect("/expired")
  }

  // Redirect to the original URL
  redirect(data.original_url)
}

