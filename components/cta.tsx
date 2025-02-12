import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CTA() {
  return (
    <section>
      <div className="container py-24 md:py-32">
        <div className="mx-auto max-w-[58rem] text-center">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl mb-6">
            Ready to Secure Your Digital Legacy?
          </h2>
          <p className="text-xl mb-8 text-muted-foreground">
            Join Aevia today and ensure your digital assets are protected for generations to come.
          </p>
          <Button size="lg">
            Try Aevia Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}

