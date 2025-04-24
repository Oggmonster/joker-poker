import { Card } from '#app/domain/cards'
import { BaseJoker } from '#app/domain/joker'
import { Player } from '#app/domain/player'
import { RoundPhase } from '#app/domain/round-state'
import { cn } from '#app/utils/cn'
import { CommunityArea } from './community-area'
import { PlayerArea } from './player-area'

export interface GameBoardProps {
    players: Player[]
    activePlayerId: string
    playerCards: Record<string, Card[]>
    communityCards: Card[]
    communityJokers: BaseJoker[]
    currentPhase: RoundPhase
    playerScores: Record<string, number>
}

interface PlayerPosition {
    x: number
    y: number
    rotation: number
}

/**
 * Calculates player positions around an elliptical table
 */
function calculatePlayerPositions(numPlayers: number): PlayerPosition[] {
    const positions: PlayerPosition[] = []
    const centerX = 50 // Center X percentage
    const centerY = 50 // Center Y percentage
    const radiusX = 40 // Horizontal radius percentage
    const radiusY = 30 // Vertical radius percentage

    for (let i = 0; i < numPlayers; i++) {
        // Calculate angle for this player (0 to 2π)
        const angle = (i * 2 * Math.PI) / numPlayers
        // Start at -π/2 (top) and go clockwise
        const adjustedAngle = angle - Math.PI / 2

        // Calculate position on ellipse
        const x = centerX + radiusX * Math.cos(adjustedAngle)
        const y = centerY + radiusY * Math.sin(adjustedAngle)
        
        // Calculate rotation to face center
        const rotation = (angle * 180) / Math.PI

        positions.push({ x, y, rotation })
    }

    return positions
}

/**
 * Main game board component that shows players around a table with community cards
 */
export function GameBoard({
    players,
    activePlayerId,
    playerCards,
    communityCards,
    communityJokers,
    currentPhase,
    playerScores
}: GameBoardProps) {
    const positions = calculatePlayerPositions(players.length)

    return (
        <div className="relative w-full h-full bg-green-800 rounded-lg p-8">
            {/* Community Area */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="flex flex-col items-center gap-4">
                    <div className="text-white font-bold">
                        {currentPhase === RoundPhase.DISCARD ? 'Discard Phase' : 'Scoring Phase'}
                    </div>
                    
                    {/* Community Cards */}
                    <div className="flex gap-2">
                        {communityCards.map((card, index) => (
                            <div key={index} className="w-16 h-24 bg-white rounded">
                                {/* TODO: Render card */}
                            </div>
                        ))}
                    </div>

                    {/* Community Jokers */}
                    <div className="flex gap-2">
                        {communityJokers.map((joker, index) => (
                            <div key={index} className="w-16 h-24 bg-purple-500 rounded">
                                {/* TODO: Render joker */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Players */}
            {players.map((player, index) => (
                <div
                    key={player.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${getPlayerPosition(index, players.length)}`}
                >
                    <div className={`flex flex-col items-center gap-2 ${player.id === activePlayerId ? 'ring-2 ring-yellow-400 rounded-lg p-2' : ''}`}>
                        <div className="text-white font-bold">{player.name}</div>
                        
                        {/* Player's Cards */}
                        <div className="flex gap-1">
                            {playerCards[player.id]?.map((card, cardIndex) => (
                                <div key={cardIndex} className="w-12 h-16 bg-white rounded">
                                    {/* TODO: Render card */}
                                </div>
                            ))}
                        </div>

                        {/* Player's Score */}
                        {currentPhase === RoundPhase.SCORING && (
                            <div className="text-yellow-400 font-bold">
                                Score: {playerScores[player.id] || 0}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

function getPlayerPosition(index: number, totalPlayers: number): string {
    const angle = (index * 360) / totalPlayers - 90 // Start from top
    const radius = 40 // % of container size
    const x = radius * Math.cos((angle * Math.PI) / 180)
    const y = radius * Math.sin((angle * Math.PI) / 180)
    
    return `left-[${50 + x}%] top-[${50 + y}%]`
} 