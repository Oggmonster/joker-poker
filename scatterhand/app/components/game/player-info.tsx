import { Player, PlayerStatus } from '#app/domain/player'
import { cn } from '#app/utils/cn'

interface PlayerInfoProps {
    player: Player
    isActive: boolean
    roundScore: number
    status: PlayerStatus
    className?: string
}

const STATUS_COLORS = {
    [PlayerStatus.WAITING]: 'text-gray-500',
    [PlayerStatus.PLAYING]: 'text-white',
    [PlayerStatus.FOLDED]: 'text-red-500',
    [PlayerStatus.ELIMINATED]: 'text-gray-400',
}

/**
 * Shows player information including name, status, and current round score
 */
export function PlayerInfo({
    player,
    isActive,
    roundScore,
    status,
    className
}: PlayerInfoProps) {
    const statusColor = STATUS_COLORS[status]

    return (
        <div
            className={cn(
                'flex flex-col items-center p-2 rounded-lg',
                'bg-gray-800/80 text-white',
                'transition-all duration-200',
                isActive && 'bg-blue-900/80',
                className
            )}
        >
            {/* Player name and status */}
            <div className="text-sm font-bold mb-1">
                {player.getName()}
            </div>
            <div className={cn('text-xs', statusColor)}>
                {status}
            </div>

            {/* Score (only shown when playing) */}
            {status === PlayerStatus.PLAYING && (
                <div className="text-sm mt-1">
                    Score: {roundScore}
                </div>
            )}

            {/* Joker count */}
            <div className="text-xs mt-1">
                {player.getJokers().length} Jokers
            </div>
        </div>
    )
} 