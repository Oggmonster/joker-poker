import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Rank } from '../cards'
import { Phase } from '../round-state'

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
        if (cards.length !== 2) return false

        const card1 = cards[0]
        const card2 = cards[1]
        if (!card1 || !card2) return false

        // Must be same suit
        if (card1.suit !== card2.suit) return false

        // Get rank values
        const value1 = OneGapGlory.RANK_VALUES[card1.rank]
        const value2 = OneGapGlory.RANK_VALUES[card2.rank]

        // Check if there's exactly one gap between the ranks
        const diff = Math.abs(value1 - value2)
        return diff === 2
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