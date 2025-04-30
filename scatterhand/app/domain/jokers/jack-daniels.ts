import { BaseJoker, JokerRarity, JokerType } from '../joker';
import { Card, Rank } from '../cards';
import { Phase } from '../rounds';

/**
 * A joker that gives bonus points for having Jack-Ten
 */
export class JackDaniels extends BaseJoker {
    private static readonly BASE_BONUS = 4;
    private static readonly LEVEL_BONUS = 4;

    constructor() {
        super(
            'jack-daniels',
            'Jack Daniels',
            `${JackDaniels.BASE_BONUS} points for holding Jack-Ten (JT)`,
            JokerRarity.COMMON,
            JokerType.PLAYER
        );
    }

    public calculateBonus({ holeCards }: {
        holeCards: readonly Card[];
        playedHand?: readonly Card[];
        phase?: Phase;
    }): number {
        const hasJack = holeCards.some(card => card.rank === Rank.JACK)
        const hasTen = holeCards.some(card => card.rank === Rank.TEN)
        if (!hasJack || !hasTen) return 0

        const bonus = JackDaniels.BASE_BONUS + 
            (JackDaniels.LEVEL_BONUS * (this.level - 1));

        return bonus;
    }
} 