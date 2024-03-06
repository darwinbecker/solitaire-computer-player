import { Card, Board, Move } from '../lib/types'
import {
  getBaseCard,
  getFoundationLocation,
  isAce,
  isKing,
  isOneLess,
  isOneMore,
  isOppositeColor,
  isSameSymbol,
} from './card-functions'

export function notUndefined<T>(value: T | undefined): value is T {
  return value !== undefined
}

export const revealCard = (board: Board, move: Move): Board => {
  const newBoard = structuredClone(board)
  if (move.from.startsWith('col')) {
    if (newBoard.tableau[move.fromIndex].length === 0) return newBoard
    newBoard.tableau[move.fromIndex][
      newBoard.tableau[move.fromIndex].length - 1
    ].hidden = false
  }
  return newBoard
}

export const detectEarlyWin = (board: Board): boolean => {
  const talon = board.talon
  const foundation = board.foundation
  const tableau = board.tableau

  const allCards = foundation
    .map((foundationColumn) => {
      return foundationColumn
    })
    .concat(
      tableau.map((tableauColumn) => {
        return tableauColumn
      })
    )
    .flat()

  const allCardsAreRevealed = allCards.every((card) => !card.hidden)

  if (allCardsAreRevealed) return true

  return false
}

export const isWon = (board: Board) => {
  return board.foundation.every(
    (foundationColumn) => foundationColumn.length === 13
  )
}

export const isLost = (board: Board) => {
  return getAllValidMoves(board).length === 0 && !isWon(board)
}

export const getAllMovesFromTalon = (board: Board): Move[] => {
  const talon = board.talon
  if (talon.length === 0) return []
  const talonMoves: Move[] = []
  talon.forEach((card, talonIndex) => {
    if (!card) return undefined

    // if card is an Ace, move to empty foundation
    if (isAce(card)) {
      const moveName =
        card.shortName +
        '(' +
        `talon` +
        ')' +
        ' [' +
        1 +
        ']' +
        ' -> ' +
        getBaseCard(card).shortName +
        '(' +
        `base-${getFoundationLocation(card)}` +
        ')'
      return talonMoves.push({
        id: moveName,
        name: moveName,
        from: 'talon',
        to: `base-${getFoundationLocation(card)}`,
        cards: [card],
        targetCard: getBaseCard(card),
        fromIndex: talonIndex,
        toIndex: getFoundationLocation(card),
      } as Move)
    }

    // Move to tableau
    board.tableau.forEach((tableauColumn, tableauIndex) => {
      const otherCard =
        tableauColumn.length === 0
          ? null
          : tableauColumn[tableauColumn.length - 1]
      if (!otherCard) {
        if (!isKing(card)) return undefined

        const emptyColumnIndex = board.tableau.findIndex(
          (col) => col.length === 0
        )
        const moveName =
          card.shortName +
          '(' +
          `talon` +
          ')' +
          ' [' +
          1 +
          ']' +
          ' -> ' +
          'null' +
          '(' +
          `col-${emptyColumnIndex}` +
          ')'
        return talonMoves.push({
          id: moveName,
          name: moveName,
          from: 'talon',
          to: `col-${emptyColumnIndex}`,
          cards: [card],
          targetCard: null,
          fromIndex: tableauIndex,
          toIndex: emptyColumnIndex,
        } as Move)
      }

      // if card is opposite color and value is one less than other card, move card to other column
      if (isOppositeColor(card, otherCard) && isOneLess(card, otherCard)) {
        const moveName =
          card.shortName +
          '(' +
          `talon` +
          ')' +
          ' [' +
          1 +
          ']' +
          ' -> ' +
          otherCard.shortName +
          '(' +
          `col-${board.tableau.indexOf(tableauColumn)}` +
          ')'
        return talonMoves.push({
          id: moveName,
          name: moveName,
          from: 'talon',
          to: `col-${board.tableau.indexOf(tableauColumn)}`,
          cards: [card],
          targetCard: otherCard,
          fromIndex: tableauIndex,
          toIndex: board.tableau.indexOf(tableauColumn),
        } as Move)
      }

      return undefined
    })

    // move to foundation
    board.foundation.forEach((foundationColumn, foundationIndex) => {
      const otherCard =
        foundationColumn.length === 0
          ? null
          : foundationColumn[foundationColumn.length - 1]
      if (!otherCard) return undefined

      if (isSameSymbol(card, otherCard) && isOneMore(card, otherCard)) {
        const moveName =
          card.shortName +
          '(' +
          `talon` +
          ')' +
          ' [' +
          1 +
          ']' +
          ' -> ' +
          otherCard.shortName +
          '(' +
          `base-${getFoundationLocation(card)}` +
          ')'
        return talonMoves.push({
          id: moveName,
          name: moveName,
          from: 'talon',
          to: `base-${getFoundationLocation(card)}`,
          cards: [card],
          targetCard: otherCard,
          fromIndex: foundationIndex,
          toIndex: getFoundationLocation(card),
        } as Move)
      }

      return undefined
    })

    return undefined
  })

  return talonMoves
}

