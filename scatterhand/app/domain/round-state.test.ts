import { describe, test, expect, beforeEach } from 'vitest'
import { RoundState, Phase, HandSelection } from './round-state'
import { Card, Suit, Rank } from './cards'
import { BaseJoker, JokerRarity } from './joker'
import { Player } from './player'

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
                const playerCards = roundState.getPlayerCards(playerId);
                expect(playerCards.length).toBe(2); // Initial 2 cards
            }
        });

        test('deals initial jokers to players', () => {
            for (const playerId of players.keys()) {
                const playerJokers = roundState.getPlayerJokers(playerId);
                expect(playerJokers.length).toBe(1); // Initial 1 joker
            }
        });
    });

    // ... rest of the tests ...
}); 