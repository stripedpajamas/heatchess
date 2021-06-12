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

// returns row/col to the BOARD above given something like 'e4'
function locationToIdx (loc) {
  const [ltr, num] = loc.toLowerCase().split('')

  // vertical
  const row = parseInt(num, 10) - 1

  // horizontal
  const col = ltr.charCodeAt(0) - 97

  return [row, col]
}

// this function is talking about the squares the piece "attacks" or "defends"
// not the piece's legal moves; it does have to take into account
// that pieces may be blocking the path of the piece in question
export function squaresPieceCanAccess (pieceType, pieceLocation, boardState) {
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
      break
    }
    case 'b': {
      break
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
      break
    }
    case 'p': {
      // pawns cover their two upper diagonals, and that attack can't be blocked
      // we assume we'll never be asked about an invalidly placed pawn, like on the 8th rank
      const squares = [
        [currentRow + 1, currentCol - 1],
        [currentRow + 1, currentCol + 1]
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
