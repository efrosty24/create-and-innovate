import Image from "next/image";
import Header from "@/app/components/Header";

const PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0c0c0c] text-white">
        {/* Hero */}
        <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-14 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-[#ff6b35]">
            Embedded safety. Off-grid.
          </p>
          <h1 className="text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
            Prism
          </h1>
          <p className="mt-6 max-w-md text-lg text-zinc-400 sm:text-xl">
            Node-to-node messaging over LoRa. Discreet alerts. Safe proximity
            beacon. No names, no tracking—just your community.
          </p>
          <div className="mt-16 w-full max-w-2xl">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-900">
              <Image
                src={PRODUCT_IMAGE}
                alt="Prism device - wearable safety beacon"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
                priority
              />
            </div>
          </div>
        </section>

        {/* Features - MVP Core Three */}
        <section
          id="features"
          className="border-t border-white/5 py-24 px-6 md:py-32"
        >
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              The Core Three
            </h2>
            <p className="mt-4 text-zinc-400">
              First iteration: no AR, no complex haptics—just what matters.
            </p>
            <div className="mt-16 grid gap-12 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-left">
                <span className="text-2xl">📡</span>
                <h3 className="mt-4 text-xl font-semibold">
                  Node-to-Node Messaging
                </h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Send &quot;Check-in&quot; or &quot;SOS&quot; over LoRa (915MHz
                  US). No cell, no internet.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-left">
                <span className="text-2xl">🔘</span>
                <h3 className="mt-4 text-xl font-semibold">
                  Discreet Alerting
                </h3>
                <p className="mt-2 text-sm text-zinc-400">
                  One physical panic button. LED + vibration so only your
                  network knows.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-left">
                <span className="text-2xl">💡</span>
                <h3 className="mt-4 text-xl font-semibold">
                  Safe Proximity Beacon
                </h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Passive mode: blinks a specific color when another Prism is
                  within 100m.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Hardware BOM */}
        <section
          id="hardware"
          className="border-t border-white/5 py-24 px-6 md:py-32"
        >
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
              Hardware
            </h2>
            <p className="mt-4 text-center text-zinc-400">
              Built on the LilyGo T-Echo. Low power, sunlight-readable, always
              on.
            </p>
            <div className="mt-16 overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-4 font-medium">Component</th>
                    <th className="px-6 py-4 font-medium">Choice</th>
                    <th className="hidden px-6 py-4 font-medium sm:table-cell">
                      Why
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="px-6 py-4">MCU / Radio</td>
                    <td className="px-6 py-4">LilyGo T-Echo (nRF52840 + LoRa)</td>
                    <td className="hidden px-6 py-4 text-zinc-400 sm:table-cell">
                      Low power; integrated LoRa and Bluetooth.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">Display</td>
                    <td className="px-6 py-4">1.54&quot; E-Ink</td>
                    <td className="hidden px-6 py-4 text-zinc-400 sm:table-cell">
                      Sunlight readable, stays on when power is low.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">Power</td>
                    <td className="px-6 py-4">850mAh LiPo</td>
                    <td className="hidden px-6 py-4 text-zinc-400 sm:table-cell">
                      ~4–7 days always-on beaconing.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">Enclosure</td>
                    <td className="px-6 py-4">3D printed (TPU/PLA)</td>
                    <td className="hidden px-6 py-4 text-zinc-400 sm:table-cell">
                      Compact, rugged, clip to bag.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">Input</td>
                    <td className="px-6 py-4">BMM150 Magnetometer</td>
                    <td className="hidden px-6 py-4 text-zinc-400 sm:table-cell">
                      Tap or shake gestures to trigger alerts.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Trust Layer / Software */}
        <section className="border-t border-white/5 py-24 px-6 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              The Trust Layer
            </h2>
            <p className="mt-4 text-zinc-400">
              Custom Prism firmware on Meshtastic. Zero PII. Encrypted mesh.
            </p>
            <div className="mt-16 space-y-12 text-left">
              <div>
                <h3 className="text-lg font-semibold text-[#ff6b35]">
                  The &quot;Ghost&quot; Protocol
                </h3>
                <ul className="mt-4 space-y-2 text-zinc-400">
                  <li>
                    <strong className="text-white">Zero PII:</strong> No names
                    stored. 4-digit Short-ID from MAC.
                  </li>
                  <li>
                    <strong className="text-white">AES-256:</strong> All mesh
                    traffic encrypted. Share a &quot;Community Key&quot; via QR
                    to join.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Flow</h3>
                <ul className="mt-4 space-y-2 text-zinc-400">
                  <li>
                    <strong className="text-white">Idle:</strong> Listens for
                    LoRa. E-Ink shows &quot;Community Status&quot; (e.g. 3 Peers
                    Nearby).
                  </li>
                  <li>
                    <strong className="text-white">SOS:</strong> Double-tap side
                    button → broadcast [ID] [COORD] [STATUS: RED].
                  </li>
                  <li>
                    <strong className="text-white">Acknowledge:</strong> Other
                    devices vibrate and show a compass needle toward the user in
                    distress.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Security */}
        <section
          id="security"
          className="border-t border-white/5 py-24 px-6 md:py-32"
        >
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Security &amp; Risk Mitigation
            </h2>
            <p className="mt-4 text-zinc-400">
              For vulnerable communities. No tracking. You stay in control.
            </p>
            <div className="mt-16 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-left">
                <h3 className="text-lg font-semibold">Burn feature</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  A physical sequence wipes encryption keys and flash instantly.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-left">
                <h3 className="text-lg font-semibold">Frequency hopping</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  LoRa channels cycle to make it harder for scanners to sniff
                  community activity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/5 py-24 px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Create an account. Link your device.
            </h2>
            <p className="mt-4 text-zinc-400">
              Sign up to manage your Prism and connect with your community.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/sign-up"
                className="inline-flex items-center rounded-full bg-[#ff6b35] px-6 py-3 text-sm font-medium text-white hover:bg-[#e85a2a] hover:scale-[1.02] active:scale-[0.99] transition-all"
              >
                Sign Up
              </a>
              <a
                href="/sign-in"
                className="inline-flex items-center rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 hover:scale-[1.02] active:scale-[0.99] transition-all"
              >
                Sign In
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}