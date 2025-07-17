"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Star, Users, TrendingUp, Play } from "lucide-react"
import Link from "next/link"
import Image from "next/image" // Assurez-vous que cette importation est correcte

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-bg opacity-10" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-chart-1/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-chart-5/20 rounded-full blur-xl animate-pulse" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10 ">
        <div className="max-w-7xl mx-auto">
          {/* Centering the grid content vertically and horizontally */}
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
            {/* Content */}
            <div className={`space-y-8 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Star className="h-4 w-4" />
                <span>Nouvelle génération de gestion budgétaire</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Reprenez le contrôle de vos{" "}
                <span className="text-gradient">finances</span>
              </h1>

              {/* Description */}
              <p className="text-xl text-muted-foreground leading-relaxed">
                La Pince révolutionne la gestion budgétaire avec une approche simple,
                intuitive et accessible à tous. Suivez vos dépenses, gérez vos budgets
                et atteignez vos objectifs financiers en toute simplicité.
              </p>

              {/* Stats */}
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-medium">10k+ utilisateurs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span className="font-medium">98% satisfaction</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-primary" />
                  <span className="font-medium">4.9/5 étoiles</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-medium"
                >
                  <Link href="/app/inscription">Commencer</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg font-medium"
                  disabled
                >
                  <Play className="h-5 w-5 mr-2" />
                  Voir la démo
                </Button>
              </div>
            </div>

            {/* Visual - Optimized for responsive image loading */}
            <div className={`relative flex justify-center items-center ${isVisible ? "animate-bounce-in" : "opacity-0"} lg:min-h-[500px]`}>
              {/* Container for the image, ensuring it's centered and has an aspect ratio */}
              <div className="relative w-full max-w-lg mx-auto aspect-video md:aspect-square">
                <Image
                  src="/hero-img.png"
                  alt="Illustration de l'application La Pince montrant la gestion budgétaire sur différents appareils."
                  fill // L'image remplira le conteneur parent
                  style={{ objectFit: 'contain' }} // Assure que l'image est contenue dans ses dimensions sans être coupée
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw" // Définit les tailles pour le chargement réactif
                  priority // Charge l'image avec une haute priorité pour éviter le lazy loading initial
                  className="rounded-xl opacity-90 shadow-2xl border-0" // Conserve les classes existantes
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
