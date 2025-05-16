import * as React from 'react'
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
    return (
        <nav
            role="navigation"
            aria-label="pagination"
            data-slot="pagination"
            className={cn('mx-auto flex w-full justify-center', className)}
            {...props}
        />
    )
}

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
    return (
        <ul
            data-slot="pagination-content"
            className={cn('flex flex-row items-center gap-1', className)}
            {...props}
        />
    )
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
    return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
    isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
    React.ComponentProps<'a'>

function PaginationLink({ className, isActive, size = 'icon', ...props }: PaginationLinkProps) {
    return (
        <a
            aria-current={isActive ? 'page' : undefined}
            data-slot="pagination-link"
            data-active={isActive}
            className={cn(
                buttonVariants({
                    variant: isActive ? 'outline' : 'ghost',
                    size,
                }),
                className
            )}
            {...props}
        />
    )
}

function PaginationPrevious({
    className,
    disabled,
    onClick,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            type="button"
            aria-label="Go to previous page"
            disabled={disabled}
            onClick={e => {
                if (disabled) return
                onClick?.(e)
            }}
            className={cn(
                'inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors',
                'bg-muted hover:bg-muted/80 text-foreground',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                className
            )}
            {...props}
        >
            <ChevronLeftIcon className="h-4 w-4" />
            <span className="hidden sm:block">Précédent</span>
        </button>
    )
}

function PaginationNext({
    className,
    disabled,
    onClick,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            type="button"
            aria-label="Go to next page"
            disabled={disabled}
            onClick={e => {
                if (disabled) return
                onClick?.(e)
            }}
            className={cn(
                'inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors',
                'bg-muted hover:bg-muted/80 text-foreground',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                className
            )}
            {...props}
        >
            <span className="hidden sm:block">Suivant</span>
            <ChevronRightIcon className="h-4 w-4" />
        </button>
    )
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span
            aria-hidden
            data-slot="pagination-ellipsis"
            className={cn('flex size-9 items-center justify-center', className)}
            {...props}
        >
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">More pages</span>
        </span>
    )
}

export {
    Pagination,
    PaginationContent,
    PaginationLink,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
}
