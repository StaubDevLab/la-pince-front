'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import Header from '@/components/header'
import { useSession } from 'next-auth/react'


export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const showHeader = pathname !== '/connexion' && pathname !== '/inscription'
    const { data: session } = useSession()
    return (
        <>
            {showHeader && <Header name={session?.user?.firstName || "Invité"} />}
            {children}
        </>
    )
}
