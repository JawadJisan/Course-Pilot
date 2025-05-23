"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import {
  Search,
  Filter,
  Plus,
  BookOpen,
  ChevronRight,
  Loader2,
  BarChart2,
  GraduationCap,
  AlertCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

// Zod schema for course data
const CourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  objectives: z.array(z.string()),
  createdAt: z.string(),
  moduleCount: z.number(),
  lessonCount: z.number(),
  progress: z.number(),
  lastAccessed: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

type Course = z.infer<typeof CourseSchema>

export default function CoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // This would be replaced with an actual API call
        // For now, we'll use mock data
        const mockCourses: Course[] = [
          {
            id: "1",
            title: "Full Stack Development with React, Node.js, and PostgreSQL",
            description:
              "A comprehensive learning path designed to equip intermediate developers with the skills to become full-stack developers using React, Node.js, and PostgreSQL, focusing on authentication and performance optimization.",
            objectives: [
              "Master authentication patterns in React and Node.js.",
              "Optimize React and Node.js applications for performance.",
              "Develop full-stack applications using React, Node.js, and PostgreSQL.",
              "Implement secure and efficient data handling techniques.",
            ],
            createdAt: "2025-05-14T07:18:10.046Z",
            moduleCount: 3,
            lessonCount: 8,
            progress: 25,
            lastAccessed: "2025-05-14T10:30:00.000Z",
            tags: ["React", "Node.js", "PostgreSQL", "Authentication"],
          },
          {
            id: "2",
            title: "Advanced React Patterns and Performance Optimization",
            description:
              "Learn advanced React patterns and techniques to build scalable, maintainable, and high-performance applications.",
            objectives: [
              "Master advanced React patterns like Compound Components and Render Props.",
              "Implement performance optimization techniques in React applications.",
              "Build reusable and composable components.",
              "Use React hooks effectively for state management and side effects.",
            ],
            createdAt: "2025-05-10T09:20:15.046Z",
            moduleCount: 4,
            lessonCount: 12,
            progress: 75,
            lastAccessed: "2025-05-13T14:45:00.000Z",
            tags: ["React", "Performance", "Advanced", "Hooks"],
          },
          {
            id: "3",
            title: "Building Microservices with Node.js and Docker",
            description: "Learn how to design, build, and deploy microservices using Node.js, Express, and Docker.",
            objectives: [
              "Understand microservices architecture and its benefits.",
              "Build RESTful APIs with Node.js and Express.",
              "Containerize applications with Docker.",
              "Implement service discovery and load balancing.",
            ],
            createdAt: "2025-05-05T11:30:20.046Z",
            moduleCount: 5,
            lessonCount: 15,
            progress: 10,
            lastAccessed: "2025-05-12T08:15:00.000Z",
            tags: ["Node.js", "Microservices", "Docker", "API"],
          },
          {
            id: "4",
            title: "Data Visualization with D3.js and React",
            description:
              "Learn how to create interactive data visualizations using D3.js and integrate them with React applications.",
            objectives: [
              "Understand the fundamentals of data visualization.",
              "Master D3.js for creating custom visualizations.",
              "Integrate D3.js with React components.",
              "Build interactive dashboards and charts.",
            ],
            createdAt: "2025-04-28T15:45:30.046Z",
            moduleCount: 4,
            lessonCount: 10,
            progress: 50,
            lastAccessed: "2025-05-11T16:20:00.000Z",
            tags: ["D3.js", "React", "Data Visualization", "Dashboard"],
          },
          {
            id: "5",
            title: "GraphQL API Development with Apollo Server",
            description: "Learn how to build efficient and flexible APIs using GraphQL and Apollo Server.",
            objectives: [
              "Understand GraphQL schema design principles.",
              "Implement resolvers and data fetching.",
              "Handle authentication and authorization in GraphQL APIs.",
              "Optimize performance with caching and batching.",
            ],
            createdAt: "2025-04-20T10:15:45.046Z",
            moduleCount: 3,
            lessonCount: 9,
            progress: 0,
            tags: ["GraphQL", "Apollo", "API", "Node.js"],
          },
        ]

        setCourses(mockCourses)
        setFilteredCourses(mockCourses)
      } catch (err) {
        console.error("Error fetching courses:", err)
        setError("Failed to load courses. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  // Filter courses based on search query and active tab
  useEffect(() => {
    let filtered = courses

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.tags?.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    // Filter by tab
    if (activeTab === "in-progress") {
      filtered = filtered.filter((course) => course.progress > 0 && course.progress < 100)
    } else if (activeTab === "completed") {
      filtered = filtered.filter((course) => course.progress === 100)
    } else if (activeTab === "not-started") {
      filtered = filtered.filter((course) => course.progress === 0)
    }

    setFilteredCourses(filtered)
  }, [searchQuery, activeTab, courses])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 container max-w-screen-xl mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-medium">Loading your courses...</h2>
            <p className="text-muted-foreground mt-2">Please wait while we fetch your course data</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 container max-w-screen-xl mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>My Courses</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">My Courses</h1>
            <p className="text-muted-foreground">Access your personalized learning paths and track your progress</p>
          </div>
          <Button asChild>
            <Link href="/courses/new">
              <Plus className="mr-2 h-4 w-4" />
              Generate New Course
            </Link>
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setActiveTab("all")}>All Courses</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("in-progress")}>In Progress</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("completed")}>Completed</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("not-started")}>Not Started</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>Recently Added</DropdownMenuItem>
                <DropdownMenuItem>Recently Accessed</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="not-started">Not Started</TabsTrigger>
          </TabsList>
        </Tabs>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No courses found</h2>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "No courses match your search criteria. Try a different search term."
                : "You don't have any courses in this category yet."}
            </p>
            <Button asChild>
              <Link href="/courses/new">
                <Plus className="mr-2 h-4 w-4" />
                Generate New Course
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                  </div>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-muted-foreground">Progress</div>
                    <div className="text-sm font-medium">{course.progress}%</div>
                  </div>
                  <Progress value={course.progress} className="h-2" />

                  <div className="flex flex-wrap gap-2 mt-4">
                    {course.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-2 flex justify-between items-center">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {course.moduleCount} modules
                    </div>
                    <div className="flex items-center">
                      <BarChart2 className="h-4 w-4 mr-1" />
                      {course.lessonCount} lessons
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/courses/${course.id}`}>
                      Continue
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {filteredCourses.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Ready to learn something new?</h2>
            <p className="text-muted-foreground mb-6">
              Generate a new personalized course tailored to your learning goals and preferences.
            </p>
            <Button asChild>
              <Link href="/courses/new">
                <Plus className="mr-2 h-4 w-4" />
                Generate New Course
              </Link>
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
