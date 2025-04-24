import { Round, RoundType, RoundResult, RoundConfig, Reward } from '../rounds'

/**
 * Big blind round - higher stakes version of small blind with better rewards
 */
export class BigBlindRound extends Round {
    constructor(config: RoundConfig) {
        if (config.type !== RoundType.BIG_BLIND) {
            throw new Error('Invalid round type for BigBlindRound')
        }
        super(config)
    }

    processResults(playerScores: Map<string, number>): RoundResult {
        const rewards = new Map<string, Reward[]>()

        // Calculate rewards for players who beat the threshold
        for (const [playerId, score] of playerScores) {
            if (score >= this.getRewardThreshold()) {
                // Basic reward for beating threshold
                const playerRewards: Reward[] = [{
                    type: 'COINS',
                    value: Math.floor(score / 75) * 10 // Better coin ratio than small blind
                }]

                // Additional rewards for exceptional scores
                if (score >= this.getRewardThreshold() * 1.5) {
                    // First bonus threshold - guaranteed joker
                    playerRewards.push({
                        type: 'JOKER',
                        value: 'random'
                    })
                }

                if (score >= this.getRewardThreshold() * 2) {
                    // Second bonus threshold - extra coins and chance for rare joker
                    playerRewards.push({
                        type: 'COINS',
                        value: Math.floor(score / 100) * 15
                    })
                    playerRewards.push({
                        type: 'JOKER',
                        value: 'rare' // This will be resolved to a rare or better joker
                    })
                }

                rewards.set(playerId, playerRewards)
            }
        }

        return {
            playerScores,
            rewards
        }
    }
} 