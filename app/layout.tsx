import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from '@/components/client-layout'
import { ThemeProvider } from '@/components/theme-provider'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from "@/components/ui/sonner"
import { UserProvider } from '@/context/user-context'

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
        <html lang="fr" suppressHydrationWarning>
        <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SessionProvider>
               <UserProvider>
                <ClientLayout>
                     
                    {children}
                    
                    <Toaster toastOptions={{
                        unstyled: true,
                        classNames: {
                            success: 'bg-green-50 text-green-700 border-green-200 p-4 rounded-lg',
                            error: 'bg-red-50 text-red-700 border-red-200 p-4 rounded-lg',
                            warning: 'bg-amber-50 text-amber-700 border-amber-200 p-4 rounded-lg',
                        },
                    }}/>

                </ClientLayout>
                </UserProvider>
            </SessionProvider>
        </ThemeProvider>
        </body>

        </html>
    )
}
