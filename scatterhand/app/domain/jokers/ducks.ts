import { BaseJoker, JokerRarity, JokerType } from '../joker';
import { Card, Rank } from '../cards';
import { Phase } from '../rounds';


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
        const deucesCount = holeCards.filter(card => card.rank === Rank.TWO).length
        if (deucesCount < 2) return 0

        const bonus = Ducks.BASE_BONUS + 
            (Ducks.LEVEL_BONUS * (this.level - 1));

        return bonus;
    }
} 