/* global fetch */
import ndjsonStream from 'can-ndjson-stream'

const TOKEN = process.env.LICHESS_API_TOKEN

export function onGamePage (loc) {
  const { pathname } = loc
  return /\/\w{8}/.test(pathname)
}

export function getGameId (loc) {
  return loc.pathname.slice(1)
}

export async function getGameStream (gameId) {
  const response = await fetch(`https://lichess.org/api/board/game/stream/${gameId}`, {
    headers: {
      authorization: `Bearer ${TOKEN}`
    }
  })
  const jsonStream = ndjsonStream(response.body)
  return jsonStream.getReader()
}

export function getPieceElementByLocation (loc) {
  // TODO we need SQUARES not PIECES

  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Sharing_objects_with_page_scripts
  const doc = window.wrappedJSObject.document
  const pieces = [...doc.getElementsByTagName('piece')]
  const piece = pieces.find((el) => el.cgKey === loc)

  return piece
}

export function getTransformForLocation (loc, myColor) {
  // find the board
  const board = document.getElementsByTagName('cg-board')[0]
  if (!board) throw new Error('cant find the board!')

  // find the width
  const boardWidth = board.getBoundingClientRect().width
  const squareWidth = boardWidth / 8

  const [ltr, num] = loc.toLowerCase().split('')

  if (myColor === 'w') {
    // how far down from a8
    const down = 8 - parseInt(num, 10)

    // how far to the right of a8
    const right = ltr.charCodeAt(0) - 97

    return `translate(${right * squareWidth}px, ${down * squareWidth}px)`
  } else {
    // how far down from h1 
    const down = parseInt(num, 10) - 1

    // how far to the right of h1
    const right = Math.abs((ltr.charCodeAt(0) - 97) - 7)

    return `translate(${right * squareWidth}px, ${down * squareWidth}px)`
  }
}