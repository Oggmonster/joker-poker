import { describe, test, expect, beforeEach } from 'vitest'
import { RoundState, Phase, HandSelection } from '../round-state'
import { Card, Suit, Rank } from '../cards'
import { BaseJoker, JokerRarity } from '../joker'
import { Player } from '../player'

class TestJoker extends BaseJoker {
    constructor(id: string) {
        super(
            id,
            'Test Joker',
            'Test Effect',
            JokerRarity.COMMON
        );
    }

    applyEffect(): number {
        return 100;
    }

    getEffectDescription(): string {
        return "Test Joker";
    }
}

describe('RoundState', () => {
    let roundState: RoundState;
    let players: Map<string, Player>;
    let deck: Card[];
    let jokerPool: BaseJoker[];

    beforeEach(() => {
        // Create test players
        players = new Map();
        players.set('player1', new Player('player1', 'Player 1', 0));
        players.set('player2', new Player('player2', 'Player 2', 1));

        // Create a test deck
        deck = [
            new Card(Suit.HEARTS, Rank.ACE),
            new Card(Suit.HEARTS, Rank.KING),
            new Card(Suit.HEARTS, Rank.QUEEN),
            new Card(Suit.HEARTS, Rank.JACK),
            new Card(Suit.HEARTS, Rank.TEN),
            new Card(Suit.SPADES, Rank.ACE),
            new Card(Suit.SPADES, Rank.KING),
            new Card(Suit.SPADES, Rank.QUEEN),
            new Card(Suit.SPADES, Rank.JACK),
            new Card(Suit.SPADES, Rank.TEN),
        ];

        // Create test jokers
        jokerPool = [
            new TestJoker('joker1'),
            new TestJoker('joker2'),
            new TestJoker('joker3'),
            new TestJoker('joker4'),
            new TestJoker('joker5'),
            new TestJoker('joker6'),
            new TestJoker('joker7'),
            new TestJoker('joker8'),
        ];

        roundState = new RoundState(players, deck, jokerPool);
    });

    describe('Initial State', () => {
        test('starts in FLOP phase', () => {
            expect(roundState.getCurrentPhase()).toBe(Phase.FLOP);
        });

        test('deals initial cards to players', () => {
            for (const playerId of players.keys()) {
                const availableCards = roundState.getAvailableCards(playerId);
                expect(availableCards.length).toBe(2); // Initial 2 cards
            }
        });

        test('deals initial jokers to players', () => {
            for (const playerId of players.keys()) {
                const availableJokers = roundState.getAvailableJokers(playerId);
                expect(availableJokers.length).toBe(1); // Initial 1 joker
            }
        });
    });

    describe('Phase Requirements', () => {
        test('returns correct requirements for FLOP phase', () => {
            const requirements = roundState.getPhaseRequirements();
            expect(requirements).toEqual({
                boardCards: 3,
                boardJokers: 3,
                playerCards: 2,
                playerJokers: 2
            });
        });

        test('returns correct requirements for TURN phase', () => {
            roundState.advancePhase();
            const requirements = roundState.getPhaseRequirements();
            expect(requirements).toEqual({
                boardCards: 4,
                boardJokers: 4,
                playerCards: 3,
                playerJokers: 3
            });
        });

        test('returns correct requirements for RIVER phase', () => {
            roundState.advancePhase(); // To TURN
            roundState.advancePhase(); // To RIVER
            const requirements = roundState.getPhaseRequirements();
            expect(requirements).toEqual({
                boardCards: 5,
                boardJokers: 5,
                playerCards: 4,
                playerJokers: 4
            });
        });

        test('throws error when getting requirements in COMPLETE phase', () => {
            roundState.advancePhase(); // To TURN
            roundState.advancePhase(); // To RIVER
            roundState.advancePhase(); // To COMPLETE
            expect(() => roundState.getPhaseRequirements()).toThrow('Round is complete');
        });
    });

    describe('Hand Selection', () => {
        test('accepts valid hand selection', () => {
            const cards = [
                new Card(Suit.HEARTS, Rank.ACE),
                new Card(Suit.HEARTS, Rank.KING),
                new Card(Suit.HEARTS, Rank.QUEEN),
                new Card(Suit.HEARTS, Rank.JACK),
                new Card(Suit.HEARTS, Rank.TEN),
            ];
            const jokers = [
                new TestJoker('test1'),
                new TestJoker('test2'),
                new TestJoker('test3'),
            ];
            const selection: HandSelection = {
                cards,
                jokers,
                score: 1000
            };

            expect(() => roundState.submitSelection('player1', selection)).not.toThrow();
            expect(roundState.getCurrentSelection('player1')).toEqual(selection);
        });

        test('rejects invalid hand selection with wrong number of cards', () => {
            const selection: HandSelection = {
                cards: [new Card(Suit.HEARTS, Rank.ACE)], // Only 1 card
                jokers: [
                    new TestJoker('test1'),
                    new TestJoker('test2'),
                    new TestJoker('test3'),
                ],
                score: 1000
            };

            expect(() => roundState.submitSelection('player1', selection))
                .toThrow('Invalid selection: Must have exactly 5 cards and 3 jokers');
        });

        test('rejects invalid hand selection with wrong number of jokers', () => {
            const selection: HandSelection = {
                cards: [
                    new Card(Suit.HEARTS, Rank.ACE),
                    new Card(Suit.HEARTS, Rank.KING),
                    new Card(Suit.HEARTS, Rank.QUEEN),
                    new Card(Suit.HEARTS, Rank.JACK),
                    new Card(Suit.HEARTS, Rank.TEN),
                ],
                jokers: [new TestJoker('test1')], // Only 1 joker
                score: 1000
            };

            expect(() => roundState.submitSelection('player1', selection))
                .toThrow('Invalid selection: Must have exactly 5 cards and 3 jokers');
        });
    });

    describe('Score Accumulation', () => {
        test('accumulates scores across phases', () => {
            // Submit selection for FLOP phase
            roundState.submitSelection('player1', {
                cards: Array(5).fill(new Card(Suit.HEARTS, Rank.ACE)),
                jokers: Array(3).fill(new TestJoker('test')),
                score: 1000
            });
            expect(roundState.getAccumulatedScore('player1')).toBe(1000);

            // Advance to TURN and submit selection
            roundState.advancePhase();
            roundState.submitSelection('player1', {
                cards: Array(5).fill(new Card(Suit.HEARTS, Rank.KING)),
                jokers: Array(3).fill(new TestJoker('test')),
                score: 2000
            });
            expect(roundState.getAccumulatedScore('player1')).toBe(3000);

            // Advance to RIVER and submit selection
            roundState.advancePhase();
            roundState.submitSelection('player1', {
                cards: Array(5).fill(new Card(Suit.HEARTS, Rank.QUEEN)),
                jokers: Array(3).fill(new TestJoker('test')),
                score: 3000
            });
            expect(roundState.getAccumulatedScore('player1')).toBe(6000);
        });

        test('maintains separate scores for each player', () => {
            roundState.submitSelection('player1', {
                cards: Array(5).fill(new Card(Suit.HEARTS, Rank.ACE)),
                jokers: Array(3).fill(new TestJoker('test')),
                score: 1000
            });
            roundState.submitSelection('player2', {
                cards: Array(5).fill(new Card(Suit.HEARTS, Rank.KING)),
                jokers: Array(3).fill(new TestJoker('test')),
                score: 2000
            });

            expect(roundState.getAccumulatedScore('player1')).toBe(1000);
            expect(roundState.getAccumulatedScore('player2')).toBe(2000);
        });
    });

    describe('Phase Progression', () => {
        test('advances through phases correctly', () => {
            expect(roundState.getCurrentPhase()).toBe(Phase.FLOP);
            
            roundState.advancePhase();
            expect(roundState.getCurrentPhase()).toBe(Phase.TURN);
            
            roundState.advancePhase();
            expect(roundState.getCurrentPhase()).toBe(Phase.RIVER);
            
            roundState.advancePhase();
            expect(roundState.getCurrentPhase()).toBe(Phase.COMPLETE);
        });

        test('clears selections when advancing phases', () => {
            roundState.submitSelection('player1', {
                cards: Array(5).fill(new Card(Suit.HEARTS, Rank.ACE)),
                jokers: Array(3).fill(new TestJoker('test')),
                score: 1000
            });
            expect(roundState.getCurrentSelection('player1')).toBeDefined();
            
            roundState.advancePhase();
            expect(roundState.getCurrentSelection('player1')).toBeUndefined();
        });

        test('throws error when advancing beyond COMPLETE', () => {
            roundState.advancePhase(); // To TURN
            roundState.advancePhase(); // To RIVER
            roundState.advancePhase(); // To COMPLETE
            expect(() => roundState.advancePhase()).toThrow('Round is already complete');
        });
    });
}); 