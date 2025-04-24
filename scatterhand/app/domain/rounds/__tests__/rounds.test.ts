import { expect, test, describe } from 'vitest'
import { RoundType, RoundConfig, RoundResult, Reward } from '../../rounds'
import { SmallBlindRound } from '../small-blind-round'
import { BigBlindRound } from '../big-blind-round'
import { BossBlindRound, BossBlindConfig, BossHandicap } from '../boss-blind-round'
import { VsRound } from '../vs-round'
import { Rank } from '../../cards'

describe('Round Types', () => {
    describe('SmallBlindRound', () => {
        const config: RoundConfig = {
            type: RoundType.SMALL_BLIND,
            ante: 100,
            rewardThreshold: 500,
            roundNumber: 1
        }

        test('processes results correctly', () => {
            const round = new SmallBlindRound(config)
            const scores = new Map([
                ['p1', 600], // Above threshold
                ['p2', 1100], // Above 2x threshold
                ['p3', 400]  // Below threshold
            ])

            const result = round.processResults(scores)
            
            // Check scores are passed through
            expect(result.playerScores).toBe(scores)

            // Check rewards
            const p1Rewards = result.rewards.get('p1')
            expect(p1Rewards).toBeDefined()
            expect(p1Rewards![0]).toEqual({ type: 'COINS', value: 60 }) // 600/100 * 10

            const p2Rewards = result.rewards.get('p2')
            expect(p2Rewards).toBeDefined()
            expect(p2Rewards![0]).toEqual({ type: 'COINS', value: 110 }) // 1100/100 * 10
            expect(p2Rewards![1]).toEqual({ type: 'JOKER', value: 'random' })

            // Check no rewards for below threshold
            expect(result.rewards.get('p3')).toBeUndefined()
        })
    })

    describe('BigBlindRound', () => {
        const config: RoundConfig = {
            type: RoundType.BIG_BLIND,
            ante: 200,
            rewardThreshold: 1000,
            roundNumber: 2
        }

        test('processes results correctly', () => {
            const round = new BigBlindRound(config)
            const scores = new Map([
                ['p1', 1200], // Above threshold, below 1.5x
                ['p2', 1600], // Above 1.5x threshold, below 2x
                ['p3', 2100], // Above 2x threshold
                ['p4', 800]   // Below threshold
            ])

            const result = round.processResults(scores)
            
            // Check scores are passed through
            expect(result.playerScores).toBe(scores)

            // Check rewards for just above threshold
            const p1Rewards = result.rewards.get('p1')
            expect(p1Rewards).toBeDefined()
            expect(p1Rewards![0]).toEqual({ type: 'COINS', value: 160 }) // 1200/75 * 10

            // Check rewards for above 1.5x threshold
            const p2Rewards = result.rewards.get('p2')
            expect(p2Rewards).toBeDefined()
            expect(p2Rewards![0]).toEqual({ type: 'COINS', value: 210 }) // 1600/75 * 10
            expect(p2Rewards![1]).toEqual({ type: 'JOKER', value: 'random' })

            // Check rewards for above 2x threshold
            const p3Rewards = result.rewards.get('p3')
            expect(p3Rewards).toBeDefined()
            expect(p3Rewards![0]).toEqual({ type: 'COINS', value: 280 }) // 2100/75 * 10
            expect(p3Rewards![1]).toEqual({ type: 'JOKER', value: 'random' })
            expect(p3Rewards![2]).toEqual({ type: 'COINS', value: 315 }) // 2100/100 * 15
            expect(p3Rewards![3]).toEqual({ type: 'JOKER', value: 'rare' })

            // Check no rewards for below threshold
            expect(result.rewards.get('p4')).toBeUndefined()
        })
    })

    describe('BossBlindRound', () => {
        const handicapConfig: BossBlindConfig = {
            type: RoundType.BOSS_BLIND,
            ante: 1000,
            rewardThreshold: 2000,
            roundNumber: 5,
            handicaps: [BossHandicap.FACE_CARDS_DEBUFF, BossHandicap.NO_PAIRS]
        }

        const invalidConfig: BossBlindConfig = {
            type: RoundType.BOSS_BLIND,
            ante: 1000,
            rewardThreshold: 2000,
            roundNumber: 5,
            handicaps: [BossHandicap.MAX_CARD_VALUE],
        }

        const maxCardConfig: BossBlindConfig = {
            type: RoundType.BOSS_BLIND,
            ante: 1000,
            rewardThreshold: 2000,
            roundNumber: 5,
            handicaps: [BossHandicap.MAX_CARD_VALUE],
            maxCardValue: Rank.TEN
        }

        test('processes results correctly', () => {
            const round = new BossBlindRound(handicapConfig)
            const scores = new Map([
                ['p1', 400],  // Below ante - eliminated
                ['p2', 600],  // Above ante, below threshold
                ['p3', 2200], // Above threshold, below 1.5x
                ['p4', 3500], // Above 1.5x threshold
                ['p5', 4500]  // Above 2x threshold
            ])

            const result = round.processResults(scores)
            
            // Check scores are passed through
            expect(result.playerScores).toBe(scores)

            // Check elimination
            expect(result.eliminatedPlayerId).toBe('p1')

            // Check rewards for surviving but below threshold
            const p2Rewards = result.rewards.get('p2')
            expect(p2Rewards).toBeDefined()
            expect(p2Rewards![0]).toEqual({ type: 'COINS', value: 180 }) // 600/50 * 15

            // Check rewards for above threshold
            const p3Rewards = result.rewards.get('p3')
            expect(p3Rewards).toBeDefined()
            expect(p3Rewards![0]).toEqual({ type: 'COINS', value: 660 }) // 2200/50 * 15
            expect(p3Rewards![1]).toEqual({ type: 'JOKER', value: 'rare' })

            // Check rewards for above 1.5x threshold
            const p4Rewards = result.rewards.get('p4')
            expect(p4Rewards).toBeDefined()
            expect(p4Rewards![0]).toEqual({ type: 'COINS', value: 1050 }) // 3500/50 * 15
            expect(p4Rewards![1]).toEqual({ type: 'JOKER', value: 'rare' })
            expect(p4Rewards![2]).toEqual({ type: 'COINS', value: 933 }) // 3500/75 * 20
            expect(p4Rewards![3]).toEqual({ type: 'JOKER', value: 'rare' })

            // Check rewards for above 2x threshold
            const p5Rewards = result.rewards.get('p5')
            expect(p5Rewards).toBeDefined()
            expect(p5Rewards![0]).toEqual({ type: 'COINS', value: 1350 }) // 4500/50 * 15
            expect(p5Rewards![1]).toEqual({ type: 'JOKER', value: 'rare' })
            expect(p5Rewards![2]).toEqual({ type: 'COINS', value: 1200 }) // 4500/75 * 20
            expect(p5Rewards![3]).toEqual({ type: 'JOKER', value: 'rare' })
            expect(p5Rewards![4]).toEqual({ type: 'JOKER', value: 'legendary' })
        })

        test('handles handicaps correctly', () => {
            const round = new BossBlindRound(handicapConfig)

            // Test handicap getters
            expect(round.getHandicaps()).toEqual([
                BossHandicap.FACE_CARDS_DEBUFF,
                BossHandicap.NO_PAIRS
            ])
            expect(round.getMaxCardValue()).toBeUndefined()

            // Test handicap description
            const description = round.getHandicapDescription()
            expect(description).toContain('Face cards (J, Q, K) count as lower value')
            expect(description).toContain('Pairs do not count for scoring')
        })

        test('handles MAX_CARD_VALUE handicap correctly', () => {
            const round = new BossBlindRound(maxCardConfig)
            
            expect(round.getHandicaps()).toEqual([BossHandicap.MAX_CARD_VALUE])
            expect(round.getMaxCardValue()).toBe(Rank.TEN)
            
            const description = round.getHandicapDescription()
            expect(description).toBe('Cards above 10 do not count')
        })

        test('handles multiple handicap combinations', () => {
            const multiHandicapConfig: BossBlindConfig = {
                type: RoundType.BOSS_BLIND,
                ante: 1000,
                rewardThreshold: 2000,
                roundNumber: 5,
                handicaps: [
                    BossHandicap.HEARTS_ONLY,
                    BossHandicap.NO_STRAIGHTS,
                    BossHandicap.NO_FLUSHES
                ]
            }

            const round = new BossBlindRound(multiHandicapConfig)
            const description = round.getHandicapDescription()
            
            expect(description).toContain('Only hearts count for scoring')
            expect(description).toContain('Straights do not count for scoring')
            expect(description).toContain('Flushes do not count for scoring')
        })

        test('throws error when MAX_CARD_VALUE handicap is used without maxCardValue', () => {
            expect(() => new BossBlindRound(invalidConfig)).toThrow(
                'maxCardValue must be specified when using MAX_CARD_VALUE handicap'
            )
        })
    })

    describe('VsRound', () => {
        const config: RoundConfig = {
            type: RoundType.VS_ROUND,
            ante: 0,
            rewardThreshold: 0,
            roundNumber: 4
        }

        test('processes results correctly', () => {
            const round = new VsRound(config)
            const scores = new Map([
                ['p1', 1000],
                ['p2', 500], // Lowest score - eliminated
                ['p3', 1500] // Highest score - gets rewards
            ])

            const result = round.processResults(scores)
            
            // Check scores are passed through
            expect(result.playerScores).toBe(scores)

            // Check elimination
            expect(result.eliminatedPlayerId).toBe('p2')

            // Check winner rewards
            const winnerRewards = result.rewards.get('p3')
            expect(winnerRewards).toBeDefined()
            expect(winnerRewards![0]).toEqual({ type: 'COINS', value: 300 }) // 1500/50 * 10
            expect(winnerRewards![1]).toEqual({ type: 'JOKER', value: 'eliminated' })

            // Check no rewards for others
            expect(result.rewards.get('p1')).toBeUndefined()
            expect(result.rewards.get('p2')).toBeUndefined()
        })
    })
}) 