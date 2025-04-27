import { Rank } from './cards'
import { Player } from './player'
import { Round, RoundType, RoundResult, RoundConfig } from './rounds'
import { BigBlindRound } from './rounds/big-blind-round'
import { BossBlindRound, BossHandicap } from './rounds/boss-blind-round'
import { SmallBlindRound } from './rounds/small-blind-round'
import { VsRound } from './rounds/vs-round'

export interface GameConfig {
    minPlayers: number
    maxPlayers: number
    startingAnte: number
    anteIncrease: number
    rewardThresholdMultiplier: number
}

export enum GameStatus {
    WAITING = 'WAITING',       // Waiting for players
    IN_PROGRESS = 'IN_PROGRESS',
    FINISHED = 'FINISHED'
}

/**
 * Main game class that manages the game state and progression
 */
export class Game {
    private players: Map<string, Player>
    private status: GameStatus
    private currentRound: Round | null
    private roundNumber: number
    private currentAnte: number
    private readonly config: GameConfig
    

    constructor(config: GameConfig) {
        this.config = config
        this.players = new Map()
        this.status = GameStatus.WAITING
        this.currentRound = null
        this.roundNumber = 0
        this.currentAnte = config.startingAnte
    }

    /**
     * Add a player to the game
     */
    addPlayer(player: Player): boolean {
        if (this.status !== GameStatus.WAITING) {
            return false
        }
        if (this.players.size >= this.config.maxPlayers) {
            return false
        }
        this.players.set(player.id, player)
        return true
    }

    /**
     * Start the game if enough players have joined
     */
    start(): boolean {
        if (this.status !== GameStatus.WAITING) {
            return false
        }
        if (this.players.size < this.config.minPlayers) {
            return false
        }
        this.status = GameStatus.IN_PROGRESS
        return true
    }

    /**
     * Get the current round type based on round number
     */
    private getCurrentRoundType(): RoundType {
        const cycle = this.roundNumber % 4
        switch (cycle) {
            case 0: return RoundType.SMALL_BLIND
            case 1: return RoundType.BIG_BLIND
            case 2: return RoundType.BOSS_BLIND
            case 3: return RoundType.VS_ROUND
            default: throw new Error('Invalid round cycle')
        }
    }

    /**
     * Create config for the next round
     */
    private createRoundConfig(): RoundConfig {
        return {
            type: this.getCurrentRoundType(),
            ante: this.currentAnte,
            rewardThreshold: this.currentAnte * this.config.rewardThresholdMultiplier,
            roundNumber: this.roundNumber
        }
    }

    /**
     * Start the next round
     */
    startNextRound(): Round {
        if (this.status !== GameStatus.IN_PROGRESS) {
            throw new Error('Game is not in progress')
        }

        // Update ante every 4 rounds (after VS round)
        if (this.roundNumber % 4 === 0) {
            this.currentAnte += this.config.anteIncrease
        }

        

        console.log('Starting round', this.roundNumber)
        console.log('Current ante', this.currentAnte)
        
        // TODO: Create specific round instance based on type
        const config = this.createRoundConfig()
        
        switch (config.type) {
            case RoundType.SMALL_BLIND:
                this.currentRound = new SmallBlindRound(config)
                break
            case RoundType.BIG_BLIND:
                this.currentRound = new BigBlindRound(config)
                break
            case RoundType.BOSS_BLIND:
                this.currentRound = new BossBlindRound(
                    {
                        ...config,
                        handicaps: [this.getRandomBossHandicap()],
                        maxCardValue: Rank.JACK,
                    }
                )
                break
            case RoundType.VS_ROUND:
                this.currentRound = new VsRound(config)
                break
            default:
                throw new Error('Invalid round type')
        }

        console.log('Current round', this.currentRound)
        return this.currentRound
    }

    private getRandomBossHandicap(): BossHandicap {
        const handicaps = Object.values(BossHandicap)
        const randomIndex = Math.floor(Math.random() * handicaps.length)
        const handicap = handicaps[randomIndex]        
        if (!handicap) {
            throw new Error('Invalid handicap')
        }
        return handicap
    }
    
    /**
     * Process the results of the current round
     */
    processRoundResults(playerScores: Map<string, number>): RoundResult {
        if (!this.currentRound) {
            throw new Error('No active round')
        }

        const result = this.currentRound.processResults(playerScores)

        // Handle player elimination in VS rounds
        if (result.eliminatedPlayerId) {
            const eliminatedPlayer = this.players.get(result.eliminatedPlayerId)
            if (eliminatedPlayer) {
                eliminatedPlayer.eliminate()                
            }
        }

        // Check if game is finished (only one player left)
        if (this.players.size === 1) {
            this.status = GameStatus.FINISHED
        }

        this.roundNumber++
        
        return result
    }

    /**
     * Get the current game status
     */
    getStatus(): GameStatus {
        return this.status
    }

    /**
     * Get all active players
     */
    getPlayers(): ReadonlyMap<string, Player> {
        return this.players
    }

    /**
     * Get the current round number
     */
    getRoundNumber(): number {
        return this.roundNumber
    }

    /**
     * Get the current ante
     */
    getCurrentAnte(): number {
        return this.currentAnte
    }
} 