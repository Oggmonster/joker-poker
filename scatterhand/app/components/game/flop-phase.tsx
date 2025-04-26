import { Card } from '#app/domain/cards'
import { BaseJoker } from '#app/domain/joker'
import { Player } from '#app/domain/player'
import { cn } from '#app/utils/cn'
import { CardDisplay } from './card-display'
import { JokerDisplay } from './joker-display'

interface FlopPhaseProps {
    player: Player
    playerCards: Card[]
    playerJoker: BaseJoker
    communityCards: Card[]
    communityJokers: BaseJoker[]
    selectedJokers: BaseJoker[]
    onJokerSelect: (joker: BaseJoker) => void
    onPlayHand: () => void
    timeRemaining: number
    className?: string
}

export function FlopPhase({
    player,
    playerCards,
    playerJoker,
    communityCards,
    communityJokers,
    selectedJokers,
    onJokerSelect,
    onPlayHand,
    timeRemaining,
    className
}: FlopPhaseProps) {
    return (
        <div className={cn("flex flex-col gap-8", className)}>
            {/* Timer */}
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 rounded-lg">
                <div className="text-lg font-medium">Time Remaining</div>
                <div className="text-2xl font-bold text-blue-500">{timeRemaining}s</div>
            </div>

            {/* Player's Hand */}
            <div className="flex flex-col gap-4">
                <div className="text-lg font-bold">Your Hand</div>
                <div className="flex gap-4">
                    <div className="flex gap-2">
                        {playerCards.map((card, index) => (
                            <div key={index} className="w-32 h-48">
                                <CardDisplay card={card} />
                            </div>
                        ))}
                    </div>
                    <div className="w-32 h-48">
                        <JokerDisplay 
                            joker={playerJoker}
                            isSelected={selectedJokers.includes(playerJoker)}
                            onClick={() => onJokerSelect(playerJoker)}
                        />
                    </div>
                </div>
            </div>

            {/* Community Cards and Jokers */}
            <div className="flex flex-col gap-4">
                <div className="text-lg font-bold">Community Cards</div>
                <div className="flex gap-8">
                    <div className="flex gap-2">
                        {communityCards.map((card, index) => (
                            <div key={index} className="w-32 h-48">
                                <CardDisplay card={card} />
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        {communityJokers.map((joker, index) => (
                            <div key={index} className="w-32 h-48">
                                <JokerDisplay 
                                    joker={joker}
                                    isSelected={selectedJokers.includes(joker)}
                                    onClick={() => onJokerSelect(joker)}
                                />
                            </div>
                        ))}
                    </div>
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
                                isSelected={true}
                                onClick={() => onJokerSelect(joker)}
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
                onClick={onPlayHand}
                disabled={selectedJokers.length !== 3}
                className={cn(
                    "px-6 py-3 text-lg font-bold rounded-lg transition-all",
                    selectedJokers.length === 3
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                )}
            >
                Play Hand
            </button>
        </div>
    )
} 