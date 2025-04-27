import { BaseJoker, JokerRarity, JokerType } from '../joker';
import { Card, Rank } from '../cards';
import { Phase } from '../rounds';

/**
 * A joker that gives bonus points for pocket eights (8-8)
 */
export class Snowmen extends BaseJoker {
    private readonly baseBonus: number = 4;
    private readonly levelBonus: number = 4;

    constructor() {
        super(
            'snowmen',
            'Snowmen',
            'Bonus points for pocket eights (8-8)',
            JokerRarity.COMMON,
            JokerType.PLAYER
        );
    }

    calculateBonus({ holeCards, phase }: { holeCards: Card[], phase: Phase }): number {
        if (phase !== Phase.FLOP || !holeCards || holeCards.length !== 2) {
            return 0;
        }

        // Since we checked length === 2 above, we know these exist
        const card1 = holeCards[0];
        const card2 = holeCards[1];
        
        if (!card1 || !card2) {
            return 0;
        }
        
        if (card1.rank === Rank.EIGHT && card2.rank === Rank.EIGHT) {
            return this.baseBonus + (this.level - 1) * this.levelBonus;
        }

        return 0;
    }

    getDescription(): string {
        return `Level ${this.level} - Bonus points for pocket eights (${this.baseBonus + (this.level - 1) * this.levelBonus} points)`;
    }
} 