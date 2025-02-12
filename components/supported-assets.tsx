import { Coins, Image, Package } from "lucide-react"

const assets = [
  {
    type: "ERC-20 Tokens",
    description: "Securely transfer your fungible tokens, including cryptocurrencies and utility tokens.",
    icon: Coins,
  },
  {
    type: "ERC-721 NFTs",
    description: "Ensure your unique digital collectibles and artwork find their way to the right heir.",
    icon: Image,
  },
  {
    type: "ERC-1155 Multi-Tokens",
    description: "Manage the inheritance of your multi-token assets, combining the best of ERC-20 and ERC-721.",
    icon: Package,
  },
]

export default function SupportedAssets() {
  return (
    <section id="assets" className="container space-y-16 py-24 md:py-32">
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Supported Digital Assets</h2>
        <p className="mt-4 text-muted-foreground sm:text-lg">
          Aevia supports a wide range of digital assets to ensure comprehensive protection of your blockchain wealth.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
        {assets.map((asset) => (
          <div key={asset.type} className="relative overflow-hidden rounded-lg border bg-background p-8">
            <div className="flex items-center gap-4">
              <asset.icon className="h-8 w-8" />
              <h3 className="font-bold">{asset.type}</h3>
            </div>
            <p className="mt-2 text-muted-foreground">{asset.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

