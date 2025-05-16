
import {
    Home,
    Book,
    Music,
    Heart, Apple, BadgeEuro,
} from 'lucide-react'

export const categoryIconMap: Record<string, React.ElementType> = {
    "maison": Home,
    "alimentation": Apple,
    "loisirs": Book,
    "santé": Heart,
    "abonnements": Music,
    "salaire": BadgeEuro,
    "default": Home,

};
