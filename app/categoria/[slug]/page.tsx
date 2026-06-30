import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CategoryProducts } from "@/components/category-products"
import { getCategoryBySlug, categories } from "@/lib/categories"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return {}
  return {
    title: `${category.title} | Farmácia do Povo`,
    description: category.longDesc,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="bg-primary py-12 text-primary-foreground md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <nav className="mb-4 flex items-center gap-1.5 text-sm text-primary-foreground/70">
            <Link href="/" className="hover:text-primary-foreground">Início</Link>
            <ChevronRight className="size-4" />
            <span className="text-primary-foreground">{category.title}</span>
          </nav>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight md:text-5xl">
            {category.title}
          </h1>
          <p className="mt-3 max-w-xl text-pretty text-primary-foreground/80 md:text-lg">
            {category.longDesc}
          </p>
        </div>
      </section>

      <CategoryProducts slug={slug} categoryTitle={category.title} />

      <SiteFooter />
    </main>
  )
}