export const checkIfTalonContainsValidMoves = (board: Board): boolean => {
  return getAllMovesFromTalon(board).length > 0 ? true : false
}

export const getAllMovesFromTableau = (board: Board): Move[] => {
  const validMoves: Move[] = []

  // valid moves from tableau
  board.tableau.forEach((tableauColumn, tableuColumnIndex) => {
    const cardsThatAreRevealed = tableauColumn.filter(
      (card) => card && !card.hidden
    )

    const cards =
      tableauColumn.length === 0
        ? null
        : cardsThatAreRevealed.length > 1
        ? cardsThatAreRevealed
        : [tableauColumn[tableauColumn.length - 1]] // get last card
    if (!cards) return

    const firstCardFromColumn = cards[0]
    const lastCardFromColumn = cards[cards.length - 1]

    // if card is an Ace, move to empty foundation
    if (isAce(lastCardFromColumn)) {
      const moveName =
        lastCardFromColumn.shortName +
        '(' +
        `col-${tableuColumnIndex}` +
        ')' +
        ' [' +
        1 +
        ']' +
        ' -> ' +
        getBaseCard(lastCardFromColumn).shortName +
        '(' +
        `base-${getFoundationLocation(lastCardFromColumn)}` +
        ')'
      validMoves.push({
        id: moveName,
        name: moveName,
        from: `col-${tableuColumnIndex}`,
        to: `base-${getFoundationLocation(lastCardFromColumn)}`,
        cards: [lastCardFromColumn],
        targetCard: getBaseCard(lastCardFromColumn),
        fromIndex: tableuColumnIndex,
        toIndex: getFoundationLocation(lastCardFromColumn),
      })
    }

    // move to foundation
    board.foundation.forEach((foundationColumn) => {
      const otherCard =
        foundationColumn.length === 0
          ? null
          : foundationColumn[foundationColumn.length - 1]
      if (!otherCard) return

      let cardForFoundation =
        cards.length > 1 ? lastCardFromColumn : firstCardFromColumn

      if (
        isSameSymbol(cardForFoundation, otherCard) &&
        isOneMore(cardForFoundation, otherCard)
      ) {
        const moveName =
          cardForFoundation.shortName +
          '(' +
          `col-${tableuColumnIndex}` +
          ')' +
          ' [' +
          1 +
          ']' +
          ' -> ' +
          otherCard.shortName +
          '(' +
          `base-${getFoundationLocation(cardForFoundation)}` +
          ')'
        validMoves.push({
          id: moveName,
          name: moveName,
          from: `col-${tableuColumnIndex}`,
          to: `base-${getFoundationLocation(cardForFoundation)}`,
          cards: [cardForFoundation],
          targetCard: otherCard,
          fromIndex: tableuColumnIndex,
          toIndex: getFoundationLocation(cardForFoundation),
        })
      }
    })

    const emptyColumnIndex = board.tableau.findIndex((col) => col.length === 0)
    // if card is a king and there is an empty column, move card to empty column
    // find index of king in tableauColumn
    const cardBelowKingIndex = tableauColumn.indexOf(firstCardFromColumn) - 1
    if (cardBelowKingIndex > -1) {
      const cardBelowKing = tableauColumn[cardBelowKingIndex]
      if (
        isKing(firstCardFromColumn) &&
        emptyColumnIndex !== -1 &&
        cardBelowKing.hidden
      ) {
        const moveName =
          cards[0].shortName +
          '(' +
          `col-${tableuColumnIndex}` +
          ')' +
          ' [' +
          1 +
          ']' +
          ' -> ' +
          'null' +
          '(' +
          `col-${emptyColumnIndex}` +
          ')'
        validMoves.push({
          id: moveName,
          name: moveName,
          from: `col-${tableuColumnIndex}`,
          to: `col-${emptyColumnIndex}`,
          cards: cards,
          targetCard: null,
          fromIndex: tableuColumnIndex,
          toIndex: emptyColumnIndex,
        })
      }
    }

    // move from tableau to tableau, but only if the card below is hidden or undefined
    const otherCards: Card[] = []
    const getAllPlaceableIndexes = board.tableau
      .map((tableauCol, tableauColIndex) => {
        const otherCard = tableauCol[tableauCol.length - 1]
        if (!otherCard) return

        // if card is opposite color and value is one less than other card, move card to other column
        if (
          isOppositeColor(firstCardFromColumn, otherCard) &&
          isOneLess(firstCardFromColumn, otherCard)
        ) {
          otherCards.push(otherCard)
          return tableauColIndex
        }
      })
      .filter(notUndefined)

    const indexOfCurrentCard = tableauColumn.indexOf(firstCardFromColumn)
    const cardBelow =
      indexOfCurrentCard > 0 ? tableauColumn[indexOfCurrentCard - 1] : undefined

    getAllPlaceableIndexes.forEach((placeableIndex, arrayIndex) => {
      if (!cardBelow || cardBelow.hidden) {
        const moveName =
          cards[0].shortName +
          '(' +
          `col-${tableuColumnIndex}` +
          ')' +
          ' [' +
          cards.length +
          ']' +
          ' -> ' +
          otherCards[arrayIndex].shortName +
          '(' +
          `col-${placeableIndex}` +
          ')'
        validMoves.push({
          id: moveName,
          name: moveName,
          from: `col-${tableuColumnIndex}`,
          to: `col-${placeableIndex}`,
          cards: cards,
          targetCard: otherCards[arrayIndex],
          fromIndex: tableuColumnIndex,
          toIndex: placeableIndex,
        })
      }
    })
  })

  return validMoves
}

