import { Card } from './cards';
import { Phase } from './round-state';

/**
 * Type of joker based on who can use it
 */
export enum JokerType {
    PLAYER = 'PLAYER',     // Joker that belongs to and only affects a specific player
    COMMUNITY = 'COMMUNITY' // Joker that affects all players in the game
}

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

    /**
     * Type of the joker (player or community)
     */
    readonly type: JokerType

    /**
     * Calculate bonus points based on the current game state
     */
    calculateBonus(params: {
        holeCards: readonly Card[];
        playedHand?: readonly Card[];
        phase: Phase;
    }): number
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
        public readonly type: JokerType,
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
     * Calculate bonus points based on the current game state
     * This method must be implemented by specific joker types
     */
    abstract calculateBonus(params: {
        holeCards: readonly Card[];
        playedHand?: readonly Card[];
        phase: Phase;
    }): number
} 