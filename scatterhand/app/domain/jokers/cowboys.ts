import { BaseJoker, JokerRarity, JokerType } from '../joker';
import { Card, Rank } from '../cards';
import { Phase } from '../rounds';

/**
 * A joker that gives bonus points for pocket Kings
 */
export class Cowboys extends BaseJoker {
    private static readonly BASE_BONUS = 5;
    private static readonly LEVEL_BONUS = 5;

    constructor() {
        super(
            'cowboys',
            'Cowboys',
            `${Cowboys.BASE_BONUS} points for pocket Kings (KK)`,
            JokerRarity.COMMON,
            JokerType.PLAYER
        );
    }

    public calculateBonus({ holeCards }: {
        holeCards: readonly Card[];
        playedHand?: readonly Card[];
        phase?: Phase;
    }): number {
        const kingsCount = holeCards.filter(card => card.rank === Rank.KING).length
        if (kingsCount < 2) return 0

        const bonus = Cowboys.BASE_BONUS + 
            (Cowboys.LEVEL_BONUS * (this.level - 1));

        return bonus;
    }
} 