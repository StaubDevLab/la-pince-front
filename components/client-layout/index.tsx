'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import Header from '@/components/header'


export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const showHeader = pathname !== '/connexion' && pathname !== '/inscription'

    return (
        <>
            {showHeader && <Header name={"Bob L'éponge 🧽"}/>}
            {children}
        </>
    )
}
