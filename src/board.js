// 2d representation of a chess board, used for naming the places a piece can access
const BOARD = [
  ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'],
  ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'],
  ['a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3'],
  ['a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4'],
  ['a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5'],
  ['a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6'],
  ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'],
  ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8']
]

export function * boardSquares () {
  for (const row of BOARD) {
    for (const square of row) {
      yield square
    }
  }
}

// returns row/col to the BOARD above given something like 'e4'
function locationToIdx (loc) {
  const [ltr, num] = loc.toLowerCase().split('')

  // vertical
  const row = parseInt(num, 10) - 1

  // horizontal
  const col = ltr.charCodeAt(0) - 97

  return [row, col]
}

export function getAllPieceLocations (boardState) {
  const b = []
  const w = []
  const output = { b, w }
  for (const row of BOARD) {
    for (const loc of row) {
      const piece = boardState.get(loc)
      if (piece) {
        output[piece.color].push({ location: loc, ...piece })
      }
    }
  }

  return output
}

// this function is talking about the squares the piece "attacks" or "defends"
// not the piece's legal moves; it does have to take into account
// that pieces may be blocking the path of the piece in question
export function squaresPieceCanAccess (pieceType, pieceLocation, pieceColor, boardState) {
  const [currentRow, currentCol] = locationToIdx(pieceLocation)
  switch (pieceType.toLowerCase()) {
    case 'k': {
      // the king's path can't be blocked since it's only one square in each
      // direction
      const squares = [
        [currentRow - 1, currentCol],
        [currentRow - 1, currentCol - 1],
        [currentRow - 1, currentCol + 1],
        [currentRow, currentCol - 1],
        [currentRow, currentCol + 1],
        [currentRow + 1, currentCol],
        [currentRow + 1, currentCol - 1],
        [currentRow + 1, currentCol + 1]
      ]

      return squares
        .filter(([r, c]) => r < 8 && r >= 0 && c < 8 && c >= 0)
        .map(([r, c]) => BOARD[r][c])
    }
    case 'q': {
      return squaresPieceCanAccess('b', pieceLocation, pieceColor, boardState)
        .concat(squaresPieceCanAccess('r', pieceLocation, pieceColor, boardState))
    }
    case 'b': {
      const squares = []

      // up and leftward movement
      for (let r = currentRow - 1, c = currentCol - 1; r >= 0 && c >= 0; r--, c--) {
        const candidateSquare = BOARD[r][c]
        squares.push(candidateSquare) // we can at least reach this square
        // but if there's something on this square, we can't go further
        if (boardState.get(candidateSquare)) break
      }
      // up and rightward movement
      for (let r = currentRow - 1, c = currentCol + 1; r >= 0 && c < 8; r--, c++) {
        const candidateSquare = BOARD[r][c]
        squares.push(candidateSquare)
        if (boardState.get(candidateSquare)) break
      }
      // down and leftward movement
      for (let r = currentRow + 1, c = currentCol - 1; r < 8 && c >= 0; r++, c--) {
        const candidateSquare = BOARD[r][c]
        squares.push(candidateSquare)
        if (boardState.get(candidateSquare)) break
      }
      // down and rightward movement
      for (let r = currentRow + 1, c = currentCol + 1; r < 8 && c < 8; r++, c++) {
        const candidateSquare = BOARD[r][c]
        squares.push(candidateSquare)
        if (boardState.get(candidateSquare)) break
      }

      return squares
    }
    case 'n': {
      // knights can't be blocked
      const squares = [
        [currentRow + 1, currentCol - 2],
        [currentRow + 2, currentCol - 1],
        [currentRow + 2, currentCol + 1],
        [currentRow + 1, currentCol + 2],
        [currentRow - 1, currentCol - 2],
        [currentRow - 2, currentCol - 1],
        [currentRow - 2, currentCol + 1],
        [currentRow - 1, currentCol + 2]
      ]

      return squares
        .filter(([r, c]) => r < 8 && r >= 0 && c < 8 && c >= 0)
        .map(([r, c]) => BOARD[r][c])
    }
    case 'r': {
      const squares = []

      // leftward horizontal movement
      for (let c = currentCol - 1; c >= 0; c--) {
        const candidateSquare = BOARD[currentRow][c]
        squares.push(candidateSquare) // we can at least reach this square
        // but if there's something on this square, we can't go further
        if (boardState.get(candidateSquare)) break
      }
      // rightward horizontal movement
      for (let c = currentCol + 1; c < 8; c++) {
        const candidateSquare = BOARD[currentRow][c]
        squares.push(candidateSquare)
        if (boardState.get(candidateSquare)) break
      }
      // upward movement
      for (let r = currentRow + 1; r < 8; r++) {
        const candidateSquare = BOARD[r][currentCol]
        squares.push(candidateSquare)
        if (boardState.get(candidateSquare)) break
      }
      // downward movement
      for (let r = currentRow - 1; r >= 0; r--) {
        const candidateSquare = BOARD[r][currentCol]
        squares.push(candidateSquare)
        if (boardState.get(candidateSquare)) break
      }

      return squares
    }
    case 'p': {
      // pawns cover their two upper diagonals, and that attack can't be blocked
      // we assume we'll never be asked about an invalidly placed pawn, like on the 8th rank
      // also the direction is flipped depending on the color
      const squares = pieceColor === 'w'
        ? [
            [currentRow + 1, currentCol - 1],
            [currentRow + 1, currentCol + 1]
          ]
        : [
            [currentRow - 1, currentCol - 1],
            [currentRow - 1, currentCol + 1]
          ]

      return squares
        .filter(([r, c]) => r < 8 && r >= 0 && c < 8 && c >= 0)
        .map(([r, c]) => BOARD[r][c])
    }
    default: {
      throw new Error('unrecognized piece type')
    }
  }
}
