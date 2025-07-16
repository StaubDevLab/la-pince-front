"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const router = useRouter()

  const hideHeaderFooterPages = [
    "/connexion",
    "/inscription",
    "/reset-password",
    "/mentions-legales",
    "/forgot-password",
    "/configuration-profil",
  ]

  const showHeader = !hideHeaderFooterPages.includes(pathname)
  const showFooter = !hideHeaderFooterPages.includes(pathname)
  useEffect(() => {
    if (status === "authenticated" && session?.user?.firstLogin && pathname !== "/configuration-profil") {
      router.push("/configuration-profil")
    }
  }, [session, status, router, pathname])

  if (status === "loading") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="mt-4 text-gray-600">Chargement...</p>
      </main>
    )
  }

  if (status === "authenticated" && session?.user?.firstLogin && pathname !== "/configuration-profil") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Redirection en cours...</h2>
          <p className="text-gray-600">Configuration de votre profil</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col">
      {showHeader && <Header />}
      {children}
      {showFooter && <Footer />}
    </main>
  )
}
