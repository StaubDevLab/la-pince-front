'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

interface DashboardToastProps {
    success?: boolean;
    message: string | null;
}

/**
 * Composant client pour afficher un toast d'erreur sur le tableau de bord.
 * Il est conçu pour être utilisé dans un Server Component en lui passant un message d'erreur.
 */
export function DashboardToaster({success, message }: DashboardToastProps) {
    useEffect(() => {
        if (message && !success) {
            toast.error(message);
        }
        else if (success) {
            toast.success(message);
        }
    }, [message]);

    return null;
}
