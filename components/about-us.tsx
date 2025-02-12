import Image from "next/image"
import Link from "next/link"

export default function AboutUs() {
  const team = [
    {
      name: "Federico Filippello",
      role: "CEO & Co-founder",
      linkedin: "https://www.linkedin.com/in/federico-filippello-43a83028/",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/federico-vgRyOLxsBVjTWuqsa7coIPJq7NZYr6.jpeg",
    },
    {
      name: "Sebastián Camacho",
      role: "CTO & Co-founder",
      linkedin: "https://www.linkedin.com/in/sebastiancamacho/",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sebastian-TdHNF3ms1JP6uDKoARxmbsPYjH8C3B.jpeg",
    },
  ]

  return (
    <section id="about" className="container py-24 md:py-32">
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl mb-8">About Us</h2>
        <p className="text-muted-foreground sm:text-lg mb-16">
          Aevia was founded by a dedicated team of two visionaries who recognized the need for secure digital asset
          inheritance in the blockchain era. Our mission is to provide peace of mind to cryptocurrency and NFT holders
          by ensuring their digital wealth reaches its intended beneficiaries.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {team.map((member) => (
            <Link
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              key={member.name}
              className="group relative overflow-hidden rounded-lg border bg-background p-8 transition-colors hover:bg-accent"
            >
              <div className="flex flex-col items-center">
                <div className="relative size-32 overflow-hidden rounded-full mb-4">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

