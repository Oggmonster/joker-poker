import { Card, Rank } from './cards'

export enum HandRank {
  HIGH_CARD = 'HIGH_CARD',
  PAIR = 'PAIR',
  TWO_PAIR = 'TWO_PAIR',
  THREE_OF_A_KIND = 'THREE_OF_A_KIND',
  STRAIGHT = 'STRAIGHT',
  FLUSH = 'FLUSH',
  FULL_HOUSE = 'FULL_HOUSE',
  FOUR_OF_A_KIND = 'FOUR_OF_A_KIND',
  STRAIGHT_FLUSH = 'STRAIGHT_FLUSH',
  ROYAL_FLUSH = 'ROYAL_FLUSH'
}

export const BASE_HAND_SCORES: Record<HandRank, number> = {
  [HandRank.HIGH_CARD]: 50,
  [HandRank.PAIR]: 100,
  [HandRank.TWO_PAIR]: 200,
  [HandRank.THREE_OF_A_KIND]: 300,
  [HandRank.STRAIGHT]: 400,
  [HandRank.FLUSH]: 500,
  [HandRank.FULL_HOUSE]: 600,
  [HandRank.FOUR_OF_A_KIND]: 800,
  [HandRank.STRAIGHT_FLUSH]: 1000,
  [HandRank.ROYAL_FLUSH]: 2000
}

export interface HandEvaluation {
  handRank: HandRank;
  baseScore: number;
  highCard: Card;
  secondHighCard?: Card;
  kickers: Card[];
}

export class HandEvaluator {
  static evaluate(cards: Card[]): HandEvaluation {
    if (cards.length !== 5) {
      throw new Error('Need 5 cards to evaluate a poker hand');
    }

    //it there is a face card, we need to treat the ace as 14
    const aceValue = this.hasAnyFaceCard(cards) ? 14 : 1;

    // Sort cards by rank
    const sortedCards = [...cards].sort((a, b) => {
      const rankA = a.rank === Rank.ACE ? aceValue : a.toNumber()
      const rankB = b.rank === Rank.ACE ? aceValue : b.toNumber()
      return rankB - rankA
    });    

    if (!sortedCards[0]) {
      throw new Error('Invalid card array');
    }

    // Check for each hand type from highest to lowest
    if (this.isRoyalFlush(sortedCards)) {
      return {
        handRank: HandRank.ROYAL_FLUSH,
        baseScore: BASE_HAND_SCORES[HandRank.ROYAL_FLUSH],
        highCard: sortedCards[0],
        kickers: []
      };
    }

    if (this.isStraightFlush(sortedCards)) {
      return {
        handRank: HandRank.STRAIGHT_FLUSH,
        baseScore: BASE_HAND_SCORES[HandRank.STRAIGHT_FLUSH],
        highCard: sortedCards[0],
        kickers: []
      };
    }

    const fourOfAKind = this.findFourOfAKind(sortedCards);
    if (fourOfAKind) {
      const [highCard, , , , kicker] = fourOfAKind;
      return {
        handRank: HandRank.FOUR_OF_A_KIND,
        baseScore: BASE_HAND_SCORES[HandRank.FOUR_OF_A_KIND],
        highCard,
        kickers: [kicker]
      };
    }

    const fullHouse = this.findFullHouse(sortedCards);
    if (fullHouse) {
      const [highCard, , , secondHighCard] = fullHouse;
      return {
        handRank: HandRank.FULL_HOUSE,
        baseScore: BASE_HAND_SCORES[HandRank.FULL_HOUSE],
        highCard,
        secondHighCard,
        kickers: []
      };
    }

    if (this.isFlush(sortedCards)) {
      const kickers = sortedCards.slice(1, 5);
      if (kickers.length !== 4) {
        throw new Error('Invalid flush hand');
      }
      return {
        handRank: HandRank.FLUSH,
        baseScore: BASE_HAND_SCORES[HandRank.FLUSH],
        highCard: sortedCards[0],
        kickers
      };
    }

    if (this.isStraight(sortedCards)) {
      return {
        handRank: HandRank.STRAIGHT,
        baseScore: BASE_HAND_SCORES[HandRank.STRAIGHT],
        highCard: sortedCards[0],
        kickers: []
      };
    }

    const threeOfAKind = this.findThreeOfAKind(sortedCards);
    if (threeOfAKind) {
      const [highCard, , , ...kickers] = threeOfAKind;
      if (kickers.length !== 2) {
        throw new Error('Invalid three of a kind hand');
      }
      return {
        handRank: HandRank.THREE_OF_A_KIND,
        baseScore: BASE_HAND_SCORES[HandRank.THREE_OF_A_KIND],
        highCard,
        kickers
      };
    }

    const twoPair = this.findTwoPair(sortedCards);
    if (twoPair) {
      const [highCard, , secondHighCard, , kicker] = twoPair;
      return {
        handRank: HandRank.TWO_PAIR,
        baseScore: BASE_HAND_SCORES[HandRank.TWO_PAIR],
        highCard,
        secondHighCard,
        kickers: [kicker]
      };
    }

    const pair = this.findPair(sortedCards);
    if (pair) {
      const [highCard, , ...kickers] = pair;
      if (kickers.length !== 3) {
        throw new Error('Invalid pair hand');
      }
      return {
        handRank: HandRank.PAIR,
        baseScore: BASE_HAND_SCORES[HandRank.PAIR],
        highCard,
        kickers
      };
    }

    const kickers = sortedCards.slice(1, 5);
    if (kickers.length !== 4) {
      throw new Error('Invalid high card hand');
    }

    return {
      handRank: HandRank.HIGH_CARD,
      baseScore: BASE_HAND_SCORES[HandRank.HIGH_CARD],
      highCard: sortedCards[0],
      kickers
    };
  }

