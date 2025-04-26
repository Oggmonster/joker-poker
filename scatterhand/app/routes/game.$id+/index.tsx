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
import { PlayPhase } from '#app/components/game/play-phase.tsx'
import { HandEvaluator } from '#app/domain/scoring.ts'
import { Phase } from '#app/domain/round-state.ts'
import { PlayerScore } from '#app/components/game/scoring-display.tsx'
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
    const [phaseScores, setPhaseScores] = useState<PlayerScore[]>([])
    const [cardDeck, setCardDeck] = useState<Deck | null>(null)
    const [jokerDeck, setJokerDeck] = useState<JokerDeck | null>(null)

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
        if (!gameState) return

        console.log(holeCards, selectedJokers, playedCards)

        const result = HandEvaluator.evaluate(playedCards)
        let score = result.baseScore
        //apply joker bonuses
        selectedJokers.forEach(joker => {
            score += joker.calculateBonus({
                holeCards,
                playedHand: playedCards,
                phase: Phase.FLOP,
            })
        })        
    }

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

            {gameState.phase === 'FLOP' && (
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
        </div>
    )
} 