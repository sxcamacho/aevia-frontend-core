"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  const handleLearnMore = () => {
    const featuresSection = document.getElementById("features")
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Background Video */}
      <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover">
        <source
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250131_1204_Loop%20Video_loop_01jjye8psdfv6aahemg9jjww8n-Qr62ckF7YAQkRjlUBAIF1M1uIjbgg1.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-background/75" />

      {/* Content */}
      <div className="relative z-10 container flex min-h-[calc(100vh-3.5rem)] max-w-screen-2xl flex-col items-center justify-center space-y-8 py-24 text-center md:py-32">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Secure Your Digital Legacy with Aevia
          </h1>
          <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Aevia empowers you to safeguard and transfer your digital assets, ensuring your blockchain wealth reaches
            its intended destination, even beyond your lifetime.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="https://aevia-web.netlify.app/dashboard">
            <Button size="lg">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            onClick={handleLearnMore}
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
}

