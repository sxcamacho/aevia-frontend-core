import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Features from "@/components/features"
import SupportedAssets from "@/components/supported-assets"
import AboutUs from "@/components/about-us"
import CTA from "@/components/cta"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <SupportedAssets />
      {/* <AboutUs /> */}
      <CTA />
      <Footer />
    </div>
  )
}

