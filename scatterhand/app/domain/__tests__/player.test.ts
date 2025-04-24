import { expect, test, describe, beforeEach } from 'vitest'
import { Player, PlayerStatus } from '../player'
import { Card, Suit, Rank } from '../cards'
import { Joker } from '../joker'

// Mock Joker for testing
class MockJoker implements Joker {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly effect: string
    ) {}
}

describe('Player', () => {
    let player: Player
    let mockJoker1: Joker
    let mockJoker2: Joker
    let mockJoker3: Joker
    let mockJoker4: Joker

    beforeEach(() => {
        player = new Player('1', 'Test Player')
        mockJoker1 = new MockJoker('j1', 'Test Joker 1', 'Effect 1')
        mockJoker2 = new MockJoker('j2', 'Test Joker 2', 'Effect 2')
        mockJoker3 = new MockJoker('j3', 'Test Joker 3', 'Effect 3')
        mockJoker4 = new MockJoker('j4', 'Test Joker 4', 'Effect 4')
    })

    describe('constructor', () => {
        test('initializes with correct values', () => {
            expect(player.getId()).toBe('1')
            expect(player.getName()).toBe('Test Player')
            expect(player.getStatus()).toBe(PlayerStatus.WAITING)
            expect(player.getPosition()).toBe(-1)
            expect(player.getRoundScore()).toBe(0)
            expect(player.isBot()).toBe(false)
        })

        test('initializes bot player correctly', () => {
            const botPlayer = new Player('bot1', 'Bot Player', 1, true)
            expect(botPlayer.isBot()).toBe(true)
            expect(botPlayer.getPosition()).toBe(1)
        })
    })

    describe('hand management', () => {
        test('receives cards correctly', () => {
            const card = new Card(Suit.SPADES, Rank.ACE)
            player.receiveCard(card)
            expect(player.getCards()).toEqual([card])
        })

        test('clears hand and resets active jokers', () => {
            player.receiveCard(new Card(Suit.SPADES, Rank.ACE))
            player.addJoker(mockJoker1)
            player.activateJoker(mockJoker1.id)
            player.clearHand()
            expect(player.getCards()).toEqual([])
            expect(player.getActiveJokers()).toEqual([])
            expect(player.getRoundScore()).toBe(0)
        })
    })

    describe('joker management', () => {
        test('adds jokers correctly', () => {
            player.addJoker(mockJoker1)
            expect(player.getJokers()).toEqual([mockJoker1])
        })

        test('removes jokers correctly', () => {
            player.addJoker(mockJoker1)
            const removed = player.removeJoker(mockJoker1.id)
            expect(removed).toBe(mockJoker1)
            expect(player.getJokers()).toEqual([])
        })

        test('returns undefined when removing non-existent joker', () => {
            expect(player.removeJoker('non-existent')).toBeUndefined()
        })

        test('activates jokers correctly', () => {
            player.addJoker(mockJoker1)
            expect(player.activateJoker(mockJoker1.id)).toBe(true)
            expect(player.getActiveJokers()).toEqual([mockJoker1])
        })

        test('returns false when activating non-existent joker', () => {
            expect(player.activateJoker('non-existent')).toBe(false)
        })

        test('clears active jokers', () => {
            player.addJoker(mockJoker1)
            player.activateJoker(mockJoker1.id)
            player.clearActiveJokers()
            expect(player.getActiveJokers()).toEqual([])
        })
    })

    describe('tournament mechanics', () => {
        test('eliminates player correctly', () => {
            player.eliminate()
            expect(player.getStatus()).toBe(PlayerStatus.ELIMINATED)
            expect(player.isInTournament()).toBe(false)
        })

        test('resets for new round correctly', () => {
            player.addJoker(mockJoker1)
            player.activateJoker(mockJoker1.id)
            player.setRoundScore(100)
            
            player.resetForNewRound()
            expect(player.getStatus()).toBe(PlayerStatus.PLAYING)
            expect(player.getActiveJokers()).toEqual([])
            expect(player.getRoundScore()).toBe(0)
        })

        test('maintains eliminated status after round reset', () => {
            player.eliminate()
            player.resetForNewRound()
            expect(player.getStatus()).toBe(PlayerStatus.ELIMINATED)
        })

        test('sets and gets round score', () => {
            player.setRoundScore(150)
            expect(player.getRoundScore()).toBe(150)
        })
    })

    describe('card and joker selection', () => {
        const card1 = new Card(Suit.HEARTS, Rank.ACE)
        const card2 = new Card(Suit.SPADES, Rank.KING)
        const card3 = new Card(Suit.DIAMONDS, Rank.QUEEN)
        const card4 = new Card(Suit.CLUBS, Rank.JACK)
        const card5 = new Card(Suit.HEARTS, Rank.TEN)

        test('sets and gets selected cards', () => {
            const cards = [card1, card2, card3, card4, card5]
            player.setSelectedCards(cards)
            expect(player.getSelectedCards()).toEqual(cards)
        })

        test('throws error when selecting wrong number of cards', () => {
            expect(() => player.setSelectedCards([card1, card2]))
                .toThrow('Must select exactly 5 cards')
        })

        test('sets and gets selected jokers', () => {
            const jokers = [mockJoker1, mockJoker2]
            player.setSelectedJokers(jokers)
            expect(player.getSelectedJokers()).toEqual(jokers)
        })

        test('throws error when selecting too many jokers', () => {
            expect(() => player.setSelectedJokers([mockJoker1, mockJoker2, mockJoker3, mockJoker4]))
                .toThrow('Cannot select more than 3 jokers')
        })

        test('clears selections on round reset', () => {
            player.setSelectedCards([card1, card2, card3, card4, card5])
            player.setSelectedJokers([mockJoker1, mockJoker2])
            player.resetForNewRound()
            expect(player.getSelectedCards()).toEqual([])
            expect(player.getSelectedJokers()).toEqual([])
        })
    })

    describe('state checks', () => {
        test('canAct returns correct value', () => {
            player.resetForNewRound() // Set to PLAYING
            expect(player.canAct()).toBe(true)
            player.fold()
            expect(player.canAct()).toBe(false)
            player.eliminate()
            expect(player.canAct()).toBe(false)
        })

        test('isInHand returns correct value', () => {
            player.resetForNewRound() // Set to PLAYING
            expect(player.isInHand()).toBe(true)
            player.fold()
            expect(player.isInHand()).toBe(false)
        })
    })

    describe('string representation', () => {
        test('returns correct string format', () => {
            expect(player.toString()).toBe('Test Player (0 jokers)')
            player.addJoker(mockJoker1)
            player.addJoker(mockJoker2)
            expect(player.toString()).toBe('Test Player (2 jokers)')
        })
    })
}) 