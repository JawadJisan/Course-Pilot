"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
  Award,
  Calendar,
  ChevronLeft,
  Copy,
  Download,
  Facebook,
  Linkedin,
  Printer,
  Share2,
  Twitter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

// Mock certificate data - would be fetched from API in a real application
const mockCertificateData = {
  "cert-1": {
    id: "cert-1",
    courseTitle: "JavaScript Fundamentals",
    date: "April 16, 2025",
    certificateUrl: "#",
    recipientName: "John Doe",
    issueDate: "April 16, 2025",
    courseDescription:
      "A comprehensive course covering JavaScript fundamentals, ES6 features, and modern best practices.",
    instructorName: "Dr. Sarah Johnson",
    credentialId: "JS-FUND-2025-04-16-001",
  },
  "cert-2": {
    id: "cert-2",
    courseTitle: "React Hooks in Depth",
    date: "March 23, 2025",
    certificateUrl: "#",
    recipientName: "John Doe",
    issueDate: "March 23, 2025",
    courseDescription: "An advanced course on React Hooks, Context API, and state management patterns.",
    instructorName: "Michael Chen",
    credentialId: "REACT-HOOKS-2025-03-23-042",
  },
  "cert-3": {
    id: "cert-3",
    courseTitle: "CSS Grid and Flexbox Mastery",
    date: "February 11, 2025",
    certificateUrl: "#",
    recipientName: "John Doe",
    issueDate: "February 11, 2025",
    courseDescription:
      "A detailed exploration of modern CSS layout techniques including Grid, Flexbox, and responsive design.",
    instructorName: "Emily Rodriguez",
    credentialId: "CSS-LAYOUT-2025-02-11-078",
  },
  "cert-4": {
    id: "cert-4",
    courseTitle: "Git and GitHub for Teams",
    date: "January 6, 2025",
    certificateUrl: "#",
    recipientName: "John Doe",
    issueDate: "January 6, 2025",
    courseDescription: "A practical course on version control with Git and collaborative development using GitHub.",
    instructorName: "James Wilson",
    credentialId: "GIT-TEAM-2025-01-06-103",
  },
  "cert-5": {
    id: "cert-5",
    courseTitle: "TypeScript for React Developers",
    date: "December 15, 2024",
    certificateUrl: "#",
    recipientName: "John Doe",
    issueDate: "December 15, 2024",
    courseDescription: "A specialized course on using TypeScript with React for type-safe component development.",
    instructorName: "Dr. Sarah Johnson",
    credentialId: "TS-REACT-2024-12-15-056",
  },
  "cert-6": {
    id: "cert-6",
    courseTitle: "Node.js API Development",
    date: "November 20, 2024",
    certificateUrl: "#",
    recipientName: "John Doe",
    issueDate: "November 20, 2024",
    courseDescription: "A comprehensive guide to building RESTful APIs with Node.js, Express, and MongoDB.",
    instructorName: "Alex Thompson",
    credentialId: "NODE-API-2024-11-20-089",
  },
}

