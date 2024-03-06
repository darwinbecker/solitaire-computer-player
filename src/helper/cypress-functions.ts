import { Board, Card, Move, Result } from '../lib/types'
import { Random_Simulation, UCB1_Simulation } from './simulation'
import {
  getAllMovesFromTableau,
  getAllMovesFromTalon,
  isLost,
  isWon,
  makeMoveAndReveal,
} from './board-functions'
import {
  cssPositionToIndex,
  formatCardClassNameToCardData,
  isBaseCard,
} from './card-functions'

// get all talon cards, that are hidden: left: 19px; top: 19px;
export const getAllHiddenTalonCards = () => {
  const cards = cy.get('.cardback', { log: false }).filter(
    (_, el) => {
      return Cypress.$(el).css('top').includes('19px')
    },
    { log: false }
  )
  return cards
}

export const revealTalonCard = (classname: string) => {
  cy.get('.' + classname, { log: false }).then(($el) => {
    const isHidden = $el[0].className.includes('cardback')

    if (isHidden) {
      const cards = getAllHiddenTalonCards()
      cards.first({ log: false }).click({ log: false })
      cy.wait(1000, { log: false })
      revealTalonCard(classname)
    } else {
      // check if card is visible. If not, reveal card by clicking on talon until card doesnt have classname: cardback
      let lastcard: JQuery<HTMLElement>

      cy.get('.card', { log: false })
        .each((el, index) => {
          if (index > 23) return
          const classNames = el[0].className.split(' ')
          if (classNames.includes('cardback')) return

          const top = Cypress.$(el).css('top').includes('19px')
          const left = Cypress.$(el).css('left').includes('19px')
          const left2 = Cypress.$(el).css('left').includes('117px')

          if (top && (left || left2)) {
            lastcard = el
            return
          }
        })
        .then(() => {
          // if lastcard is the correct one, play it
          if (lastcard.hasClass(classname)) {
            return
          } else {
            // if card was already revealed at some point, circle through talon until its the last revealed card
            // this is a workaround: get .card and #turnOverWasteImage so the filter-function doesnt return undefined (undefined will throw an error in cypress)
            cy.get('.card, #turnOverWasteImage', { log: false })
              .filter(
                (index, el) => {
                  const isTalon = index < 25
                  const isHidden = el.className.includes('cardback')
                  const isRootTalon = el.id === 'turnOverWasteImage'

                  return (isHidden && isTalon) || isRootTalon
                },
                { log: false }
              )
              .then((cards) => {
                // check if talon conatins hidden cards, if so reveal them. If not, click: "#turnOverWasteImage"
                if (cards.length > 1) {
                  // click the second element
                  cy.wrap(cards.eq(1), { log: false }).trigger('click', {
                    log: false,
                  })
                } else if (cards.length === 1) {
                  // click the first element
                  cy.wrap(cards.first(), { log: false }).trigger('click', {
                    log: false,
                  })
                }
              })

            cy.wait(1000, { log: false })
            revealTalonCard(classname)
          }
        })
    }
    return
  })
}

export const getTarget = (move: Move): string => {
  let target: string

  if (move.targetCard && isBaseCard(move.targetCard)) {
    // get classname of foundation location
    target = '#' + move.targetCard.classname
  } else {
    if (move.targetCard) {
      // get classname of target card location
      target = '.' + move.targetCard.classname
    } else {
      // get classname of empty tableau column location
      target = `#tableauPileBase${move.toIndex}`
    }
  }
  return target
}

export const run_Random_Simulation = (
  board: Board,
  playedMoves: Move[],
  resultsHistory: Result[]
) => {
  if (isWon(board) || isLost(board)) {
    cy.log('game over')
    console.log(board)
    return
  }

  let move: Move
  // check if worst-winrate is 100% and play random
  const lastResult = resultsHistory[resultsHistory.length - 1]
  if (lastResult && lastResult.worstWinnabilityPercentage === 100) {
    const tableauMoves = getAllMovesFromTableau(board)
    const talonMoves = getAllMovesFromTalon(board)
    const allMoves = talonMoves.length > 0 ? talonMoves : tableauMoves
    move = allMoves[Math.floor(Math.random() * allMoves.length)]
  } else {
    const results = Random_Simulation(board)
    resultsHistory.push(results)

    console.log('-----RESULTS-----')
    console.log(results)

    if (!results || !results.bestMove) {
      return cy.log('no move found')
    }
    if (results.wins === 0) {
      return cy.log('no winnable moves found')
    }

    move = results.bestMove
  }
  playedMoves.push(move)

  // move card from talon
  if (move.from === 'talon') {
    // check if card is visible and if not, reveal card by clicking on talon until card doesnt have classname: cardback
    cy.log('reveal talon card')
    revealTalonCard(move.cards[0].classname!)
  }

  if (!move) {
    cy.log('no move found')
    console.log('no move found')
    return
  }

  const target = getTarget(move)

  cy.wait(1000)

  const formattedClassname = `.${move.cards[0].classname}`
  // drag and drop card
  cy.get(formattedClassname).drag(target, {
    force: true,
  })

  cy.wait(1000)

  cy.get('.card').then((cards) => {
    const newBoard = makeMoveAndReveal(board, move)
    run_Random_Simulation(newBoard, playedMoves, resultsHistory)
  })
}

