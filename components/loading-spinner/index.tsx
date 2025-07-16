interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg"
    message?: string
    className?: string
  }
  
  export default function LoadingSpinner({
    size = "md",
    message = "Chargement...",
    className = "",
  }: LoadingSpinnerProps) {
    const sizeClasses = {
      sm: "h-6 w-6",
      md: "h-12 w-12",
      lg: "h-16 w-16",
    }
  
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
        {message && <p className="mt-4 text-gray-600 text-center">{message}</p>}
      </div>
    )
  }
  