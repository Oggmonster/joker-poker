import { BaseJoker, JokerRarity } from '../joker'
import { Card, Suit } from '../cards'

/**
 * A legendary joker that gives massive bonus points for collecting cards of the same suit
 */
export class LegendaryFlush extends BaseJoker {
    private static readonly BASE_BONUS = 500
    private static readonly LEVEL_BONUS = 500

    constructor(id: string) {
        super(
            id,
            'Legendary Flush',
            'Massive bonus points for cards of the same suit',
            JokerRarity.LEGENDARY
        )
    }

    applyEffect(hand: readonly Card[]): number {
        // Count cards of each suit
        const suitCounts = new Map<Suit, number>()
        for (const card of hand) {
            suitCounts.set(card.suit, (suitCounts.get(card.suit) || 0) + 1)
        }

        // Find the suit with the most cards
        let maxCount = 0
        for (const count of suitCounts.values()) {
            maxCount = Math.max(maxCount, count)
        }

        if (maxCount < 3) return 0

        const bonus = LegendaryFlush.BASE_BONUS + 
            (LegendaryFlush.LEVEL_BONUS * (this.level - 1))

        // Super exponential bonus for more cards of the same suit
        return bonus * Math.pow(3, maxCount - 2)
    }

    getEffectDescription(): string {
        const bonus = LegendaryFlush.BASE_BONUS + 
            (LegendaryFlush.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points for 3 cards of the same suit, triples for each additional card of that suit`
    }
} 