import { describe, test, expect } from 'vitest'
import { HandEvaluator, HandRank, BASE_HAND_SCORES } from '../scoring'
import { Card, Suit, Rank } from '../cards'

describe('HandEvaluator', () => {
  test('throws error if less than 5 cards', () => {
    const cards = [
      new Card(Suit.HEARTS, Rank.ACE),
      new Card(Suit.HEARTS, Rank.KING),
      new Card(Suit.HEARTS, Rank.QUEEN),
    ]
    expect(() => HandEvaluator.evaluate(cards)).toThrow('Need 5 cards to evaluate a poker hand')
  })

  test('identifies royal flush', () => {
    const cards = [
      new Card(Suit.HEARTS, Rank.ACE),
      new Card(Suit.HEARTS, Rank.KING),
      new Card(Suit.HEARTS, Rank.QUEEN),
      new Card(Suit.HEARTS, Rank.JACK),
      new Card(Suit.HEARTS, Rank.TEN),
    ]
    const result = HandEvaluator.evaluate(cards)
    expect(result.handRank).toBe(HandRank.ROYAL_FLUSH)
    expect(result.baseScore).toBe(BASE_HAND_SCORES[HandRank.ROYAL_FLUSH])
    expect(result.highCard.rank).toBe(Rank.ACE)
    expect(result.kickers).toHaveLength(0)
  })

  test('identifies straight flush', () => {
    const cards = [
      new Card(Suit.HEARTS, Rank.KING),
      new Card(Suit.HEARTS, Rank.QUEEN),
      new Card(Suit.HEARTS, Rank.JACK),
      new Card(Suit.HEARTS, Rank.TEN),
      new Card(Suit.HEARTS, Rank.NINE),
    ]
    const result = HandEvaluator.evaluate(cards)
    expect(result.handRank).toBe(HandRank.STRAIGHT_FLUSH)
    expect(result.baseScore).toBe(BASE_HAND_SCORES[HandRank.STRAIGHT_FLUSH])
    expect(result.highCard.rank).toBe(Rank.KING)
    expect(result.kickers).toHaveLength(0)
  })

  test('identifies four of a kind', () => {
    const cards = [
      new Card(Suit.HEARTS, Rank.ACE),
      new Card(Suit.DIAMONDS, Rank.ACE),
      new Card(Suit.CLUBS, Rank.ACE),
      new Card(Suit.SPADES, Rank.ACE),
      new Card(Suit.HEARTS, Rank.KING),
    ]
    const result = HandEvaluator.evaluate(cards)
    expect(result.handRank).toBe(HandRank.FOUR_OF_A_KIND)
    expect(result.baseScore).toBe(BASE_HAND_SCORES[HandRank.FOUR_OF_A_KIND])
    expect(result.highCard.rank).toBe(Rank.ACE)
    expect(result.kickers).toHaveLength(1)
    expect(result.kickers[0]?.rank).toBe(Rank.KING)
  })

  test('identifies full house', () => {
    const cards = [
      new Card(Suit.HEARTS, Rank.ACE),
      new Card(Suit.DIAMONDS, Rank.ACE),
      new Card(Suit.CLUBS, Rank.ACE),
      new Card(Suit.SPADES, Rank.KING),
      new Card(Suit.HEARTS, Rank.KING),
    ]
    const result = HandEvaluator.evaluate(cards)
    expect(result.handRank).toBe(HandRank.FULL_HOUSE)
    expect(result.baseScore).toBe(BASE_HAND_SCORES[HandRank.FULL_HOUSE])
    expect(result.highCard.rank).toBe(Rank.ACE)
    expect(result.secondHighCard?.rank).toBe(Rank.KING)
    expect(result.kickers).toHaveLength(0)
  })

  test('identifies flush', () => {
    const cards = [
      new Card(Suit.HEARTS, Rank.ACE),
      new Card(Suit.HEARTS, Rank.KING),
      new Card(Suit.HEARTS, Rank.JACK),
      new Card(Suit.HEARTS, Rank.NINE),
      new Card(Suit.HEARTS, Rank.SEVEN),
    ]
    const result = HandEvaluator.evaluate(cards)
    expect(result.handRank).toBe(HandRank.FLUSH)
    expect(result.baseScore).toBe(BASE_HAND_SCORES[HandRank.FLUSH])
    expect(result.highCard.rank).toBe(Rank.ACE)
    expect(result.kickers).toHaveLength(4)
    expect(result.kickers[0]?.rank).toBe(Rank.KING)
  })

  test('identifies straight', () => {
    const cards = [
      new Card(Suit.HEARTS, Rank.KING),
      new Card(Suit.DIAMONDS, Rank.QUEEN),
      new Card(Suit.CLUBS, Rank.JACK),
      new Card(Suit.SPADES, Rank.TEN),
      new Card(Suit.HEARTS, Rank.NINE),
    ]
    const result = HandEvaluator.evaluate(cards)
    expect(result.handRank).toBe(HandRank.STRAIGHT)
    expect(result.baseScore).toBe(BASE_HAND_SCORES[HandRank.STRAIGHT])
    expect(result.highCard.rank).toBe(Rank.KING)
    expect(result.kickers).toHaveLength(0)
  })

  test('identifies overlapping straight as high card', () => {
    const cards = [
      new Card(Suit.CLUBS, Rank.JACK),
      new Card(Suit.DIAMONDS, Rank.QUEEN),
      new Card(Suit.HEARTS, Rank.KING),     
      new Card(Suit.SPADES, Rank.ACE),
      new Card(Suit.HEARTS, Rank.TWO),
    ]
    const result = HandEvaluator.evaluate(cards)
    expect(result.handRank).toBe(HandRank.HIGH_CARD)
    expect(result.baseScore).toBe(BASE_HAND_SCORES[HandRank.HIGH_CARD])
    expect(result.highCard.rank).toBe(Rank.ACE)
    expect(result.kickers).toHaveLength(4)
  })

  test('identifies ace-low straight', () => {
    const cards = [
      new Card(Suit.HEARTS, Rank.ACE),
      new Card(Suit.DIAMONDS, Rank.FIVE),
      new Card(Suit.CLUBS, Rank.FOUR),
      new Card(Suit.SPADES, Rank.THREE),
      new Card(Suit.HEARTS, Rank.TWO),
    ]
    const result = HandEvaluator.evaluate(cards)
    expect(result.handRank).toBe(HandRank.STRAIGHT)
    expect(result.baseScore).toBe(BASE_HAND_SCORES[HandRank.STRAIGHT])
    expect(result.kickers).toHaveLength(0)
  })

  test('identifies three of a kind', () => {
    const cards = [
      new Card(Suit.HEARTS, Rank.ACE),
      new Card(Suit.DIAMONDS, Rank.ACE),
      new Card(Suit.CLUBS, Rank.ACE),
      new Card(Suit.SPADES, Rank.KING),
      new Card(Suit.HEARTS, Rank.QUEEN),
    ]
    const result = HandEvaluator.evaluate(cards)
    expect(result.handRank).toBe(HandRank.THREE_OF_A_KIND)
    expect(result.baseScore).toBe(BASE_HAND_SCORES[HandRank.THREE_OF_A_KIND])
    expect(result.highCard.rank).toBe(Rank.ACE)
    expect(result.kickers).toHaveLength(2)
    expect(result.kickers[0]?.rank).toBe(Rank.KING)
    expect(result.kickers[1]?.rank).toBe(Rank.QUEEN)
  })

  test('identifies two pair', () => {
    const cards = [
      new Card(Suit.HEARTS, Rank.ACE),
      new Card(Suit.DIAMONDS, Rank.ACE),
      new Card(Suit.CLUBS, Rank.KING),
      new Card(Suit.SPADES, Rank.KING),
      new Card(Suit.HEARTS, Rank.QUEEN),
    ]
    const result = HandEvaluator.evaluate(cards)
    expect(result.handRank).toBe(HandRank.TWO_PAIR)
    expect(result.baseScore).toBe(BASE_HAND_SCORES[HandRank.TWO_PAIR])
    expect(result.highCard.rank).toBe(Rank.ACE)
    expect(result.secondHighCard?.rank).toBe(Rank.KING)
    expect(result.kickers).toHaveLength(1)
    expect(result.kickers[0]?.rank).toBe(Rank.QUEEN)
  })

  test('identifies pair', () => {
    const cards = [
      new Card(Suit.HEARTS, Rank.ACE),
      new Card(Suit.DIAMONDS, Rank.ACE),
      new Card(Suit.CLUBS, Rank.KING),
      new Card(Suit.SPADES, Rank.QUEEN),
      new Card(Suit.HEARTS, Rank.JACK),
    ]
    const result = HandEvaluator.evaluate(cards)
    expect(result.handRank).toBe(HandRank.PAIR)
    expect(result.baseScore).toBe(BASE_HAND_SCORES[HandRank.PAIR])
    expect(result.highCard.rank).toBe(Rank.ACE)
    expect(result.kickers).toHaveLength(3)
    expect(result.kickers[0]?.rank).toBe(Rank.KING)
    expect(result.kickers[1]?.rank).toBe(Rank.QUEEN)
    expect(result.kickers[2]?.rank).toBe(Rank.JACK)
  })

  test('identifies high card', () => {
    const cards = [
      new Card(Suit.HEARTS, Rank.ACE),
      new Card(Suit.DIAMONDS, Rank.KING),
      new Card(Suit.CLUBS, Rank.QUEEN),
      new Card(Suit.SPADES, Rank.JACK),
      new Card(Suit.HEARTS, Rank.NINE),
    ]
    const result = HandEvaluator.evaluate(cards)
    expect(result.handRank).toBe(HandRank.HIGH_CARD)
    expect(result.baseScore).toBe(BASE_HAND_SCORES[HandRank.HIGH_CARD])
    expect(result.highCard.rank).toBe(Rank.ACE)
    expect(result.kickers).toHaveLength(4)
    expect(result.kickers[0]?.rank).toBe(Rank.KING)
    expect(result.kickers[1]?.rank).toBe(Rank.QUEEN)
    expect(result.kickers[2]?.rank).toBe(Rank.JACK)
    expect(result.kickers[3]?.rank).toBe(Rank.NINE)
  })
}) 