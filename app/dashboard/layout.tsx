import React from 'react'
import Header from '@/components/header'

export default function DashboardLayout({children}: {children: React.ReactNode}) {
    return (
        <main className="min-h-screen bg-background p-12 font-inter">
            <Header name={"Bob L'éponge 🧽"}/>
            {children}
        </main>
    )
}

