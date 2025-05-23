import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Newsletter() {
  return (
    <section className="container py-24 md:py-32" id="newsletter">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl mb-6">Stay Updated</h2>
        <p className="text-muted-foreground sm:text-lg mb-8">
          Subscribe to our newsletter for the latest course releases, career tips, and exclusive offers.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
          <Input type="email" placeholder="Enter your email" className="h-12" />
          <Button className="h-12 px-8">Subscribe</Button>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
        </p>
      </div>
    </section>
  )
}
