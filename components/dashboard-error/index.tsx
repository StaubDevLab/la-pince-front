'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

interface DashboardErrorToastProps {
    success?: boolean;
    errorMessage: string | null;
}

/**
 * Composant client pour afficher un toast d'erreur sur le tableau de bord.
 * Il est conçu pour être utilisé dans un Server Component en lui passant un message d'erreur.
 */
export function DashboardErrorToast({success, errorMessage }: DashboardErrorToastProps) {
    useEffect(() => {
        if (errorMessage && !success) {
            toast.error(errorMessage);
        }
        else if (success) {
            toast.success(errorMessage);
        }
    }, [errorMessage]);

    return null;
}
