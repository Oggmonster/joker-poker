import { useCallback, useEffect, useState } from 'react'
import { Card } from '#app/domain/cards'
import { BaseJoker } from '#app/domain/joker'
import { Player, PlayerStatus } from '#app/domain/player'
import { RoundPhase } from '#app/domain/round-state'
import { GameBoard } from '#app/components/game/game-board'
import { RoundStatus } from '#app/components/game/round-status'
import { ScoringDisplay } from '#app/components/game/scoring-display'
import { RoundResults } from '#app/components/game/round-results'
import { cn } from '#app/utils/cn'
import { GameSection, GameState, PlayerAction } from '#app/domain/game-state'
import { type Route } from './+types/index.ts'
import { useLoaderData } from 'react-router'

const mockPlayers: Player[] = [
    new Player('1', 'Player 1', 0, true),
    new Player('2', 'Player 2', 1, true),
    new Player('3', 'Player 3', 2, true),
    new Player('4', 'Player 4', 3, true),
    new Player('5', 'Player 5', 4, true),
    new Player('6', 'Martin', 5, false),
]

export async function loader({ params, request }: Route.LoaderArgs) {
	const playerNames = ["Kalle", "Leffe", "Martin", "Olle", "Pelle", "Stina"]
	return { gameId: params.id, playerNames: playerNames }
}

export const meta: Route.MetaFunction = ({ data }) => [{ title: `Scatterhand - Game ${data.gameId}` }]

const SECTION_TIME_LIMIT = 30 // seconds

/**
 * Main game route component
 */
export default function GameRoute({ loaderData }: Route.ComponentProps) { 
    const [gameState, setGameState] = useState<GameState | null>(null)
    const [timeRemaining, setTimeRemaining] = useState(SECTION_TIME_LIMIT)
    const [pendingActions, setPendingActions] = useState<PlayerAction[]>([])
    const [playerScores, setPlayerScores] = useState<Record<string, number>>({})

    //set mock game state
    useEffect(() => {
        const mockGameState: GameState = {
            id: loaderData.gameId,
            players: mockPlayers,
            currentSection: 'DISCARD',
            sectionActions: [],
            communityCards: [],
            communityJokers: [],
            playerCards: {},
            isComplete: false,
            activeJokers: [],
            currentPlayerId: 0,
            lastAction: null
        }
        setGameState(mockGameState)
    }, [])

    // // Handle section timer
    useEffect(() => {
        if (!gameState || gameState.isComplete) return

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 0) {
                    // Time's up - process all pending actions
                    processSectionEnd()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [gameState])

   
    // Process all actions at the end of a section
    const processSectionEnd = useCallback(() => {
        if (!gameState) return

        // Combine pending actions with existing section actions
        const allActions = [...gameState.sectionActions, ...pendingActions]

        // TODO: Process actions and update game state
        // This is where we would:
        // 1. Apply all player actions in order
        // 2. Update game state (cards, selected cards/jokers)
        // 3. Move to next section if appropriate
        // 4. Save game state to storage

        // For now, just move to next section
        setGameState(prev => {
            if (!prev) return null
            return {
                ...prev,
                currentSection: prev.currentSection === 'DISCARD' ? 'SCORING' : prev.currentSection,
                isComplete: prev.currentSection === 'SCORING'
            }
        })

        // Clear pending actions
        setPendingActions([])
    }, [gameState, pendingActions])

    // Handle player actions
    const handlePlayerAction = useCallback((action: PlayerAction) => {
        setPendingActions(prev => [...prev, action])
    }, [])

    
    if (!gameState) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex flex-col h-full gap-4 p-4">

            <div className='flex-1'>
                <ul>
                    {gameState.players.map(player => (
                        <li key={player.id}>{player.name}</li>
                    ))}
                </ul>
            </div>
           
            {/* Game Board */}
            <div className="flex-1">
                <GameBoard
                    players={gameState.players}
                    activePlayerId={String(gameState.currentPlayerId)}
                    playerCards={gameState.playerCards}
                    communityCards={gameState.communityCards}
                    communityJokers={gameState.communityJokers}
                    currentPhase={gameState.currentSection === 'DISCARD' ? RoundPhase.DISCARD : RoundPhase.SCORING}
                    playerScores={playerScores}
                />
            </div>

            {/* Game Controls */}
            <div className="flex flex-col gap-4">
                <RoundStatus
                    phase={gameState.currentSection === 'DISCARD' ? RoundPhase.DISCARD : RoundPhase.SCORING}
                    activePlayerName={gameState.players[gameState.currentPlayerId]?.name || null}
                    timeRemaining={timeRemaining}
                    maxTime={SECTION_TIME_LIMIT}
                />

                {gameState.currentSection === 'DISCARD' ? (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePlayerAction({
                                type: 'DISCARD',
                                cardIndices: [] // TODO: Get selected card indices
                            })}
                            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                        >
                            Discard Selected
                        </button>
                        <button
                            onClick={() => handlePlayerAction({
                                type: 'DISCARD',
                                cardIndices: []
                            })}
                            className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                        >
                            Keep All
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePlayerAction({
                                type: 'SELECT_CARDS',
                                selectedCards: [] // TODO: Get selected cards
                            })}
                            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                        >
                            Confirm Selection
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
} 