"use client";

import Link from "next/link";

const nav = [
  { href: "/dashboard", label: "Your Products", icon: "📦" },
  { href: "/dashboard/safe-space", label: "Safe Space", icon: "🏳️‍🌈" },
  { href: "/dashboard/preferences", label: "Preferences", icon: "⚙️" },
] as const;

type Props = {
  open: boolean;
  onClose: () => void;
  currentPath: string;
};

export default function DashboardSidebar({ open, onClose, currentPath }: Props) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[999] bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={`fixed left-0 top-14 z-[1000] h-[calc(100vh-3.5rem)] w-64 border-r border-white/10 bg-[#0c0c0c] transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col gap-1 p-4">
          <span className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
            Dashboard
          </span>
          {nav.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? currentPath === "/dashboard"
                : currentPath.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-[#ff6b35]/20 text-[#ff6b35]"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}

          <span className="mt-6 px-3 py-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
            Explore Productions
          </span>
          <div className="mt-1 rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff6b35]/20 text-lg">
                📻
              </div>
              <div className="min-w-0">
                <p className="font-medium text-white">Prism</p>
                <p className="text-xs text-zinc-500">Off-grid safety beacon</p>
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <Link
                href="/dashboard/product/prism"
                onClick={onClose}
                className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-center text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                View product
              </Link>
              <Link
                href="/dashboard/product/prism#waitlist"
                onClick={onClose}
                className="rounded-lg bg-[#ff6b35] px-3 py-2 text-center text-sm font-medium text-white hover:bg-[#e85a2a] hover:scale-[1.02] active:scale-[0.99] transition-all"
              >
                Sign up for waitlist
              </Link>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
