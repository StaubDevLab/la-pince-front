import { categoryIconMap } from '@/lib/icons'

type Category = {
    name: string
    displayName?:boolean
    iconSize?: number
}

export const CategoryItem = ({ category }: { category: Category }) => {
    const Icon = categoryIconMap[category.name.toLowerCase()] || categoryIconMap['default']
    const displayName = category.displayName !== undefined ? category.displayName : true
    if (!displayName) {
        return (
            <div className="flex items-center justify-center">
                {Icon && <Icon size={category.iconSize ? category.iconSize : 20} />}
            </div>
        )
    }
    return (
        <div className="flex items-center gap-2">
            {Icon && <Icon size={category.iconSize ? category.iconSize : 20} />}
            <span>{category.name}</span>
        </div>
    )
}
