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
        return result.handRank.toString()
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
    
    return (
        <div className={cn("flex flex-col gap-8 min-h-screen items-center", className)}>
            {/* Timer */}
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 rounded-lg w-full max-w-4xl">
                <div className="text-lg font-medium">Time Remaining</div>
                <div className="text-2xl font-bold text-blue-500">{timeRemaining}s</div>
            </div>

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
                    Your Hand ({selectedCards.length}/5) {getResult() && `- ${getResult()}`}
                </div>
                <div className="flex gap-12 items-center justify-center">
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
                    <div className="flex flex-col items-center gap-4">
                        <div className="text-lg font-bold">Selected Jokers ({selectedJokers.length}/3)</div>
                        <div className="flex flex-col gap-2">
                            {selectedJokers.map((joker, index) => (
                                <div 
                                    key={index}
                                    className="w-24 h-36 transition-all duration-300 ease-in-out transform hover:scale-105"
                                >
                                    <JokerDisplay 
                                        joker={joker}
                                        onClick={() => handleJokerSelect(joker)}
                                    />
                                </div>
                            ))}
                            {Array.from({ length: 3 - selectedJokers.length }).map((_, index) => (
                                <div 
                                    key={`empty-${index}`} 
                                    className="w-24 h-36 rounded-lg border-2 border-dashed border-white/20"
                                />
                            ))}
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

            {/* Play Hand Button */}
            <button
                onClick={() => onPlayHand(selectedHoleCards, selectedJokers, selectedCards)}
                disabled={selectedJokers.length !== 3 || selectedCards.length !== 5}
                className={cn(
                    "px-6 py-3 text-lg font-bold rounded-lg transition-all",
                    selectedJokers.length === 3 && selectedCards.length === 5
                        ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                )}
            >
                Play Hand
            </button>
        </div>
    )
} 