import { BaseJoker, JokerRarity } from '../joker'
import { Card, Rank } from '../cards'

/**
 * A joker that gives bonus points for pairs and sets
 */
export class PairMaster extends BaseJoker {
    private static readonly BASE_BONUS = 75
    private static readonly LEVEL_BONUS = 75

    constructor(id: string) {
        super(
            id,
            'Pair Master',
            'Bonus points for pairs and sets, with extra points for higher ranks',
            JokerRarity.UNCOMMON
        )
    }

    private getRankValue(rank: Rank): number {
        // Higher ranks are worth more
        const rankValues: Record<Rank, number> = {
            [Rank.TWO]: 2,
            [Rank.THREE]: 3,
            [Rank.FOUR]: 4,
            [Rank.FIVE]: 5,
            [Rank.SIX]: 6,
            [Rank.SEVEN]: 7,
            [Rank.EIGHT]: 8,
            [Rank.NINE]: 9,
            [Rank.TEN]: 10,
            [Rank.JACK]: 11,
            [Rank.QUEEN]: 12,
            [Rank.KING]: 13,
            [Rank.ACE]: 14
        }
        return rankValues[rank]
    }

    applyEffect(hand: readonly Card[]): number {
        // Count cards of each rank
        const rankCounts = new Map<Rank, number>()
        for (const card of hand) {
            rankCounts.set(card.rank, (rankCounts.get(card.rank) || 0) + 1)
        }

        let score = 0
        const bonus = PairMaster.BASE_BONUS + 
            (PairMaster.LEVEL_BONUS * (this.level - 1))

        for (const [rank, count] of rankCounts.entries()) {
            if (count >= 2) {
                // Score = base * rank value * 2^(count-2)
                // This means pairs get 1x, three of a kind gets 2x, four of a kind gets 4x
                score += bonus * this.getRankValue(rank) * Math.pow(2, count - 2)
            }
        }

        return score
    }

    getEffectDescription(): string {
        const bonus = PairMaster.BASE_BONUS + 
            (PairMaster.LEVEL_BONUS * (this.level - 1))
        return `${bonus} × rank value for pairs, doubles for each additional matching card`
    }
} 