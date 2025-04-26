import { useCallback, useEffect, useState } from 'react'
import { Card, Suit, Rank } from '#app/domain/cards'
import { BaseJoker, JokerRarity, JokerType } from '#app/domain/joker'
import { Player, PlayerStatus } from '#app/domain/player'
import { GameState, GamePhase } from '#app/domain/game-state'
import { cn } from '#app/utils/cn'
import { GameSection, PlayerAction } from '#app/domain/game-state'
import { type Route } from './+types/index.ts'
import { useLoaderData } from 'react-router'
import { CountdownPhase } from '#app/components/game/countdown-phase'
import { FlopPhase } from '#app/components/game/flop-phase'


export async function loader({ params, request }: Route.LoaderArgs) {
	return { gameId: params.id }
}

export const meta: Route.MetaFunction = ({ data }) => [{ title: `Scatterhand - Game ${data.gameId}` }]

const COUNTDOWN_TIME = 10 // seconds
const PHASE_TIME = 30 // seconds

// Create mock players with proper Player class instances
const mockPlayers: Player[] = [
	new Player('1', 'Player 1', 0, false),
	new Player('2', 'Bot 1', 1, true),
	new Player('3', 'Bot 2', 2, true),
	new Player('4', 'Bot 3', 3, true),
]

// Create a basic joker class for mocking
class MockJoker extends BaseJoker {
	constructor(
		id: string,
		name: string,
		effect: string,
		rarity: JokerRarity,
		type: JokerType,
		level: number = 1
	) {
		super(id, name, effect, rarity, type, level)
	}

	calculateBonus(): number {
		return 0
	}
}

/**
 * Main game route component
 */
export default function GameRoute({ loaderData }: Route.ComponentProps) { 
    const [gameState, setGameState] = useState<GameState | null>(null)
    const [timeRemaining, setTimeRemaining] = useState(COUNTDOWN_TIME)
    const [selectedJokers, setSelectedJokers] = useState<BaseJoker[]>([])

    // Initialize game state
    useEffect(() => {
        const mockGameState: GameState = {
            id: loaderData.gameId,
            players: mockPlayers,
            currentSection: 'DISCARD',
            sectionActions: [],
            communityCards: [],
            communityJokers: [],
            playerCards: {},
            playerJokers: {},
            isComplete: false,
            activeJokers: [],
            currentPlayerId: 0,
            lastAction: null,
            phase: 'COUNTDOWN',
            selectedJokers: {},
            timeRemaining: COUNTDOWN_TIME
        }
        setGameState(mockGameState)
    }, [])

    // Handle phase timer
    useEffect(() => {
        if (!gameState || gameState.isComplete) return

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 0) {
                    // Time's up - move to next phase
                    handlePhaseEnd()
                    return gameState.phase === 'COUNTDOWN' ? PHASE_TIME : prev
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [gameState])

    // Handle phase end
    const handlePhaseEnd = useCallback(() => {
        if (!gameState) return

        setGameState(prev => {
            if (!prev) return null

            if (prev.phase === 'COUNTDOWN') {
                // Deal cards and jokers
                const playerCards: Record<string, Card[]> = {}
                const playerJokers: Record<string, BaseJoker[]> = {}
                const communityCards: Card[] = []
                const communityJokers: BaseJoker[] = []

                // TODO: Implement actual card/joker dealing logic
                // For now, use mock data
                prev.players.forEach(player => {
                    playerCards[player.id] = [
                        new Card(Suit.HEARTS, Rank.ACE),
                        new Card(Suit.SPADES, Rank.KING)
                    ]
                    playerJokers[player.id] = [
                        new MockJoker(
                            'basic-joker',
                            'Basic Joker',
                            'Basic effect',
                            JokerRarity.COMMON,
                            JokerType.PLAYER
                        )
                    ]
                })

                // Add community cards and jokers
                communityCards.push(
                    new Card(Suit.DIAMONDS, Rank.QUEEN),
                    new Card(Suit.CLUBS, Rank.JACK),
                    new Card(Suit.HEARTS, Rank.TEN)
                )
                communityJokers.push(
                    new MockJoker(
                        'wild-joker',
                        'Wild Joker',
                        'Wild effect',
                        JokerRarity.RARE,
                        JokerType.COMMUNITY,
                        2
                    ),
                    new MockJoker(
                        'multiply-joker',
                        'Multiply Joker',
                        'Multiply effect',
                        JokerRarity.UNCOMMON,
                        JokerType.COMMUNITY,
                        3
                    ),
                    new MockJoker(
                        'basic-joker-2',
                        'Basic Joker',
                        'Basic effect',
                        JokerRarity.COMMON,
                        JokerType.COMMUNITY
                    )
                )

                return {
                    ...prev,
                    phase: 'FLOP',
                    playerCards,
                    playerJokers,
                    communityCards,
                    communityJokers,
                    timeRemaining: PHASE_TIME
                }
            }

            return prev
        })
    }, [gameState])

    // Handle joker selection
    const handleJokerSelect = useCallback((joker: BaseJoker) => {
        setSelectedJokers(prev => {
            const isSelected = prev.some(j => j.id === joker.id)
            if (isSelected) {
                return prev.filter(j => j.id !== joker.id)
            }
            if (prev.length < 3) {
                return [...prev, joker]
            }
            return prev
        })
    }, [])

    // Handle play hand
    const handlePlayHand = useCallback(() => {
        if (!gameState || selectedJokers.length !== 3) return

        setGameState(prev => {
            if (!prev) return null

            const currentPlayer = prev.players[prev.currentPlayerId]
            if (!currentPlayer) return prev

            return {
                ...prev,
                selectedJokers: {
                    ...prev.selectedJokers,
                    [currentPlayer.id]: selectedJokers
                }
            }
        })
    }, [gameState, selectedJokers])

    if (!gameState || !gameState.players.length) {
        return <div>Loading...</div>
    }

    const currentPlayer = gameState.players[gameState.currentPlayerId]
    if (!currentPlayer) return <div>Error: No current player</div>

    const playerCards = gameState.playerCards[currentPlayer.id]
    if (!playerCards) return <div>Error: No cards for current player</div>

    const playerJoker = gameState.playerJokers[currentPlayer.id]?.[0]
    if (!playerJoker) return <div>Error: No joker for current player</div>

    return (
        <div className="flex flex-col h-full gap-4 p-4">
            {gameState.phase === 'COUNTDOWN' && (
                <CountdownPhase
                    players={gameState.players}
                    timeRemaining={timeRemaining}
                    className="flex-1"
                />
            )}

            {gameState.phase === 'FLOP' && (
                <FlopPhase
                    player={currentPlayer}
                    playerCards={playerCards}
                    playerJoker={playerJoker}
                    communityCards={gameState.communityCards}
                    communityJokers={gameState.communityJokers}
                    selectedJokers={selectedJokers}
                    onJokerSelect={handleJokerSelect}
                    onPlayHand={handlePlayHand}
                    timeRemaining={timeRemaining}
                    className="flex-1"
                />
            )}
        </div>
    )
} 