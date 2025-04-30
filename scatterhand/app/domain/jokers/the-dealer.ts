import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Rank } from '../cards'
import { Phase } from '../rounds'

/**
 * A unique joker that gives bonus points for holding two cards below 10
 */
export class TheDealer extends BaseJoker {
    private static readonly BASE_BONUS = 20
    private static readonly LEVEL_BONUS = 10

    constructor() {
        super(
            'the-dealer',
            'The Dealer',
            `${TheDealer.BASE_BONUS} points if you hold exactly two cards below 10`,
            JokerRarity.UNIQUE,
            JokerType.PLAYER
        )
    }

    private isCardBelowTen(card: Card): boolean {
        const value = card.rank
        return value < Rank.TEN
    }

    private hasTwoCardsBelowTen(cards: readonly Card[]): boolean {
        const cardsBelowTenCount = cards.filter(card => card && this.isCardBelowTen(card)).length
        return cardsBelowTenCount === 2
    }

    public calculateBonus({ holeCards }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (!this.hasTwoCardsBelowTen(holeCards)) return 0

        const bonus = TheDealer.BASE_BONUS + 
            (TheDealer.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = TheDealer.BASE_BONUS + 
            (TheDealer.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if you hold two cards below 10`
    }
} 