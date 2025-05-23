import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="container flex min-h-[calc(100vh-3.5rem)] max-w-screen-2xl flex-col items-center justify-center space-y-8 py-24 text-center md:py-32">
      <div className="space-y-4">
        <h1 className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
          Master Your Career Path
          <br />
          <span className="text-primary">Learn. Practice. Succeed.</span>
        </h1>
        <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Join thousands of professionals who have transformed their careers through our industry-leading courses and
          interview preparation. Get hired at top companies with our proven methodology.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90">
          Start Learning Now
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button variant="outline" size="lg">
          View Course Catalog
        </Button>
      </div>
      <div className="mt-8 flex items-center justify-center space-x-4 text-sm">
        <div className="flex -space-x-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-8 rounded-full bg-gray-300 border-2 border-background" />
          ))}
        </div>
        <p className="text-muted-foreground">
          <span className="font-bold text-foreground">10,000+</span> students already enrolled
        </p>
      </div>
    </section>
  )
}
