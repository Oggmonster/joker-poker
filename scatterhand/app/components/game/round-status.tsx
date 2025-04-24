import { RoundPhase } from '#app/domain/round-state'
import { cn } from '#app/utils/cn'
import { RoundTimer } from './round-timer'

interface RoundStatusProps {
    phase: RoundPhase
    pot: number
    currentBet: number
    activePlayerName: string | null
    timeRemaining: number
    maxTime: number
    className?: string
}

/**
 * Displays current round status including pot, current bet, and active player
 */
export function RoundStatus({
    phase,
    pot,
    currentBet,
    activePlayerName,
    timeRemaining,
    maxTime,
    className
}: RoundStatusProps) {
    return (
        <div className={cn(
            'flex items-center justify-between',
            'px-6 py-3 bg-gray-800/80 rounded-lg',
            className
        )}>
            {/* Pot and Bet Info */}
            <div className="flex items-center gap-6">
                <div className="flex flex-col">
                    <span className="text-sm text-gray-400">Total Pot</span>
                    <span className="text-xl font-bold text-yellow-400">
                        {pot}
                    </span>
                </div>

                <div className="flex flex-col">
                    <span className="text-sm text-gray-400">Current Bet</span>
                    <span className="text-lg font-bold text-white">
                        {currentBet}
                    </span>
                </div>
            </div>

            {/* Active Player and Timer */}
            <div className="flex items-center gap-4">
                {activePlayerName && phase !== RoundPhase.SCORING && phase !== RoundPhase.COMPLETE && (
                    <>
                        <div className="flex flex-col items-end">
                            <span className="text-sm text-gray-400">Current Turn</span>
                            <span className="text-lg font-bold text-white">
                                {activePlayerName}
                            </span>
                        </div>

                        <RoundTimer
                            timeRemaining={timeRemaining}
                            maxTime={maxTime}
                            isActive={true}
                        />
                    </>
                )}

                {phase === RoundPhase.SCORING && (
                    <div className="text-lg font-bold text-yellow-400">
                        Scoring in progress...
                    </div>
                )}

                {phase === RoundPhase.COMPLETE && (
                    <div className="text-lg font-bold text-green-400">
                        Round Complete
                    </div>
                )}
            </div>
        </div>
    )
} 