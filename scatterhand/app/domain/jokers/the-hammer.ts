import { BaseJoker, GamePhase, JokerRarity, JokerType } from '../joker';
import { Card, Rank } from '../cards';

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
            `${TheHammer.BASE_BONUS} points for having 7-2 offsuit`,
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

        // Check if cards are 7 and 2 in any order
        const has72 = (
            (card1.rank === Rank.SEVEN && card2.rank === Rank.TWO) ||
            (card1.rank === Rank.TWO && card2.rank === Rank.SEVEN)
        );
        
        // Must be offsuit
        const isOffsuit = card1.suit !== card2.suit;
        
        if (!has72 || !isOffsuit) return 0;

        const bonus = TheHammer.BASE_BONUS + 
            (TheHammer.LEVEL_BONUS * (this.level - 1));

        return bonus;
    }
} 