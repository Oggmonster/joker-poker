import { Card } from '#app/domain/cards'
import { BaseJoker } from '#app/domain/joker'
import { Player } from '#app/domain/player'
import { cn } from '#app/utils/cn'
import { useCallback, useState } from 'react'
import { CardDisplay } from './card-display'
import { JokerDisplay } from './joker-display'
import { HandEvaluator } from '#app/domain/scoring.ts'

interface PlayPhaseProps {
    player: Player
    playerCards: Card[]
    playerJokers: BaseJoker[]
    communityCards: Card[]
    communityJokers: BaseJoker[]
    onPlayHand: (holeCards: Card[], selectedJokers: BaseJoker[], playedCards: Card[]) => void
    timeRemaining: number
    className?: string
}

// Add this near the top with other helper functions
const RARITY_STYLES = {
    COMMON: {
        bg: 'bg-gray-500',
        hover: 'hover:bg-gray-600',
        text: 'text-white'
    },
    UNCOMMON: {
        bg: 'bg-green-500',
        hover: 'hover:bg-green-600',
        text: 'text-white'
    },
    RARE: {
        bg: 'bg-blue-500',
        hover: 'hover:bg-blue-600',
        text: 'text-white'
    },
    LEGENDARY: {
        bg: 'bg-purple-500',
        hover: 'hover:bg-purple-600',
        text: 'text-white'
    },
    UNIQUE: {
        bg: 'bg-yellow-500',
        hover: 'hover:bg-yellow-600',
        text: 'text-black'
    }
}

