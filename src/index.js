import * as lichess from './lichess'
import { Chess } from 'chess.js'

const swapColor = (c) => c === 'b' ? 'w' : 'b'

async function updateBoardHeatmap (boardState, myColor) {
  // TODO
  //  - create map of all the squares their pieces can attack,
  //    incrementing a counter for each piece that can attack the square
  //  - do the same for my pieces but decrement the counter
  //  - use the resulting map to modify squares on the DOM (apply some CSS
  //    that can get more severe by degrees, like darker reds or something)
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
