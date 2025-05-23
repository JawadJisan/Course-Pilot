"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, Play, BarChart2, CheckCircle, RefreshCw } from "lucide-react"
import Image from "next/image"

export default function AIInterviewPractice() {
  const [isHovered, setIsHovered] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<HTMLDivElement>(null)

  // Animation for the section when it comes into view
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

  // Pulse animation for the microphone
  const [isPulsing, setIsPulsing] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing((prev) => !prev)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 bg-background relative opacity-0 translate-y-10 transition-all duration-700 ease-out"
      id="ai-interview"
    >
      {/* Section background - consistent with theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 to-background pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side: Content */}
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3 mb-4">
              <Badge className="bg-primary text-primary-foreground px-3 py-1 text-sm font-medium">LIVE AI</Badge>
              <Badge className="bg-purple-600 text-white px-3 py-1 text-sm font-medium">NEW FEATURE</Badge>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Practice, Learn, <span className="text-primary">Succeed</span>
            </h2>

            <p className="text-lg text-muted-foreground">
              Experience live AI-driven interviews with instant feedback. Our advanced AI systems analyze your responses
              in real-time, providing constructive criticism and suggestions to help you improve.
            </p>

            <ul className="space-y-4">
              {[
                "Practice with industry-specific interview questions",
                "Receive detailed performance analytics",
                "Compare your answers with ideal responses",
                "Track your improvement over time",
              ].map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              size="lg"
              className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className="mr-2">Start Interview</span>
              <Play className={`h-5 w-5 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`} />
            </Button>

            <div className="mt-8">
              <p className="text-sm text-muted-foreground mb-3">Powered by industry-leading AI technologies</p>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center space-x-2 opacity-80 hover:opacity-100 transition-opacity">
                  <Image
                    src="/placeholder.svg?height=24&width=24"
                    alt="OpenAI"
                    width={24}
                    height={24}
                    className="grayscale"
                  />
                  <span className="text-muted-foreground">OpenAI</span>
                </div>
                <div className="flex items-center space-x-2 opacity-80 hover:opacity-100 transition-opacity">
                  <Image
                    src="/placeholder.svg?height=24&width=24"
                    alt="Google Gemini"
                    width={24}
                    height={24}
                    className="grayscale"
                  />
                  <span className="text-muted-foreground">Google Gemini</span>
                </div>
                <div className="flex items-center space-x-2 opacity-80 hover:opacity-100 transition-opacity">
                  <Image
                    src="/placeholder.svg?height=24&width=24"
                    alt="Anthropic"
                    width={24}
                    height={24}
                    className="grayscale"
                  />
                  <span className="text-muted-foreground">Anthropic</span>
                </div>
                <div className="flex items-center space-x-2 opacity-80 hover:opacity-100 transition-opacity">
                  <Image
                    src="/placeholder.svg?height=24&width=24"
                    alt="Vapi AI"
                    width={24}
                    height={24}
                    className="grayscale"
                  />
                  <span className="text-muted-foreground">Vapi AI</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Interactive UI */}
          <div ref={animationRef} className="relative">
            <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl border border-border shadow-xl overflow-hidden">
              {/* Interview UI Header */}
              <div className="bg-background/80 p-4 border-b border-border flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="px-3 py-1 bg-primary/20 rounded-full text-xs text-primary">LIVE SESSION</div>
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">00:05:32</span>
                </div>
              </div>

              {/* Interview Content */}
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                      <span className="text-primary font-medium">AI</span>
                    </div>
                    <div className="text-foreground font-medium">Technical Interviewer</div>
                  </div>
                  <div className="ml-11 p-4 bg-secondary/30 rounded-lg rounded-tl-none">
                    <p className="text-muted-foreground">
                      Can you explain how you would design a scalable microservice architecture for an e-commerce
                      platform?
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center mr-3">
                      <span className="text-muted-foreground font-medium">You</span>
                    </div>
                    <div className="text-foreground font-medium">Your Response</div>
                  </div>
                  <div className="ml-11 p-4 bg-secondary/50 rounded-lg rounded-tl-none">
                    <p className="text-muted-foreground">
                      For a scalable e-commerce microservice architecture, I would separate core functionalities into
                      distinct services...
                    </p>
                  </div>
                </div>

                {/* Microphone and Recording UI */}
                <div className="mt-8 flex justify-center">
                  <div className="relative">
                    <div
                      className={`absolute inset-0 rounded-full bg-primary/20 ${isPulsing ? "scale-150" : "scale-100"} opacity-70 transition-all duration-1000 ease-in-out`}
                    ></div>
                    <div
                      className={`absolute inset-0 rounded-full bg-primary/30 ${isPulsing ? "scale-125" : "scale-100"} opacity-70 transition-all duration-1000 ease-in-out delay-300`}
                    ></div>
                    <button className="relative h-16 w-16 rounded-full bg-primary flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                      <Mic className="h-8 w-8 text-primary-foreground" />
                    </button>
                  </div>
                </div>

                {/* Feedback Preview */}
                <div className="mt-8 p-4 bg-card border border-border rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-foreground font-medium">Real-time Feedback</h4>
                    <BarChart2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">Technical Accuracy</span>
                      <div className="w-2/3 bg-secondary rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">Communication</span>
                      <div className="w-2/3 bg-secondary rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "70%" }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">Completeness</span>
                      <div className="w-2/3 bg-secondary rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements - subtle */}
            <div className="absolute -top-6 -right-6 h-24 w-24 bg-purple-600/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-8 -left-8 h-32 w-32 bg-primary/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