export const run_UCB1_Simulation = (
  board: Board,
  playedMoves: Move[],
  resultsHistory: Result[]
) => {
  if (isLost(board)) {
    cy.log(' game lost')
    console.log(board)
    return
  }
  if (isWon(board)) {
    cy.log('game won')
    console.log(board)
    return
  }

  // detect early win
  let move: Move
  const lastResult = resultsHistory[resultsHistory.length - 1]
  if (lastResult && lastResult.worstWinnabilityPercentage === 100) {
    resultsHistory.forEach((result) => {
      console.log(result.bestWinnabilityPercentage)
    })

    // prioritise talon moves and move random if early win was detected
    const talonMoves = getAllMovesFromTalon(board)
    const allMoves = talonMoves.length > 0 ? talonMoves : undefined
    if (!allMoves) {
      console.log('game won')
      return
    }
    move = allMoves[Math.floor(Math.random() * allMoves.length)]
  } else {
    const results = UCB1_Simulation(board)
    resultsHistory.push(results)

    console.log('----------RESULT----------')
    console.log('results:', results)
    resultsHistory.push(results)

    if (!results || !results.bestMove) {
      return cy.log('no move found')
    }

    if (results.wins === 0) {
      return cy.log('no winnable moves found')
    }

    move = results.bestMove
  }
  playedMoves.push(move)

  let formattedClassname = `.${move.cards[0].classname}`

  // move card from talon
  if (move.from === 'talon') {
    // check if card is visible and if not, reveal card by clicking on talon until card doesnt have classname: cardback
    revealTalonCard(move.cards[0].classname!)
  }

  if (!move) {
    cy.log('no move found')
    console.log('no move found')
    return
  }

  const target = getTarget(move)

  cy.wait(1000)

  // drag and drop card
  cy.get(formattedClassname, { log: false }).drag(target, {
    source: {
      x: 10,
      y: 10,
    },
    force: true,
  })

  cy.wait(1000)

  cy.get('.card').then((cards) => {
    const newBoard = makeMoveAndReveal(board, move)
    run_UCB1_Simulation(newBoard, playedMoves, resultsHistory)
  })
}

export const transfromTalonCardsToCardData = (): Card[] => {
  const talon = [] as Card[]

  cy.get('.card').each(($el) => {
    const classNames = $el[0].className.split(' ')
    const lastClass = classNames[classNames.length - 1]
    const card = cy.wrap($el)

    const top = Cypress.$($el).css('top').includes('19px')
    const left1 = Cypress.$($el).css('left').includes('19px')
    const left2 = Cypress.$($el).css('left').includes('117px')

    if ((top && left1) || (top && left2)) {
      card.should('have.css', 'background-image').then((background: any) => {
        const backgroundImage = background as string

        const cardData = formatCardClassNameToCardData(
          lastClass,
          backgroundImage,
          false
        )

        talon.push(cardData)
      })
    }
  })

  return talon
}

export const transfromTableauCardsToCardData = (): Card[][] => {
  const tableau = [[], [], [], [], [], [], []] as Card[][]
  const tableauCards = cy.get('.card').filter((_, el) => {
    const top = parseInt(Cypress.$(el).css('top'), 10)
    return top >= 172
  })

  tableauCards.each((el) => {
    const card = cy.wrap(el)
    card.should('have.class', 'card').then(($el) => {
      // format classname to card data
      const classNames = $el[0].className.split(' ')
      const lastClass = classNames[classNames.length - 1]
      const isHidden = $el[0].className.includes('cardback')

      card.should('have.css', 'background-image').then((background: any) => {
        const backgroundImage = background as string

        const cardData = formatCardClassNameToCardData(
          lastClass,
          backgroundImage,
          isHidden
        )

        // css position to index
        const position = cssPositionToIndex($el[0].style.left, $el[0].style.top)

        tableau[position.x][position.y] = cardData
      })
    })
  })

  return tableau
}

export const transfromFoundationCardsToCardData = (): Card[][] => {
  const foundation = [[], [], [], []] as Card[][]

  cy.get('.card').each(($el) => {
    const classNames = $el[0].className.split(' ')
    const lastClass = classNames[classNames.length - 1]
    const card = cy.wrap($el)

    const top = Cypress.$($el).css('top').includes('19px')
    const left1 = Cypress.$($el).css('left').includes('313px')
    if (top && left1) {
      card.should('have.css', 'background-image').then((background: any) => {
        const backgroundImage = background as string

        const cardData = formatCardClassNameToCardData(
          lastClass,
          backgroundImage,
          false
        )

        foundation[0].push(cardData)
      })
    }

    const left2 = Cypress.$($el).css('left').includes('411px')
    if (top && left2) {
      card.should('have.css', 'background-image').then((background: any) => {
        const backgroundImage = background as string

        const cardData = formatCardClassNameToCardData(
          lastClass,
          backgroundImage,
          false
        )

        foundation[1].push(cardData)
      })
    }

    const left3 = Cypress.$($el).css('left').includes('509px')
    if (top && left3) {
      card.should('have.css', 'background-image').then((background: any) => {
        const backgroundImage = background as string

        const cardData = formatCardClassNameToCardData(
          lastClass,
          backgroundImage,
          false
        )

        foundation[2].push(cardData)
      })
    }

    const left4 = Cypress.$($el).css('left').includes('607px')
    if (top && left4) {
      card.should('have.css', 'background-image').then((background: any) => {
        const backgroundImage = background as string

        const cardData = formatCardClassNameToCardData(
          lastClass,
          backgroundImage,
          false
        )

        foundation[3].push(cardData)
      })
    }

    return
  })

  return foundation
}
