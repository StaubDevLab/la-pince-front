'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'
export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const showHeader = pathname !== '/connexion' && pathname !== '/inscription' && pathname !== '/reset-password' && pathname !== '/mentions-legales' && pathname !== '/forgot-password'
    const showFooter = pathname !== '/connexion' && pathname !== '/inscription' && pathname !== '/reset-password' && pathname !== '/mentions-legales' && pathname !== '/forgot-password'
 
    return (
        <main className={"flex min-h-screen flex-col"}>
            {showHeader && <Header />}
            {children}
            {showFooter && <Footer />}
        </main>
    )
}
