import { BaseJoker } from '#app/domain/joker'
import { cn } from '#app/utils/cn'

interface PlayerResult {
    playerId: string
    playerName: string
    score: number
    chips: number
    chipsWon: number
    newJokers: BaseJoker[]
}

interface RoundResultsProps {
    results: PlayerResult[]
    onContinue?: () => void
    className?: string
}

/**
 * Displays the final results of a round including scores, chips won, and new jokers
 */
export function RoundResults({
    results,
    onContinue,
    className
}: RoundResultsProps) {
    // Sort results by score in descending order
    const sortedResults = [...results].sort((a, b) => b.score - a.score)
    const winner = sortedResults[0]

    return (
        <div className={cn(
            'flex flex-col gap-6 p-6',
            'bg-gray-800/90 rounded-lg',
            'max-w-2xl mx-auto',
            className
        )}>
            {/* Winner Banner */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-yellow-400 mb-2">
                    {winner?.playerName} Wins!
                </h2>
                <p className="text-gray-300">
                    with a score of {winner?.score}
                </p>
            </div>

            {/* Results Table */}
            <div className="flex flex-col gap-4">
                {sortedResults.map((result, index) => (
                    <div 
                        key={result.playerId}
                        className={cn(
                            'flex flex-col gap-3 p-4 rounded-lg',
                            'transition-colors duration-300',
                            index === 0 ? 'bg-yellow-900/30' : 'bg-gray-700/30'
                        )}
                    >
                        {/* Player Info Row */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-baseline gap-3">
                                <span className="text-lg font-bold text-white">
                                    {result.playerName}
                                </span>
                                <span className="text-sm text-gray-400">
                                    Score: {result.score}
                                </span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-sm text-gray-400">
                                    Chips:
                                </span>
                                <span className="text-lg font-bold text-green-400">
                                    {result.chips}
                                </span>
                                {result.chipsWon > 0 && (
                                    <span className="text-sm font-bold text-green-500">
                                        (+{result.chipsWon})
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* New Jokers */}
                        {result.newJokers.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <span className="text-sm text-purple-300">
                                    New Jokers:
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {result.newJokers.map((joker, idx) => (
                                        <div 
                                            key={idx}
                                            className="px-3 py-1 bg-purple-900/30 rounded text-sm text-purple-200"
                                        >
                                            {joker.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Continue Button */}
            {onContinue && (
                <button
                    onClick={onContinue}
                    className={cn(
                        'mt-4 px-6 py-3 rounded-lg',
                        'bg-blue-500 hover:bg-blue-600 active:bg-blue-700',
                        'text-white font-bold text-lg',
                        'transition-colors duration-200'
                    )}
                >
                    Continue to Next Round
                </button>
            )}
        </div>
    )
} 