'use client'
 import React, { useEffect, useState } from 'react'
import { useUser } from '@/context/user-context'
import { User as UserType } from '@/types/user'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema } from '@/types/profile-schema'
import { getProfile, updateProfileAndSession } from '@/actions/profile.actions'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'
import { z } from 'zod'
export type ProfileFormValues = z.infer<typeof profileSchema>

const ProfileForm = () => {

    const { setUser } = useUser()
    const [isEditing, setIsEditing] = useState(false)
    const [profileData, setProfileData] = useState<Partial<UserType>>({})

    // Formulaire react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            accountName: '',
        },
    })

    // Récupération du profil à l'initialisation
    useEffect(() => {
        getProfile().then((response) => {
            if (response.success && response.data) {
                setProfileData(response.data)
                reset({
                    firstName: response.data.firstName || '',
                    lastName: response.data.lastName || '',
                    email: response.data.email || '',
                    accountName: response.data.accountName || '',
                })
            } else {
                console.error('Erreur lors de la récupération du profil:', response.error)
            }
        }).catch((error) => {
            console.error('Erreur inattendue lors de la récupération du profil:', error)
        })
    }, [reset])
    // Soumission du formulaire profil
    const onSubmit = async (data: ProfileFormValues) => {
        const res = await updateProfileAndSession({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
        })
        if (res.success) {
            toast.success('Profil mis à jour avec succès')
            setUser((prev) => ({ ...prev, ...data }))
            setIsEditing(false)
            setProfileData(data)
        } else {
            toast.error('Erreur lors de la mise à jour du profil : ' + res.error)
        }
    }

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Mon profil</h1>
                <Button
                    variant="outline"
                    onClick={() => {
                        setIsEditing(!isEditing)
                        reset(profileData as ProfileFormValues)
                    }}
                    className="flex items-center gap-2"
                >
                    <Edit className="w-4 h-4" />
                    {isEditing ? 'Annuler' : 'Éditer'}
                </Button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">Informations personnelles </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 mb-6">
                            <Avatar className="w-16 h-16 bg-[#f97316]">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                </AvatarFallback>
                            </Avatar>
                            {isEditing ? (
                                <>
                                    <Input
                                        {...register('firstName')}
                                        className="text-xl font-semibold"
                                        placeholder="Prénom"
                                    />
                                    <Input
                                        {...register('lastName')}
                                        className="text-xl font-semibold"
                                        placeholder="Nom"
                                    />
                                </>
                            ) : (
                                <h2 className="text-xl font-semibold">
                                    {profileData.firstName && profileData.lastName ? profileData.firstName + ' ' + profileData.lastName :
                                        <Skeleton className="h-6 w-[400px]" />}
                                </h2>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className="text-sm text-gray-600 mb-1 block">Adresse Email</Label>
                                {isEditing ? (
                                    <>
                                        <Input
                                            type="email"
                                            {...register('email')}
                                        />
                                        {errors.email && (
                                            <p className="text-xs text-red-500">{errors.email.message}</p>
                                        )}
                                    </>
                                ) : (
                                    <p className="font-medium">{profileData.email ? profileData.email :
                                        <Skeleton className="h-4 w-[250px]" />}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-sm text-gray-600 mb-1 block">Téléphone</Label>
                                {isEditing ? (<Input
                                    type="tel"
                                    value={'0600000000'}
                                    disabled
                                    readOnly
                                />) : <p className="font-medium">0600000000</p>}
                            </div>

                            <div className="md:col-span-2">
                                <Label className="text-sm text-gray-600 mb-1 block">Nom de votre compte</Label>
                                {isEditing ? (
                                    <>
                                        <Input
                                            {...register('accountName')}
                                            disabled
                                        />
                                        {errors.accountName && (
                                            <p className="text-xs text-red-500">{errors.accountName.message}</p>
                                        )}
                                    </>
                                ) : (
                                    <p className="font-medium">{profileData.accountName ? profileData.accountName :
                                        <Skeleton className="h-4 w-[250px]" />}</p>
                                )}
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex justify-end mt-6">
                                <Button
                                    type="submit"
                                    className="bg-[#f97316] hover:bg-[#ea6a0a]"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </form>
        </>
    )
}

export default ProfileForm
