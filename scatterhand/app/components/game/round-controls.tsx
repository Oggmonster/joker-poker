import { RoundPhase } from '#app/domain/round-state'
import { cn } from '#app/utils/cn'

interface RoundControlsProps {
    phase: RoundPhase
    isPlayerTurn: boolean
    currentBet: number
    playerChips: number
    minRaise: number
    maxRaise: number
    onCall?: () => void
    onRaise?: (amount: number) => void
    onFold?: () => void
    onNextPhase?: () => void
    className?: string
}

/**
 * Controls for managing round actions and progression
 */
export function RoundControls({
    phase,
    isPlayerTurn,
    currentBet,
    playerChips,
    minRaise,
    maxRaise,
    onCall,
    onRaise,
    onFold,
    onNextPhase,
    className
}: RoundControlsProps) {
    return (
        <div className={cn(
            'flex flex-col items-center gap-4 p-4',
            'bg-gray-800/80 rounded-lg',
            'transition-all duration-300',
            !isPlayerTurn && 'opacity-50',
            className
        )}>
            {/* Phase and Bet Info */}
            <div className="flex items-center gap-4">
                <div className="text-white font-bold">
                    {phase}
                </div>
                <div className="text-yellow-400">
                    Current Bet: {currentBet}
                </div>
                <div className="text-green-400">
                    Your Chips: {playerChips}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                {/* Call Button */}
                <button
                    onClick={onCall}
                    disabled={!isPlayerTurn || phase === RoundPhase.SCORING || phase === RoundPhase.COMPLETE}
                    className={cn(
                        'px-6 py-2 rounded-lg font-bold',
                        'transition-all duration-200',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        'bg-blue-500 hover:bg-blue-600 active:bg-blue-700',
                        'text-white'
                    )}
                >
                    Call {currentBet}
                </button>

                {/* Raise Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onRaise?.(minRaise)}
                        disabled={!isPlayerTurn || playerChips < minRaise || phase === RoundPhase.SCORING || phase === RoundPhase.COMPLETE}
                        className={cn(
                            'px-6 py-2 rounded-lg font-bold',
                            'transition-all duration-200',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            'bg-green-500 hover:bg-green-600 active:bg-green-700',
                            'text-white'
                        )}
                    >
                        Raise to {minRaise}
                    </button>
                    {maxRaise > minRaise && (
                        <button
                            onClick={() => onRaise?.(maxRaise)}
                            disabled={!isPlayerTurn || playerChips < maxRaise || phase === RoundPhase.SCORING || phase === RoundPhase.COMPLETE}
                            className={cn(
                                'px-4 py-2 rounded-lg font-bold',
                                'transition-all duration-200',
                                'disabled:opacity-50 disabled:cursor-not-allowed',
                                'bg-purple-500 hover:bg-purple-600 active:bg-purple-700',
                                'text-white'
                            )}
                        >
                            All In ({maxRaise})
                        </button>
                    )}
                </div>

                {/* Fold Button */}
                <button
                    onClick={onFold}
                    disabled={!isPlayerTurn || phase === RoundPhase.SCORING || phase === RoundPhase.COMPLETE}
                    className={cn(
                        'px-6 py-2 rounded-lg font-bold',
                        'transition-all duration-200',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        'bg-red-500 hover:bg-red-600 active:bg-red-700',
                        'text-white'
                    )}
                >
                    Fold
                </button>
            </div>

            {/* Next Phase Button (for debugging/development) */}
            {onNextPhase && phase !== RoundPhase.COMPLETE && (
                <button
                    onClick={onNextPhase}
                    className={cn(
                        'px-4 py-1 rounded-lg text-sm',
                        'transition-all duration-200',
                        'bg-gray-600 hover:bg-gray-700 active:bg-gray-800',
                        'text-white opacity-50 hover:opacity-100'
                    )}
                >
                    Next Phase →
                </button>
            )}
        </div>
    )
} 