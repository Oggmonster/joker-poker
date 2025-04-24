import { cn } from '#app/utils/cn'

interface RoundTimerProps {
    timeRemaining: number
    maxTime: number
    isActive: boolean
    className?: string
}

/**
 * Displays a timer for the current round action
 */
export function RoundTimer({
    timeRemaining,
    maxTime,
    isActive,
    className
}: RoundTimerProps) {
    // Calculate percentage remaining
    const percentage = Math.max(0, Math.min(100, (timeRemaining / maxTime) * 100))
    
    // Determine color based on time remaining
    const getTimerColor = () => {
        if (percentage > 66) return 'bg-green-500'
        if (percentage > 33) return 'bg-yellow-500'
        return 'bg-red-500'
    }

    return (
        <div className={cn('flex flex-col items-center gap-1', className)}>
            {/* Timer Bar */}
            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                    className={cn(
                        'h-full transition-all duration-200',
                        getTimerColor(),
                        !isActive && 'opacity-50'
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Time Display */}
            <div 
                className={cn(
                    'text-sm font-mono',
                    'transition-colors duration-200',
                    isActive ? 'text-white' : 'text-gray-400'
                )}
            >
                {Math.ceil(timeRemaining)}s
            </div>
        </div>
    )
} 