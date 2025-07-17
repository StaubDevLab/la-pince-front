"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  PiggyBank, 
  BarChart3, 
  Shield, 
  Smartphone, 
  Target, 
  Zap,
  TrendingUp,
  Bell,
  Lock
} from "lucide-react"

const features = [
  {
    icon: PiggyBank,
    title: "Gestion intuitive",
    description: "Interface simple et épurée pour gérer vos finances sans complexité. Ajoutez vos revenus et dépenses en quelques clics."
  },
  {
    icon: BarChart3,
    title: "Analyses détaillées",
    description: "Visualisez vos habitudes de dépenses avec des graphiques clairs et des rapports personnalisés."
  },
  {
    icon: Target,
    title: "Objectifs financiers",
    description: "Définissez et suivez vos objectifs d'épargne avec des outils motivants et des rappels intelligents."
  },
  {
    icon: Smartphone,
    title: "Accessible partout",
    description: "Application responsive qui s'adapte à tous vos appareils. Gérez vos finances où que vous soyez."
  },
  {
    icon: Shield,
    title: "Sécurité maximale",
    description: "Vos données sont protégées par un chiffrement de niveau bancaire. Nous ne stockons aucune information bancaire."
  },
  {
    icon: Zap,
    title: "Synchronisation temps réel",
    description: "Toutes vos données sont synchronisées instantanément entre tous vos appareils."
  },
  {
    icon: TrendingUp,
    title: "Prédictions intelligentes",
    description: "Anticipez vos dépenses futures grâce à nos algorithmes d'analyse prédictive."
  },
  {
    icon: Bell,
    title: "Notifications smart",
    description: "Recevez des alertes personnalisées pour rester dans votre budget et atteindre vos objectifs."
  },
  {
    icon: Lock,
    title: "Confidentialité",
    description: "Nous respectons votre vie privée. Vos données vous appartiennent et ne sont jamais vendues."
  }
]

export function FeaturesSection() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0')
            setVisibleCards(prev => [...prev, index])
          }
        })
      },
      { threshold: 0.1 }
    )

    const cards = document.querySelectorAll('.feature-card')
    cards.forEach(card => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <section id="features" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Fonctionnalités <span className="text-gradient">puissantes</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez tous les outils dont vous avez besoin pour transformer 
            votre relation avec l'argent
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isVisible = visibleCards.includes(index)
            
            return (
              <Card 
                key={index}
                data-index={index}
                className={`feature-card group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md ${
                  isVisible ? "animate-slide-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}