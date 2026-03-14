import Image from "next/image";
import Link from "next/link";
import PrismProductContent from "./PrismProductContent";
import PrismWaitlist from "./PrismWaitlist";

const GALLERY_IMAGES = [
  {
    src: "/design.png",
    alt: "Prism microcontroller design",
  },
  {
    src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    alt: "Prism device - wearable safety beacon",
  },
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    alt: "Prism device - compact design",
  },
  {
    src: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80",
    alt: "Prism device - off-grid connectivity",
  },
];

export default function PrismProductPage() {
  return (
    <div className="mx-auto max-w-4xl min-w-0">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-6"
      >
        ← Back to Dashboard
      </Link>

      <header className="mb-8 sm:mb-12">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#ff6b35] sm:text-sm sm:tracking-[0.3em]">
          Embedded safety. Off-grid.
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          Prism
        </h1>
        <p className="mt-4 max-w-2xl text-base text-zinc-400 sm:text-lg">
          Node-to-node messaging over LoRa. Discreet alerts. Safe proximity
          beacon. No names, no tracking—just your community.
        </p>
      </header>

      {/* Gallery */}
      <section className="mb-10 sm:mb-14">
        <h2 className="text-lg font-medium text-white mb-4">Gallery</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {GALLERY_IMAGES.map((img, i) => (
            <div
              key={i}
              className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-zinc-900 sm:rounded-2xl"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Description + landing-page info (Core Three, Hardware, Trust Layer, Security) */}
      <PrismProductContent />

      {/* Waitlist */}
      <section id="waitlist" className="mt-12 sm:mt-16 scroll-mt-24">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:rounded-2xl sm:p-8">
          <h2 className="text-xl font-semibold text-white sm:text-2xl">
            Join the waitlist
          </h2>
          <p className="mt-2 text-sm text-zinc-400 sm:mt-3">
            Be the first to know when Prism is available. No spam.
          </p>
          <PrismWaitlist />
        </div>
      </section>
    </div>
  );
}
