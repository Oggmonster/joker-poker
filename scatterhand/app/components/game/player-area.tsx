import { Card } from '#app/domain/cards'
import { BaseJoker } from '#app/domain/joker'
import { Player } from '#app/domain/player'
import { cn } from '#app/utils/cn'
import { Joker } from './joker'
import { PlayerInfo } from './player-info'

interface PlayerAreaProps {
    player: Player
    isActive: boolean
    cards: Card[]
    roundScore: number
    className?: string
}

/**
 * Displays a player's area including their info, cards, and jokers
 */
export function PlayerArea({
    player,
    isActive,
    cards,
    roundScore,
    className
}: PlayerAreaProps) {
    const playerJokers = player.getJokers()

    return (
        <div className={cn(
            'flex flex-col items-center gap-2',
            'transition-opacity duration-200',
            !isActive && 'opacity-80',
            className
        )}>
            {/* Player Info */}
            <PlayerInfo
                player={player}
                isActive={isActive}
                roundScore={roundScore}
                status={player.getStatus()}
            />

            {/* Player Cards */}
            <div className={cn(
                'flex gap-1',
                'transition-transform duration-200',
                isActive && 'hover:translate-y-[-4px]'
            )}>
                {cards.map((card, index) => (
                    <div 
                        key={index} 
                        className={cn(
                            'w-12 h-16 bg-white rounded-lg',
                            'transform transition-transform duration-200',
                            isActive && 'hover:scale-110'
                        )}
                    >
                        {/* TODO: Add Card component */}
                    </div>
                ))}
            </div>

            {/* Player Jokers */}
            {playerJokers.length > 0 && (
                <div className={cn(
                    'flex flex-wrap gap-1 justify-center max-w-[200px]',
                    'transition-transform duration-200',
                    isActive && 'hover:translate-y-[-4px]'
                )}>
                    {playerJokers.map((joker, index) => {
                        // Skip jokers that aren't BaseJoker instances
                        if (!(joker instanceof BaseJoker)) return null

                        return (
                            <div 
                                key={index}
                                className={cn(
                                    'transform transition-transform duration-200',
                                    isActive && 'hover:scale-110'
                                )}
                            >
                                <Joker joker={joker} />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
} 