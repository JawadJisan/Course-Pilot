import { BookOpen, Users, Award, Clock, Zap, Globe } from "lucide-react"

const features = [
  {
    name: "Expert-Led Courses",
    description: "Learn from industry professionals with years of real-world experience.",
    icon: BookOpen,
  },
  {
    name: "Community Support",
    description: "Join a thriving community of learners to share knowledge and grow together.",
    icon: Users,
  },
  {
    name: "Certification",
    description: "Earn recognized certificates to showcase your skills to employers.",
    icon: Award,
  },
  {
    name: "Flexible Learning",
    description: "Study at your own pace with lifetime access to all course materials.",
    icon: Clock,
  },
  {
    name: "Interactive Exercises",
    description: "Reinforce your learning with hands-on projects and coding challenges.",
    icon: Zap,
  },
  {
    name: "Global Recognition",
    description: "Our certificates are recognized by leading companies worldwide.",
    icon: Globe,
  },
]

export default function Features() {
  return (
    <section className="container space-y-16 py-24 md:py-32" id="features">
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Why Choose Us</h2>
        <p className="mt-4 text-muted-foreground sm:text-lg">
          Our platform offers everything you need to accelerate your career and achieve your goals.
        </p>
      </div>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.name}
            className="relative overflow-hidden rounded-lg border bg-background p-8 transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-2">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold">{feature.name}</h3>
            </div>
            <p className="mt-2 text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
