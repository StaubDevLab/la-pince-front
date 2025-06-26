import ProfileForm from '@/components/profile-form'
import ChangePasswordForm from '@/components/change-password-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreateCategoryDialog } from '@/components/category-dialog/CategoryDialog'


export default function ProfilePage() {


    return (
        <div className="p-4 flex-grow">
            <div className="max-w-4xl mx-auto">
                {/* Profil */}
                <ProfileForm />

                <Card className='mb-6'>
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">Mes données</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CreateCategoryDialog isEditMod={true} triggerElement={
                            <Button>Modifier mes catégories</Button>
                        } />
                    </CardContent>
                </Card>

                {/* Modifier mon mot de passe */}
                <ChangePasswordForm />
            </div>
        </div>
    )
}

