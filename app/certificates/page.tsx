"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { Award, Calendar, ChevronLeft, Download, ExternalLink, Search, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

// Mock data - would be fetched from API in a real application
const mockCertificates = [
  {
    id: "cert-1",
    courseTitle: "JavaScript Fundamentals",
    date: "April 16, 2025",
    certificateUrl: "#",
    thumbnailUrl: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "cert-2",
    courseTitle: "React Hooks in Depth",
    date: "March 23, 2025",
    certificateUrl: "#",
    thumbnailUrl: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "cert-3",
    courseTitle: "CSS Grid and Flexbox Mastery",
    date: "February 11, 2025",
    certificateUrl: "#",
    thumbnailUrl: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "cert-4",
    courseTitle: "Git and GitHub for Teams",
    date: "January 6, 2025",
    certificateUrl: "#",
    thumbnailUrl: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "cert-5",
    courseTitle: "TypeScript for React Developers",
    date: "December 15, 2024",
    certificateUrl: "#",
    thumbnailUrl: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "cert-6",
    courseTitle: "Node.js API Development",
    date: "November 20, 2024",
    certificateUrl: "#",
    thumbnailUrl: "/placeholder.svg?height=300&width=400",
  },
]

export default function CertificatesPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Filter certificates based on search query
  const filteredCertificates = mockCertificates.filter((cert) =>
    cert.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleShare = (id: string, title: string) => {
    // In a real app, generate a shareable URL
    const shareUrl = `${window.location.origin}/certificate/${id}`

    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        toast({
          title: "Link copied to clipboard",
          description: `Share your "${title}" certificate with others`,
        })
      },
      (err) => {
        console.error("Could not copy text: ", err)
        toast({
          title: "Failed to copy link",
          description: "Please try again",
          variant: "destructive",
        })
      },
    )
  }

  const handleDownload = (id: string, title: string) => {
    // In a real app, this would trigger the actual download
    setIsLoading(true)

    // Simulate download delay
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Certificate downloaded",
        description: `${title} certificate has been downloaded`,
      })
    }, 1500)
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              <Button variant="ghost" size="sm" className="gap-1 p-0 h-auto">
                <ChevronLeft className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">My Certificates</h1>
          <p className="text-muted-foreground mt-1">View and share your achievements</p>
        </div>

        <div className="relative w-full md:w-auto">
          <Input
            placeholder="Search certificates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-[250px] pl-9"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {filteredCertificates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCertificates.map((certificate) => (
            <Card key={certificate.id} className="overflow-hidden flex flex-col h-full">
              <div className="relative aspect-[4/3] bg-muted">
                <Image
                  src={certificate.thumbnailUrl || "/placeholder.svg"}
                  alt={`${certificate.courseTitle} Certificate`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="font-semibold line-clamp-2">{certificate.courseTitle}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-sm opacity-90">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Earned on {certificate.date}</span>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-4 pt-4 flex-grow">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    <Award className="h-3 w-3 mr-1" />
                    Certificate
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 grid grid-cols-3 gap-2">
                <Link href={`/certificate/${certificate.id}`} className="col-span-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="col-span-1"
                  onClick={() => handleDownload(certificate.id, certificate.courseTitle)}
                  disabled={isLoading}
                >
                  {isLoading ? <Skeleton className="h-4 w-4 rounded-full" /> : <Download className="h-4 w-4" />}
                  <span className="sr-only">Download</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="col-span-1"
                  onClick={() => handleShare(certificate.id, certificate.courseTitle)}
                >
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Share</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="bg-muted/30 p-4 rounded-full mb-4">
            <Award className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No certificates found</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            {searchQuery
              ? `No certificates matching "${searchQuery}"`
              : "You haven't earned any certificates yet. Complete courses to earn certificates."}
          </p>
          <Link href="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
