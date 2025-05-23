"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, ChevronLeft, ChevronRight, Clock, Briefcase } from "lucide-react"
import Image from "next/image"

const interviews = [
  {
    company: "Google",
    role: "Software Engineer",
    difficulty: "Hard",
    duration: "45 min",
    thumbnail: "/placeholder.svg?height=200&width=350",
    logo: "/placeholder.svg?height=40&width=40",
    description: "System design interview focusing on scalable architecture for a global service.",
  },
  {
    company: "Amazon",
    role: "Data Scientist",
    difficulty: "Medium",
    duration: "60 min",
    thumbnail: "/placeholder.svg?height=200&width=350",
    logo: "/placeholder.svg?height=40&width=40",
    description: "Statistical analysis and machine learning model implementation for recommendation systems.",
  },
  {
    company: "Microsoft",
    role: "Product Manager",
    difficulty: "Medium",
    duration: "50 min",
    thumbnail: "/placeholder.svg?height=200&width=350",
    logo: "/placeholder.svg?height=40&width=40",
    description: "Product strategy and roadmap planning for a new enterprise software solution.",
  },
  {
    company: "Apple",
    role: "UX Designer",
    difficulty: "Medium",
    duration: "55 min",
    thumbnail: "/placeholder.svg?height=200&width=350",
    logo: "/placeholder.svg?height=40&width=40",
    description: "User experience design challenge for a new mobile application feature.",
  },
  {
    company: "Meta",
    role: "Frontend Engineer",
    difficulty: "Hard",
    duration: "40 min",
    thumbnail: "/placeholder.svg?height=200&width=350",
    logo: "/placeholder.svg?height=40&width=40",
    description: "React performance optimization and component architecture design.",
  },
  {
    company: "Netflix",
    role: "Backend Engineer",
    difficulty: "Hard",
    duration: "65 min",
    thumbnail: "/placeholder.svg?height=200&width=350",
    logo: "/placeholder.svg?height=40&width=40",
    description: "Microservices architecture and distributed systems design for streaming platforms.",
  },
]

export default function InterviewShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const slidesToShow = 3
  const totalSlides = Math.ceil(interviews.length / slidesToShow)

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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
  }

  return (
    <section
      className="py-24 md:py-32 bg-background relative opacity-0 translate-y-10 transition-all duration-700 ease-out"
      id="interviews"
      ref={sectionRef}
    >
      {/* Section background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 to-background pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mx-auto max-w-[58rem] text-center mb-16">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl text-foreground">
            Real Interview <span className="text-primary">Experiences</span>
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            Watch mock interviews with professionals from top companies. Learn the exact questions they ask and how to
            answer them effectively.
          </p>
        </div>

        <div className="relative">
          {/* Slider controls */}
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-6 z-10">
            <Button
              size="icon"
              variant="outline"
              onClick={prevSlide}
              className="rounded-full bg-card/80 backdrop-blur-sm border border-border text-foreground hover:bg-secondary h-12 w-12 shadow-md"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>

          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-6 z-10">
            <Button
              size="icon"
              variant="outline"
              onClick={nextSlide}
              className="rounded-full bg-card/80 backdrop-blur-sm border border-border text-foreground hover:bg-secondary h-12 w-12 shadow-md"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Interview cards slider */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {interviews.map((interview, index) => (
                <div key={index} className="min-w-full md:min-w-[50%] lg:min-w-[33.333%] p-4">
                  <Card className="overflow-hidden bg-card/80 backdrop-blur-sm border-border text-card-foreground h-full hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-0">
                      <div className="relative">
                        <div className="aspect-video overflow-hidden">
                          <Image
                            src={interview.thumbnail || "/placeholder.svg"}
                            alt={`${interview.company} interview`}
                            width={350}
                            height={200}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent flex items-center justify-center">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 h-16 w-16 group-hover:scale-110 transition-transform duration-300"
                          >
                            <Play className="h-8 w-8 text-white fill-white" />
                          </Button>
                        </div>

                        <div className="absolute top-4 right-4">
                          <Badge
                            variant="outline"
                            className={`
                              ${
                                interview.difficulty === "Hard"
                                  ? "bg-red-500/20 text-red-400 border-red-500/30"
                                  : interview.difficulty === "Medium"
                                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                    : "bg-green-500/20 text-green-400 border-green-500/30"
                              }
                            `}
                          >
                            {interview.difficulty}
                          </Badge>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <div className="flex items-center mb-3">
                            <div className="h-10 w-10 rounded-full bg-secondary mr-3 overflow-hidden border border-border">
                              <Image
                                src={interview.logo || "/placeholder.svg"}
                                alt={interview.company}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-foreground">{interview.company}</h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Briefcase className="h-3 w-3 mr-1" />
                                {interview.role}
                              </div>
                            </div>
                          </div>

                          <p className="text-muted-foreground mb-4 line-clamp-2">{interview.description}</p>

                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-1" />
                              {interview.duration}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-primary/50 text-primary hover:bg-primary/10"
                            >
                              Watch Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index ? "w-8 bg-primary" : "w-2 bg-muted"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
