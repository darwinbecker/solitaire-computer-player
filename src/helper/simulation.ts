import { Board, Node, Result } from '../lib/types'
import {
  getAllMovesFromTalon,
  getAllValidMoves,
  isLost,
  isWon,
  makeMove,
  makeMoveAndReveal,
  revealCard,
} from './board-functions'
import md5 from 'md5'

export const simulateGameAndGetMoves = (board: Board) => {
  let gameWon: boolean
  const playedMoves = []
  while (true) {
    const allMoves = getAllValidMoves(board)

    if (isLost(board)) {
      gameWon = false
      break
    }
    if (isWon(board)) {
      gameWon = true
      break
    }

    let aMove = allMoves[Math.floor(Math.random() * allMoves.length)]
    playedMoves.push(aMove)
    const movedboard = makeMove(board, aMove)
    board = revealCard(movedboard, aMove)
  }

  return { gameWon, playedMoves }
}

const simulateGame = (board: Board) => {
  let gameWon: boolean
  while (true) {
    const allMoves = getAllValidMoves(board)

    if (isLost(board)) {
      gameWon = false
      break
    }
    if (isWon(board)) {
      gameWon = true
      break
    }

    let aMove = allMoves[Math.floor(Math.random() * allMoves.length)]
    const movedboard = makeMove(board, aMove)
    board = revealCard(movedboard, aMove)
  }

  return gameWon
}

export const Random_Simulation = (initBoard: Board): Result => {
  const start = Date.now()
  const firstMoves = getAllValidMoves(structuredClone(initBoard))

  const firstNode = {
    id: 'first-' + md5(JSON.stringify(initBoard)),
    visits: 0,
    wins: 0,
    moveThatCreatedThisNode: null,
  } as Node

  const childNodes: Node[] = []
  firstMoves.forEach((move) => {
    const childBoard = makeMoveAndReveal(initBoard, move)

    // this is a workaround, so each childNode is unique
    childBoard.moveThatCreatedThisBoard = move

    const childNode = {
      id: md5(JSON.stringify(childBoard)),
      visits: 0,
      wins: 0,
      winnabilityPercentage: 0,
      moveThatCreatedThisNode: move,
    } as Node
    childNodes.push(childNode)
  })

  let simulationsCounter = 0
  const AMOUNT_OF_OVERALL_SIMULATIONS = childNodes.length * 1000

  while (simulationsCounter < AMOUNT_OF_OVERALL_SIMULATIONS) {
    const randomMove = firstMoves[Math.floor(Math.random() * firstMoves.length)]
    const startBoard = makeMoveAndReveal(structuredClone(initBoard), randomMove)

    // find according childNode
    const playedChildNode = childNodes.find((node) => {
      return node.moveThatCreatedThisNode.name === randomMove.name
    })
    firstNode.visits++
    playedChildNode.visits++

    const isWon = simulateGame(startBoard)
    if (isWon) {
      playedChildNode.wins++
      firstNode.wins++
    }
    simulationsCounter++
  }

  // calclulate winnability for parent node
  firstNode.winnabilityPercentage = (firstNode.wins / firstNode.visits) * 100

  // calculate winnability for each child node
  childNodes.forEach((node) => {
    node.winnabilityPercentage = (node.wins / node.visits) * 100
  })

  // find the node with the highest winnability
  const bestNode = childNodes.reduce((prev, current) => {
    return prev.winnabilityPercentage > current.winnabilityPercentage
      ? prev
      : current
  })

  // find the node with the lowest winnability
  const worstNode = childNodes.reduce((prev, current) => {
    return prev.winnabilityPercentage < current.winnabilityPercentage
      ? prev
      : current
  })

  const results = {
    nodes: {
      currentNode: firstNode,
      childNodes: childNodes,
      bestNode: bestNode,
      worstNode: worstNode,
    },
    wins: firstNode.wins,
    visits: firstNode.visits,
    bestWinnabilityPercentage: bestNode.winnabilityPercentage,
    worstWinnabilityPercentage: worstNode.winnabilityPercentage,
    bestMove: bestNode.moveThatCreatedThisNode,
    moves: firstMoves,
  } as Result

  // debug output
  const end = Date.now()
  const timeTaken = end - start
  console.log(`Execution time: ${timeTaken} ms`)

  return results
}

