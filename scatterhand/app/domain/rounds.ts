import { Card } from './cards'
import { Joker } from './joker'
import { RoundState } from './round-state'
import { Player } from './player'

export enum RoundType {
    SMALL_BLIND = 'SMALL_BLIND',
    BIG_BLIND = 'BIG_BLIND',
    BOSS_BLIND = 'BOSS_BLIND',
    VS_ROUND = 'VS_ROUND'
}

export interface RoundResult {
    playerScores: Map<string, number>  // player ID -> score
    rewards: Map<string, Reward[]>     // player ID -> rewards
    eliminatedPlayerId?: string        // Only for VS rounds
}

export interface Reward {
    type: 'JOKER' | 'COINS'
    value: number | string  // number for coins, joker ID for jokers
}

export interface RoundConfig {
    type: RoundType
    ante: number           // Minimum score threshold
    rewardThreshold: number // Score needed for rewards (for blind rounds)
    roundNumber: number    // Used to scale difficulty
}

/**
 * Base class for all round types
 */
export abstract class Round {
    protected readonly config: RoundConfig
    protected state: RoundState | null = null

    constructor(config: RoundConfig) {
        this.config = config
    }

    /**
     * Initialize the round with a deck and players
     */
    initialize(players: ReadonlyMap<string, Player>, deck: Card[], jokerPool: Joker[]): void {
        this.state = new RoundState(players, deck, jokerPool)
    }

    /**
     * Get the round type
     */
    getType(): RoundType {
        return this.config.type
    }

    /**
     * Get the ante (minimum score threshold)
     */
    getAnte(): number {
        return this.config.ante
    }

    /**
     * Get the reward threshold
     */
    getRewardThreshold(): number {
        return this.config.rewardThreshold
    }

    /**
     * Get the round number
     */
    getRoundNumber(): number {
        return this.config.roundNumber
    }

    /**
     * Get the current round state
     */
    getState(): RoundState | null {
        return this.state
    }

    /**
     * Process the round results and determine rewards
     * @param playerScores Map of player IDs to their scores
     * @returns RoundResult containing scores and rewards
     */
    abstract processResults(playerScores: Map<string, number>): RoundResult
} 