import { Card, Suit, Rank } from '#app/domain/cards'
import { cn } from '#app/utils/cn'

interface CardProps {
    card: Card
    isSelected?: boolean
    onClick?: () => void
    className?: string
}

const SUIT_SYMBOLS = {
    [Suit.HEARTS]: '♥',
    [Suit.DIAMONDS]: '♦',
    [Suit.CLUBS]: '♣',
    [Suit.SPADES]: '♠'
}

const RANK_DISPLAY = {
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
export function CardDisplay({ card, isSelected, onClick, className }: CardProps) {
    const isRed = card.suit === Suit.HEARTS || card.suit === Suit.DIAMONDS

    return (
        <div 
            className={cn(
                "w-full h-full rounded-lg p-2 cursor-pointer transition-all",
                "bg-white hover:bg-gray-50",
                isSelected && "ring-4 ring-yellow-400",
                className
            )}
            onClick={onClick}
        >
            <div className={cn(
                "flex flex-col h-full",
                isRed ? "text-red-600" : "text-black"
            )}>
                {/* Top */}
                <div className="text-lg font-bold">
                    {RANK_DISPLAY[card.rank]}
                    <span className="ml-1">{SUIT_SYMBOLS[card.suit]}</span>
                </div>

                {/* Center */}
                <div className="flex-1 flex items-center justify-center text-4xl">
                    {SUIT_SYMBOLS[card.suit]}
                </div>

                {/* Bottom */}
                <div className="text-lg font-bold rotate-180">
                    {RANK_DISPLAY[card.rank]}
                    <span className="ml-1">{SUIT_SYMBOLS[card.suit]}</span>
                </div>
            </div>
        </div>
    )
} 