export const getAllValidMoves = (board: Board): Move[] => {
  const talonMoves = getAllMovesFromTalon(board)
  const tableauMoves = getAllMovesFromTableau(board)
  // const moves = [...talonMoves, ...tableauMoves]
  // moves.sort(() => Math.random() - 0.5)
  return [...talonMoves, ...tableauMoves]
}

export const makeMove = (board: Board, move: Move): Board => {
  const newBoard = structuredClone(board)
  if (move.from.startsWith('col') && move.to.startsWith('base')) {
    const card = newBoard.tableau[move.fromIndex].pop()
    if (!card) return newBoard
    newBoard.foundation[move.toIndex].push(card)
  }
  if (move.from.startsWith('col') && move.to.startsWith('col')) {
    if (move.cards.length > 1) {
      const column = newBoard.tableau[move.fromIndex]
      const indexOfFirstMoveableCard = column.findIndex(
        (card) => card.name === move.cards[0].name
      )
      const cards = column.splice(indexOfFirstMoveableCard)

      if (!cards) return newBoard
      newBoard.tableau[move.toIndex].push(...cards)
    } else {
      const card = newBoard.tableau[move.fromIndex].pop()
      if (!card) return newBoard
      newBoard.tableau[move.toIndex].push(card)
    }
  }
  if (move.from === 'talon' && move.to.startsWith('base')) {
    const card = newBoard.talon.find(
      (card) => card?.shortName === move.cards[0].shortName
    )
    newBoard.talon = newBoard.talon.filter(
      (card) => card?.shortName !== move.cards[0].shortName
    )
    if (!card) return newBoard
    newBoard.foundation[move.toIndex].push(card)
  }
  if (move.from === 'talon' && move.to.startsWith('col')) {
    const card = newBoard.talon.find(
      (card) => card?.shortName === move.cards[0].shortName
    )
    newBoard.talon = newBoard.talon.filter(
      (card) => card?.shortName !== move.cards[0].shortName
    )
    if (!card) return newBoard
    newBoard.tableau[move.toIndex].push(card)
  }
  return newBoard
}

export const makeMoveAndReveal = (board: Board, move: Move): Board => {
  const newBoard = structuredClone(board)
  if (move.from.startsWith('col') && move.to.startsWith('base')) {
    const card = newBoard.tableau[move.fromIndex].pop()
    if (!card) return newBoard
    newBoard.foundation[move.toIndex].push(card)
  }
  if (move.from.startsWith('col') && move.to.startsWith('col')) {
    if (move.cards.length > 1) {
      const column = newBoard.tableau[move.fromIndex]
      const indexOfFirstMoveableCard = column.findIndex(
        (card) => card.name === move.cards[0].name
      )
      const cards = column.splice(indexOfFirstMoveableCard)

      if (!cards) return newBoard
      newBoard.tableau[move.toIndex].push(...cards)
    } else {
      const card = newBoard.tableau[move.fromIndex].pop()
      if (!card) return newBoard
      newBoard.tableau[move.toIndex].push(card)
    }
  }
  if (move.from === 'talon' && move.to.startsWith('base')) {
    const card = newBoard.talon.find(
      (card) => card?.shortName === move.cards[0].shortName
    )
    newBoard.talon = newBoard.talon.filter(
      (card) => card?.shortName !== move.cards[0].shortName
    )
    if (!card) return newBoard
    newBoard.foundation[move.toIndex].push(card)
  }
  if (move.from === 'talon' && move.to.startsWith('col')) {
    const card = newBoard.talon.find(
      (card) => card?.shortName === move.cards[0].shortName
    )
    newBoard.talon = newBoard.talon.filter(
      (card) => card?.shortName !== move.cards[0].shortName
    )
    if (!card) return newBoard
    newBoard.tableau[move.toIndex].push(card)
  }

  return revealCard(newBoard, move)
}
