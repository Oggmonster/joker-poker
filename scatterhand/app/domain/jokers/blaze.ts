import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Rank } from '../cards'
import { Phase } from '../round-state'

/**
 * A joker that gives bonus points when all cards are face cards (JQK)
 */
export class Blaze extends BaseJoker {
    private static readonly BASE_BONUS = 10
    private static readonly LEVEL_BONUS = 10

    constructor() {
        super(
            'blaze',
            'Blaze',
            `${Blaze.BASE_BONUS} points if all your cards are face cards (JQK)`,
            JokerRarity.UNCOMMON,
            JokerType.PLAYER
        )
    }

    private isFaceCard(card: Card): boolean {
        return card.rank === Rank.JACK || 
               card.rank === Rank.QUEEN || 
               card.rank === Rank.KING
    }

    public calculateBonus({ holeCards, playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase?: Phase
    }): number {

        if (!playedHand) return 0
        
        // Check if all cards are face cards
        const allFaceCards = playedHand.every(card => this.isFaceCard(card))
        if (!allFaceCards) return 0

        const bonus = Blaze.BASE_BONUS + 
            (Blaze.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = Blaze.BASE_BONUS + 
            (Blaze.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if all your cards are face cards (JQK)`
    }
} 