import { BaseJoker, JokerRarity, JokerType } from '../joker';
import { Card, Rank } from '../cards';
import { Phase } from '../rounds';

/**
 * A joker that gives bonus points for pocket nines (9-9)
 */
export class Lollipops extends BaseJoker {
    private static readonly BASE_BONUS = 4;
    private static readonly LEVEL_BONUS = 4;

    constructor() {
        super(
            'lollipops',
            'Lollipops',
            `${Lollipops.BASE_BONUS} points for pocket nines (9-9)`,
            JokerRarity.COMMON,
            JokerType.PLAYER
        );
    }

    public calculateBonus({ holeCards }: {
        holeCards: readonly Card[];
        playedHand?: readonly Card[];
        phase?: Phase;
    }): number {
        const ninesCount = holeCards.filter(card => card.rank === Rank.NINE).length
        if (ninesCount < 2) return 0

        const bonus = Lollipops.BASE_BONUS + 
            (Lollipops.LEVEL_BONUS * (this.level - 1));

        return bonus;
    }
} 