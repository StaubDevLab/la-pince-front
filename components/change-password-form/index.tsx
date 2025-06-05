'use client'
import React,{useState} from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { changePasswordAction } from '@/actions/profile.actions'
import { PasswordFormData } from '@/types/user'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordRequirements {
    minLength: boolean
    hasLowercase: boolean
    hasUppercase: boolean
    hasNumber: boolean
    hasSpecialChar: boolean
}
const ChangePasswordForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    })
    const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirements>({
        minLength: false,
        hasLowercase: false,
        hasUppercase: false,
        hasNumber: false,
        hasSpecialChar: false,
    })

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm<PasswordFormData>({
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
    })

    const newPassword = watch('newPassword')
    const confirmNewPassword = watch('confirmNewPassword')

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }))
    }
    React.useEffect(() => {
        if (newPassword) {
            validatePassword(newPassword)
        } else {
            setPasswordRequirements({
                minLength: false,
                hasLowercase: false,
                hasUppercase: false,
                hasNumber: false,
                hasSpecialChar: false,
            })
        }
    }, [newPassword])

    const validatePassword = (password: string) => {
        setPasswordRequirements({
            minLength: password.length >= 12,
            hasLowercase: /[a-z]/.test(password),
            hasUppercase: /[A-Z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        })
    }

    const allPasswordRequirementsMet = Object.values(passwordRequirements).every((req) => req)
    const passwordsMatch = newPassword === confirmNewPassword

    const onSubmit = async (data: PasswordFormData) => {
        setIsLoading(true)

        try {
            const result = await changePasswordAction(data)

            if (result.success) {
                toast.success('Mot de passe modifié avec succès !')
                reset()
            } else {
                toast.error(result.error || 'Erreur lors de la modification du mot de passe')
            }
        } catch  {
            toast.error('Une erreur inattendue est survenue')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-medium">Modifier mon mot de passe</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Mot de passe actuel */}
                    <div className={"relative"}>
                        <Label htmlFor="currentPassword" className="text-sm text-gray-600 mb-1 block">
                            Mot de passe actuel *
                        </Label>
                        <Input
                            id="currentPassword"
                            type={showPasswords.current ? 'text' : 'password'}
                            {...register('currentPassword', {
                                required: 'Le mot de passe actuel est obligatoire',
                            })}
                            placeholder="Entrez votre mot de passe actuel"
                            className={errors.currentPassword ? 'border-red-500' : ''}
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility('current')}
                            className="absolute right-3 top-10 -translate-y-1/2 text-gray-400 dark:text-white hover:text-gray-600 transition-colors"
                        >
                            {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        {errors.currentPassword && (
                            <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nouveau mot de passe */}
                        <div className={'relative'}>
                            <Label htmlFor="newPassword" className="text-sm text-gray-600 mb-1 block">
                                Nouveau mot de passe *
                            </Label>
                            <Input
                                id="newPassword"
                                type={showPasswords.new ? 'text' : 'password'}

                                {...register('newPassword', {
                                    required: 'Le nouveau mot de passe est obligatoire',
                                    validate: () => allPasswordRequirementsMet || 'Le mot de passe ne respecte pas tous les critères',
                                })}
                                placeholder="Entrez votre nouveau mot de passe"
                                className={errors.newPassword ? 'border-red-500' : ''}
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('new')}
                                className="absolute right-3 top-10 -translate-y-1/2 text-gray-400 dark:text-white hover:text-gray-600 transition-colors"
                            >
                                {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            {errors.newPassword && (
                                <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
                            )}
                        </div>

                        {/* Confirmation */}
                        <div className={"relative"}>
                            <Label htmlFor="confirmNewPassword" className="text-sm text-gray-600 mb-1 block">
                                Confirmation *
                            </Label>
                            <Input
                                id="confirmNewPassword"
                                type={showPasswords.confirm ? 'text' : 'password'}
                                {...register('confirmNewPassword', {
                                    required: 'La confirmation est obligatoire',
                                    validate: (value) =>
                                        value === newPassword || 'Les mots de passe ne correspondent pas',
                                })}
                                placeholder="Confirmez votre mot de passe"
                                className={errors.confirmNewPassword ? 'border-red-500' : ''}
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('confirm')}
                                className="absolute right-3 top-10 -translate-y-1/2 text-gray-400 dark:text-white hover:text-gray-600 transition-colors"
                            >
                                {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            {errors.confirmNewPassword && (
                                <p className="text-red-500 text-xs mt-1">{errors.confirmNewPassword.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Exigences du mot de passe */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Exigences du mot de passe :</h4>
                        <ul className="space-y-1 text-sm">
                            <li className={`flex items-center gap-2 ${passwordRequirements.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                                <span className={`w-2 h-2 rounded-full ${passwordRequirements.minLength ? 'bg-green-600' : 'bg-gray-300'}`}></span>
                                Minimum 12 caractères
                            </li>
                            <li className={`flex items-center gap-2 ${passwordRequirements.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                                <span className={`w-2 h-2 rounded-full ${passwordRequirements.hasLowercase ? 'bg-green-600' : 'bg-gray-300'}`}></span>
                                Minimum une minuscule
                            </li>
                            <li className={`flex items-center gap-2 ${passwordRequirements.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                                <span className={`w-2 h-2 rounded-full ${passwordRequirements.hasUppercase ? 'bg-green-600' : 'bg-gray-300'}`}></span>
                                Minimum une majuscule
                            </li>
                            <li className={`flex items-center gap-2 ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                                <span className={`w-2 h-2 rounded-full ${passwordRequirements.hasNumber ? 'bg-green-600' : 'bg-gray-300'}`}></span>
                                Minimum 1 chiffre
                            </li>
                            <li className={`flex items-center gap-2 ${passwordRequirements.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                                <span className={`w-2 h-2 rounded-full ${passwordRequirements.hasSpecialChar ? 'bg-green-600' : 'bg-gray-300'}`}></span>
                                Minimum 1 caractère spécial
                            </li>
                        </ul>
                    </div>

                    {/* Bouton de soumission */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={isLoading || !allPasswordRequirementsMet || !passwordsMatch}
                            className="bg-[#f97316] hover:bg-[#ea6a0a] disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default ChangePasswordForm
