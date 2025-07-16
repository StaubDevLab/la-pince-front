'use client';

import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/la-pince-logo.png';
import { Github, Linkedin, Instagram, Mail } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Footer() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const currentThemeText = mounted ? (theme === 'dark' ? 'Dark' : 'Light') : '';

    return (
        <footer className="bg-muted/50 text-muted-foreground border-t border-border">
            <div className="container mx-auto px-2 py-2 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Logo + message */}
                <div className="flex items-center gap-3">
                    <Image src={logo} alt="Logo La Pince" width={36} height={36} priority={false} />
                    <span className="text-xs font-medium">
                        © {new Date().getFullYear()} La Pince™
                    </span>
                </div>

                {/* Liens principaux */}
                <nav className="flex gap-4 text-sm" aria-label="Liens principaux">
                    <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
                    <Link href="/transactions" className="hover:text-primary transition-colors">Transactions</Link>
                    <Link href="/mentions-legales" className="hover:text-primary transition-colors">Mentions légales</Link>
                </nav>

                {/* Réseaux sociaux */}
                <div className="flex gap-3">
                    <Link href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <Github className="h-5 w-5 hover:text-primary transition-colors" />
                    </Link>
                    <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <Linkedin className="h-5 w-5 hover:text-primary transition-colors" />
                    </Link>
                    <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <Instagram className="h-5 w-5 hover:text-primary transition-colors" />
                    </Link>
                    <Link href="mailto:contact@la-pince.tech" aria-label="Email">
                        <Mail className="h-5 w-5 hover:text-primary transition-colors" />
                    </Link>
                </div>
            </div>
            <div className="text-center text-xs py-2 text-muted-foreground" aria-live="polite">
                Fait avec ❤️ et NextJs – {mounted ? `Mode ${currentThemeText} activé !` : 'Chargement du thème...'}
            </div>
        </footer>
    );
}
