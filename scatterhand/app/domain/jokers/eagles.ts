import { BaseJoker, JokerRarity, JokerType } from '../joker';
import { Card, Rank } from '../cards';
import { Phase } from '../rounds';

/**
 * A joker that gives bonus points for having pocket Aces
 */
export class Eagles extends BaseJoker {
    private static readonly BASE_BONUS = 8;
    private static readonly LEVEL_BONUS = 8;

    constructor() {
        super(
            'eagles',
            'Eagles',
            `${Eagles.BASE_BONUS} points for having pocket Aces`,
            JokerRarity.COMMON,
            JokerType.PLAYER
        );
    }

    public calculateBonus({ holeCards, phase }: {
        holeCards: readonly Card[];
        playedHand?: readonly Card[];
        phase: Phase;
    }): number {
        const acesCount = holeCards.filter(card => card.rank === Rank.ACE).length
        if (acesCount < 2) return 0

        const bonus = Eagles.BASE_BONUS + 
            (Eagles.LEVEL_BONUS * (this.level - 1));

        return bonus;
    }
} 