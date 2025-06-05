'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import Header from '@/components/header'
import { useSession } from 'next-auth/react'
import Footer from '@/components/footer'
import { getProfile } from '@/actions/profile.actions'
import { useUser } from "@/context/user-context"


export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const showHeader = pathname !== '/connexion' && pathname !== '/inscription'
    const showFooter = pathname !== '/connexion' && pathname !== '/inscription'
 
    return (
        <main className={"flex min-h-screen flex-col"}>
            {showHeader && <Header />}
            {children}
            {showFooter && <Footer />}
        </main>
    )
}
