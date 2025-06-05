"use client"

import { useEffect, useState } from "react"
import { Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { profileSchema } from "@/types/profile-schema"
import { User as UserType } from "@/types/user"
import { getProfile, updateProfileAndSession } from "@/actions/profile.actions"
import { Skeleton } from "@/components/ui/skeleton"
import { useUser } from "@/context/user-context"
import { toast } from "sonner"

export type ProfileFormValues = z.infer<typeof profileSchema>

export default function ProfilePage() {

const { setUser } = useUser()
    const [isEditing, setIsEditing] = useState(false)
    const [profileData, setProfileData] = useState<Partial<UserType>>({})

    // Formulaire react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            accountName: "",
        },
    })

    // Récupération du profil à l'initialisation
    useEffect(() => {
        getProfile().then((response) => {
            if (response.success && response.data) {
                setProfileData(response.data)
                reset({
                    firstName: response.data.firstName || "",
                    lastName: response.data.lastName || "",
                    email: response.data.email || "",
                    accountName: response.data.accountName || "",
                })
            } else {
                console.error("Erreur lors de la récupération du profil:", response.error)
            }
        }).catch((error) => {
            console.error("Erreur inattendue lors de la récupération du profil:", error)
        })
    }, [reset])

    // Mot de passe
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const [passwordRequirements, setPasswordRequirements] = useState({
        minLength: false,
        hasLowercase: false,
        hasUppercase: false,
        hasNumber: false,
        hasSpecialChar: false,
    })

    const handlePasswordChange = (field: string, value: string) => {
        setPasswordData((prev) => ({
            ...prev,
            [field]: value,
        }))
        if (field === "newPassword") {
            validatePassword(value)
        }
    }

    const validatePassword = (password: string) => {
        setPasswordRequirements({
            minLength: password.length >= 12,
            hasLowercase: /[a-z]/.test(password),
            hasUppercase: /[A-Z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        })
    }

    // Soumission du formulaire profil
    const onSubmit = async (data: ProfileFormValues) => {
        const res = await updateProfileAndSession({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
        })
        if (res.success) {
            toast.success("Profil mis à jour avec succès")
         setUser((prev) => ({ ...prev, ...data }))
            setIsEditing(false)
            setProfileData(data)
        } else {
            alert(res.error)
        }
    }

    const allPasswordRequirementsMet = Object.values(passwordRequirements).every((req) => req)

    return (
        <div className="p-4 flex-grow">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
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
                        {isEditing ? "Annuler" : "Éditer"}
                    </Button>
                </div>

                {/* Informations personnelles */}
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
                                            {...register("firstName")}
                                            className="text-xl font-semibold"
                                            placeholder="Prénom"
                                        />
                                        <Input
                                            {...register("lastName")}
                                            className="text-xl font-semibold"
                                            placeholder="Nom"
                                        />
                                    </>
                                ) : (
                                    <h2 className="text-xl font-semibold">
                                       {profileData.firstName && profileData.lastName  ? profileData.firstName + ' ' + profileData.lastName :  <Skeleton className="h-6 w-[400px]" />}
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
                                                {...register("email")}
                                            />
                                            {errors.email && (
                                                <p className="text-xs text-red-500">{errors.email.message}</p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="font-medium">{profileData.email ? profileData.email : <Skeleton className="h-4 w-[250px]" />}</p>
                                    )}
                                </div>

                                <div>
                                    <Label className="text-sm text-gray-600 mb-1 block">Téléphone</Label>
                                    {isEditing ? (<Input
                                        type="tel"
                                        value={"0600000000"}
                                        disabled
                                        readOnly
                                    />): <p className="font-medium">0600000000</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <Label className="text-sm text-gray-600 mb-1 block">Nom de votre compte</Label>
                                    {isEditing ? (
                                        <>
                                            <Input
                                                {...register("accountName")}
                                                disabled
                                            />
                                            {errors.accountName && (
                                                <p className="text-xs text-red-500">{errors.accountName.message}</p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="font-medium">{profileData.accountName ? profileData.accountName : <Skeleton className="h-4 w-[250px]" />}</p>
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
                                        {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </form>

                {/* Modifier mon mot de passe */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">Modifier mon mot de passe</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <Label htmlFor="newPassword" className="text-sm text-gray-600 mb-1 block">
                                    Nouveau mot de passe
                                </Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                                    placeholder="Entrez votre nouveau mot de passe"
                                />
                            </div>

                            <div>
                                <Label htmlFor="confirmPassword" className="text-sm text-gray-600 mb-1 block">
                                    Confirmation
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                                    placeholder="Confirmez votre mot de passe"
                                />
                            </div>
                        </div>

                        {/* Exigences du mot de passe */}
                        <div className="mb-6">
                            <ul className="space-y-1 text-sm">
                                <li className={`flex items-center gap-2 ${passwordRequirements.minLength ? "text-green-600" : "text-gray-500"}`}>
                                    <span className={`w-2 h-2 rounded-full ${passwordRequirements.minLength ? "bg-green-600" : "bg-gray-300"}`}></span>
                                    Minimum 12 caractères
                                </li>
                                <li className={`flex items-center gap-2 ${passwordRequirements.hasLowercase ? "text-green-600" : "text-gray-500"}`}>
                                    <span className={`w-2 h-2 rounded-full ${passwordRequirements.hasLowercase ? "bg-green-600" : "bg-gray-300"}`}></span>
                                    Minimum une minuscule
                                </li>
                                <li className={`flex items-center gap-2 ${passwordRequirements.hasUppercase ? "text-green-600" : "text-gray-500"}`}>
                                    <span className={`w-2 h-2 rounded-full ${passwordRequirements.hasUppercase ? "bg-green-600" : "bg-gray-300"}`}></span>
                                    Minimum une majuscule
                                </li>
                                <li className={`flex items-center gap-2 ${passwordRequirements.hasNumber ? "text-green-600" : "text-gray-500"}`}>
                                    <span className={`w-2 h-2 rounded-full ${passwordRequirements.hasNumber ? "bg-green-600" : "bg-gray-300"}`}></span>
                                    Minimum 1 chiffre
                                </li>
                                <li className={`flex items-center gap-2 ${passwordRequirements.hasSpecialChar ? "text-green-600" : "text-gray-500"}`}>
                                    <span className={`w-2 h-2 rounded-full ${passwordRequirements.hasSpecialChar ? "bg-green-600" : "bg-gray-300"}`}></span>
                                    Minimum 1 caractère spécial
                                </li>
                            </ul>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                onClick={() => {/* handleSavePassword à implémenter */}}
                                disabled={
                                    !allPasswordRequirementsMet ||
                                    passwordData.newPassword !== passwordData.confirmPassword ||
                                    !passwordData.newPassword
                                }
                                className="bg-[#f97316] hover:bg-[#ea6a0a] disabled:bg-gray-300"
                            >
                                Enregistrer
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

