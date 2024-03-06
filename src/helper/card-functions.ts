import { Card } from '../lib/types'
import { BASE_HEART, BASE_SPADE, BASE_DIAMOND, BASE_CLUB, CardBacksite } from '../lib/data'

export const getBaseCard = (card: Card) => {
  if (card.symbol === '♥') return BASE_HEART
  if (card.symbol === '♠') return BASE_SPADE
  if (card.symbol === '♦') return BASE_DIAMOND
  if (card.symbol === '♣') return BASE_CLUB
}

export const getFoundationLocation = (card: Card): number => {
  if (card.symbol === '♥') return 0
  if (card.symbol === '♠') return 1
  if (card.symbol === '♦') return 2
  if (card.symbol === '♣') return 3
  return 0
}

export const isAce = (card: Card) => {
  return card.value === 1
}

export const isKing = (card: Card) => {
  return card.value === 13
}

export const isOppositeColor = (card1: Card, card2: Card) => {
  return card1.color !== card2.color
}

export const isOneLess = (card1: Card, card2: Card) => {
  return card1.value === card2.value - 1
}

export const isOneMore = (card1: Card, card2: Card) => {
  return card1.value === card2.value + 1
}

export const isSameSymbol = (card1: Card, card2: Card) => {
  return card1.symbol === card2.symbol
}

export const isBaseCard = (card: Card) => {
  return card.name.includes('Base')
}

const formatCardImageString = (cardImageString: string) => {
  return cardImageString.replace('url("', '').slice(0, -2)
}

const cssYpositionToIndex = (cssPositionY: string): number => {
  switch (cssPositionY) {
    case '172px':
      return 0
    case '192px':
      return 1
    case '212px':
      return 2
    case '232px':
      return 3
    case '252px':
      return 4
    case '272px':
      return 5
    case '292px':
      return 6
    case '312px':
      return 7
    case '332px':
      return 8
    case '352px':
      return 9
    case '372px':
      return 10
    case '392px':
      return 11
    case '412px':
      return 12
    case '432px':
      return 13
    case '452px':
      return 14
    case '472px':
      return 15
    case '492px':
      return 16
    case '512px':
      return 17
    case '532px':
      return 18
    case '552px':
      return 19
    case '572px':
      return 20
    default:
      return 0
  }
}

export const cssPositionToIndex = (
  cssPositionX: string,
  cssPositionY: string,
): { x: number; y: number } => {
  const yIndex = cssYpositionToIndex(cssPositionY)
  switch (cssPositionX) {
    case '19px':
      return {
        x: 0,
        y: yIndex,
      }
    case '117px':
      return {
        x: 1,
        y: yIndex,
      }
    case '215px':
      return {
        x: 2,
        y: yIndex,
      }
    case '313px':
      return {
        x: 3,
        y: yIndex,
      }
    case '411px':
      return {
        x: 4,
        y: yIndex,
      }
    case '509px':
      return {
        x: 5,
        y: yIndex,
      }
    case '607px':
      return {
        x: 6,
        y: yIndex,
      }
    default:
      return {
        x: 0,
        y: 0,
      }
  }
}

