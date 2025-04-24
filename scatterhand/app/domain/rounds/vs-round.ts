import { Round, RoundType, RoundResult, RoundConfig, Reward } from '../rounds'

/**
 * VS round - lowest scoring player is eliminated, winner gets rewards
 */
export class VsRound extends Round {
    constructor(config: RoundConfig) {
        if (config.type !== RoundType.VS_ROUND) {
            throw new Error('Invalid round type for VsRound')
        }
        super(config)
    }

    processResults(playerScores: Map<string, number>): RoundResult {
        // Find player with lowest score (they will be eliminated)
        let lowestScore = Infinity
        let eliminatedPlayerId: string | undefined
        
        for (const [playerId, score] of playerScores) {
            if (score < lowestScore) {
                lowestScore = score
                eliminatedPlayerId = playerId
            }
        }

        if (!eliminatedPlayerId) {
            throw new Error('No players in round')
        }

        // Find player with highest score (they get rewards)
        let highestScore = -Infinity
        let winnerId: string | undefined

        for (const [playerId, score] of playerScores) {
            if (score > highestScore) {
                highestScore = score
                winnerId = playerId
            }
        }

        if (!winnerId) {
            throw new Error('No winner found')
        }

        // Calculate rewards for the winner
        const rewards = new Map<string, Reward[]>()
        const winnerRewards: Reward[] = [
            {
                type: 'COINS',
                value: Math.floor(highestScore / 50) * 10 // 10 coins per 50 points
            },
            {
                type: 'JOKER',
                value: 'eliminated' // This will be resolved to one of the eliminated player's jokers
            }
        ]
        rewards.set(winnerId, winnerRewards)

        return {
            playerScores,
            rewards,
            eliminatedPlayerId
        }
    }
} 