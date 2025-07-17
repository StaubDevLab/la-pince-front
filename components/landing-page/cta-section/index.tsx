"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CheckCircle, Mail, ArrowRight } from "lucide-react"

export function CTASection() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 }
    )

    const section = document.querySelector('#cta-section')
    if (section) observer.observe(section)

    return () => observer.disconnect()
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail("")
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <section id="cta-section" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <Card className={`max-w-4xl mx-auto border-0 shadow-2xl bg-gradient-to-br from-primary/5 to-chart-1/5 ${
          isVisible ? "animate-bounce-in" : "opacity-0"
        }`}>
          <CardContent className="p-12 text-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Prêt à reprendre le contrôle de vos{" "}
                  <span className="text-gradient">finances</span> ?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Rejoignez plus de 10 000 utilisateurs qui ont déjà transformé 
                  leur gestion budgétaire avec La Pince
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-medium group"
                >
                  S&apos;inscrire maintenant
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 py-6 text-lg font-medium"
                  disabled
                >
                  Voir le tutoriel
                </Button>
              </div>

              <div className="pt-8 border-t border-border">
                <p className="text-muted-foreground mb-4">
                  Ou restez informé de nos dernières fonctionnalités (désactivé temporairement)
                </p>
                
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      disabled
                      required
                    />
                  </div>
                  <Button type="submit" disabled className="bg-primary hover:bg-primary/90">
                    {isSubscribed ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Inscrit !
                      </>
                    ) : (
                      "S'inscrire"
                    )}
                  </Button>
                </form>
              </div>

              <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>100% gratuit</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Aucune carte requise</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Annulation facile</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}