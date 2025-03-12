import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24">
        <div className="max-w-3xl w-full text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Simple URL Shortener</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create short, memorable links in seconds. No sign-up required.
          </p>
          <div className="flex justify-center mt-8">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/shorten" className="flex items-center gap-2">
                Shorten a URL <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="pt-12 grid gap-8 md:grid-cols-3">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">No Sign-up</h3>
              <p className="text-muted-foreground">Free and anonymous. No account required.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Custom Codes</h3>
              <p className="text-muted-foreground">Create your own memorable short codes.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Expiration Control</h3>
              <p className="text-muted-foreground">Set custom expiration dates for your links.</p>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 text-center md:flex-row md:gap-6">
          <p className="text-sm text-muted-foreground">Built with Next.js and Supabase</p>
        </div>
      </footer>
    </div>
  )
}

