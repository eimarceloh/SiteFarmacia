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

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <Hero />
      <TrustBar />
      <Categories />
      <FeaturedProducts />
      <HowItWorks />
      <QualitySection />
      <Testimonials />
      <CtaNewsletter />
      <SiteFooter />
    </main>
  )
}
