"use client"

import { Zap, Mail, Phone, MapPin, Github, Twitter, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"
import logo from '@/public/la-pince-logo.png';

export function Footer() {
    return (
        <footer className="bg-card border-t border-border">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full">
                                <Image src={logo} alt="logo" height={100} width={75} />
                            </div>
                            <span className="text-lg font-bold text-gradient">La Pince</span>
                        </div>
                        <p className="text-muted-foreground">
                            La nouvelle génération de gestion budgétaire. Simple, intuitive
                            et accessible à tous.
                        </p>
                        <div className="flex space-x-2">
                            <Button variant="outline" size="icon" className="h-8 w-8">
                                <Twitter className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                                <Linkedin className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                                <Github className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Product */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Produit</h3>
                        <nav className="flex flex-col space-y-2">
                            <Link href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                                Fonctionnalités
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                Tarification
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                Sécurité
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                Mises à jour
                            </Link>
                        </nav>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Support</h3>
                        <nav className="flex flex-col space-y-2">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                Centre d'aide
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                Documentation
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                Tutoriels
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                Contact
                            </a>
                        </nav>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Contact</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2 text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span>contact@la-pince.tech</span>
                            </div>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                <span>+33 1 23 45 67 89</span>
                            </div>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>La Pince, France</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="text-muted-foreground text-sm">

                        © {new Date().getFullYear()} La Pince™

                    </div>
                    <div className="flex space-x-6 text-sm">
                        <Link href="/app/mentions-legales" className="text-muted-foreground hover:text-primary transition-colors">
                            Mentions légales
                        </Link>
                        <Link href="/app/mentions-legales" className="text-muted-foreground hover:text-primary transition-colors">
                            Politique de confidentialité
                        </Link>
                        <Link href="/app/mentions-legales" className="text-muted-foreground hover:text-primary transition-colors">
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}