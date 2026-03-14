"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import DashboardSidebar from "@/app/dashboard/DashboardSidebar";
import Header from "@/app/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isLoading && !user) {
    router.replace("/sign-in");
    return null;
  }

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-[#0c0c0c] pt-14">
        <DashboardSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentPath={pathname}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            className="fixed left-3 top-20 z-30 flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 hover:scale-105 active:scale-95 transition-transform lg:hidden"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? "←" : "→"}
          </button>
          <main className="flex-1 p-4 sm:p-6 lg:pl-8">{children}</main>
        </div>
      </div>
    </>
  );
}
