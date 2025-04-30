import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Rank } from '../cards'
import { Phase } from '../rounds'


/**
 * A joker that gives bonus points for face cards (J, Q, K)
 */
export class FaceCollector extends BaseJoker {
    private static readonly BASE_BONUS = 5
    private static readonly LEVEL_BONUS = 5
    private static readonly FACE_CARDS = [Rank.JACK, Rank.QUEEN, Rank.KING]

    constructor() {
        super(
            'face-collector',
            'Face Collector',
            `${FaceCollector.BASE_BONUS} points for each face card (Jack, Queen, King)`,
            JokerRarity.UNCOMMON,
            JokerType.PLAYER
        )
    }

    private countFaceCards(cards: readonly Card[]): number {
        return cards.filter(card => FaceCollector.FACE_CARDS.includes(card.rank)).length
    }

    public calculateBonus({ holeCards, playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase?: Phase
    }): number {
        if (!playedHand) return 0
        
        const faceCount = this.countFaceCards([...playedHand, ...holeCards])
        if (faceCount === 0) return 0

        const bonus = FaceCollector.BASE_BONUS + 
            (FaceCollector.LEVEL_BONUS * (this.level - 1))

        // Linear bonus for each face card
        return bonus * faceCount
    }

    getEffectDescription(): string {
        const bonus = FaceCollector.BASE_BONUS + 
            (FaceCollector.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points for one face card, doubles for each additional face card`
    }
} 