"use client"

import { useRef, useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    quote:
      "This platform completely transformed my career. I went from a junior developer to a senior role at a FAANG company in just 8 months after completing their courses.",
    author: "Sarah Johnson",
    role: "Senior Software Engineer",
    company: "Google",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
  },
  {
    quote:
      "The interview preparation was spot on. The mock interviews and feedback helped me understand exactly what recruiters are looking for. I got offers from 3 companies!",
    author: "Michael Chen",
    role: "Data Scientist",
    company: "Amazon",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
  },
  {
    quote:
      "As someone transitioning careers, I was worried about breaking into tech. The structured curriculum and supportive community made it possible. Now I'm a UX designer!",
    author: "Emily Rodriguez",
    role: "UX Designer",
    company: "Spotify",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
  },
  {
    quote:
      "The AI interview practice feature is incredible. It helped me identify my weak points and improve my communication skills. I aced my interviews at Microsoft!",
    author: "David Kim",
    role: "Product Manager",
    company: "Microsoft",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
  },
  {
    quote:
      "I was skeptical at first, but the personalized learning path really works. The platform adapted to my learning style and helped me master complex topics quickly.",
    author: "Priya Patel",
    role: "Full Stack Developer",
    company: "Airbnb",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
  },
  {
    quote:
      "The certification I earned through this platform was recognized immediately by employers. I had multiple job offers within weeks of completing my course.",
    author: "James Wilson",
    role: "Cloud Architect",
    company: "Netflix",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
  },
]

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const testimonialsPerView = 3
  const totalSlides = Math.ceil(testimonials.length / testimonialsPerView)

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

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        nextSlide()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [activeIndex, isAnimating])

  const nextSlide = () => {
    if (isAnimating) return

    setIsAnimating(true)
    setActiveIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))

    setTimeout(() => {
      setIsAnimating(false)
    }, 500)
  }

  const prevSlide = () => {
    if (isAnimating) return

    setIsAnimating(true)
    setActiveIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))

    setTimeout(() => {
      setIsAnimating(false)
    }, 500)
  }

  return (
    <section
      className="py-24 md:py-32 bg-background relative opacity-0 translate-y-10 transition-all duration-700 ease-out"
      id="testimonials"
      ref={sectionRef}
    >
      {/* Section background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/90 pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mx-auto max-w-[58rem] text-center mb-16">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl text-foreground">
            Success <span className="text-primary">Stories</span>
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            Hear from our students who have transformed their careers with our platform.
          </p>
        </div>

        <div className="relative">
          {/* Slider controls */}
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-6 z-10">
            <button
              onClick={prevSlide}
              disabled={isAnimating}
              className="rounded-full bg-card/80 backdrop-blur-sm border border-border text-foreground hover:bg-secondary h-12 w-12 shadow-md flex items-center justify-center disabled:opacity-50"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </div>

          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-6 z-10">
            <button
              onClick={nextSlide}
              disabled={isAnimating}
              className="rounded-full bg-card/80 backdrop-blur-sm border border-border text-foreground hover:bg-secondary h-12 w-12 shadow-md flex items-center justify-center disabled:opacity-50"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Testimonial slider */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="min-w-full md:min-w-[50%] lg:min-w-[33.333%] p-4">
                  <Card className="h-full bg-card/80 backdrop-blur-sm border-border text-card-foreground hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-8 relative">
                      {/* Quote icon */}
                      <div className="absolute top-6 right-6 text-primary/20">
                        <Quote className="h-12 w-12" />
                      </div>

                      {/* Rating stars */}
                      <div className="flex items-center mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${star <= testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                          />
                        ))}
                      </div>

                      {/* Quote text */}
                      <p className="mb-8 text-muted-foreground relative z-10">"{testimonial.quote}"</p>

                      {/* Author info */}
                      <div className="flex items-center">
                        <div className="mr-4 h-14 w-14 overflow-hidden rounded-full border-2 border-primary/30">
                          <Image
                            src={testimonial.avatar || "/placeholder.svg"}
                            alt={testimonial.author}
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role}, <span className="text-primary">{testimonial.company}</span>
                          </p>
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
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === index ? "w-8 bg-primary" : "w-2 bg-muted"
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
