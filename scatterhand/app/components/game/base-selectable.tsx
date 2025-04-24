import { cn } from '#app/utils/cn'

export interface BaseSelectableProps {
    isSelected?: boolean
    isDisabled?: boolean
    onClick?: () => void
    className?: string
    children: React.ReactNode
}

/**
 * Base component for selectable items like cards and jokers
 * Handles selection state, hover effects, and click handling
 */
export function BaseSelectable({
    isSelected = false,
    isDisabled = false,
    onClick,
    className,
    children
}: BaseSelectableProps) {
    return (
        <div
            className={cn(
                // Base styles
                'relative rounded-lg shadow-md transition-all duration-200',
                'cursor-pointer select-none',
                // Hover effects when not disabled
                !isDisabled && 'hover:scale-105 hover:shadow-lg',
                // Selected state
                isSelected && 'ring-2 ring-blue-500 ring-offset-2',
                // Disabled state
                isDisabled && 'opacity-50 cursor-not-allowed',
                className
            )}
            onClick={isDisabled ? undefined : onClick}
            role="button"
            tabIndex={isDisabled ? -1 : 0}
        >
            {children}
        </div>
    )
} 