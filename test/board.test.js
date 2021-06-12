/* global test, expect */
import * as board from '../src/board'

test('squaresPieceCanAccess | king', () => {
  const expectations = [
    ['h1', ['g1', 'g2', 'h2']],
    ['e4', ['d3', 'd4', 'd5', 'e3', 'e5', 'f3', 'f4', 'f5']],
    ['b8', ['a7', 'a8', 'b7', 'c7', 'c8']]
  ]
  for (const [kingLoc, expected] of expectations) {
    const actual = board.squaresPieceCanAccess('k', kingLoc)
    // don't care about actual order, so sorting before asserting
    actual.sort()

    expect(actual).toEqual(expected)
  }
})

test('squaresPieceCanAccess | knight', () => {
  const expectations = [
    ['a1', ['b3', 'c2']],
    ['e4', ['c3', 'c5', 'd2', 'd6', 'f2', 'f6', 'g3', 'g5']],
    ['g7', ['e6', 'e8', 'f5', 'h5']]
  ]
  for (const [knightLoc, expected] of expectations) {
    const actual = board.squaresPieceCanAccess('n', knightLoc)
    // don't care about actual order, so sorting before asserting
    actual.sort()

    expect(actual).toEqual(expected)
  }
})
