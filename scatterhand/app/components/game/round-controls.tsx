import { Phase } from '#app/domain/round-state'
import { cn } from '#app/utils/cn'

interface RoundControlsProps {
    phase: Phase   
    onNextPhase?: () => void
    className?: string
}

/**
 * Controls for managing round actions and progression
 */
export function RoundControls({
    phase,
    className
}: RoundControlsProps) {
    return (
        <div className={cn(
            'flex flex-col items-center gap-4 p-4',
            'bg-gray-800/80 rounded-lg',
            'transition-all duration-300',
             'opacity-50',
            className
        )}>
            {/* Phase and Bet Info */}
            <div className="flex items-center gap-4">
                <div className="text-white font-bold">
                    {phase}
                </div>
            </div>
        </div>
    )
} 