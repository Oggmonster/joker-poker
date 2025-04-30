import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Rank } from '../cards'
import { Phase } from '../rounds'

/**
 * A joker that gives bonus points for each 2 in the played hand
 */
export class QuackQuack extends BaseJoker {
    private static readonly BASE_BONUS = 2
    private static readonly LEVEL_BONUS = 2

    constructor() {
        super(
            'quack-quack',
            'Quack Quack',
            `${QuackQuack.BASE_BONUS} points for each 2 in the hand you play`,
            JokerRarity.UNCOMMON,
            JokerType.PLAYER
        )
    }

    public calculateBonus({ playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (!playedHand) return 0

        // Count how many 2s are in the played hand
        const twoCount = playedHand.filter(card => card.rank === Rank.TWO).length

        if (twoCount === 0) return 0

        const bonusPerTwo = QuackQuack.BASE_BONUS + 
            (QuackQuack.LEVEL_BONUS * (this.level - 1))

        return bonusPerTwo * twoCount
    }

    getEffectDescription(): string {
        const bonus = QuackQuack.BASE_BONUS + 
            (QuackQuack.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points for each 2 in the hand you play`
    }
} 