import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
    return (
        <div className={cn('flex flex-col gap-2 items-center', className)} {...props}>
            <img src="la-pince-logo.png" alt="logo" height="100px" width="75px" />
            <h1 className="text-2xl font-semibold text-center">Bienvenue sur La Pince</h1>

            <span className="text-sm text-center mb-4">
                Pas de compte ?{' '}
                <a href="#" className="underline underline-offset-4">
                    Créer en un ici
                </a>
            </span>

            <div className="w-full max-w-md">
                <form>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john.doe@gmail.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Mot de passe</Label>
                                <a
                                    href="#"
                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                >
                                    Mot de passe oublié ?
                                </a>
                            </div>
                            <Input id="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full">
                            Connexion
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
