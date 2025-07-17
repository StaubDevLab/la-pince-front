import ProfileForm from '@/components/profile-form'
import ChangePasswordForm from '@/components/change-password-form'
import MyData from '@/components/profil-mydata'


export default function ProfilePage() {

    return (
        <div className="p-4 flex-grow">
            <div className="max-w-4xl mx-auto">
                {/* Profil */}
                <ProfileForm />
                {/* Mes données */}
                <MyData />

                {/* Modifier mon mot de passe */}
                <ChangePasswordForm />
            </div>
        </div>
    )
}

