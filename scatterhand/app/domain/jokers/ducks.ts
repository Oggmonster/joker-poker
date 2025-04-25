import { BaseJoker, JokerRarity, JokerType } from '../joker';
import { Card, Rank } from '../cards';
import { Phase } from '../round-state';


/**
 * A joker that gives bonus points for pocket deuces (2-2)
 */
export class Ducks extends BaseJoker {
    private static readonly BASE_BONUS = 4;
    private static readonly LEVEL_BONUS = 4;

    constructor() {
        super(
            'ducks',
            'Ducks',
            `${Ducks.BASE_BONUS} points for pocket deuces (2-2)`,
            JokerRarity.COMMON,
            JokerType.PLAYER
        );
    }

    public calculateBonus({ holeCards }: {
        holeCards: readonly Card[];
        playedHand?: readonly Card[];
        phase?: Phase;
    }): number {
        // Only check hole cards for pocket pairs
        if (holeCards.length !== 2) return 0;

        const [card1, card2] = holeCards;
        if (!card1 || !card2) return 0;

        // Check if both cards are deuces
        const hasDeuces = card1.rank === Rank.TWO && card2.rank === Rank.TWO;
        if (!hasDeuces) return 0;

        const bonus = Ducks.BASE_BONUS + 
            (Ducks.LEVEL_BONUS * (this.level - 1));

        return bonus;
    }
} 