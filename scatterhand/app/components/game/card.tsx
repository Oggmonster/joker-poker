import { Card as CardType, Rank, Suit } from '#app/domain/cards'
import { BaseSelectable, BaseSelectableProps } from './base-selectable'
import { cn } from '#app/utils/cn'

interface CardProps extends Omit<BaseSelectableProps, 'children'> {
    card: CardType
}

const SUIT_COLORS = {
    [Suit.HEARTS]: 'text-red-500',
    [Suit.DIAMONDS]: 'text-red-500',
    [Suit.CLUBS]: 'text-gray-800',
    [Suit.SPADES]: 'text-gray-800',
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
    [Rank.KING]: 'K',
}

const SUIT_SYMBOLS = {
    [Suit.HEARTS]: '♥',
    [Suit.DIAMONDS]: '♦',
    [Suit.CLUBS]: '♣',
    [Suit.SPADES]: '♠',
}

/**
 * Card component that displays a playing card
 * Uses BaseSelectable for selection and hover states
 */
export function Card({ card, className, ...props }: CardProps) {
    const { suit, rank } = card
    const suitColor = SUIT_COLORS[suit]
    const rankDisplay = RANK_DISPLAY[rank]
    const suitSymbol = SUIT_SYMBOLS[suit]

    return (
        <BaseSelectable
            className={cn(
                'w-24 h-36 bg-white p-2',
                'flex flex-col items-center justify-between',
                suitColor,
                className
            )}
            {...props}
        >
            {/* Top left rank and suit */}
            <div className="self-start text-lg font-bold">
                <div>{rankDisplay}</div>
                <div>{suitSymbol}</div>
            </div>

            {/* Center suit */}
            <div className="text-4xl">{suitSymbol}</div>

            {/* Bottom right rank and suit (inverted) */}
            <div className="self-end text-lg font-bold rotate-180">
                <div>{rankDisplay}</div>
                <div>{suitSymbol}</div>
            </div>
        </BaseSelectable>
    )
} 