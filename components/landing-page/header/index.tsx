"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { SwitchTheme } from "@/components/switch-theme"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useSession } from "next-auth/react"
import { DropdownMenuGroup, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
    )}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full">
              <Image src="/la-pince-logo.png" alt="logo" height={100} width={75} />
            </div>
            <span className="text-xl font-bold text-gradient">La Pince</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="#features" className="text-foreground hover:text-primary transition-colors">
              Fonctionnalités
            </Link>
            <Link href="#testimonials" className="text-foreground hover:text-primary transition-colors">
              Témoignages
            </Link>
            <Link href="#contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
          <SwitchTheme />
          {session?.user ? (
            <>
            <Button variant="outline">
              <Link href="/app/dashboard">Dashboard</Link>
            </Button>
             
            </>
          ) : (
            <>  
            <Button variant="outline">
              <Link href="/app/connexion">Connexion</Link>
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Link href="/app/inscription">S&apos;inscrire</Link>
            </Button>
            </>
                  )}
          </div>
          {/* Mobile Actions */}
          <div className="lg:hidden flex justify-end items-end space-x-4">
          {session?.user ? (
            <>
            <Button variant="outline">
              <Link href="/app/dashboard">Dashboard</Link>
            </Button>
             
            </>
          ) : (
            <>  
           
            <Button className="bg-primary hover:bg-primary/90">
              <Link href="/app/inscription">S&apos;inscrire</Link>
            </Button>
            </>
                  )}
         

          {/* Mobile Menu Button */}
          <SwitchTheme />
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                <span className="sr-only">Menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>

                <DropdownMenuItem>
                <Link href="/app/connexion">Connexion</Link>
                </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator/>
                <DropdownMenuGroup>
               
                <DropdownMenuItem>
                <Link href="#features">Fonctionnalités</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                <Link href="#testimonials">Témoignages</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                <Link href="#contact">Contact</Link>
                </DropdownMenuItem>
                </DropdownMenuGroup>
                </DropdownMenuContent>
                </DropdownMenu>
          
            </div>
        </div>
      </div>
    </header>
  )
}