'use client'
import { BellIcon, CircleUser, LogOut, Menu } from 'lucide-react'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { SwitchTheme } from '@/components/switch-theme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { getProfile } from '@/actions/profile.actions'
import { useUser } from '@/context/user-context'
import { HeaderAmmount } from '../header-amount'
import { Skeleton } from '../ui/skeleton'
import { getNotifications } from '@/actions/notifications.actions'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
export default function Header() {
    const pathname = usePathname()
    const { user, setUser } = useUser()
    const [nbUnreadNotifs, setNbUnreadNotifs] = useState(0)
    const toggleValue = ['/dashboard', '/transactions'].includes(pathname) ? pathname : undefined;


    useEffect(() => {
            getProfile().then((response) => {
            if (response.success && response.data) {
                setUser(response.data)
            }
            getNotifications().then((response) => {
                if(response.success && response.data) {
                    const nbNotifsUnread = response.data.data.filter((notif) => !notif.isRead)
                    setNbUnreadNotifs(nbNotifsUnread.length)
                }
            })
        })
    }, [setUser])
    return (
        <header className="flex items-center justify-between px-4 py-2.5 border-b dark:text-white">
            <div className="flex items-center gap-3">
                <Link className="w-9 h-9 md:w-10 md:h-10 flex-shrink-0" href='/dashboard'>
                    <Image src="/la-pince-logo.png" alt="Logo de l'application La Pince" width={80} height={80} />
                </Link>
                <div>
                    <h1 className="hidden sm:flex text-lg md:text-xl font-medium gap-1 items-center ">
                        Bonjour{user.firstName ? ', ' + user.firstName : <Skeleton className='w-28 h-5'/>}
                    </h1>
                    <h1 className="flex gap-1 items-center text-base sm:hidden font-medium">
                        Bonjour, {user.firstName ? user.firstName : <Skeleton className='w-20 h-4' />}
                    </h1>
                    <div className="text-sm text-muted-foreground">
                        {user.amount ? <HeaderAmmount amount={user.amount} /> : <Skeleton  className="w-24 h-6" />}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
                <ToggleGroup.Root
                    type="single"
                    value={toggleValue}
                    className="hidden md:inline-flex relative bg-muted rounded-full p-1"
                >
                    <div
                        className={`
                        absolute inset-y-0 left-0 w-1/2 rounded-full bg-primary transition-transform duration-300 ease-in-out
                        ${pathname === '/dashboard' ? 'translate-x-0' : pathname === '/transactions' ? 'translate-x-full' : 'translate-x-[-100%] opacity-0'}
                        `}
                    />

                    <Link href="/dashboard" passHref>
                        <ToggleGroup.Item
                        value="/dashboard"
                        className={`relative z-10 px-4 py-0.5 text-sm font-medium rounded-full transition-colors cursor-pointer
                            ${pathname === '/dashboard' ? 'text-white' : 'text-muted-foreground hover:text-white'}
                        `}
                        aria-label="Lien vers le dashboard"
                        >
                        Dashboard
                        </ToggleGroup.Item>
                    </Link>

                    <Link href="/transactions" passHref>
                        <ToggleGroup.Item
                        value="/transactions"
                        className={`relative z-10 px-4 py-0.5 text-sm font-medium rounded-full transition-colors cursor-pointer
                            ${pathname === '/transactions' ? 'text-white' : 'text-muted-foreground hover:text-white'}
                        `}
                        aria-label="Lien vers les transactions"
                        >
                        Transactions
                        </ToggleGroup.Item>
                    </Link>
                </ToggleGroup.Root>

                <Sheet>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-2 bg-white shadow-xl dark:bg-gray-800">
                        <div className="flex flex-col gap-3 mt-8">
                            <Link href="/dashboard">
                                <Button variant="outline" className="w-full text-sm" aria-label="Lien vers le dashboard">
                                    Dashboard
                                </Button>
                            </Link>
                            <Link href="/transactions">
                                <Button variant="outline" className="w-full text-sm" aria-label="Lien vers les transactions">
                                    Transactions
                                </Button>
                            </Link>
                        </div>
                    </SheetContent>
                </Sheet>

                <Link href="/notifications">
                    <Button variant="ghost" size="icon" className="relative h-8 w-8" aria-label="Accès aux notifications">
                        <BellIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                        {nbUnreadNotifs > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 text-xs text-white bg-red-500 rounded-full flex items-center justify-center">
                            {nbUnreadNotifs > 9 ? '9+' : nbUnreadNotifs}
                        </span>
                        )}
                    </Button>
                </Link>

                <SwitchTheme />

                <DropdownMenu>
                    <DropdownMenuTrigger className="h-8 w-8 md:h-9 md:w-9" aria-label="Accès au profil">
                        <Avatar className="h-8 w-8 md:h-9 md:w-9">
                            <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel aria-label="Mon compte">Mon compte</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem aria-label="Mon profil">
                            <CircleUser className="mr-2 h-4 w-4" />
                            <Link href={"/profile"}>Mon profil</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem aria-label="Déconnexion" onClick={ () => {
                            signOut({redirectTo: '/connexion'})
                        }}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Déconnexion</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
