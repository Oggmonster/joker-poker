import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Rank } from '../cards'
import { Phase } from '../round-state'

/**
 * A joker that gives bonus points for having 10-2 and making two pair
 */
export class TheBrunson extends BaseJoker {
    private static readonly BASE_BONUS = 10
    private static readonly LEVEL_BONUS = 10

    constructor() {
        super(
            'the-brunson',
            'The Brunson',
            `${TheBrunson.BASE_BONUS} points if holding 10-2 and make two pair`,
            JokerRarity.UNCOMMON,
            JokerType.PLAYER
        )
    }

    private hasTenTwo(cards: readonly Card[]): boolean {
        if (cards.length !== 2) return false
        
        const card1 = cards[0]
        const card2 = cards[1]
        if (!card1 || !card2) return false

        return (
            (card1.rank === Rank.TEN && card2.rank === Rank.TWO) ||
            (card1.rank === Rank.TWO && card2.rank === Rank.TEN)
        )
    }

    private hasTwoPair(cards: readonly Card[]): boolean {
        // Count occurrences of each rank
        const rankCounts = new Map<Rank, number>()
        for (const card of cards) {
            rankCounts.set(card.rank, (rankCounts.get(card.rank) ?? 0) + 1)
        }

        // Count how many pairs we have
        let pairCount = 0
        for (const count of rankCounts.values()) {
            if (count === 2) pairCount++
        }

        return pairCount === 2
    }

    public calculateBonus({ holeCards, playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        // First check if we have 10-2
        if (!this.hasTenTwo(holeCards)) return 0

        // Then check if we have two pair when considering all cards
        if (!playedHand) return 0
        const allCards = [...holeCards, ...playedHand]
        if (!this.hasTwoPair(allCards)) return 0

        const bonus = TheBrunson.BASE_BONUS + 
            (TheBrunson.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = TheBrunson.BASE_BONUS + 
            (TheBrunson.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if holding 10-2 and make two pair`
    }
} 