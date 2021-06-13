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
