import MouseMoveEffect from "@/components/mouse-move-effect"
import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Features from "@/components/features"
import SupportedAssets from "@/components/supported-assets"
import AboutUs from "@/components/about-us"
import CTA from "@/components/cta"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <>
      <MouseMoveEffect />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <SupportedAssets />
        {/* <AboutUs /> */}
        <CTA />
      </main>
      <Footer />
    </>
  )
}

