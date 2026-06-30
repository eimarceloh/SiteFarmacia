import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans, Geist_Mono } from 'next/font/google'
import { CartProvider } from '@/components/cart-provider'
import { CartDrawer } from '@/components/cart-drawer'
import { ProductsInventoryProvider } from '@/components/products-inventory-provider'
import { AuthProvider } from '@/components/auth-provider'
import { PermissoesProvider } from '@/components/permissoes-provider'
import './globals.css'

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] })
const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
})
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Farmácia do Povo | Farmácia de Manipulação',
  description:
    'Fórmulas manipuladas sob medida para emagrecimento, desempenho, saúde, queda capilar e beleza. Qualidade farmacêutica, registro ANVISA e entrega para todo o Brasil.',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#B73336',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`light ${inter.variable} ${jakarta.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <AuthProvider>
          <PermissoesProvider>
            <ProductsInventoryProvider>
              <CartProvider>
                {children}
                <CartDrawer />
              </CartProvider>
            </ProductsInventoryProvider>
          </PermissoesProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
