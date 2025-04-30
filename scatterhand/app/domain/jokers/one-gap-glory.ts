import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Rank } from '../cards'
import { Phase } from '../rounds'

/**
 * A joker that gives bonus points for holding a one-gap suited connector (e.g., 9-7 suited)
 */
export class OneGapGlory extends BaseJoker {
    private static readonly BASE_BONUS = 5
    private static readonly LEVEL_BONUS = 5

    // Map of rank values for comparing cards
    private static readonly RANK_VALUES = {
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
        [Rank.ACE]: 14,
    }

    constructor() {
        super(
            'one-gap-glory',
            'One Gap Glory',
            `${OneGapGlory.BASE_BONUS} points if holding a one-gap suited connector (e.g., 9-7 suited)`,
            JokerRarity.UNCOMMON,
            JokerType.PLAYER
        )
    }

    private isOneGapConnector(cards: readonly Card[]): boolean {
        // Need at least 2 cards to check for one-gap connectors
        if (cards.length < 2) return false

        // Check all pairs of cards
        for (let i = 0; i < cards.length - 1; i++) {
            for (let j = i + 1; j < cards.length; j++) {
                const card1 = cards[i]
                const card2 = cards[j]
                if (!card1 || !card2) continue

                // Must be same suit
                if (card1.suit !== card2.suit) continue

                // Get rank values
                const value1 = OneGapGlory.RANK_VALUES[card1.rank]
                const value2 = OneGapGlory.RANK_VALUES[card2.rank]

                // Check if there's exactly one gap between the ranks
                const diff = Math.abs(value1 - value2)
                if (diff === 2) return true
            }
        }

        return false
    }

    public calculateBonus({ holeCards }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (!this.isOneGapConnector(holeCards)) return 0

        const bonus = OneGapGlory.BASE_BONUS + 
            (OneGapGlory.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = OneGapGlory.BASE_BONUS + 
            (OneGapGlory.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if holding a one-gap suited connector (e.g., 9-7 suited)`
    }
} 