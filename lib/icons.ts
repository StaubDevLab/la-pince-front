
import {
    Home,
    Book,
    Music,
    Heart, Apple, BadgeEuro,Car, Shirt
} from 'lucide-react'

export const categoryIconMap: Record<string, React.ElementType> = {
    "maison": Home,
    "alimentation": Apple,
    "loisirs": Book,
    "santé": Heart,
    "abonnements": Music,
    "salaire": BadgeEuro,
    "default": Home,
    "transport": Car,
    "vêtements":Shirt

};
