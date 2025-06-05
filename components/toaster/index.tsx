import React from 'react'
import { Toaster } from "@/components/ui/sonner"
const ToasterComponent = () => {
    return (
        <Toaster
            position="bottom-right"
            toastOptions={{
                unstyled: true,
                duration: 4000,
                classNames: {
                    success: `
        ${commonToastStyles}
        bg-gradient-to-r from-emerald-50 to-green-50 
        text-green-800 
        border border-green-200/50 
        shadow-lg shadow-green-100/50
        ring-1 ring-green-200/20
        hover:shadow-xl hover:shadow-green-200/30
        before:bg-gradient-to-r before:from-green-400/10 before:to-emerald-400/10
      `,
                    error: `
        ${commonToastStyles}
        bg-gradient-to-r from-red-50 to-rose-50 
        text-red-800 
        border border-red-200/50 
        shadow-lg shadow-red-100/50
        ring-1 ring-red-200/20
        hover:shadow-xl hover:shadow-red-200/30
        before:bg-gradient-to-r before:from-red-400/10 before:to-rose-400/10
      `,
                    warning: `
        bg-gradient-to-r from-amber-50 to-yellow-50 
        text-amber-800 
        border border-amber-200/50 
        p-4 rounded-xl 
        shadow-lg shadow-amber-100/50
        backdrop-blur-sm
        ring-1 ring-amber-200/20
        transition-all duration-300 ease-out
        hover:shadow-xl hover:shadow-amber-200/30
        hover:scale-[1.02]
        relative overflow-hidden
        before:absolute before:inset-0 
        before:bg-gradient-to-r before:from-amber-400/10 before:to-yellow-400/10
        before:opacity-0 before:transition-opacity before:duration-300
        hover:before:opacity-100
      `,
                    info: `
        bg-gradient-to-r from-blue-50 to-cyan-50 
        text-blue-800 
        border border-blue-200/50 
        p-4 rounded-xl 
        shadow-lg shadow-blue-100/50
        backdrop-blur-sm
        ring-1 ring-blue-200/20
        transition-all duration-300 ease-out
        hover:shadow-xl hover:shadow-blue-200/30
        hover:scale-[1.02]
        relative overflow-hidden
        before:absolute before:inset-0 
        before:bg-gradient-to-r before:from-blue-400/10 before:to-cyan-400/10
        before:opacity-0 before:transition-opacity before:duration-300
        hover:before:opacity-100
      `,
                    loading: `
        bg-gradient-to-r from-gray-50 to-slate-50 
        text-gray-700 
        border border-gray-200/50 
        p-4 rounded-xl 
        shadow-lg shadow-gray-100/50
        backdrop-blur-sm
        ring-1 ring-gray-200/20
        transition-all duration-300 ease-out
        animate-pulse
        relative overflow-hidden
        before:absolute before:inset-0 
        before:bg-gradient-to-r before:from-gray-400/5 before:to-slate-400/5
        before:animate-shimmer
      `,
                    toast: `
        font-medium
        flex items-center gap-3
        min-w-[320px] max-w-md
        transform translate-x-0
        data-[state=open]:animate-in
        data-[state=open]:slide-in-from-right-full
        data-[state=closed]:animate-out
        data-[state=closed]:slide-out-to-right-full
        data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]
        data-[swipe=cancel]:translate-x-0
        data-[swipe=end]:animate-out
        data-[swipe=end]:slide-out-to-right-full
      `
                },
            }}
        />
    )
}

export default ToasterComponent
