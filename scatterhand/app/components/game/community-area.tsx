import { Card } from '#app/domain/cards'
import { BaseJoker } from '#app/domain/joker'
import { RoundPhase } from '#app/domain/round-state'
import { cn } from '#app/utils/cn'
import { Joker } from './joker'

interface CommunityAreaProps {
    phase: RoundPhase
    cards: Card[]
    jokers: BaseJoker[]
    className?: string
}

const PHASE_COLORS: Record<RoundPhase, string> = {
    [RoundPhase.PRE_FLOP]: 'text-gray-400',
    [RoundPhase.FLOP]: 'text-blue-400',
    [RoundPhase.TURN]: 'text-green-400',
    [RoundPhase.RIVER]: 'text-purple-400',
    [RoundPhase.SCORING]: 'text-yellow-400',
    [RoundPhase.COMPLETE]: 'text-red-400'
}

/**
 * Displays the community area including phase indicator, cards, and jokers
 */
export function CommunityArea({
    phase,
    cards,
    jokers,
    className
}: CommunityAreaProps) {
    const phaseColor = PHASE_COLORS[phase]

    return (
        <div className={cn('flex flex-col items-center gap-4', className)}>
            {/* Phase Indicator */}
            <div 
                className={cn(
                    'text-lg font-bold tracking-wide',
                    'transition-colors duration-300',
                    phaseColor
                )}
            >
                {phase}
            </div>

            {/* Community Cards */}
            <div className={cn(
                'flex gap-2',
                'transition-opacity duration-300',
                phase === RoundPhase.PRE_FLOP && 'opacity-0'
            )}>
                {cards.map((card, index) => (
                    <div 
                        key={index}
                        className={cn(
                            'w-16 h-24 bg-white rounded-lg',
                            'transform transition-all duration-300',
                            {
                                'opacity-0 scale-90': phase === RoundPhase.PRE_FLOP,
                                'opacity-100 scale-100': phase !== RoundPhase.PRE_FLOP,
                                'hover:scale-110': phase === RoundPhase.SCORING
                            }
                        )}
                    >
                        {/* TODO: Add Card component */}
                    </div>
                ))}
            </div>

            {/* Community Jokers */}
            {jokers.length > 0 && (
                <div className={cn(
                    'flex flex-wrap gap-2 justify-center',
                    'max-w-[400px] p-2',
                    'bg-gray-800/50 rounded-lg',
                    'transition-all duration-300',
                    phase === RoundPhase.PRE_FLOP && 'opacity-0 translate-y-4'
                )}>
                    {jokers.map((joker, index) => (
                        <div 
                            key={index}
                            className={cn(
                                'transform transition-transform duration-200',
                                phase === RoundPhase.SCORING && 'hover:scale-110'
                            )}
                        >
                            <Joker joker={joker} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
} 