export default function CertificateViewPage() {
  const params = useParams()
  const { toast } = useToast()
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isPdfLoaded, setIsPdfLoaded] = useState(false)

  // Get certificate ID from URL params
  const certificateId = params.cid as string

  // Get certificate data
  const certificate = mockCertificateData[certificateId as keyof typeof mockCertificateData]

  if (!certificate) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Certificate Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The certificate you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/certificates">
          <Button>Back to Certificates</Button>
        </Link>
      </div>
    )
  }

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/certificate/${certificateId}` : ""

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        toast({
          title: "Link copied to clipboard",
          description: "You can now share this certificate with others",
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

  const handleDownload = () => {
    setIsLoading(true)

    // Simulate download delay
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Certificate downloaded",
        description: `${certificate.courseTitle} certificate has been downloaded`,
      })
    }, 1500)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShareSocial = (platform: string) => {
    let shareLink = ""

    switch (platform) {
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=I earned a certificate in ${certificate.courseTitle}!&url=${encodeURIComponent(shareUrl)}`
        break
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        break
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      default:
        break
    }

    if (shareLink) {
      window.open(shareLink, "_blank")
    }
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/certificates" className="text-muted-foreground hover:text-foreground transition-colors">
              <Button variant="ghost" size="sm" className="gap-1 p-0 h-auto">
                <ChevronLeft className="h-4 w-4" />
                Back to Certificates
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{certificate.courseTitle}</h1>
          <div className="flex items-center gap-2 mt-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Earned on {certificate.date}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 print:hidden">
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={isLoading}>
            {isLoading ? <Skeleton className="h-4 w-4 rounded-full" /> : <Download className="h-4 w-4 mr-2" />}
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share Certificate</DialogTitle>
                <DialogDescription>
                  Share your achievement with friends, colleagues, or on your professional profiles.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2 mt-4">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button size="sm" variant="secondary" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-12 w-12"
                  onClick={() => handleShareSocial("twitter")}
                >
                  <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                  <span className="sr-only">Share on Twitter</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-12 w-12"
                  onClick={() => handleShareSocial("linkedin")}
                >
                  <Linkedin className="h-5 w-5 text-[#0A66C2]" />
                  <span className="sr-only">Share on LinkedIn</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-12 w-12"
                  onClick={() => handleShareSocial("facebook")}
                >
                  <Facebook className="h-5 w-5 text-[#1877F2]" />
                  <span className="sr-only">Share on Facebook</span>
                </Button>
              </div>
              <DialogFooter className="mt-4">
                <Button variant="secondary" onClick={() => setIsShareModalOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Certificate Viewer */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8 print:shadow-none">
        {!isPdfLoaded && (
          <div className="flex justify-center items-center h-[600px]">
            <div className="text-center">
              <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48 mx-auto" />
                <Skeleton className="h-4 w-32 mx-auto" />
              </div>
            </div>
          </div>
        )}

        {/* Certificate Content */}
        <div className={`p-8 ${!isPdfLoaded ? "hidden" : ""}`} onLoad={() => setIsPdfLoaded(true)}>
          <div className="border-8 border-double border-primary/20 p-8 relative">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-white px-8">
              <Award className="h-10 w-10 text-primary mx-auto" />
            </div>

            <div className="text-center pt-8">
              <h2 className="text-3xl font-serif mb-2">Certificate of Completion</h2>
              <p className="text-muted-foreground">This certifies that</p>
              <h3 className="text-2xl font-bold my-4 text-primary">{certificate.recipientName}</h3>
              <p className="text-muted-foreground mb-6">has successfully completed the course</p>
              <h4 className="text-xl font-bold mb-2">{certificate.courseTitle}</h4>
              <p className="text-sm max-w-lg mx-auto mb-8">{certificate.courseDescription}</p>

              <div className="grid grid-cols-2 gap-8 mt-12 mb-8">
                <div className="text-center border-t pt-2 border-muted">
                  <p className="font-medium">{certificate.instructorName}</p>
                  <p className="text-sm text-muted-foreground">Instructor</p>
                </div>
                <div className="text-center border-t pt-2 border-muted">
                  <p className="font-medium">CoursePilot</p>
                  <p className="text-sm text-muted-foreground">Issuing Organization</p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-12 text-sm text-muted-foreground">
                <div>Issue Date: {certificate.issueDate}</div>
                <div>Credential ID: {certificate.credentialId}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Certificate Details</h3>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Course Title</dt>
              <dd className="mt-1">{certificate.courseTitle}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Recipient</dt>
              <dd className="mt-1">{certificate.recipientName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Issue Date</dt>
              <dd className="mt-1">{certificate.issueDate}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Credential ID</dt>
              <dd className="mt-1">{certificate.credentialId}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Verification</h3>
          <p className="text-muted-foreground mb-4">
            This certificate can be verified online. Share the link or credential ID with anyone who needs to verify
            your achievement.
          </p>
          <div className="flex flex-col gap-4">
            <Button variant="outline" className="w-full" onClick={handleCopyLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Verification Link
            </Button>
            <Link href={`/courses/${certificate.id}`}>
              <Button variant="secondary" className="w-full">
                View Course Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
