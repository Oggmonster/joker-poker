import { Round, RoundType, RoundResult, RoundConfig, Reward } from '../rounds'

/**
 * Small blind round - rewards players who pass a certain score threshold
 */
export class SmallBlindRound extends Round {
    constructor(config: RoundConfig) {
        if (config.type !== RoundType.SMALL_BLIND) {
            throw new Error('Invalid round type for SmallBlindRound')
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
                     type: 'JOKER',
                    value: 'random'
                }]
                
                rewards.set(playerId, playerRewards)
            }
        }

        return {
            playerScores,
            rewards
        }
    }
} 