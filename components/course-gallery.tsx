"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Star, ChevronLeft, ChevronRight, BookOpen } from "lucide-react"
import Image from "next/image"

const courses = [
  {
    title: "Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript, React, and Node.js to become a full-stack developer.",
    level: "Beginner",
    duration: "12 weeks",
    students: "5,234",
    rating: "4.8",
    image: "/placeholder.svg?height=200&width=400",
    tag: "Most Popular",
    tagColor: "bg-yellow-500",
  },
  {
    title: "Data Science Fundamentals",
    description: "Master Python, statistics, and machine learning for data analysis and visualization.",
    level: "Intermediate",
    duration: "10 weeks",
    students: "3,129",
    rating: "4.7",
    image: "/placeholder.svg?height=200&width=400",
    tag: "Trending",
    tagColor: "bg-purple-500",
  },
  {
    title: "UX/UI Design Masterclass",
    description: "Create stunning user interfaces and experiences with industry-standard tools.",
    level: "All Levels",
    duration: "8 weeks",
    students: "2,876",
    rating: "4.9",
    image: "/placeholder.svg?height=200&width=400",
    tag: "New",
    tagColor: "bg-green-500",
  },
  {
    title: "Cloud Computing Certification",
    description: "Prepare for AWS, Azure, and Google Cloud certifications with hands-on projects.",
    level: "Advanced",
    duration: "14 weeks",
    students: "1,982",
    rating: "4.6",
    image: "/placeholder.svg?height=200&width=400",
    tag: "Advanced",
    tagColor: "bg-red-500",
  },
  {
    title: "Mobile App Development",
    description: "Build native iOS and Android applications using React Native and Flutter.",
    level: "Intermediate",
    duration: "11 weeks",
    students: "2,345",
    rating: "4.7",
    image: "/placeholder.svg?height=200&width=400",
    tag: "Hot",
    tagColor: "bg-orange-500",
  },
  {
    title: "Cybersecurity Essentials",
    description: "Learn to protect systems and networks from digital attacks and security breaches.",
    level: "Intermediate",
    duration: "9 weeks",
    students: "1,876",
    rating: "4.8",
    image: "/placeholder.svg?height=200&width=400",
    tag: "In Demand",
    tagColor: "bg-blue-500",
  },
]

export default function CourseGallery() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [visibleCourses, setVisibleCourses] = useState(courses)
  const [currentPage, setCurrentPage] = useState(0)
  const coursesPerPage = 4

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100")
            entry.target.classList.remove("opacity-0", "translate-y-10")
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (activeTab === "all") {
      setVisibleCourses(courses)
    } else {
      setVisibleCourses(courses.filter((course) => course.level.toLowerCase() === activeTab))
    }
    setCurrentPage(0)
  }, [activeTab])

  const totalPages = Math.ceil(visibleCourses.length / coursesPerPage)
  const displayedCourses = visibleCourses.slice(currentPage * coursesPerPage, (currentPage + 1) * coursesPerPage)

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const tabs = [
    { id: "all", label: "All Courses" },
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
  ]

  return (
    <section
      className="py-24 md:py-32 bg-background relative opacity-0 translate-y-10 transition-all duration-700 ease-out"
      id="courses"
      ref={sectionRef}
    >
      {/* Section background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/90 pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mx-auto max-w-[58rem] text-center mb-12">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl text-foreground">
            Featured <span className="text-primary">Courses</span>
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            Explore our most popular courses and start your learning journey today.
          </p>
        </div>

        {/* Course filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedCourses.map((course, index) => (
            <Card
              key={index}
              className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-2 border-border bg-card/80 backdrop-blur-sm text-card-foreground group"
            >
              <div className="aspect-video w-full overflow-hidden relative">
                <Image
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  width={400}
                  height={200}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {course.tag && (
                  <div
                    className={`absolute top-3 right-3 ${course.tagColor} text-white text-xs font-bold px-2 py-1 rounded-full`}
                  >
                    {course.tag}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
              </div>
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg text-foreground">{course.title}</CardTitle>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                    {course.level}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2 mt-2 text-muted-foreground">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    {course.students}
                  </div>
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${Number.parseFloat(course.rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                        />
                      ))}
                    </div>
                    <span className="ml-1">{course.rating}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground group-hover:shadow-md transition-all duration-300">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Enroll Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Pagination controls */}
        <div className="flex justify-center items-center mt-12 space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={prevPage}
            disabled={currentPage === 0}
            className="border-border text-foreground hover:bg-secondary hover:text-secondary-foreground disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={nextPage}
            disabled={currentPage >= totalPages - 1}
            className="border-border text-foreground hover:bg-secondary hover:text-secondary-foreground disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-12 text-center">
          <Button
            variant="outline"
            size="lg"
            className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary"
          >
            View All Courses
          </Button>
        </div>
      </div>
    </section>
  )
}
