export type User = {
    password: string;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    accountName: string;
    accountId: string;
    amount: float;
    firstLogin: boolean;
    currency: string;
    locale: string;
}

export interface PasswordFormData {
    currentPassword: string
    newPassword: string
    confirmNewPassword: string
}

