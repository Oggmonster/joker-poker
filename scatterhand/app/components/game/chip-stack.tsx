import { cn } from '#app/utils/cn'

interface ChipStackProps {
    amount: number
    maxDisplayed?: number
    isAnimated?: boolean
    className?: string
}

const CHIP_COLORS = [
    'bg-red-500',    // 1
    'bg-green-500',  // 5
    'bg-blue-500',   // 10
    'bg-black',      // 25
    'bg-purple-500', // 100
    'bg-yellow-500', // 500
    'bg-pink-500'    // 1000
]

/**
 * Displays a stack of poker chips with the total amount
 */
export function ChipStack({
    amount,
    maxDisplayed = 5,
    isAnimated = false,
    className
}: ChipStackProps) {
    // Calculate how many chips to show based on the amount
    const getChipCount = () => {
        if (amount <= 0) return 0
        if (amount <= 10) return 1
        if (amount <= 100) return 2
        if (amount <= 1000) return 3
        return Math.min(maxDisplayed, Math.ceil(Math.log10(amount)))
    }

    // Get the color for a chip based on its position in the stack
    const getChipColor = (index: number) => {
        const colorIndex = Math.min(
            CHIP_COLORS.length - 1,
            Math.floor(Math.log10(amount / Math.pow(10, index)))
        )
        return CHIP_COLORS[colorIndex]
    }

    const chipCount = getChipCount()

    return (
        <div className={cn('relative flex flex-col items-center', className)}>
            {/* Chip Stack */}
            <div className="relative h-8">
                {Array.from({ length: chipCount }).map((_, index) => (
                    <div
                        key={index}
                        className={cn(
                            'absolute left-1/2',
                            'w-8 h-8 rounded-full border-2 border-white',
                            'transform -translate-x-1/2',
                            getChipColor(index),
                            isAnimated && 'transition-all duration-300',
                            isAnimated && 'hover:translate-y-[-2px]'
                        )}
                        style={{
                            top: `${-index * 4}px`,
                            zIndex: chipCount - index
                        }}
                    />
                ))}
            </div>

            {/* Amount Label */}
            <div className={cn(
                'mt-2 px-2 py-1 rounded',
                'bg-gray-800 text-white text-sm font-bold',
                'transition-all duration-200',
                isAnimated && 'group-hover:scale-110'
            )}>
                {amount}
            </div>
        </div>
    )
} 