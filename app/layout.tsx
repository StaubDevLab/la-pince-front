import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from '@/components/client-layout'

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'La Pince',
    description: 'Application de gestion de budget',
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="fr">
        <body className={`${inter.variable} antialiased dark`}>
        <ClientLayout>
            {children}
        </ClientLayout>
        </body>

        </html>
    )
}