export const UCB1_Simulation = (initBoard: Board): Result => {
  const start = Date.now()

  let board = structuredClone(initBoard)
  const firstMoves = getAllValidMoves(board)

  // 1. selection phase
  const playedNodes: Node[] = []
  const firstNode = {
    id: 'first-' + md5(JSON.stringify(initBoard)),
    visits: 0,
    wins: 0,
    winnabilityPercentage: 0,
    moveThatCreatedThisNode: null,
  } as Node
  playedNodes.push(firstNode)

  const childNodes: Node[] = []
  firstMoves.forEach((move) => {
    const childBoard = makeMoveAndReveal(initBoard, move)

    // this is a workaround, so each childNode is unique
    childBoard.moveThatCreatedThisBoard = move

    const childNode = {
      id: md5(JSON.stringify(childBoard)),
      visits: 0,
      wins: 0,
      winnabilityPercentage: 0,
      moveThatCreatedThisNode: move,
    } as Node
    childNodes.push(childNode)
  })

  if (childNodes.length === 0) {
    console.log('no childNodes')
    return
  }

  let simulationsCounter = 0
  const AMOUNT_OF_OVERALL_SIMULATIONS = childNodes.length * 300

  // 2. expand phase
  // UCB1-formula: nodeWins/nodeVisits + c * sqrt(ln(overAllVisits)/nodeVisits)
  const c = 1.41
  while (simulationsCounter < AMOUNT_OF_OVERALL_SIMULATIONS) {
    const ucb1Values: number[] = []
    childNodes.forEach((node) => {
      if (node.visits === 0) {
        return ucb1Values.push(Infinity)
      }
      const ucb1Value =
        node.wins / node.visits +
        c * Math.sqrt(Math.log(simulationsCounter) / node.visits)
      ucb1Values.push(ucb1Value)
    })

    const maxUCB1Value = Math.max(...ucb1Values)
    const index = ucb1Values.indexOf(maxUCB1Value)
    const bestNode = childNodes[index]
    if (
      !playedNodes.find((node) => {
        node.id === bestNode.id
      })
    ) {
      playedNodes.push(bestNode)
    }

    board = makeMoveAndReveal(initBoard, bestNode.moveThatCreatedThisNode)

    // 3. rollout phase
    const isWon = simulateGame(board)

    // 4. backpropagation phase
    if (isWon) {
      playedNodes.forEach((node) => {
        node.visits++
        node.wins++
      })
    } else {
      playedNodes.forEach((node) => {
        node.visits++
      })
    }

    playedNodes.pop()

    simulationsCounter++
  }

  // calclulate winnability for parent node
  firstNode.winnabilityPercentage = (firstNode.wins / firstNode.visits) * 100

  // calclulate winnability for each child node
  childNodes.forEach((node) => {
    node.winnabilityPercentage = (node.wins / node.visits) * 100
  })

  if (firstNode.winnabilityPercentage === 0) {
    console.log('no winnable moves found')
  }

  // find the node with the highest winnability
  const bestNode = childNodes.reduce((prev, current) => {
    return prev.winnabilityPercentage > current.winnabilityPercentage
      ? prev
      : current
  })

  // find the node with the lowest winnability
  const worstNode = childNodes.reduce((prev, current) => {
    return prev.winnabilityPercentage < current.winnabilityPercentage
      ? prev
      : current
  })

  const results = {
    nodes: {
      currentNode: firstNode,
      childNodes: childNodes,
      bestNode: bestNode,
      worstNode: worstNode,
    },
    wins: firstNode.wins,
    visits: firstNode.visits,
    bestWinnabilityPercentage: bestNode.winnabilityPercentage,
    worstWinnabilityPercentage: worstNode.winnabilityPercentage,
    bestMove: bestNode.moveThatCreatedThisNode,
    moves: firstMoves,
  } as Result

  // debug output
  const end = Date.now()
  const timeTaken = end - start
  console.log(`Execution time: ${timeTaken} ms`)

  return results
}
