import { cn } from '#app/utils/cn'

export enum HandRankType {
    HIGH_CARD = 'HIGH_CARD',
    PAIR = 'PAIR',
    TWO_PAIR = 'TWO_PAIR',
    THREE_OF_A_KIND = 'THREE_OF_A_KIND',
    STRAIGHT = 'STRAIGHT',
    FLUSH = 'FLUSH',
    FULL_HOUSE = 'FULL_HOUSE',
    FOUR_OF_A_KIND = 'FOUR_OF_A_KIND',
    STRAIGHT_FLUSH = 'STRAIGHT_FLUSH',
    ROYAL_FLUSH = 'ROYAL_FLUSH'
}

const RANK_DISPLAY = {
    [HandRankType.HIGH_CARD]: {
        name: 'High Card',
        color: 'text-gray-400'
    },
    [HandRankType.PAIR]: {
        name: 'Pair',
        color: 'text-blue-400'
    },
    [HandRankType.TWO_PAIR]: {
        name: 'Two Pair',
        color: 'text-blue-500'
    },
    [HandRankType.THREE_OF_A_KIND]: {
        name: 'Three of a Kind',
        color: 'text-green-400'
    },
    [HandRankType.STRAIGHT]: {
        name: 'Straight',
        color: 'text-green-500'
    },
    [HandRankType.FLUSH]: {
        name: 'Flush',
        color: 'text-yellow-400'
    },
    [HandRankType.FULL_HOUSE]: {
        name: 'Full House',
        color: 'text-yellow-500'
    },
    [HandRankType.FOUR_OF_A_KIND]: {
        name: 'Four of a Kind',
        color: 'text-purple-400'
    },
    [HandRankType.STRAIGHT_FLUSH]: {
        name: 'Straight Flush',
        color: 'text-purple-500'
    },
    [HandRankType.ROYAL_FLUSH]: {
        name: 'Royal Flush',
        color: 'text-red-500'
    }
}

interface HandRankProps {
    rank: HandRankType
    description?: string
    score?: number
    isAnimated?: boolean
    className?: string
}

/**
 * Displays a poker hand rank with optional description and score
 */
export function HandRank({
    rank,
    description,
    score,
    isAnimated = false,
    className
}: HandRankProps) {
    const { name, color } = RANK_DISPLAY[rank]

    return (
        <div 
            className={cn(
                'flex flex-col items-center gap-1 p-2',
                'bg-gray-800/80 rounded-lg',
                isAnimated && 'transition-all duration-300 hover:scale-105',
                className
            )}
        >
            {/* Rank Name */}
            <div className={cn(
                'text-lg font-bold',
                color,
                'transition-colors duration-200'
            )}>
                {name}
            </div>

            {/* Description */}
            {description && (
                <div className="text-sm text-gray-400 text-center">
                    {description}
                </div>
            )}

            {/* Score */}
            {score !== undefined && (
                <div className="text-sm font-mono text-yellow-400">
                    {score} points
                </div>
            )}
        </div>
    )
} 