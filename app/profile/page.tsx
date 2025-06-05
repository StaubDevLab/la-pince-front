import ProfileForm from '@/components/profile-form'
import ChangePasswordForm from '@/components/change-password-form'


export default function ProfilePage() {


    return (
        <div className="p-4 flex-grow">
            <div className="max-w-4xl mx-auto">
                {/* Profil */}
                <ProfileForm />


                {/* Modifier mon mot de passe */}
                <ChangePasswordForm />
            </div>
        </div>
    )
}