export const formatCardClassNameToCardData = (
  classname: string,
  cardBackground: string,
  isHidden: boolean
) => {
  switch (classname) {
    case 'cardac':
      return {
        name: 'Ace Club',
        shortName: 'A♣',
        symbol: '♣',
        color: 'black',
        value: 1,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'cardad':
      return {
        name: 'Ace Diamond',
        shortName: 'A♦',
        symbol: '♦',
        color: 'red',
        value: 1,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'cardah':
      return {
        name: 'Ace Heart',
        shortName: 'A♥',
        symbol: '♥',
        color: 'red',
        value: 1,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'cardas':
      return {
        name: 'Ace Spade',
        shortName: 'A♠',
        symbol: '♠',
        color: 'black',
        value: 1,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card2c':
      return {
        name: '2 Club',
        shortName: '2♣',
        symbol: '♣',
        color: 'black',
        value: 2,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card2d':
      return {
        name: '2 Diamond',
        shortName: '2♦',
        symbol: '♦',
        color: 'red',
        value: 2,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card2h':
      return {
        name: '2 Heart',
        shortName: '2♥',
        symbol: '♥',
        color: 'red',
        value: 2,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card2s':
      return {
        name: '2 Spade',
        shortName: '2♠',
        symbol: '♠',
        color: 'black',
        value: 2,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card3c':
      return {
        name: '3 Club',
        shortName: '3♣',
        symbol: '♣',
        color: 'black',
        value: 3,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card3d':
      return {
        name: '3 Diamond',
        shortName: '3♦',
        symbol: '♦',
        color: 'red',
        value: 3,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card3h':
      return {
        name: '3 Heart',
        shortName: '3♥',
        symbol: '♥',
        color: 'red',
        value: 3,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card3s':
      return {
        name: '3 Spade',
        shortName: '3♠',
        symbol: '♠',
        color: 'black',
        value: 3,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card4c':
      return {
        name: '4 Club',
        shortName: '4♣',
        symbol: '♣',
        color: 'black',
        value: 4,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card4d':
      return {
        name: '4 Diamond',
        shortName: '4♦',
        symbol: '♦',
        color: 'red',
        value: 4,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card4h':
      return {
        name: '4 Heart',
        shortName: '4♥',
        symbol: '♥',
        color: 'red',
        value: 4,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card4s':
      return {
        name: '4 Spade',
        shortName: '4♠',
        symbol: '♠',
        color: 'black',
        value: 4,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card5c':
      return {
        name: '5 Club',
        shortName: '5♣',
        symbol: '♣',
        color: 'black',
        value: 5,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card5d':
      return {
        name: '5 Diamond',
        shortName: '5♦',
        symbol: '♦',
        color: 'red',
        value: 5,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card5h':
      return {
        name: '5 Heart',
        shortName: '5♥',
        symbol: '♥',
        color: 'red',
        value: 5,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card5s':
      return {
        name: '5 Spade',
        shortName: '5♠',
        symbol: '♠',
        color: 'black',
        value: 5,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card6c':
      return {
        name: '6 Club',
        shortName: '6♣',
        symbol: '♣',
        color: 'black',
        value: 6,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card6d':
      return {
        name: '6 Diamond',
        shortName: '6♦',
        symbol: '♦',
        color: 'red',
        value: 6,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card6h':
      return {
        name: '6 Heart',
        shortName: '6♥',
        symbol: '♥',
        color: 'red',
        value: 6,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card6s':
      return {
        name: '6 Spade',
        shortName: '6♠',
        symbol: '♠',
        color: 'black',
        value: 6,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card7c':
      return {
        name: '7 Club',
        shortName: '7♣',
        symbol: '♣',
        color: 'black',
        value: 7,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card7d':
      return {
        name: '7 Diamond',
        shortName: '7♦',
        symbol: '♦',
        color: 'red',
        value: 7,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card7h':
      return {
        name: '7 Heart',
        shortName: '7♥',
        symbol: '♥',
        color: 'red',
        value: 7,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card7s':
      return {
        name: '7 Spade',
        shortName: '7♠',
        symbol: '♠',
        color: 'black',
        value: 7,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card8c':
      return {
        name: '8 Club',
        shortName: '8♣',
        symbol: '♣',
        color: 'black',
        value: 8,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card8d':
      return {
        name: '8 Diamond',
        shortName: '8♦',
        symbol: '♦',
        color: 'red',
        value: 8,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card8h':
      return {
        name: '8 Heart',
        shortName: '8♥',
        symbol: '♥',
        color: 'red',
        value: 8,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card8s':
      return {
        name: '8 Spade',
        shortName: '8♠',
        symbol: '♠',
        color: 'black',
        value: 8,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card9c':
      return {
        name: '9 Club',
        shortName: '9♣',
        symbol: '♣',
        color: 'black',
        value: 9,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card9d':
      return {
        name: '9 Diamond',
        shortName: '9♦',
        symbol: '♦',
        color: 'red',
        value: 9,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card9h':
      return {
        name: '9 Heart',
        shortName: '9♥',
        symbol: '♥',
        color: 'red',
        value: 9,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'card9s':
      return {
        name: '9 Spade',
        shortName: '9♠',
        symbol: '♠',
        color: 'black',
        value: 9,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'cardtc':
      return {
        name: '10 Club',
        shortName: '10♣',
        symbol: '♣',
        color: 'black',
        value: 10,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'cardtd':
      return {
        name: '10 Diamond',
        shortName: '10♦',
        symbol: '♦',
        color: 'red',
        value: 10,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'cardth':
      return {
        name: '10 Heart',
        shortName: '10♥',
        symbol: '♥',
        color: 'red',
        value: 10,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'cardts':
      return {
        name: '10 Spade',
        shortName: '10♠',
        symbol: '♠',
        color: 'black',
        value: 10,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'cardjc':
      return {
        name: 'Jack Club',
        shortName: 'J♣',
        symbol: '♣',
        color: 'black',
        value: 11,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'cardjd':
      return {
        name: 'Jack Diamond',
        shortName: 'J♦',
        symbol: '♦',
        color: 'red',
        value: 11,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'cardjh':
      return {
        name: 'Jack Heart',
        shortName: 'J♥',
        symbol: '♥',
        color: 'red',
        value: 11,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'cardjs':
      return {
        name: 'Jack Spade',
        shortName: 'J♠',
        symbol: '♠',
        color: 'black',
        value: 11,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'cardqc':
      return {
        name: 'Queen Club',
        shortName: 'Q♣',
        symbol: '♣',
        color: 'black',
        value: 12,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'cardqd':
      return {
        name: 'Queen Diamond',
        shortName: 'Q♦',
        symbol: '♦',
        color: 'red',
        value: 12,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'cardqh':
      return {
        name: 'Queen Heart',
        shortName: 'Q♥',
        symbol: '♥',
        color: 'red',
        value: 12,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'cardqs':
      return {
        name: 'Queen Spade',
        shortName: 'Q♠',
        symbol: '♠',
        color: 'black',
        value: 12,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'cardkc':
      return {
        name: 'King Club',
        shortName: 'K♣',
        symbol: '♣',
        color: 'black',
        value: 13,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'cardkd':
      return {
        name: 'King Diamond',
        shortName: 'K♦',
        symbol: '♦',
        color: 'red',
        value: 13,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'cardkh':
      return {
        name: 'King Heart',
        shortName: 'K♥',
        symbol: '♥',
        color: 'red',
        value: 13,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }
    case 'cardks':
      return {
        name: 'King Spade',
        shortName: 'K♠',
        symbol: '♠',
        color: 'black',
        value: 13,
        image: formatCardImageString(cardBackground),
        hidden: isHidden,
        classname: classname,
      }

    default:
      return CardBacksite
  }
}
