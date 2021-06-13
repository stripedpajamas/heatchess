import * as lichess from './lichess'
import { boardSquares, getAllPieceLocations, squaresPieceCanAccess } from './board'
import { Chess } from 'chess.js'

const swapColor = (c) => c === 'b' ? 'w' : 'b'

function uncolorSquare (squareLoc) {
  const el = lichess.getPieceElementByLocation(squareLoc)

  // currently this only works with pieces; need to figure out how to color squares
  if (el) {
    el.style.boxShadow = ''
  }
}

function colorSquare (squareLoc, severity) {
  const el = lichess.getPieceElementByLocation(squareLoc)

  // currently this only works with pieces; need to figure out how to color squares
  if (el) {
    let borders = Math.abs(severity * 5)
    let color = severity > 0
      ? 'rgba(255, 0, 0, 0.5'
      : 'rgba(0, 255, 0, 0.5'

    if (severity === 0) {
      borders = '5'
      color = 'rgba(255, 255, 0, 0.5)'
    }
    const boxShadow = `inset 0 0 0 ${borders}px ${color}`
    el.style.boxShadow = boxShadow
  }
}

async function updateBoardHeatmap (boardState, myColor) {
  const heatmap = new Map()
  const pieces = getAllPieceLocations(boardState)

  const theirPieces = pieces[swapColor(myColor)]
  const myPieces = pieces[myColor]

  for (const piece of theirPieces) {
    const squares = squaresPieceCanAccess(piece.type, piece.location, piece.color, boardState)
    for (const square of squares) {
      heatmap.set(square, (heatmap.get(square) || 0) + 1)
    }
  }

  for (const piece of myPieces) {
    const squares = squaresPieceCanAccess(piece.type, piece.location, piece.color, boardState)
    for (const square of squares) {
      heatmap.set(square, (heatmap.get(square) || 0) - 1)
    }
  }

  for (const [square, heat] of heatmap.entries()) {
    colorSquare(square, heat)
  }

  // there are squares that no piece can access; we will want to reset
  // the dom manipulations on pieces that move into those safe squares
  for (const square of boardSquares()) {
    if (!heatmap.has(square)) uncolorSquare(square)
  }
}

async function main () {
  console.log('Heatchess initializing...')

  if (!lichess.onGamePage(window.location)) {
    return
  }

  const gameId = lichess.getGameId(window.location)
  console.log('On game page:', gameId)

  try {
    // start streaming the game state
    const stream = await lichess.getGameStream(gameId)
    let chunk = await stream.read()

    if (chunk.done) {
      console.error('Expected first message to contain game info', chunk)
      throw new Error('Expected first message to contain game state')
    }

    const { initialFen, state, black } = chunk.value

    // TODO make this configurable
    const myColor = black.id === process.env.LICHESS_USERNAME ? 'b' : 'w'
    console.log(`You are playing the ${myColor === 'b' ? 'black' : 'white'} pieces`)

    const boardState = new Chess(initialFen === 'startpos' ? undefined : initialFen)

    // apply whatever moves are in the initial chunk
    state.moves.split(' ').filter(Boolean).forEach((move) => {
      boardState.move(move, { sloppy: true })
      updateBoardHeatmap(boardState, myColor)
    })

    console.log(boardState.ascii())
    while (true) {
      chunk = await stream.read()
      if (chunk.done) break

      // apply the last move from the chunk's game state to our board state
      const lastMove = chunk.value.moves.split(' ').pop()
      boardState.move(lastMove, { sloppy: true })

      updateBoardHeatmap(boardState, myColor)
      console.log(boardState.ascii())
    }
  } catch (e) {
    console.error(e)
  }
}

main()
