import { BaseJoker, JokerRarity } from '../joker'
import { Card, Rank } from '../cards'

/**
 * A joker that gives bonus points for face cards (J, Q, K)
 */
export class FaceCollector extends BaseJoker {
    private static readonly BASE_BONUS = 100
    private static readonly LEVEL_BONUS = 100

    constructor(id: string) {
        super(
            id,
            'Face Collector',
            'Bonus points for face cards in your hand',
            JokerRarity.UNCOMMON
        )
    }

    applyEffect(hand: readonly Card[]): number {
        const faceCards = hand.filter(card => 
            card.rank === Rank.JACK || 
            card.rank === Rank.QUEEN || 
            card.rank === Rank.KING
        )

        const bonus = FaceCollector.BASE_BONUS + 
            (FaceCollector.LEVEL_BONUS * (this.level - 1))

        // Exponential bonus for collecting multiple face cards
        return faceCards.length > 0 ? 
            bonus * Math.pow(2, faceCards.length - 1) : 0
    }

    getEffectDescription(): string {
        const bonus = FaceCollector.BASE_BONUS + 
            (FaceCollector.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points for one face card, doubles for each additional face card`
    }
} 