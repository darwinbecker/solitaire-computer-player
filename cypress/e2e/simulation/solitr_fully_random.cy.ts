/// <reference types="cypress" />
import {
  cssPositionToIndex,
  formatCardClassNameToCardData,
} from '../../../src/helper/card-functions'
import { run_Random_Simulation } from '../../../src/helper/cypress-functions'
import { Board, Card, Move, Result } from '../../../src/lib/types'

const talonSetup = () => {
  cy.log('talon should exist')
  const tableauBases = cy.get('.turnOverWasteImage', { log: false })
  tableauBases.should('have.length', 1)

  cy.log('expect talon to hold 24 cards')
  const cards = cy.get('.cardback').filter((_, el) => {
    return Cypress.$(el).css('top').includes('19px')
  })
  cards.should('have.length', 24)
}

const foundationSetup = () => {
  cy.log('4 foundations should exist')
  const tableauBases = cy.get('.foundationBase')
  tableauBases.should('have.length', 4)

  // 1. foundation
  cy.log('1st foundation is empty')
  const firstFoundationBaseCards = cy.get('.card').filter((_, el) => {
    // filter all cards that have css property: left: 313px; top: 19px;
    const top = Cypress.$(el).css('top').includes('19px')
    const left = Cypress.$(el).css('left').includes('313px')
    return top && left
  })
  firstFoundationBaseCards.should('have.length', 0)

  // 2. foundation
  cy.log('2nd foundation is empty')
  const secondFoundationBaseCards = cy.get('.card').filter((_, el) => {
    // filter all cards that have css property: left: 411px; top: 19px;
    const top = Cypress.$(el).css('top').includes('19px')
    const left = Cypress.$(el).css('left').includes('411px')
    return top && left
  })
  secondFoundationBaseCards.should('have.length', 0)

  // 3. foundation
  cy.log('3rd foundation is empty')
  const thirdFoundationBaseCards = cy.get('.card').filter((_, el) => {
    // filter all cards that have css property: left: 509px; top: 19px;
    const top = Cypress.$(el).css('top').includes('19px')
    const left = Cypress.$(el).css('left').includes('509px')
    return top && left
  })
  thirdFoundationBaseCards.should('have.length', 0)

  // 4. foundation
  cy.log('4th foundation is empty')
  const fourthFoundationBaseCards = cy.get('.card').filter((_, el) => {
    // filter all cards that have css property: left: 607px; top: 19px;
    const top = Cypress.$(el).css('top').includes('19px')
    const left = Cypress.$(el).css('left').includes('607px')
    return top && left
  })
  fourthFoundationBaseCards.should('have.length', 0)
}

const tableauSetup = () => {
  cy.log('tableau should exist')
  const tableauBases = cy.get('.tableauPileBase')
  tableauBases.should('have.length', 7)

  // calc tableau card amount, first column has 1 card, second column has 2 cards, third column has 3 cards, etc.
  // use style property: left () to determine the position of the card and tableau column
  cy.log('get cards with classname: .card but exclude classname: .cardback')
  const cards = cy.get('.card').not('.cardback')
  cards.should('not.have.class', 'cardback')

  cy.log('expected 7 cards to be revealed by default')
  cards.should('have.length', 7)
}

describe('solitr', () => {
  before(() => {
    cy.visit('https://www.solitr.com/klondike-turn-one')
    cy.wait(1000)
  })
  it('play game', () => {
    // Setup
    cy.log('Talon (draw-pile)')
    talonSetup()
    cy.log('Foundation (discard-pile)')
    foundationSetup()
    cy.log('Tableau (play-pile)')
    tableauSetup()

    // format cards position & classname to card data
    cy.log('transform talon cards to card data')
    const talon = [] as Card[]
    const visibleTalonCards = [] as Card[]
    const talonCards = cy.get('.cardback').filter((index) => index < 24)
    talonCards.each((el) => {
      const card = cy.wrap(el)
      card.should('have.class', 'cardback').then(($el) => {
        const classNames = $el[0].className.split(' ')
        const lastClass = classNames[classNames.length - 1]
        const isHidden = $el[0].className.includes('cardback')

        card.should('have.css', 'background-image').then((background: any) => {
          const backgroundImage = background as string

          const cardData = formatCardClassNameToCardData(
            lastClass,
            backgroundImage,
            false
          )

          cy.log('card data: ', cardData)
          const cardDataKeys = Cypress._.keys(cardData)
          expect(
            cardDataKeys,
            'expected object to have properties: name, shortName, symbol, color, value and image'
          ).to.deep.eq([
            'name',
            'shortName',
            'symbol',
            'color',
            'value',
            'image',
            'hidden',
            'classname',
          ])

          expect(
            cardData.shortName,
            'expected to get a valid card'
          ).to.not.equal('00')

          talon.push(cardData)

          if (!isHidden) {
            visibleTalonCards.push(cardData)
          }
        })
      })
    })

    // format cards position & classname to card data & play game
    cy.log('transform tableau cards to card data & play game')
    const tableau = [[], [], [], [], [], [], []] as Card[][]
    const tableauCards = cy.get('.card').filter((index) => index > 23)
    tableauCards
      .each((el) => {
        const card = cy.wrap(el)
        card.should('have.class', 'card').then(($el) => {
          // format classname to card data
          const classNames = $el[0].className.split(' ')
          const lastClass = classNames[classNames.length - 1]
          const isHidden = $el[0].className.includes('cardback')

          card
            .should('have.css', 'background-image')
            .then((background: any) => {
              const backgroundImage = background as string

              const cardData = formatCardClassNameToCardData(
                lastClass,
                backgroundImage,
                isHidden
              )

              cy.log('card data: ', cardData)
              const cardDataKeys = Cypress._.keys(cardData)
              expect(
                cardDataKeys,
                'expected object to have properties: name, shortName, symbol, color, value and image'
              ).to.deep.eq([
                'name',
                'shortName',
                'symbol',
                'color',
                'value',
                'image',
                'hidden',
                'classname',
              ])

              expect(
                cardData.shortName,
                'expected to get a valid card'
              ).to.not.equal('00')

              // css position to index
              const position = cssPositionToIndex(
                $el[0].style.left,
                $el[0].style.top
              )

              tableau[position.x][position.y] = cardData
            })
        })
      })
      .then(() => {
        // play the game
        const board = {
          talon: talon,
          tableau: tableau,
          foundation: [[], [], [], []],
        } as Board

        const playedMoves: Move[] = []
        const resultsHistory: Result[] = []
        run_Random_Simulation(board, playedMoves, resultsHistory)
      })
  })
})
