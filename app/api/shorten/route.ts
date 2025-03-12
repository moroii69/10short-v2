import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { nanoid } from "nanoid"

export async function POST(request: NextRequest) {
  try {
    console.log("Request received")

    const { original_url, short_code, expires_at } = await request.json()

    // Validate URL
    if (!original_url) {
      console.log("URL is missing")
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    try {
      new URL(original_url)
    } catch (e) {
      console.log("Invalid URL format")
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    // Generate a short code if not provided
    const finalShortCode = short_code || nanoid(6)

    // Set expiration date (default: 30 days)
    const expirationDate = expires_at ? new Date(expires_at) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    console.log("Shortening URL", { original_url, short_code, expires_at })

    const supabase = createClient()

    // Check if custom code already exists
    if (short_code) {
      const { data: existingCode } = await supabase
        .from("urls")
        .select("short_code")
        .eq("short_code", short_code)
        .single()

      if (existingCode) {
        console.log("Custom code already in use")
        return NextResponse.json({ error: "This custom code is already in use" }, { status: 409 })
      }
    }

    // Insert the URL into the database
    const { data, error } = await supabase
      .from("urls")
      .insert({
        original_url,
        short_code: finalShortCode,
        expires_at: expirationDate.toISOString(),
      })
      .select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create short URL" }, { status: 500 })
    }

    // Construct the full short URL
    const host = request.headers.get("host")
    const protocol = host?.includes("localhost") ? "http" : "https"
    const full_short_url = `${protocol}://${host}/${finalShortCode}`

    console.log("Short URL created", { full_short_url })

    return NextResponse.json({
      short_code: finalShortCode,
      full_short_url,
      expires_at: expirationDate,
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
