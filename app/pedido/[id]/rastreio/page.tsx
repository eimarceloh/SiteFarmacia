import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { OrderTracking } from "@/components/order-tracking"
import { ORDERS, getOrderById } from "@/lib/orders"

export function generateStaticParams() {
  return ORDERS.map((o) => ({ id: o.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = getOrderById(id)
  if (!order) return {}
  return { title: `Rastreio ${order.id} | Farmácia do Povo` }
}

export default async function RastreioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = getOrderById(id)
  if (!order) notFound()

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <OrderTracking order={order} />
      <SiteFooter />
    </main>
  )
}
