'use client'
import { BellIcon, CircleUser, LogOut, Menu, Settings } from 'lucide-react'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { SwitchTheme } from '@/components/switch-theme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useEffect } from 'react'
import { getProfile } from '@/actions/profile.actions'
import { useUser } from '@/context/user-context'
import { HeaderAmmount } from '../header-amount'
import { Skeleton } from '../ui/skeleton'
export default function Header() {
    const pathname = usePathname()
    const { user, setUser } = useUser()


    useEffect(() => {
    getProfile().then((response) => {
      if (response.success && response.data) {
        setUser(response.data)
      }
    })
  }, [setUser])
    return (
        <header className="flex items-center justify-between px-4 py-2.5 border-b dark:text-white">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 flex-shrink-0">
                    <Image src="/la-pince-logo.png" alt="Logo de l'application La Pince" width={80} height={80} />
                </div>
                <div>
                    <h1 className="hidden sm:flex text-lg md:text-xl font-medium gap-1 items-center ">
                        Bienvenue<span className="font-semibold">{user.firstName ? ', ' + user.firstName : <Skeleton className='w-28 h-5'/>}</span>
                    </h1>
                    <h1 className="flex gap-1 items-center text-base sm:hidden font-medium">
                        Bonjour, <span className="font-semibold">{user.firstName ? user.firstName : <Skeleton className='w-20 h-4' />}</span>
                    </h1>
                    <div className="text-sm text-muted-foreground">
                        {user.amount ? <HeaderAmmount amount={user.amount} /> : <Skeleton  className="w-24 h-6" />}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
                <div className="hidden md:flex items-center rounded-full bg-muted px-1 py-0.5">
                    <Link href="/dashboard">
                        <Button
                            className={`h-8 px-4 text-sm font-medium rounded-full transition-all cursor-pointer
                                ${pathname === '/dashboard' ? 'bg-primary text-white' : 'bg-input/30 text-muted-foreground hover:text-white hover:bg-input/50'}
                            `}
                        >
                            Dashboard
                        </Button>
                    </Link>
                    <Link href="/transactions">
                        <Button
                            className={`h-8 px-4 text-sm font-medium rounded-full transition-all cursor-pointer
                                ${pathname === '/transactions' ? 'bg-primary text-white' : 'bg-input/30 text-muted-foreground hover:text-white hover:bg-input/50'}
                            `}
                        >
                            Transactions
                        </Button>
                    </Link>
                </div>

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
                                <Button variant="outline" className="w-full text-sm">
                                    Dashboard
                                </Button>
                            </Link>
                            <Link href="/transactions">
                                <Button variant="outline" className="w-full text-sm">
                                    Transactions
                                </Button>
                            </Link>
                        </div>
                    </SheetContent>
                </Sheet>

                <Link href="/notifications">
                    <Button variant="ghost" size="icon" className="relative h-8 w-8">
                        <BellIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </Button>
                </Link>

                <SwitchTheme />

                <DropdownMenu>
                    <DropdownMenuTrigger className="h-8 w-8 md:h-9 md:w-9">
                        <Avatar className="h-8 w-8 md:h-9 md:w-9">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <CircleUser className="mr-2 h-4 w-4" />
                            <Link href={"/profile"}>Mon profil</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Paramètres</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={ () => {
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
