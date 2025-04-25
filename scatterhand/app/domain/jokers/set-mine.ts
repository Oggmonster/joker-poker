import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card } from '../cards'
import { Phase } from '../round-state'
import { HandEvaluator, HandRank } from '../scoring'

/**
 * A joker that gives bonus points for hitting Three of a Kind with a pocket pair
 */
export class SetMine extends BaseJoker {
    private static readonly BASE_BONUS = 12
    private static readonly LEVEL_BONUS = 12

    constructor() {
        super(
            'set-mine',
            'Set Mine',
            `${SetMine.BASE_BONUS} points if you hit Three of a Kind with a pocket pair`,
            JokerRarity.RARE,
            JokerType.PLAYER
        )
    }

    private hasPocketPair(cards: readonly Card[]): boolean {
        if (cards.length !== 2) return false
        const card1 = cards[0]
        const card2 = cards[1]
        if (!card1 || !card2) return false
        return card1.rank === card2.rank
    }

    public calculateBonus({ holeCards, playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        // First check if we have a pocket pair
        if (!this.hasPocketPair(holeCards)) return 0

        // Then check if we made three of a kind
        if (!playedHand) return 0
        const result = HandEvaluator.evaluate([...playedHand])
        if (result.handRank !== HandRank.THREE_OF_A_KIND) return 0

        // Finally check if at least one hole card was used
        if (holeCards.some(card => !playedHand.includes(card))) return 0

        const bonus = SetMine.BASE_BONUS + 
            (SetMine.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = SetMine.BASE_BONUS + 
            (SetMine.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if you hit Three of a Kind with a pocket pair`
    }
} 