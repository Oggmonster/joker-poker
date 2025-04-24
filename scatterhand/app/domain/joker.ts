/**
 * Represents a joker card in the game
 */
export interface Joker {
    /**
     * Unique identifier for the joker
     */
    readonly id: string

    /**
     * Display name of the joker
     */
    readonly name: string

    /**
     * Description of the joker's effect
     */
    readonly effect: string
}

/**
 * Represents the rarity level of a joker
 */
export enum JokerRarity {
    COMMON = 'COMMON',         // Basic jokers with simple effects
    UNCOMMON = 'UNCOMMON',     // Moderate effects, accessible mid-game
    RARE = 'RARE',            // Powerful effects with higher utility
    LEGENDARY = 'LEGENDARY',   // Very rare, powerful effects
    UNIQUE = 'UNIQUE'         // Single-use jokers with game-altering effects
}

/**
 * Base class for implementing jokers
 */
export abstract class BaseJoker implements Joker {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly effect: string,
        public readonly rarity: JokerRarity,
        private _level: number = 1
    ) {
        if (_level < 1 || _level > 5) {
            throw new Error('Joker level must be between 1 and 5')
        }
    }

    /**
     * Get the current level of the joker
     */
    get level(): number {
        return this._level
    }

    /**
     * Upgrade the joker to the next level
     * @throws Error if joker is already at max level
     */
    upgrade(): void {
        if (this._level >= 5) {
            throw new Error('Joker is already at max level')
        }
        this._level++
    }

    /**
     * Apply the joker's effect to a hand
     * This method should be implemented by specific joker types
     */
    abstract applyEffect(hand: readonly any[]): number // TODO: Replace 'any' with proper hand type
} 