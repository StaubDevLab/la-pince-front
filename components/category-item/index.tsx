import { categoryIconMap } from '@/lib/icons'
import { getLucideIcons } from '@/lib/utils'
import { LucideProps } from 'lucide-react'

type Category = {
  name: string
  displayName?: boolean
  iconSize?: number
}

type Props = {
  category: Category
  iconName?: string
}

const lucideIconList = getLucideIcons()
const Icons: Record<string, React.ComponentType<LucideProps>> = Object.fromEntries(
  lucideIconList.map(({ name, component }) => [name, component])
)

export const CategoryItem = ({ category, iconName }: Props) => {
  const { name, displayName = true, iconSize = 20 } = category

  const maybeLucideIcon = iconName ? Icons[iconName] : undefined
  const LucideIcon = maybeLucideIcon

  const fallbackIcon = categoryIconMap[name.toLowerCase()] || categoryIconMap['default']
  const Icon = LucideIcon || fallbackIcon

  if (!displayName) {
    return (
      <div className="flex items-center justify-center">
        <Icon size={iconSize} />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Icon size={iconSize} />
      <span>{name}</span>
    </div>
  )
}
