import * as React from "react"

import { cn } from "@/lib/utils"

const alertVariants = {
  default: "bg-background text-foreground",
  destructive: "bg-destructive text-destructive-foreground",
}

export type AlertVariant = keyof typeof alertVariants

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({ className, variant, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative w-full rounded-lg border p-4", alertVariants[variant || "default"], className)}
      {...props}
    />
  )
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-1 font-semibold leading-tight tracking-tight", className)} {...props} />
  ),
)
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("text-sm [&+ul]:mt-2", className)} {...props} />,
)
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
export type { AlertProps }
