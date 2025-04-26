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
    //split up into selectedBoardCards and selectedHoleCards
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
    
    return (
        <div className={cn("flex flex-col gap-8", className)}>
            {/* Timer */}
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 rounded-lg">
                <div className="text-lg font-medium">Time Remaining</div>
                <div className="text-2xl font-bold text-blue-500">{timeRemaining}s</div>
            </div>

            {/* Community Cards and Jokers */}
            <div className="flex flex-col gap-4">
                <div className="text-lg font-bold">Board</div>
                <div className="flex gap-8">
                    <div className="flex gap-2">
                        {communityCards.map((card, index) => (
                            <div key={index} className="w-32 h-48">
                                <CardDisplay card={card}
                                    isSelected={selectedCards.includes(card)}
                                    onClick={() => handleBoardCardSelect(card)}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        {communityJokers.map((joker, index) => (
                            <div key={index} className="w-32 h-48">
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

            {/* Player's Hand */}
            <div className="flex flex-col gap-4">
                <div className="text-lg font-bold">Hole cards</div>
                <div className="flex gap-4">
                    <div className="flex gap-2">
                        {playerCards.map((card, index) => (
                            <div key={index} className="w-32 h-48">
                                <CardDisplay card={card} 
                                    isSelected={selectedCards.includes(card)}
                                    onClick={() => handleHoleCardSelect(card)}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        {playerJokers.map((joker, index) => (
                            <div key={index} className="w-32 h-48">
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

            {/* Selected Cards */}
            <div className="flex flex-col gap-4">
                <div className="text-lg font-bold">Selected Cards ({selectedCards.length}/5) - {getResult()}</div>
                <div className="flex gap-2">
                    {selectedCards.map((card, index) => (
                        <div key={index} className="w-32 h-48">
                            <CardDisplay card={card} 
                            onClick={() => handleCardSelect(card)}
                            
                            />
                        </div>
                    ))}
                    {Array.from({ length: 5 - selectedCards.length }).map((_, index) => (
                        <div 
                            key={`empty-${index}`} 
                            className="w-32 h-48 rounded-lg border-2 border-dashed border-white/20"
                        />
                    ))}
                </div>
            </div>

            {/* Selected Jokers */}
            <div className="flex flex-col gap-4">
                <div className="text-lg font-bold">Selected Jokers ({selectedJokers.length}/3)</div>
                <div className="flex gap-2">
                    {selectedJokers.map((joker, index) => (
                        <div key={index} className="w-24 h-36">
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