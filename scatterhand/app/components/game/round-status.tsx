import { RoundPhase } from '#app/domain/round-state'

export interface RoundStatusProps {
    phase: RoundPhase
    activePlayerName: string | null
    timeRemaining: number
    maxTime: number
}

/**
 * Displays current round status including phase and timing information
 */
export function RoundStatus({
    phase,
    activePlayerName,
    timeRemaining,
    maxTime
}: RoundStatusProps) {
    return (
        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-4">
                <div className="text-white">
                    <span className="font-bold">Phase: </span>
                    {phase}
                </div>
                {activePlayerName && (
                    <div className="text-white">
                        <span className="font-bold">Active Player: </span>
                        {activePlayerName}
                    </div>
                )}
            </div>
            <div className="text-white">
                <span className="font-bold">Time: </span>
                {timeRemaining}s / {maxTime}s
            </div>
        </div>
    )
} 