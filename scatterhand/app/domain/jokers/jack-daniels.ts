import { BaseJoker, GamePhase, JokerRarity, JokerType } from '../joker';
import { Card, Rank } from '../cards';

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
            `${JackDaniels.BASE_BONUS} points for having Jack-Ten (JT)`,
            JokerRarity.COMMON,
            JokerType.PLAYER
        );
    }

    public calculateBonus({ holeCards, phase }: {
        holeCards: readonly Card[];
        playedHand?: readonly Card[];
        phase: GamePhase;
    }): number {
        // Only check hole cards
        if (holeCards.length !== 2) return 0;

        const [card1, card2] = holeCards;
        if (!card1 || !card2) return 0;

        // Check if cards are Jack and Ten in any order
        const hasJackTen = (
            (card1.rank === Rank.JACK && card2.rank === Rank.TEN) ||
            (card1.rank === Rank.TEN && card2.rank === Rank.JACK)
        );
        
        if (!hasJackTen) return 0;

        const bonus = JackDaniels.BASE_BONUS + 
            (JackDaniels.LEVEL_BONUS * (this.level - 1));

        return bonus;
    }
} 