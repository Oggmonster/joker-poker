import { BaseJoker, JokerRarity, JokerType } from '../joker';
import { Card, Rank } from '../cards';
import { Phase } from '../rounds';

/**
 * A joker that gives bonus points for having 7-2 offsuit
 */
export class TheHammer extends BaseJoker {
    private static readonly BASE_BONUS = 8;
    private static readonly LEVEL_BONUS = 8;

    constructor() {
        super(
            'the-hammer',
            'The Hammer',
            `${TheHammer.BASE_BONUS} points for holding 7-2`,
            JokerRarity.COMMON,
            JokerType.PLAYER
        );
    }

    public calculateBonus({ holeCards }: {
        holeCards: readonly Card[];
        playedHand?: readonly Card[];
        phase: Phase;
    }): number {
        const has7 = holeCards.some(card => card.rank === Rank.SEVEN)
        const has2 = holeCards.some(card => card.rank === Rank.TWO)
        if (!has7 || !has2) return 0

        const bonus = TheHammer.BASE_BONUS + 
            (TheHammer.LEVEL_BONUS * (this.level - 1));

        return bonus;
    }
} 