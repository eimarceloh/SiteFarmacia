"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogoIcon } from "@/components/logo"
import { LayoutDashboard, ShoppingBag, Package, LogOut, X, Users } from "lucide-react"

const NAV_BASE = [
  { href: "/admin",         label: "Dashboard",  icon: LayoutDashboard },
  { href: "/admin/produtos",label: "Produtos",    icon: Package         },
  { href: "/admin/pedidos", label: "Pedidos",     icon: ShoppingBag     },
]

const NAV_ADMIN = [
  { href: "/admin/equipe",  label: "Equipe",      icon: Users           },
]

export function AdminSidebar({
  open,
  onClose,
  ehAdmin,
}: {
  open: boolean
  onClose: () => void
  ehAdmin?: boolean
}) {
  const pathname = usePathname()

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-60 flex-col border-r border-border bg-card transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <Link href="/" className="flex items-center gap-2">
            <LogoIcon className="size-8 shrink-0" />
            <span className="font-heading text-sm font-extrabold leading-tight text-foreground">
              Admin
            </span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {[...NAV_BASE, ...(ehAdmin ? NAV_ADMIN : [])].map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border px-3 py-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="size-4 shrink-0" />
            Voltar à loja
          </Link>
        </div>
      </aside>
    </>
  )
}
