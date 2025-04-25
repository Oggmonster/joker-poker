import { BaseJoker, GamePhase, JokerRarity, JokerType } from '../joker'
import { Card, Suit } from '../cards'

/**
 * A joker that gives massive bonus points for having all cards of the same suit
 */
export class LegendaryFlush extends BaseJoker {
    private static readonly BASE_BONUS = 500
    private static readonly LEVEL_BONUS = 500

    constructor() {
        super(
            'legendary-flush',
            'Legendary Flush',
            `${LegendaryFlush.BASE_BONUS} points for each card in a flush`,
            JokerRarity.LEGENDARY,
            JokerType.COMMUNITY
        )
    }

    private countFlushCards(cards: readonly Card[]): number {
        if (cards.length === 0) return 0

        // Count cards of each suit
        const suitCounts = new Map<Suit, number>()
        for (const card of cards) {
            suitCounts.set(card.suit, (suitCounts.get(card.suit) ?? 0) + 1)
        }

        // Return the highest count of any suit
        return Math.max(...suitCounts.values())
    }

    public calculateBonus({ holeCards, playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: GamePhase
    }): number {
        // Consider all available cards
        const allCards = playedHand ? [...holeCards, ...playedHand] : holeCards
        
        const flushCount = this.countFlushCards(allCards)
        if (flushCount < 2) return 0

        const bonus = LegendaryFlush.BASE_BONUS + 
            (LegendaryFlush.LEVEL_BONUS * (this.level - 1))

        // Linear bonus for each card in the flush
        return bonus * flushCount
    }

    getEffectDescription(): string {
        const bonus = LegendaryFlush.BASE_BONUS + 
            (LegendaryFlush.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points for each card in a flush`
    }
} 