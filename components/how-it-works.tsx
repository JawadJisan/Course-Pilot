"use client"

import { useRef, useEffect } from "react"
import { BookOpen, Code, Award, TrendingUp } from "lucide-react"

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLDivElement | null>>([])

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

    itemRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref)
      }
    })

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
      itemRefs.current.forEach((ref) => {
        if (ref) {
          observer.unobserve(ref)
        }
      })
    }
  }, [])

  const steps = [
    {
      number: "01",
      title: "Choose Your Path",
      description: "Browse our catalog of courses and select the one that aligns with your career goals.",
      icon: <BookOpen className="h-8 w-8 text-white" />,
      color: "from-blue-600 to-blue-400",
    },
    {
      number: "02",
      title: "Learn at Your Pace",
      description: "Access high-quality video lessons, reading materials, and interactive exercises.",
      icon: <Code className="h-8 w-8 text-white" />,
      color: "from-purple-600 to-purple-400",
    },
    {
      number: "03",
      title: "Practice & Apply",
      description: "Reinforce your knowledge with real-world projects and coding challenges.",
      icon: <TrendingUp className="h-8 w-8 text-white" />,
      color: "from-pink-600 to-pink-400",
    },
    {
      number: "04",
      title: "Get Certified",
      description: "Complete your course and earn a certificate to showcase your new skills.",
      icon: <Award className="h-8 w-8 text-white" />,
      color: "from-amber-600 to-amber-400",
    },
  ]

  return (
    <section className="py-24 md:py-32 bg-background relative" id="how-it-works" ref={sectionRef}>
      {/* Section background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 to-background pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mx-auto max-w-[58rem] text-center mb-16 opacity-0 translate-y-10 transition-all duration-700 ease-out">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl text-foreground">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            Our simple four-step process will take you from beginner to job-ready professional.
          </p>
        </div>

        <div className="relative">
          {/* Timeline connector */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-amber-600/30 transform -translate-y-1/2 hidden lg:block"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative group opacity-0 translate-y-10 transition-all duration-700 ease-out"
                style={{ transitionDelay: `${index * 150}ms` }}
                ref={(el) => (itemRefs.current[index] = el)}
              >
                <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-8 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
                  {/* Step number with gradient background */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-background to-background border-4 border-border flex items-center justify-center z-10">
                    <span className="text-foreground font-bold">{step.number}</span>
                  </div>

                  {/* Icon with gradient background */}
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {step.icon}
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-foreground text-center">{step.title}</h3>
                  <p className="text-muted-foreground text-center">{step.description}</p>

                  {/* Bottom animated line */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-primary/50 to-primary group-hover:w-full transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
