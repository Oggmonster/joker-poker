import { Card as CardModel, Suit, Rank } from '#app/domain/cards'
import { cn } from '#app/utils/cn'

interface CardProps {
    card?: CardModel
    isHidden?: boolean
    isHighlighted?: boolean
    className?: string
}

const SUIT_SYMBOLS = {
    [Suit.HEARTS]: '♥',
    [Suit.DIAMONDS]: '♦',
    [Suit.CLUBS]: '♣',
    [Suit.SPADES]: '♠'
}

const RANK_SYMBOLS = {
    [Rank.ACE]: 'A',
    [Rank.TWO]: '2',
    [Rank.THREE]: '3',
    [Rank.FOUR]: '4',
    [Rank.FIVE]: '5',
    [Rank.SIX]: '6',
    [Rank.SEVEN]: '7',
    [Rank.EIGHT]: '8',
    [Rank.NINE]: '9',
    [Rank.TEN]: '10',
    [Rank.JACK]: 'J',
    [Rank.QUEEN]: 'Q',
    [Rank.KING]: 'K'
}

/**
 * Displays a playing card with rank and suit
 */
export function CardDisplay({
    card,
    isHidden = false,
    isHighlighted = false,
    className
}: CardProps) {
    const isRed = card && (card.suit === Suit.HEARTS || card.suit === Suit.DIAMONDS)

    return (
        <div 
            className={cn(
                'relative w-16 h-24',
                'bg-white rounded-lg shadow-md',
                'flex flex-col justify-between p-2',
                'font-bold select-none',
                isHighlighted && 'ring-2 ring-yellow-400',
                isHidden && 'bg-blue-900 text-transparent',
                'transition-all duration-200',
                className
            )}
        >
            {!isHidden && card ? (
                <>
                    {/* Top Left */}
                    <div className={cn(
                        'flex flex-col items-start leading-none',
                        isRed ? 'text-red-600' : 'text-black'
                    )}>
                        <span>{RANK_SYMBOLS[card.rank]}</span>
                        <span>{SUIT_SYMBOLS[card.suit]}</span>
                    </div>

                    {/* Center */}
                    <div className={cn(
                        'absolute inset-0 flex items-center justify-center',
                        'text-3xl pointer-events-none',
                        isRed ? 'text-red-600' : 'text-black'
                    )}>
                        {SUIT_SYMBOLS[card.suit]}
                    </div>

                    {/* Bottom Right */}
                    <div className={cn(
                        'flex flex-col items-end leading-none rotate-180',
                        isRed ? 'text-red-600' : 'text-black'
                    )}>
                        <span>{RANK_SYMBOLS[card.rank]}</span>
                        <span>{SUIT_SYMBOLS[card.suit]}</span>
                    </div>
                </>
            ) : (
                <div className="absolute inset-0 rounded-lg bg-pattern-cards" />
            )}
        </div>
    )
} 