  private static isRoyalFlush(cards: Card[]): boolean {
    const firstFive = cards.slice(0, 5);
    const firstCard = firstFive[0];
    if (!firstCard) return false;
    return this.isStraightFlush(firstFive) && firstCard.rank === Rank.ACE;
  }

  private static isStraightFlush(cards: Card[]): boolean {
    const firstFive = cards.slice(0, 5);
    return this.isFlush(firstFive) && this.isStraight(firstFive);
  }

  private static isFlush(cards: Card[]): boolean {
    const firstCard = cards[0];
    if (!firstCard) return false;
    return cards.slice(0, 5).every(card => card.suit === firstCard.suit);
  }

  
  private static cardDistance(card1: Card, card2: Card): number {
    // Convert ranks to numbers, treating Ace as both 1 and 14
    const rank1 = card1.toNumber()
    const rank2 = card2.toNumber()
    
    // If either card is an Ace, check both high and low distances
    if (card1.rank === Rank.ACE || card2.rank === Rank.ACE) {
      const highAceDistance = Math.abs(
        (card1.rank === Rank.ACE ? 14 : rank1) - 
        (card2.rank === Rank.ACE ? 14 : rank2)
      );
      const lowAceDistance = Math.abs(
        (card1.rank === Rank.ACE ? 1 : rank1) - 
        (card2.rank === Rank.ACE ? 1 : rank2)
      );
      // Return the smaller distance
      return Math.min(highAceDistance, lowAceDistance);
    }

    // For non-Ace cards, just return absolute difference
    return Math.abs(rank1 - rank2);
  }

  private static hasAnyFaceCard(cards: Card[]): boolean {
    return cards.some(card => card.rank === Rank.JACK || card.rank === Rank.QUEEN || card.rank === Rank.KING);
  }


  private static isStraight(cards: Card[]): boolean {
    const distance = cards.reduce((acc, card, index) => {
      if (index === 0) return 0;
      
      const previousCard = cards[index - 1];
      if (!previousCard) return acc;

      return acc + this.cardDistance(card, previousCard);
    }, 0);

    return distance === 4;
  }

