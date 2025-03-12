import Link from "next/link"
import { Link2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Link2 className="h-5 w-5" />
            <span className="font-bold">Tenshort URL Shortener</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/shorten">Shorten URL</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}

