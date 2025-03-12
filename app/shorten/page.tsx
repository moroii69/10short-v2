"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon, Copy } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

export default function ShortenPage() {
  const { toast } = useToast()
  const [url, setUrl] = useState("")
  const [customCode, setCustomCode] = useState("")
  const [date, setDate] = useState<Date | undefined>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default: 30 days from now
  )
  const [isLoading, setIsLoading] = useState(false)
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL to shorten",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          original_url: url,
          short_code: customCode || undefined,
          expires_at: date?.toISOString(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to shorten URL")
      }

      setShortenedUrl(data.full_short_url)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to shorten URL",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }


  const copyToClipboard = () => {
    if (shortenedUrl) {
      navigator.clipboard.writeText(shortenedUrl)
      toast({
        title: "Copied!",
        description: "URL copied to clipboard",
      })
    }
  }

  const resetForm = () => {
    setUrl("")
    setCustomCode("")
    setDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
    setShortenedUrl(null)
  }

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Shorten a URL</CardTitle>
          <CardDescription>Create a short link that redirects to your destination URL</CardDescription>
        </CardHeader>
        <CardContent>
          {!shortenedUrl ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="url">URL to shorten</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/very-long-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-code">Custom code (optional)</Label>
                <Input
                  id="custom-code"
                  placeholder="abc123"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  maxLength={10}
                />
                <p className="text-xs text-muted-foreground">Leave blank to generate a random code</p>
              </div>

              <div className="space-y-2">
                <Label>Expiration date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground">Default: 30 days from today</p>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Shortening..." : "Shorten URL"}
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="rounded-md bg-muted p-4">
                <div className="text-sm font-medium mb-2">Your shortened URL:</div>
                <div className="flex items-center gap-2">
                  <Input value={shortenedUrl} readOnly className="font-medium" />
                  <Button size="icon" variant="outline" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={resetForm}>
                  Shorten another URL
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