  private static findFourOfAKind(cards: Card[]): [Card, Card, Card, Card, Card] | null {
    if (cards.length < 5) return null;

    for (let i = 0; i <= cards.length - 4; i++) {
      const card1 = cards[i];
      const card2 = cards[i + 1];
      const card3 = cards[i + 2];
      const card4 = cards[i + 3];
      
      if (!card1 || !card2 || !card3 || !card4) continue;

      if (card1.rank === card2.rank &&
          card1.rank === card3.rank &&
          card1.rank === card4.rank) {
        // Find highest kicker that isn't part of the four of a kind
        const kicker = cards.find(c => c.rank !== card1.rank);
        if (!kicker) return null;
        
        return [card1, card2, card3, card4, kicker];
      }
    }
    return null;
  }

  private static findFullHouse(cards: Card[]): [Card, Card, Card, Card, Card] | null {
    if (cards.length < 5) return null;

    // Find three of a kind first
    for (let i = 0; i <= cards.length - 3; i++) {
      const card1 = cards[i];
      const card2 = cards[i + 1];
      const card3 = cards[i + 2];
      
      if (!card1 || !card2 || !card3) continue;

      if (card1.rank === card2.rank && card1.rank === card3.rank) {
        // Look for a pair among remaining cards
        const remainingCards = cards.filter(c => c.rank !== card1.rank);
        for (let j = 0; j <= remainingCards.length - 2; j++) {
          const pairCard1 = remainingCards[j];
          const pairCard2 = remainingCards[j + 1];
          
          if (!pairCard1 || !pairCard2) continue;

          if (pairCard1.rank === pairCard2.rank) {
            return [card1, card2, card3, pairCard1, pairCard2];
          }
        }
      }
    }
    return null;
  }

  private static findThreeOfAKind(cards: Card[]): [Card, Card, Card, Card, Card] | null {
    if (cards.length < 5) return null;

    for (let i = 0; i <= cards.length - 3; i++) {
      const card1 = cards[i];
      const card2 = cards[i + 1];
      const card3 = cards[i + 2];
      
      if (!card1 || !card2 || !card3) continue;

      if (card1.rank === card2.rank && card1.rank === card3.rank) {
        const remainingCards = cards.filter(c => c.rank !== card1.rank);
        if (remainingCards.length < 2) return null;
        
        // Get the two highest remaining cards as kickers
        const [kicker1, kicker2] = remainingCards.slice(0, 2);
        if (!kicker1 || !kicker2) return null;

        return [card1, card2, card3, kicker1, kicker2];
      }
    }
    return null;
  }

  private static findTwoPair(cards: Card[]): [Card, Card, Card, Card, Card] | null {
    if (cards.length < 5) return null;

    // Find first pair
    for (let i = 0; i <= cards.length - 2; i++) {
      const card1 = cards[i];
      const card2 = cards[i + 1];
      
      if (!card1 || !card2) continue;

      if (card1.rank === card2.rank) {
        // Look for second pair
        const remainingCards = cards.filter(c => c.rank !== card1.rank);
        for (let j = 0; j <= remainingCards.length - 2; j++) {
          const pairCard1 = remainingCards[j];
          const pairCard2 = remainingCards[j + 1];
          
          if (!pairCard1 || !pairCard2) continue;

          if (pairCard1.rank === pairCard2.rank) {
            // Find highest remaining card as kicker
            const kicker = cards.find(c => 
              c.rank !== card1.rank && 
              c.rank !== pairCard1.rank
            );
            if (!kicker) return null;

            return [card1, card2, pairCard1, pairCard2, kicker];
          }
        }
      }
    }
    return null;
  }

  private static findPair(cards: Card[]): [Card, Card, Card, Card, Card] | null {
    if (cards.length < 5) return null;

    for (let i = 0; i <= cards.length - 2; i++) {
      const card1 = cards[i];
      const card2 = cards[i + 1];
      
      if (!card1 || !card2) continue;

      if (card1.rank === card2.rank) {
        const remainingCards = cards.filter(c => c.rank !== card1.rank);
        if (remainingCards.length < 3) return null;
        
        // Get the three highest remaining cards as kickers
        const [kicker1, kicker2, kicker3] = remainingCards.slice(0, 3);
        if (!kicker1 || !kicker2 || !kicker3) return null;

        return [card1, card2, kicker1, kicker2, kicker3];
      }
    }
    return null;
  }
} 