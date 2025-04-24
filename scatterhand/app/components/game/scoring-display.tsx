import { Card } from '#app/domain/cards'
import { BaseJoker } from '#app/domain/joker'
import { cn } from '#app/utils/cn'

interface JokerScore {
    joker: BaseJoker
    score: number
    description: string
}

interface PlayerScore {
    playerId: string
    playerName: string
    baseScore: number
    jokerScores: JokerScore[]
    totalScore: number
}

interface ScoringDisplayProps {
    scores: PlayerScore[]
    className?: string
}

/**
 * Displays the scoring breakdown for each player
 */
export function ScoringDisplay({
    scores,
    className
}: ScoringDisplayProps) {
    return (
        <div className={cn(
            'flex flex-col gap-6 p-6',
            'bg-gray-800/90 rounded-lg',
            'max-h-[80vh] overflow-y-auto',
            className
        )}>
            <h2 className="text-2xl font-bold text-white text-center">
                Round Scoring
            </h2>

            {/* Player Scores */}
            <div className="flex flex-col gap-6">
                {scores.map((playerScore) => (
                    <div 
                        key={playerScore.playerId}
                        className="flex flex-col gap-3 p-4 bg-gray-700/50 rounded-lg"
                    >
                        {/* Player Name and Total */}
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-white">
                                {playerScore.playerName}
                            </span>
                            <span className="text-2xl font-bold text-yellow-400">
                                {playerScore.totalScore}
                            </span>
                        </div>

                        {/* Score Breakdown */}
                        <div className="flex flex-col gap-2">
                            {/* Base Score */}
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-300">Base Hand Score</span>
                                <span className="text-white font-mono">
                                    +{playerScore.baseScore}
                                </span>
                            </div>

                            {/* Joker Effects */}
                            {playerScore.jokerScores.map((jokerScore, index) => (
                                <div 
                                    key={index}
                                    className="flex flex-col gap-1 border-t border-gray-600 pt-2"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-purple-300">
                                            {jokerScore.joker.name}
                                        </span>
                                        <span className="text-sm font-mono text-purple-300">
                                            +{jokerScore.score}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {jokerScore.description}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Total Line */}
                        <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-600">
                            <span className="font-bold text-gray-300">Total Score</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-xs text-gray-400">
                                    ({playerScore.baseScore} + {playerScore.jokerScores.reduce((sum, js) => sum + js.score, 0)})
                                </span>
                                <span className="text-xl font-bold text-yellow-400">
                                    = {playerScore.totalScore}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
} 