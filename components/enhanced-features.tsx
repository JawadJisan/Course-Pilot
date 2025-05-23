"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { Target, MessageSquare, Activity, Award } from "lucide-react"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  index: number
}

const FeatureCard = ({ icon, title, description, index }: FeatureCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100")
          entry.target.classList.remove("opacity-0")
        }
      },
      { threshold: 0.1 },
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className="opacity-0 transition-all duration-700 ease-out"
      style={{ animationDelay: `${0.2 + index * 0.15}s` }}
    >
      <div className="rounded-2xl p-0.5 h-full transform hover:scale-105 transition-all duration-300 border border-white/10 bg-gradient-to-br from-primary/20 to-transparent">
        <div className="p-8 flex flex-col items-center text-center h-full group bg-background/80 backdrop-blur-sm rounded-2xl">
          <div className="rounded-full bg-background p-4 mb-6 shadow-[0_0_15px_rgba(0,0,0,0.1)] transform group-hover:rotate-3 transition-transform duration-300">
            {icon}
          </div>
          <h3 className="text-xl font-semibold mb-3 text-foreground">{title}</h3>
          <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
            {description}
          </p>

          {/* Animated line */}
          <div className="mt-6 w-12 h-1 bg-primary/50 rounded-full group-hover:w-20 transition-all duration-300"></div>
        </div>
      </div>
    </div>
  )
}

const EnhancedFeatures = () => {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-up")
          entry.target.classList.remove("opacity-0")
        }
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

  const features = [
    {
      icon: <Target className="h-6 w-6 text-primary" />,
      title: "Personalized Course Generation",
      description:
        "Our AI analyzes your goals, skills, and learning style to create tailored learning paths just for you.",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "Interactive AI Interviews",
      description:
        "Practice with realistic voice agents powered by Vapi & Gemini technologies for perfect interview prep.",
    },
    {
      icon: <Activity className="h-6 w-6 text-primary" />,
      title: "Instant AI Feedback",
      description: "Receive detailed analysis and improvement suggestions on your responses in real-time.",
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: "Verified Certificates",
      description: "Earn blockchain-verified credentials that showcase your skills to potential employers.",
    },
  ]

  return (
    <section className="py-20" ref={sectionRef}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 opacity-0 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            <span className="text-primary">Key</span> Features
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Leverage the power of AI to enhance your tech career journey with our cutting-edge learning platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default EnhancedFeatures
