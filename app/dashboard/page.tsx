"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  BookOpen,
  CheckCircle,
  Clock,
  Award,
  MessageSquare,
  ChevronRight,
  Calendar,
  Settings,
  BarChart,
  Play,
  FileText,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

// Mock data - would be fetched from API in a real application
const mockUserData = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "/placeholder.svg?height=40&width=40",
  stats: {
    coursesInProgress: 3,
    coursesCompleted: 5,
    interviewsTaken: 8,
    certificatesEarned: 4,
  },
  coursesInProgress: [
    {
      id: "1",
      title: "Full-Stack Development with React, Node.js, and PostgreSQL",
      progress: 65,
      lastAccessed: "2 days ago",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: "2",
      title: "Advanced TypeScript for Enterprise Applications",
      progress: 42,
      lastAccessed: "Yesterday",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: "3",
      title: "Cloud Architecture with AWS",
      progress: 18,
      lastAccessed: "4 days ago",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
  ],
  coursesCompleted: [
    {
      id: "4",
      title: "JavaScript Fundamentals",
      completedDate: "April 15, 2025",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: "5",
      title: "React Hooks in Depth",
      completedDate: "March 22, 2025",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: "6",
      title: "CSS Grid and Flexbox Mastery",
      completedDate: "February 10, 2025",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: "7",
      title: "Git and GitHub for Teams",
      completedDate: "January 5, 2025",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
  ],
  upcomingInterview: {
    id: "int-1",
    courseTitle: "Full-Stack Development",
    date: "May 18, 2025",
    time: "2:00 PM",
  },
  interviewHistory: [
    { id: "int-2", courseTitle: "React Hooks in Depth", date: "April 10, 2025", score: 92 },
    { id: "int-3", courseTitle: "JavaScript Fundamentals", date: "March 15, 2025", score: 88 },
    { id: "int-4", courseTitle: "CSS Grid and Flexbox Mastery", date: "February 20, 2025", score: 95 },
  ],
  certificates: [
    { id: "cert-1", courseTitle: "JavaScript Fundamentals", date: "April 16, 2025", url: "#" },
    { id: "cert-2", courseTitle: "React Hooks in Depth", date: "March 23, 2025", url: "#" },
    { id: "cert-3", courseTitle: "CSS Grid and Flexbox Mastery", date: "February 11, 2025", url: "#" },
    { id: "cert-4", courseTitle: "Git and GitHub for Teams", date: "January 6, 2025", url: "#" },
  ],
  activityFeed: [
    { id: "act-1", text: "You completed Lesson 3 of Full-Stack Development", date: "2 days ago" },
    { id: "act-2", text: "You scored 92% on React Hooks in Depth interview", date: "April 10, 2025" },
    { id: "act-3", text: "Certificate issued for JavaScript Fundamentals", date: "April 16, 2025" },
    { id: "act-4", text: "You started Cloud Architecture with AWS", date: "4 days ago" },
    { id: "act-5", text: "You completed JavaScript Fundamentals", date: "April 15, 2025" },
  ],
}

export default function DashboardPage() {
  const [showAllActivity, setShowAllActivity] = useState(false)
  const displayedActivities = showAllActivity ? mockUserData.activityFeed : mockUserData.activityFeed.slice(0, 3)

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header with greeting and profile */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {mockUserData.name}!</h1>
            <p className="text-muted-foreground mt-1">Track your progress and continue your learning journey</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Input placeholder="Search courses..." className="w-full md:w-[200px] pl-9" />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            <Link href="/profile">
              <Button variant="outline" className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={mockUserData.avatar || "/placeholder.svg"} alt={mockUserData.name} />
                  <AvatarFallback>{mockUserData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline">Profile</span>
              </Button>
            </Link>

            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Courses In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-primary mr-2" />
                <div className="text-2xl font-bold">{mockUserData.stats.coursesInProgress}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <div className="text-2xl font-bold">{mockUserData.stats.coursesCompleted}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Interviews Taken</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
                <div className="text-2xl font-bold">{mockUserData.stats.interviewsTaken}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Certificates Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Award className="h-5 w-5 text-yellow-500 mr-2" />
                <div className="text-2xl font-bold">{mockUserData.stats.certificatesEarned}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Courses */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Courses Section */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>My Courses</CardTitle>
                  <Link href="/courses">
                    <Button variant="ghost" size="sm" className="gap-1">
                      View all <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pb-1">
                <Tabs defaultValue="in-progress">
                  <TabsList className="mb-4">
                    <TabsTrigger value="in-progress" className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>In Progress</span>
                      <Badge variant="secondary" className="ml-1">
                        {mockUserData.coursesInProgress.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>Completed</span>
                      <Badge variant="secondary" className="ml-1">
                        {mockUserData.coursesCompleted.length}
                      </Badge>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="in-progress" className="m-0">
                    <div className="space-y-4">
                      {mockUserData.coursesInProgress.map((course) => (
                        <div key={course.id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
                          <div className="sm:w-[120px] h-[80px] rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={course.thumbnail || "/placeholder.svg"}
                              alt={course.title}
                              width={120}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-base line-clamp-1">{course.title}</h3>
                            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>Last accessed {course.lastAccessed}</span>
                            </div>
                            <div className="mt-3 space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span>{course.progress}% complete</span>
                                <span>{course.progress}/100</span>
                              </div>
                              <Progress value={course.progress} className="h-2" />
                            </div>
                          </div>
                          <div className="flex sm:flex-col gap-2 mt-4 sm:mt-0 sm:justify-center">
                            <Link
                              href={`/courses/my-courses/${course.id}/full-stack-development-with-react,-node.js,-and-postgresql/lesson/1`}
                            >
                              <Button className="w-full sm:w-auto">
                                <Play className="h-4 w-4 mr-1" />
                                Resume
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="completed" className="m-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {mockUserData.coursesCompleted.map((course) => (
                        <div key={course.id} className="border rounded-lg overflow-hidden flex flex-col">
                          <div className="h-[120px] relative">
                            <Image
                              src={course.thumbnail || "/placeholder.svg"}
                              alt={course.title}
                              width={200}
                              height={120}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-green-500">Completed</Badge>
                            </div>
                          </div>
                          <div className="p-4 flex-1 flex flex-col">
                            <h3 className="font-medium line-clamp-2 flex-1">{course.title}</h3>
                            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>Completed on {course.completedDate}</span>
                            </div>
                            <div className="mt-3 flex gap-2">
                              <Link href={`/courses/${course.id}`}>
                                <Button variant="outline" size="sm">
                                  <FileText className="h-4 w-4 mr-1" />
                                  Review
                                </Button>
                              </Link>
                              <Link href={`/certificate/${course.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Award className="h-4 w-4 mr-1" />
                                  Certificate
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="pt-0">
                <Link href="/courses/new">
                  <Button className="w-full mt-4">
                    Generate New Course with AI
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Interviews Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Interviews</CardTitle>
                  <Link href="/interview">
                    <Button variant="ghost" size="sm" className="gap-1">
                      View all <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {mockUserData.upcomingInterview && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Upcoming Interview</h3>
                    <div className="border rounded-lg p-4 bg-primary/5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{mockUserData.upcomingInterview.courseTitle}</h4>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {mockUserData.upcomingInterview.date} at {mockUserData.upcomingInterview.time}
                            </span>
                          </div>
                        </div>
                        <Link href={`/interview/${mockUserData.upcomingInterview.id}`}>
                          <Button>Go to Interview</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                <h3 className="text-sm font-medium text-muted-foreground mb-2">Interview History</h3>
                <div className="space-y-3">
                  {mockUserData.interviewHistory.map((interview) => (
                    <div key={interview.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div>
                        <h4 className="font-medium">{interview.courseTitle}</h4>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{interview.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">{interview.score}%</div>
                          <div className="text-xs text-muted-foreground">Score</div>
                        </div>
                        <Link href={`/interview/${interview.id}/feedback`}>
                          <Button variant="outline" size="sm">
                            View Feedback
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/interview/new">
                  <Button className="w-full">Schedule New Interview</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          {/* Right Column - Certificates & Activity */}
          <div className="space-y-8">
            {/* Certificates Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>My Certificates</CardTitle>
                  <Link href="/certificates">
                    <Button variant="ghost" size="sm" className="gap-1">
                      View all <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUserData.certificates.slice(0, 3).map((certificate) => (
                    <div key={certificate.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Award className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{certificate.courseTitle}</h4>
                          <div className="text-sm text-muted-foreground mt-0.5">{certificate.date}</div>
                        </div>
                      </div>
                      <Link href={certificate.url}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your learning journey updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayedActivities.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className="relative mt-1">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        {/* Line connecting dots */}
                        {activity.id !== displayedActivities[displayedActivities.length - 1].id && (
                          <div className="absolute top-2 bottom-0 left-1/2 w-px -translate-x-1/2 bg-border h-full"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm">{activity.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {mockUserData.activityFeed.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => setShowAllActivity(!showAllActivity)}
                  >
                    {showAllActivity ? (
                      <>
                        Show less <ChevronUp className="ml-1 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Show more <ChevronDown className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Learning Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Weekly Goal</span>
                      <span className="text-sm text-muted-foreground">4/5 hours</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Monthly Completion</span>
                      <span className="text-sm text-muted-foreground">2/3 courses</span>
                    </div>
                    <Progress value={66} className="h-2" />
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-1.5 rounded-full">
                          <BarChart className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">Current Streak</span>
                      </div>
                      <span className="font-bold">5 days</span>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-1.5 rounded-full">
                          <Clock className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">Total Learning Time</span>
                      </div>
                      <span className="font-bold">42 hours</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/stats">
                  <Button variant="outline" size="sm" className="w-full">
                    View Detailed Stats
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
