import { categoryIconMap } from '@/lib/icons';

type Category = {
    name: string;
};

export const CategoryItem = ({ category }: { category: Category }) => {
    const Icon = categoryIconMap[category.name.toLowerCase()] || categoryIconMap['default'];

    return (
        <div className="flex items-center gap-2">
            {Icon && <Icon size={20} />}
            <span className={"hidden sm:block md:block lg:hidden"}>{category.name}</span>
        </div>
    );
};
