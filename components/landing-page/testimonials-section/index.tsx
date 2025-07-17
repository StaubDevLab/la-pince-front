"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Marie Dubois",
    role: "Freelance Designer",
    avatar: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400",
    content: "La Pince a complètement transformé ma gestion financière. Interface intuitive et fonctionnalités parfaites pour un freelance.",
    rating: 5
  },
  {
    name: "Thomas Martin",
    role: "Étudiant",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
    content: "Enfin une app qui comprend les besoins d'un étudiant ! Simple, efficace et gratuite. Je recommande à tous mes amis.",
    rating: 5
  },
  {
    name: "Sophie Laurent",
    role: "Mère de famille",
    avatar: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400",
    content: "Gérer le budget familial n'a jamais été aussi simple. Les objectifs d'épargne nous motivent vraiment à économiser.",
    rating: 5
  },
  {
    name: "Alexandre Chen",
    role: "Développeur",
    avatar: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400",
    content: "L'interface est magnifique et les fonctionnalités sont exactement ce dont j'avais besoin. Bravo à l'équipe !",
    rating: 5
  },
  {
    name: "Emma Rodriguez",
    role: "Consultante",
    avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
    content: "Les analyses sont très détaillées et m'aident à prendre de meilleures décisions financières. Application indispensable.",
    rating: 5
  },
  {
    name: "Lucas Petit",
    role: "Entrepreneur",
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
    content: "Perfect pour suivre mes dépenses professionnelles et personnelles. La synchronisation multi-appareils est parfaite.",
    rating: 5
  }
]

export function TestimonialsSection() {
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

    const cards = document.querySelectorAll('.testimonial-card')
    cards.forEach(card => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ils nous font <span className="text-gradient">confiance</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez ce que nos utilisateurs pensent de La Pince
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => {
            const isVisible = visibleCards.includes(index)
            
            return (
              <Card 
                key={index}
                data-index={index}
                className={`testimonial-card group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md ${
                  isVisible ? "animate-slide-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    &quot;{testimonial.content}&quot;
                  </p>
                  
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}