import Link from "next/link"
import { AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ExpiredPage() {
  return (
    <div className="container max-w-md py-20">
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Link Expired or Invalid</AlertTitle>
        <AlertDescription>The link you tried to access has expired or does not exist.</AlertDescription>
      </Alert>

      <div className="flex justify-center">
        <Button asChild>
          <Link href="/shorten">Create a New Short URL</Link>
        </Button>
      </div>
    </div>
  )
}

