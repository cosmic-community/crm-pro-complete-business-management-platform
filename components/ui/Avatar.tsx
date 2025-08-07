import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { User } from 'lucide-react'

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fallback?: string
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, size = 'md', fallback, ...props }, ref) => {
    const sizes = {
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
      xl: 'h-16 w-16'
    }

    const iconSizes = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-8 w-8'
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex shrink-0 overflow-hidden rounded-full',
          sizes[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img
            className="aspect-square h-full w-full object-cover"
            src={src}
            alt={alt || 'Avatar'}
          />
        ) : fallback ? (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-600 font-medium text-sm">
            {fallback}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-600">
            <User className={iconSizes[size]} />
          </div>
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

export { Avatar }
export type { AvatarProps }