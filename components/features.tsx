import { Shield, Cpu, Clock, Users } from "lucide-react"

const features = [
  {
    name: "Smart Contract Security",
    description:
      "Pre-approve asset transfers with our advanced smart contracts, keeping your assets in your control until needed.",
    icon: Shield,
  },
  {
    name: "AI-Powered Monitoring",
    description:
      "Our AI agent, Aevia, regularly checks on your well-being, ensuring your digital assets are always protected.",
    icon: Cpu,
  },
  {
    name: "Timely Asset Transfer",
    description:
      "In the event of your passing, Aevia initiates the transfer of your digital assets to your specified wallet.",
    icon: Clock,
  },
  {
    name: "Emergency Contact System",
    description:
      "Aevia communicates with your designated emergency contacts if unable to reach you, adding an extra layer of verification.",
    icon: Users,
  },
]

export default function Features() {
  return (
    <section id="features" className="container space-y-16 py-24 md:py-32">
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">How Aevia Works</h2>
        <p className="mt-4 text-muted-foreground sm:text-lg">
          Discover the innovative features that make Aevia the trusted choice for digital asset inheritance.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        {features.map((feature) => (
          <div key={feature.name} className="relative overflow-hidden rounded-lg border bg-background p-8">
            <div className="flex items-center gap-4">
              <feature.icon className="h-8 w-8" />
              <h3 className="font-bold">{feature.name}</h3>
            </div>
            <p className="mt-2 text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

