import { FiWifi, FiCircle, FiZap } from "react-icons/fi";

export default function PrismProductContent() {
  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Core Three */}
      <section>
        <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
          The Core Three
        </h2>
        <p className="mt-2 text-zinc-400 sm:mt-3">
          First iteration: no AR, no complex haptics—just what matters.
        </p>
        <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-3 sm:gap-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:rounded-2xl sm:p-6">
            <FiWifi className="h-8 w-8 text-[#ff6b35]" aria-hidden />
            <h3 className="mt-3 text-lg font-semibold text-white sm:text-xl">
              Node-to-Node Messaging
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              Send &quot;Check-in&quot; or &quot;SOS&quot; over LoRa (915MHz US). No cell, no internet.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:rounded-2xl sm:p-6">
            <FiCircle className="h-8 w-8 text-[#ff6b35]" aria-hidden />
            <h3 className="mt-3 text-lg font-semibold text-white sm:text-xl">
              Discreet Alerting
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              One physical panic button. LED + vibration so only your network knows.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:rounded-2xl sm:p-6">
            <FiZap className="h-8 w-8 text-[#ff6b35]" aria-hidden />
            <h3 className="mt-3 text-lg font-semibold text-white sm:text-xl">
              Safe Proximity Beacon
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              Passive mode: blinks a specific color when another Prism is within 100m.
            </p>
          </div>
        </div>
      </section>

      {/* Hardware */}
      <section>
        <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
          Hardware
        </h2>
        <p className="mt-2 text-zinc-400 sm:mt-3">
          Built on the LilyGo T-Echo. Low power, sunlight-readable, always on.
        </p>
        <div className="mt-6 overflow-x-auto sm:mt-8">
          <div className="min-w-[320px] overflow-hidden rounded-xl border border-white/10 sm:rounded-2xl">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-3 py-3 font-medium sm:px-6 sm:py-4">Component</th>
                  <th className="px-3 py-3 font-medium sm:px-6 sm:py-4">Choice</th>
                  <th className="hidden px-6 py-4 font-medium sm:table-cell">Why</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="px-3 py-3 sm:px-6 sm:py-4">MCU / Radio</td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4">LilyGo T-Echo (nRF52840 + LoRa)</td>
                  <td className="hidden px-6 py-4 text-zinc-400 sm:table-cell">
                    Low power; integrated LoRa and Bluetooth.
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-3 sm:px-6 sm:py-4">Display</td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4">1.54&quot; E-Ink</td>
                  <td className="hidden px-6 py-4 text-zinc-400 sm:table-cell">
                    Sunlight readable, stays on when power is low.
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-3 sm:px-6 sm:py-4">Power</td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4">850mAh LiPo</td>
                  <td className="hidden px-6 py-4 text-zinc-400 sm:table-cell">
                    ~4–7 days always-on beaconing.
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-3 sm:px-6 sm:py-4">Enclosure</td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4">3D printed (TPU/PLA)</td>
                  <td className="hidden px-6 py-4 text-zinc-400 sm:table-cell">
                    Compact, rugged, clip to bag.
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-3 sm:px-6 sm:py-4">Input</td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4">BMM150 Magnetometer</td>
                  <td className="hidden px-6 py-4 text-zinc-400 sm:table-cell">
                    Tap or shake gestures to trigger alerts.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Trust Layer */}
      <section>
        <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
          The Trust Layer
        </h2>
        <p className="mt-2 text-zinc-400 sm:mt-3">
          Custom Prism firmware on Meshtastic. Zero PII. Encrypted mesh.
        </p>
        <div className="mt-6 space-y-6 sm:mt-8 sm:space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-[#ff6b35]">The &quot;Ghost&quot; Protocol</h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-400 sm:mt-4">
              <li>
                <strong className="text-white">Zero PII:</strong> No names stored. 4-digit Short-ID from MAC.
              </li>
              <li>
                <strong className="text-white">AES-256:</strong> All mesh traffic encrypted. Share a &quot;Community Key&quot; via QR to join.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Flow</h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-400 sm:mt-4">
              <li>
                <strong className="text-white">Idle:</strong> Listens for LoRa. E-Ink shows &quot;Community Status&quot; (e.g. 3 Peers Nearby).
              </li>
              <li>
                <strong className="text-white">SOS:</strong> Double-tap side button → broadcast [ID] [COORD] [STATUS: RED].
              </li>
              <li>
                <strong className="text-white">Acknowledge:</strong> Other devices vibrate and show a compass needle toward the user in distress.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Security */}
      <section>
        <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
          Security &amp; Risk Mitigation
        </h2>
        <p className="mt-2 text-zinc-400 sm:mt-3">
          For vulnerable communities. No tracking. You stay in control.
        </p>
        <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:rounded-2xl sm:p-6">
            <h3 className="text-lg font-semibold text-white">Burn feature</h3>
            <p className="mt-2 text-sm text-zinc-400">
              A physical sequence wipes encryption keys and flash instantly.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:rounded-2xl sm:p-6">
            <h3 className="text-lg font-semibold text-white">Frequency hopping</h3>
            <p className="mt-2 text-sm text-zinc-400">
              LoRa channels cycle to make it harder for scanners to sniff community activity.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