export function PlayPhase({
    player,
    playerCards,
    playerJokers,
    communityCards,
    communityJokers,
    onPlayHand,
    timeRemaining,
    className
}: PlayPhaseProps) {
    const [selectedJokers, setSelectedJokers] = useState<BaseJoker[]>([])
    const [selectedBoardCards, setSelectedBoardCards] = useState<Card[]>([])
    const [selectedHoleCards, setSelectedHoleCards] = useState<Card[]>([])
    const selectedCards = [...selectedBoardCards, ...selectedHoleCards]

    const getResult = () => {
        if (selectedCards.length !== 5) {
            return null
        }        
        const result = HandEvaluator.evaluate(selectedCards)
        return result
    }

    // Handle card selection
    const handleBoardCardSelect = useCallback((card: Card) => {
        setSelectedBoardCards(prev => {
            const isSelected = prev.some(c => c.id === card.id)
            if (isSelected) {
                return prev.filter(c => c.id !== card.id)
            }
            if (prev.length < 3) {
                return [...prev, card]
            }
            return prev
        })
    }, [])

    const handleHoleCardSelect = useCallback((card: Card) => {
        setSelectedHoleCards(prev => {
            const isSelected = prev.some(c => c.id === card.id)
            if (isSelected) {
                return prev.filter(c => c.id !== card.id)
            }
            if (prev.length < 2) {
                return [...prev, card]
            }
            return prev
        })
    }, [])

    const handleCardSelect = useCallback((card: Card) => {
        if (playerCards.some(c => c.id === card.id)) {
            handleHoleCardSelect(card)
        } else {
            handleBoardCardSelect(card)
        }
    }, [handleHoleCardSelect, handleBoardCardSelect])
    
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

    // Helper function to check if a card is selected
    const isCardSelected = (card: Card) => {
        return selectedCards.some(c => c.id === card.id)
    }

    // Helper function to get card source indicator
    const getCardSourceClass = (card: Card) => {
        if (playerCards.some(c => c.id === card.id)) {
            return 'from-hole-cards'
        }
        return 'from-board-cards'
    }

    const result = getResult()
    
    return (
        <div className={cn("flex gap-8 min-h-screen", className)}>
            {/* Main Game Area */}
            <div className="flex-1 flex flex-col gap-8 items-center">
                {/* Board Cards */}
                <div className="flex flex-col gap-4 items-center w-full max-w-4xl">
                    <div className="text-lg font-bold">Board Cards (select up to 3)</div>
                    <div className="flex gap-8 justify-center">
                        <div className="flex gap-2">
                            {communityCards.map((card, index) => (
                                <div 
                                    key={index} 
                                    className={cn(
                                        "w-32 h-48 transition-all duration-300 ease-in-out transform",
                                        isCardSelected(card) && "opacity-50 scale-95"
                                    )}
                                >
                                    <CardDisplay 
                                        card={card}
                                        isSelected={isCardSelected(card)}
                                        onClick={() => handleBoardCardSelect(card)}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            {communityJokers.map((joker, index) => (
                                <div 
                                    key={index} 
                                    className={cn(
                                        "w-32 h-48 transition-all duration-300",
                                        selectedJokers.includes(joker) && "opacity-50 scale-95"
                                    )}
                                >
                                    <JokerDisplay 
                                        joker={joker}
                                        isSelected={selectedJokers.includes(joker)}
                                        onClick={() => handleJokerSelect(joker)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Selected Hand and Jokers - Center Stage */}
                <div className="flex flex-col items-center gap-4 my-8 w-full max-w-6xl">
                    <div className="text-xl font-bold text-center mb-2">
                        Your Hand ({selectedCards.length}/5)
                    </div>
                    <div className="flex gap-12 items-center justify-center">
                        <div className="flex flex-col items-center gap-6">
                            {/* Selected Hand */}
                            <div className="flex gap-4 justify-center min-h-[12rem]">
                                {selectedCards.map((card, index) => (
                                    <div 
                                        key={`selected-${card.id}`}
                                        className={cn(
                                            "w-32 h-48 transition-all duration-300 ease-in-out transform hover:scale-105",
                                            getCardSourceClass(card)
                                        )}
                                        style={{
                                            transform: `rotate(${(index - (selectedCards.length - 1) / 2) * 5}deg)`
                                        }}
                                    >
                                        <CardDisplay 
                                            card={card}
                                            onClick={() => handleCardSelect(card)}
                                        />
                                    </div>
                                ))}
                                {/* Empty card slots */}
                                {Array.from({ length: 5 - selectedCards.length }).map((_, index) => (
                                    <div 
                                        key={`empty-${index}`}
                                        className="w-32 h-48 rounded-lg border-2 border-dashed border-white/20"
                                        style={{
                                            transform: `rotate(${(index + selectedCards.length - 2) * 5}deg)`
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Selected Jokers */}
                            <div className="flex gap-3 justify-center min-h-[6rem] items-center">
                                {selectedJokers.map((joker, index) => {
                                    const styles = RARITY_STYLES[joker.rarity]
                                    return (
                                        <div 
                                            key={index}
                                            className={cn(
                                                "w-20 h-28 transition-all duration-300 ease-in-out transform hover:scale-105",
                                                "rounded-lg p-2 flex items-center justify-center",
                                                styles.bg,
                                                styles.hover
                                            )}
                                            onClick={() => handleJokerSelect(joker)}
                                        >
                                            <div className={cn(
                                                "text-center text-sm font-medium",
                                                styles.text
                                            )}>
                                                {joker.name}
                                            </div>
                                        </div>
                                    )
                                })}
                                {Array.from({ length: 3 - selectedJokers.length }).map((_, index) => (
                                    <div 
                                        key={`empty-${index}`} 
                                        className="w-20 h-28 rounded-lg border-2 border-dashed border-white/20"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Play Hand Button and Clear Buttons */}
                        <div className="flex flex-col justify-center gap-4">
                            <button
                                onClick={() => onPlayHand(selectedHoleCards, selectedJokers, selectedCards)}
                                disabled={selectedJokers.length !== 3 || selectedCards.length !== 5}
                                className={cn(
                                    "px-8 py-6 text-xl font-bold rounded-lg transition-all",
                                    selectedJokers.length === 3 && selectedCards.length === 5
                                        ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer shadow-lg hover:shadow-blue-500/20"
                                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                                )}
                            >
                                Play Hand
                            </button>

                            {/* Clear Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setSelectedBoardCards([])
                                        setSelectedHoleCards([])
                                    }}
                                    disabled={selectedCards.length === 0}
                                    className={cn(
                                        "px-3 py-2 text-sm font-medium rounded transition-all flex-1",
                                        selectedCards.length > 0
                                            ? "bg-red-500/20 hover:bg-red-500/30 text-red-300 cursor-pointer"
                                            : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                                    )}
                                >
                                    Clear Cards
                                </button>
                                <button
                                    onClick={() => setSelectedJokers([])}
                                    disabled={selectedJokers.length === 0}
                                    className={cn(
                                        "px-3 py-2 text-sm font-medium rounded transition-all flex-1",
                                        selectedJokers.length > 0
                                            ? "bg-red-500/20 hover:bg-red-500/30 text-red-300 cursor-pointer"
                                            : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                                    )}
                                >
                                    Clear Jokers
                                </button>
                            </div>

                            {/* Requirements Status */}
                            <div className="flex gap-4 text-sm font-medium">
                                <div className={cn(
                                    "flex items-center gap-1",
                                    selectedBoardCards.length === 3 ? "text-green-400" : "text-gray-400"
                                )}>
                                    <span>{selectedBoardCards.length}/3</span>
                                    <span>Board</span>
                                </div>
                                <div className={cn(
                                    "flex items-center gap-1",
                                    selectedHoleCards.length === 2 ? "text-green-400" : "text-gray-400"
                                )}>
                                    <span>{selectedHoleCards.length}/2</span>
                                    <span>Hole</span>
                                </div>
                                <div className={cn(
                                    "flex items-center gap-1",
                                    selectedJokers.length === 3 ? "text-green-400" : "text-gray-400"
                                )}>
                                    <span>{selectedJokers.length}/3</span>
                                    <span>Jokers</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Player's Hole Cards */}
                <div className="flex flex-col gap-4 items-center w-full max-w-4xl">
                    <div className="text-lg font-bold">Hole Cards (select 2)</div>
                    <div className="flex gap-8 justify-center">
                        <div className="flex gap-2">
                            {playerCards.map((card, index) => (
                                <div 
                                    key={index}
                                    className={cn(
                                        "w-32 h-48 transition-all duration-300 ease-in-out transform",
                                        isCardSelected(card) && "opacity-50 scale-95"
                                    )}
                                >
                                    <CardDisplay 
                                        card={card}
                                        isSelected={isCardSelected(card)}
                                        onClick={() => handleHoleCardSelect(card)}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            {playerJokers.map((joker, index) => (
                                <div 
                                    key={index}
                                    className={cn(
                                        "w-32 h-48 transition-all duration-300",
                                        selectedJokers.includes(joker) && "opacity-50 scale-95"
                                    )}
                                >
                                    <JokerDisplay 
                                        joker={joker}
                                        isSelected={selectedJokers.includes(joker)}
                                        onClick={() => handleJokerSelect(joker)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side Panel */}
            <div className="w-80 flex flex-col gap-6 p-6 bg-white/5 rounded-lg">
                {/* Timer */}
                <div className="flex flex-col gap-2">
                    <div className="text-lg font-medium text-gray-300">Time Remaining</div>
                    <div className="text-4xl font-bold text-blue-500">{timeRemaining}s</div>
                </div>

                {/* Current Score */}
                <div className="flex flex-col gap-2">
                    <div className="text-lg font-medium text-gray-300">Current Hand</div>
                    {result ? (
                        <>
                            <div className="text-2xl font-bold text-yellow-400">
                                {result.handRank.toString()}
                            </div>
                            <div className="text-xl font-bold text-green-400">
                                {result.baseScore} Points
                            </div>
                        </>
                    ) : (
                        <div className="text-xl text-gray-400">
                            Select 5 cards to make a hand
                        </div>
                    )}
                </div>

                {/* Player Stats or Additional Info could go here */}
            </div>
        </div>
    )
} 