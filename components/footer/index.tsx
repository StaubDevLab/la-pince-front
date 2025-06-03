'use client';

import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/la-pince-logo.png'; // Assurez-vous que ce chemin est correct
import {
    Facebook,
    Github,
    Instagram,
    Linkedin,
    Mail,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Footer() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // useEffect se lance uniquement côté client, après le montage.
    useEffect(() => {
        setMounted(true);
    }, []);

    // Ne pas rendre la partie dépendante du thème tant que le composant n'est pas monté côté client
    const currentThemeText = mounted ? (theme === 'dark' ? 'Dark' : 'Light') : '';
    // Ou, pour éviter un "saut" de contenu, vous pouvez rendre un placeholder ou la valeur par défaut du serveur
    // const currentThemeText = mounted ? (theme === 'dark' ? 'Dark' : 'Light') : 'Light'; // si 'light' est votre thème par défaut

    return (
        <footer className="bg-muted/50 text-muted-foreground border-t border-border">
            <div className="container mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {/* Logo + message */}
                <div className="col-span-1 flex flex-col gap-2">
                    {/* Assurez-vous que l'image logo est bien accessible à ce chemin */}
                    <Image src={logo} alt="Logo La Pince" width={50} height={50} priority={false} />
                    <p className="text-sm">
                        © {new Date().getFullYear()} La Pince™ – Fièrement codé par des étudiants de la promo Naga sous caféine ☕
                    </p>
                </div>

                {/* Liens de navigation */}
                <div>
                    <h3 className="font-semibold mb-2">Navigation</h3>
                    <ul className="space-y-1 text-sm">
                        <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                        <li><Link href="/transactions" className="hover:text-primary transition-colors">Transactions</Link></li>
                        {/* Ajoutez d'autres liens si nécessaire */}
                    </ul>
                </div>

                {/* Infos légales */}
                <div>
                    <h3 className="font-semibold mb-2">Infos légales</h3>
                    <ul className="space-y-1 text-sm">
                        <li><Link href="/mentions-legales" className="hover:text-primary transition-colors">Mentions légales</Link></li>
                        <li><Link href="/cgu" className="hover:text-primary transition-colors">Conditions d’utilisation</Link></li>
                        <li><Link href="/confidentialite" className="hover:text-primary transition-colors">Confidentialité</Link></li>
                        <li><a href="mailto:contact@la-pince.tech" className="hover:text-primary transition-colors">Contact</a></li>
                    </ul>
                </div>

                {/* Réseaux sociaux */}
                <div>
                    <h3 className="font-semibold mb-2">Suivez-nous</h3>
                    <div className="flex space-x-4">
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
            </div>

            {/* Bas de page */}
            <div className="border-t border-border mt-8 text-center text-xs py-4 text-muted-foreground">
                Fait avec ❤️ et NextJs – {mounted ? `Mode ${currentThemeText} activé !` : 'Chargement du thème...'}
            </div>
        </footer>
    );
}
