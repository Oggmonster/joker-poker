import { BaseJoker, JokerRarity, JokerType } from '../joker';
import { Card, Rank } from '../cards';

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

    calculateBonus({ holeCards }: { holeCards: Card[] }): number {
        const eightsCount = holeCards.filter(card => card.rank === Rank.EIGHT).length
        if (eightsCount < 2) return 0

        return this.baseBonus + (this.level - 1) * this.levelBonus;
    }

    getDescription(): string {
        return `Level ${this.level} - Bonus points for pocket eights (${this.baseBonus + (this.level - 1) * this.levelBonus} points)`;
    }
} 