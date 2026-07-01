import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { TrustBar } from "@/components/trust-bar"
import { Categories } from "@/components/categories"
import { FeaturedProducts } from "@/components/featured-products"
import { HowItWorks } from "@/components/how-it-works"
import { QualitySection } from "@/components/quality-section"
import { Testimonials } from "@/components/testimonials"
import { CtaNewsletter } from "@/components/cta-newsletter"
import { SiteFooter } from "@/components/site-footer"
import { createClient } from "@/lib/supabase/server"
import { getProducts, adaptDbProduct } from "@/lib/supabase/queries/products"
import type { Product } from "@/lib/products"

export const dynamic = "force-dynamic"

export default async function Page() {
  let dbProducts: Product[] | undefined

  try {
    const supabase = await createClient()
    const rows = await getProducts(supabase)
    dbProducts = rows.map(adaptDbProduct)
  } catch {
    // Se Supabase falhar, usa os produtos estáticos como fallback
  }

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <Hero />
      <TrustBar />
      <Categories />
      <FeaturedProducts dbProducts={dbProducts} />
      <HowItWorks />
      <QualitySection />
      <Testimonials />
      <CtaNewsletter />
      <SiteFooter />
    </main>
  )
}
