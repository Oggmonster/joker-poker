import { BaseJoker, JokerRarity, JokerType } from '../joker';
import { Card, Rank, Suit } from '../cards';
import { Phase } from '../rounds';


/**
 * A joker that gives bonus points for having Ace of Spades and Eight of Spades
 */
export class DeadMansHand extends BaseJoker {
    private static readonly BASE_BONUS = 12;
    private static readonly LEVEL_BONUS = 6;

    constructor() {
        super(
            'dead-mans-hand',
            'Dead Man\'s Hand',
            `${DeadMansHand.BASE_BONUS} points for holding A♠ and 8♠`,
            JokerRarity.COMMON,
            JokerType.PLAYER
        );
    }

    public calculateBonus({ holeCards }: {
        holeCards: readonly Card[];
        playedHand?: readonly Card[];
        phase?: Phase;
    }): number {
        const hasAceOfSpades = holeCards.some(card => card.rank === Rank.ACE && card.suit === Suit.SPADES)
        const hasEightOfSpades = holeCards.some(card => card.rank === Rank.EIGHT && card.suit === Suit.SPADES)
        if (!hasAceOfSpades || !hasEightOfSpades) return 0

        const bonus = DeadMansHand.BASE_BONUS + 
            (DeadMansHand.LEVEL_BONUS * (this.level - 1));

        return bonus;
    }
} 