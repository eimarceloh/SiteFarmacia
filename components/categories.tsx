import Link from "next/link"
import {
  Flame, Dumbbell, Heart, Sparkles, Zap, Star,
} from "lucide-react"
import { cn } from "@/lib/utils"

const categories = [
  { label: "Emagrecimento", slug: "emagrecimento", icon: Flame },
  { label: "Desempenho",    slug: "desempenho",    icon: Dumbbell },
  { label: "Saúde",         slug: "saude",         icon: Heart },
  { label: "Queda Capilar", slug: "queda-capilar", icon: Star },
  { label: "Libido",        slug: "libido",        icon: Zap },
  { label: "Beleza",        slug: "beleza",        icon: Sparkles },
]

export function Categories() {
  return (
    <nav
      aria-label="Categorias de produtos"
      className="border-b border-border bg-background"
    >
      <div className="mx-auto max-w-6xl px-4">
        <ul className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]">
          {categories.map(({ label, slug, icon: Icon }) => (
            <li key={slug} className="shrink-0">
              <Link
                href={`/categoria/${slug}`}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border border-border px-4 py-2",
                  "text-sm font-medium text-foreground/70 transition-all",
                  "hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
