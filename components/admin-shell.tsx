"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Menu } from "lucide-react"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar mobile */}
        <header className="flex items-center gap-4 border-b border-border bg-card px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-1 text-muted-foreground hover:text-foreground"
            aria-label="Abrir menu"
          >
            <Menu className="size-5" />
          </button>
          <span className="font-heading font-bold text-foreground">Painel Admin</span>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
