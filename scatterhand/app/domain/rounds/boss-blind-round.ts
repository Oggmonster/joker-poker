import { Round, RoundType, RoundResult, RoundConfig, Reward } from '../rounds'
import { Rank } from '../cards'

/**
 * Types of handicaps that can be applied in boss blind rounds
 */
export enum BossHandicap {
    FACE_CARDS_DEBUFF = 'FACE_CARDS_DEBUFF',     // Face cards (J, Q, K) count as lower value
    NO_JOKERS = 'NO_JOKERS',                     // Jokers cannot be used
    NO_PAIRS = 'NO_PAIRS',                       // Pairs don't count for scoring
    HEARTS_ONLY = 'HEARTS_ONLY',                 // Only hearts count for scoring
    EVENS_ONLY = 'EVENS_ONLY',                  // Only even-numbered cards count
    ODDS_ONLY = 'ODDS_ONLY',                    // Only odd-numbered cards count
    NO_STRAIGHTS = 'NO_STRAIGHTS',              // Straights don't count for scoring
    NO_FLUSHES = 'NO_FLUSHES',                  // Flushes don't count for scoring
    MAX_CARD_VALUE = 'MAX_CARD_VALUE'           // Cards above certain value don't count
}

/**
 * Configuration for boss blind rounds
 */
export interface BossBlindConfig extends RoundConfig {
    handicaps: BossHandicap[]
    maxCardValue?: Rank // Only used with MAX_CARD_VALUE handicap
}

/**
 * Boss blind round - highest stakes round with special rewards, elimination risk, and handicaps
 */
export class BossBlindRound extends Round {
    private readonly handicaps: BossHandicap[]
    private readonly maxCardValue?: Rank

    constructor(config: BossBlindConfig) {
        if (config.type !== RoundType.BOSS_BLIND) {
            throw new Error('Invalid round type for BossBlindRound')
        }
        super(config)
        this.handicaps = config.handicaps
        this.maxCardValue = config.maxCardValue

        if (this.handicaps.includes(BossHandicap.MAX_CARD_VALUE) && !this.maxCardValue) {
            throw new Error('maxCardValue must be specified when using MAX_CARD_VALUE handicap')
        }
    }

    /**
     * Get the list of active handicaps
     */
    getHandicaps(): readonly BossHandicap[] {
        return this.handicaps
    }

    /**
     * Get the maximum allowed card value (only applicable with MAX_CARD_VALUE handicap)
     */
    getMaxCardValue(): Rank | undefined {
        return this.maxCardValue
    }

    /**
     * Get a description of the active handicaps
     */
    getHandicapDescription(): string {
        const descriptions = this.handicaps.map(handicap => {
            switch (handicap) {
                case BossHandicap.FACE_CARDS_DEBUFF:
                    return 'Face cards (J, Q, K) count as lower value'
                case BossHandicap.NO_JOKERS:
                    return 'Jokers cannot be used'
                case BossHandicap.NO_PAIRS:
                    return 'Pairs do not count for scoring'
                case BossHandicap.HEARTS_ONLY:
                    return 'Only hearts count for scoring'
                case BossHandicap.EVENS_ONLY:
                    return 'Only even-numbered cards count'
                case BossHandicap.ODDS_ONLY:
                    return 'Only odd-numbered cards count'
                case BossHandicap.NO_STRAIGHTS:
                    return 'Straights do not count for scoring'
                case BossHandicap.NO_FLUSHES:
                    return 'Flushes do not count for scoring'
                case BossHandicap.MAX_CARD_VALUE:
                    return `Cards above ${this.maxCardValue} do not count`
                default:
                    return 'Unknown handicap'
            }
        })
        return descriptions.join(', ')
    }

    processResults(playerScores: Map<string, number>): RoundResult {
        const rewards = new Map<string, Reward[]>()
        let eliminatedPlayerId: string | undefined
        let lowestScore = Infinity
        let lowestScoringPlayer: string | undefined

        // First pass: find lowest scoring player below ante
        for (const [playerId, score] of playerScores) {
            if (score < this.getAnte() && score < lowestScore) {
                lowestScore = score
                lowestScoringPlayer = playerId
            }
        }

        // Set eliminated player - in boss blind rounds, someone must be eliminated
        eliminatedPlayerId = lowestScoringPlayer

        // Second pass: process rewards for surviving players
        for (const [playerId, score] of playerScores) {
            // Skip eliminated player
            if (playerId === eliminatedPlayerId) continue

            const playerRewards: Reward[] = []

            // Basic reward for surviving
            playerRewards.push({
                type: 'COINS',
                value: Math.floor(score / 50) * 15 // Best coin ratio
            })

            // Threshold-based rewards
            if (score >= this.getRewardThreshold()) {
                // Beat the reward threshold - get a rare or better joker
                playerRewards.push({
                    type: 'JOKER',
                    value: 'rare'
                })
            }

            if (score >= this.getRewardThreshold() * 1.5) {
                // Exceptional performance - bonus coins and another joker
                playerRewards.push({
                    type: 'COINS',
                    value: Math.round(score / 75 * 20)
                })
                playerRewards.push({
                    type: 'JOKER',
                    value: 'rare'
                })
            }

            if (score >= this.getRewardThreshold() * 2) {
                // Outstanding performance - legendary joker chance
                playerRewards.push({
                    type: 'JOKER',
                    value: 'legendary'
                })
            }

            if (playerRewards.length > 0) {
                rewards.set(playerId, playerRewards)
            }
        }

        // If no one was below ante, eliminate the lowest scoring player
        if (!eliminatedPlayerId) {
            lowestScore = Infinity
            for (const [playerId, score] of playerScores) {
                if (score < lowestScore) {
                    lowestScore = score
                    eliminatedPlayerId = playerId
                }
            }
        }

        return {
            playerScores,
            rewards,
            eliminatedPlayerId
        }
    }
} 