import { useCallback, useEffect, useState } from 'react'
import { Card } from '#app/domain/cards'
import { BaseJoker, JokerRarity, JokerType } from '#app/domain/joker'
import { Player} from '#app/domain/player'
import { GameState, GamePhase } from '#app/domain/game-state'
import { type Route } from './+types/index.ts'
import { CountdownPhase } from '#app/components/game/countdown-phase'
import { PlayPhase } from '#app/components/game/play-phase.tsx'
import { HandEvaluator } from '#app/domain/scoring.ts'
import { Phase } from '#app/domain/round-state.ts'
import { PlayerScore, ScoringDisplay } from '#app/components/game/scoring-display.tsx'
import { Deck } from '#app/domain/deck.ts'
import { JokerDeck } from '#app/domain/joker-deck.ts'


export async function loader({ params, request }: Route.LoaderArgs) {
	return { gameId: params.id }
}

export const meta: Route.MetaFunction = ({ data }) => [{ title: `Scatterhand - Game ${data.gameId}` }]

const COUNTDOWN_TIME = 5 // seconds
const PHASE_TIME = 30 // seconds
const SCORING_TIME = 10 // seconds

// Create mock players with proper Player class instances
const mockPlayers: Player[] = [
	new Player('1', 'Player 1', 0, false),
	new Player('2', 'Bot 1', 1, true),
	new Player('3', 'Bot 2', 2, true),
	new Player('4', 'Bot 3', 3, true),
]

interface ScoredPlay extends PlayerScore {
	phase: GamePhase
}

/**
 * Main game route component
 */
