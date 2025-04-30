import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Rank } from '../cards'
import { Phase } from '../rounds'

/**
 * A legendary joker that gives bonus points for each face card in your hand
 */
export class PokerFace extends BaseJoker {
    private static readonly BASE_BONUS = 10
    private static readonly LEVEL_BONUS = 10

    constructor() {
        super(
            'poker-face',
            'Poker Face',
            `${PokerFace.BASE_BONUS} points for each face card in your hand`,
            JokerRarity.LEGENDARY,
            JokerType.PLAYER
        )
    }

    private isFaceCard(card: Card): boolean {
        return card.rank === Rank.JACK || 
               card.rank === Rank.QUEEN || 
               card.rank === Rank.KING
    }

    private countFaceCards(cards: readonly Card[]): number {
        return cards.filter(card => card && this.isFaceCard(card)).length
    }

    public calculateBonus({ playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (!playedHand) return 0

        const faceCount = this.countFaceCards(playedHand)
        if (faceCount === 0) return 0

        const bonusPerCard = PokerFace.BASE_BONUS + 
            (PokerFace.LEVEL_BONUS * (this.level - 1))

        return bonusPerCard * faceCount
    }

    getEffectDescription(): string {
        const bonus = PokerFace.BASE_BONUS + 
            (PokerFace.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points for each face card in your hand`
    }
} 