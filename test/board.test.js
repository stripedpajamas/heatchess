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