export default function GameRoute({ loaderData }: Route.ComponentProps) { 
    const [gameState, setGameState] = useState<GameState | null>(null)
    const [timeRemaining, setTimeRemaining] = useState(COUNTDOWN_TIME)
    const [phaseScores, setPhaseScores] = useState<ScoredPlay[]>([])
    const [cardDeck, setCardDeck] = useState<Deck | null>(null)
    const [jokerDeck, setJokerDeck] = useState<JokerDeck | null>(null)
    const [showScoring, setShowScoring] = useState(false)

    // Initialize game state
    useEffect(() => {
        const mockGameState: GameState = {
            id: loaderData.gameId,
            players: mockPlayers,
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
        const newDeck = Deck.createStandard()
        newDeck.shuffle()
        const newJokerDeck = JokerDeck.create()
        newJokerDeck.shuffle()
        setGameState(mockGameState)
        setCardDeck(newDeck)
        setJokerDeck(newJokerDeck)
    }, [])

    // Handle phase timer
    useEffect(() => {
        if (!gameState || gameState.isComplete) return

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 0) {
                    // Time's up - move to next phase
                    handlePhaseEnd()
                    return gameState.phase === 'COUNTDOWN' ?  PHASE_TIME : prev
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
                let communityCards: Card[] = []
                let communityJokers: BaseJoker[] = []
               

                prev.players.forEach(player => {
                    playerCards[player.id] = cardDeck?.drawCards(2) ?? []
                    playerJokers[player.id] = jokerDeck?.drawPlayerJokers(3) ?? []
                })

                communityCards = [...cardDeck?.drawCards(3) ?? []]
                communityJokers = [...jokerDeck?.drawCommunityJokers(3) ?? []]

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

    

    // Handle play hand
    const handlePlayHand = (holeCards: Card[], selectedJokers: BaseJoker[], playedCards: Card[]) => {
        if (!gameState || !cardDeck || !jokerDeck) return

        const result = HandEvaluator.evaluate(playedCards)
        let score = result.baseScore

        const currentPlayer = gameState.players[gameState.currentPlayerId]
        if (!currentPlayer) return

        // Calculate joker bonuses
        const jokerScores = selectedJokers.map(joker => {
            const jokerScore = joker.calculateBonus({
                holeCards,
                playedHand: playedCards,
                phase: gameState.phase === 'TURN' ? Phase.TURN : Phase.FLOP,
            })
            return {
                joker,
                score: jokerScore,
                description: `Bonus from ${joker.name}`
            }
        })

        const totalScore = result.baseScore + jokerScores.reduce((sum, js) => sum + js.score, 0)

        // Create player score object with phase information
        const playerScore: ScoredPlay = {
            playerId: currentPlayer.id,
            playerName: currentPlayer.name,
            baseScore: result.baseScore,
            jokerScores,
            totalScore,
            phase: gameState.phase
        }

        setPhaseScores(prev => [...prev, playerScore])
        setShowScoring(true)

        // After 5 seconds, transition to next phase
        setTimeout(() => {
            setShowScoring(false)
            setGameState(prev => {
                if (!prev) return null

                // If we're in FLOP phase, move to TURN
                if (prev.phase === 'FLOP') {
                    const newPlayerCards: Record<string, Card[]> = { ...prev.playerCards }
                    const newPlayerJokers: Record<string, BaseJoker[]> = { ...prev.playerJokers }
                    
                    // Add one card to each player's hand
                    for (const player of prev.players) {
                        const playerHand = newPlayerCards[player.id] || []
                        const drawnCard = cardDeck.tryDrawCard()
                        if (drawnCard) {
                            newPlayerCards[player.id] = [...playerHand, drawnCard]
                        }

                        // Add one joker to each player
                        const playerJokers = newPlayerJokers[player.id] || []
                        const drawnJokers = jokerDeck.drawPlayerJokers(1)
                        if (drawnJokers.length === 1 && drawnJokers[0]) {
                            newPlayerJokers[player.id] = [...playerJokers, drawnJokers[0]]
                        }
                    }

                    // Add one community card and one community joker
                    const drawnCard = cardDeck.tryDrawCard()
                    const drawnJokers = jokerDeck.drawCommunityJokers(1)

                    // Only update if we successfully drew all cards
                    if (!drawnCard || drawnJokers.length !== 1 || !drawnJokers[0]) {
                        return prev // Keep the previous state if we couldn't draw new cards
                    }

                    const newState: GameState = {
                        ...prev,
                        phase: 'TURN',
                        playerCards: newPlayerCards,
                        playerJokers: newPlayerJokers,
                        communityCards: [...prev.communityCards, drawnCard],
                        communityJokers: [...prev.communityJokers, drawnJokers[0]],
                        timeRemaining: PHASE_TIME
                    }

                    return newState
                }
                // If we're in TURN phase, move to RIVER
                else if (prev.phase === 'TURN') {
                    const newPlayerCards: Record<string, Card[]> = { ...prev.playerCards }
                    const newPlayerJokers: Record<string, BaseJoker[]> = { ...prev.playerJokers }
                    
                    // Add one joker to each player for River phase
                    for (const player of prev.players) {
                        const playerJokers = newPlayerJokers[player.id] || []
                        const drawnJokers = jokerDeck.drawPlayerJokers(1)
                        if (drawnJokers.length === 1 && drawnJokers[0]) {
                            newPlayerJokers[player.id] = [...playerJokers, drawnJokers[0]]
                        }
                    }

                    // Add one community card for River
                    const drawnCard = cardDeck.tryDrawCard()
                    if (!drawnCard) {
                        return prev // Keep previous state if we couldn't draw a card
                    }

                    const newState: GameState = {
                        ...prev,
                        phase: 'RIVER',
                        playerJokers: newPlayerJokers,
                        communityCards: [...prev.communityCards, drawnCard],
                        timeRemaining: PHASE_TIME
                    }

                    return newState
                }
                // If we're in RIVER phase, move to SHOWDOWN
                else if (prev.phase === 'RIVER') {
                    // Calculate final scores for all players
                    const finalScores = phaseScores.reduce((acc, score) => {
                        const existingScore = acc[score.playerId] || 0
                        acc[score.playerId] = existingScore + score.totalScore
                        return acc
                    }, {} as Record<string, number>)

                    const newState: GameState = {
                        ...prev,
                        phase: 'SHOWDOWN',
                        isComplete: true,
                        timeRemaining: SCORING_TIME
                    }

                    // Show final scores
                    setShowScoring(true)
                    return newState
                }

                return prev
            })
        }, 5000)
    }

    type GamePlayPhase =  'COUNTDOWN' | 'FLOP' | 'TURN' | 'RIVER' | 'SHOWDOWN'
    
    // Group scores by phase
    const scoresByPhase = phaseScores.reduce((acc, score) => {
        if (!acc[score.phase]) {
            acc[score.phase] = []
        }
        acc[score.phase].push(score)
        return acc
    }, { COUNTDOWN: [], FLOP: [], TURN: [], RIVER: [], SHOWDOWN: [] } as Record<GamePlayPhase, ScoredPlay[]>)

    // Calculate total scores per player
    const totalScores = phaseScores.reduce((acc, score) => {
        if (!acc[score.playerId]) {
            acc[score.playerId] = {
                playerName: score.playerName,
                totalScore: 0
            }
        } else {
            acc[score.playerId]!.totalScore += score.totalScore
        }
        return acc
    }, {} as Record<string, { playerName: string; totalScore: number }>)

    if (!gameState || !gameState.players.length) {
        return <div>Loading...</div>
    }

    if (gameState.phase === 'COUNTDOWN') {
        return (
            <CountdownPhase
                players={gameState.players}
                timeRemaining={timeRemaining}
                className="flex-1"
            />
        )
    }

    const currentPlayer = gameState.players[gameState.currentPlayerId]
    if (!currentPlayer) return <div>Error: No current player</div>
    const playerCards = gameState.playerCards[currentPlayer.id]
    if (!playerCards) return <div>Error: No cards for current player</div>

    const playerJokers = gameState.playerJokers[currentPlayer.id]
    if (!playerJokers) return <div>Error: No jokers for current player</div>

    return (
        <div className="flex flex-col h-full gap-4 p-4">
            {showScoring && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-gray-800/90 rounded-lg p-6 w-full max-w-2xl">
                        {/* Show current phase scores at the top */}
                        {gameState.phase !== 'SHOWDOWN' && scoresByPhase[gameState.phase as GamePlayPhase].length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white text-center mb-4">
                                    Current {gameState.phase} Phase Scores
                                </h2>
                                <ScoringDisplay
                                    scores={scoresByPhase[gameState.phase as GamePlayPhase]}
                                    className="mb-4"
                                />
                            </div>
                        )}

                        {/* Show all phase scores in sequence */}
                        {(['FLOP', 'TURN', 'RIVER'] as GamePlayPhase[]).map(phase => {
                            const phaseScores = scoresByPhase[phase]
                            return phaseScores.length > 0 ? (
                                <div key={phase} className="mb-6">
                                    <h3 className="text-xl font-bold text-gray-300 mb-2">
                                        {phase} Phase
                                    </h3>
                                    <ScoringDisplay
                                        scores={phaseScores}
                                        className="mb-4"
                                    />
                                </div>
                            ) : null
                        })}

                        {/* Show total scores in showdown */}
                        {gameState.phase === 'SHOWDOWN' && (
                            <div className="mt-6">
                                <h2 className="text-2xl font-bold text-yellow-400 text-center mb-4">
                                    Final Scores
                                </h2>
                                <div className="flex flex-col gap-4">
                                    {Object.entries(totalScores)
                                        .sort(([, a], [, b]) => b.totalScore - a.totalScore)
                                        .map(([playerId, { playerName, totalScore }]) => (
                                            <div 
                                                key={playerId}
                                                className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg"
                                            >
                                                <span className="text-lg font-bold text-white">
                                                    {playerName}
                                                </span>
                                                <span className="text-2xl font-bold text-yellow-400">
                                                    {totalScore}
                                                </span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {(gameState.phase === 'FLOP' || gameState.phase === 'TURN' || gameState.phase === 'RIVER') && (
                <PlayPhase
                    player={currentPlayer}
                    playerCards={playerCards}
                    playerJokers={playerJokers}
                    communityCards={gameState.communityCards}
                    communityJokers={gameState.communityJokers}
                    onPlayHand={handlePlayHand}
                    timeRemaining={timeRemaining}
                    className="flex-1"
                />
            )}

            {gameState.phase === 'SHOWDOWN' && (
                <div className="text-center text-2xl font-bold text-white">
                    Game Complete!
                </div>
            )}
        </div>
    )
} 