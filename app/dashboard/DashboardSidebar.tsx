"use client";

import Link from "next/link";
import { FiPackage, FiMapPin, FiSettings, FiRadio, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const nav = [
  { href: "/dashboard", label: "Your Products", Icon: FiPackage },
  { href: "/dashboard/safe-space", label: "Safe Space", Icon: FiMapPin },
  { href: "/dashboard/preferences", label: "Preferences", Icon: FiSettings },
] as const;

type Props = {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  currentPath: string;
};

export default function DashboardSidebar({ open, onClose, collapsed, onCollapsedChange, currentPath }: Props) {
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
        className={`fixed left-0 top-14 z-[1000] h-[calc(100vh-3.5rem)] border-r border-white/10 bg-[#0c0c0c] transition-[width,transform] duration-200 lg:sticky lg:top-14 lg:z-auto lg:translate-x-0 lg:self-start lg:h-[calc(100vh-3.5rem)] flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full"
        } w-64 ${collapsed ? "lg:w-[4.25rem]" : ""}`}
      >
        <nav className="flex flex-col gap-1 p-4 flex-1 min-w-0">
          {!collapsed && (
            <span className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
              Dashboard
            </span>
          )}
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
                title={collapsed ? item.label : undefined}
                className={`flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  collapsed ? "justify-center lg:justify-center" : "gap-3"
                } ${
                  isActive
                    ? "bg-[#ff6b35]/20 text-[#ff6b35]"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.Icon className="h-5 w-5 shrink-0" aria-hidden />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}

          {!collapsed && (
            <>
              <span className="mt-6 px-3 py-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
                Explore Productions
              </span>
              <div className="mt-1 rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff6b35]/20">
                    <FiRadio className="h-5 w-5 text-[#ff6b35]" aria-hidden />
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
            </>
          )}

          {collapsed && (
            <div className="mt-4 flex justify-center">
              <Link
                href="/dashboard/product/prism"
                onClick={onClose}
                title="Prism"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff6b35]/20 text-[#ff6b35] hover:bg-[#ff6b35]/30 transition-colors"
              >
                <FiRadio className="h-5 w-5" aria-hidden />
              </Link>
            </div>
          )}
        </nav>

        {/* Collapse / expand toggle — desktop only */}
        <div className="hidden lg:block border-t border-white/10 p-2">
          <button
            type="button"
            onClick={() => onCollapsedChange(!collapsed)}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <FiChevronRight className="h-5 w-5" />
            ) : (
              <>
                <FiChevronLeft className="h-5 w-5" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
