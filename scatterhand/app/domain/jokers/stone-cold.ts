import { BaseJoker, JokerRarity, JokerType } from '../joker';
import { Card, Rank } from '../cards';
import { Phase } from '../rounds';

/**
 * A joker that gives bonus points for having 7-4
 */
export class StoneCold extends BaseJoker {
    private static readonly BASE_BONUS = 3;
    private static readonly LEVEL_BONUS = 3;

    constructor() {
        super(
            'stone-cold',
            'Stone Cold',
            `${StoneCold.BASE_BONUS} points for holding 7-4`,
            JokerRarity.COMMON,
            JokerType.PLAYER
        );
    }

    public calculateBonus({ holeCards }: {
        holeCards: readonly Card[];
        playedHand?: readonly Card[];
        phase?: Phase;
    }): number {
       const has7 = holeCards.some(card => card.rank === Rank.SEVEN)
       const has4 = holeCards.some(card => card.rank === Rank.FOUR)
       if (!has7 || !has4) return 0 
       

        const bonus = StoneCold.BASE_BONUS + 
            (StoneCold.LEVEL_BONUS * (this.level - 1));

        return bonus;
    }
} 