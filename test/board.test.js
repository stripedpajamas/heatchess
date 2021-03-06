/* global test, expect */
import { Chess } from 'chess.js'
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
    actual.sort()

    expect(actual).toEqual(expected)
  }
})

test('squaresPieceCanAccess | pawn', () => {
  const expectations = [
    ['h2', 'w', ['g3']],
    ['e4', 'w', ['d5', 'f5']],
    ['a7', 'w', ['b8']],
    ['h2', 'b', ['g1']],
    ['e4', 'b', ['d3', 'f3']],
    ['a7', 'b', ['b6']]
  ]
  for (const [pawnLoc, color, expected] of expectations) {
    const actual = board.squaresPieceCanAccess('p', pawnLoc, color)
    actual.sort()

    expect(actual).toEqual(expected)
  }
})

test('squaresPieceCanAccess | rook', () => {
  const expectations = [
    [
      'd4',
      [],
      ['a4', 'b4', 'c4', 'd1', 'd2', 'd3', 'd5', 'd6', 'd7', 'd8', 'e4', 'f4', 'g4', 'h4']
    ],
    [
      'd4',
      ['b4'],
      ['b4', 'c4', 'd1', 'd2', 'd3', 'd5', 'd6', 'd7', 'd8', 'e4', 'f4', 'g4', 'h4']
    ],
    [
      'd4',
      ['b4', 'e4', 'e6'],
      ['b4', 'c4', 'd1', 'd2', 'd3', 'd5', 'd6', 'd7', 'd8', 'e4']
    ],
    [
      'h1',
      ['g1', 'h2'],
      ['g1', 'h2']
    ]
  ]
  for (const [rookLoc, otherPieceLocations, expected] of expectations) {
    const boardState = new Chess('') // completely blank board
    otherPieceLocations.forEach((loc) => boardState.put({ type: 'q', color: 'w' }, loc))

    const actual = board.squaresPieceCanAccess('r', rookLoc, 'w', boardState)
    actual.sort()

    expect(actual).toEqual(expected)
  }
})

test('squaresPieceCanAccess | bishop', () => {
  const expectations = [
    [
      'd3',
      [],
      ['a6', 'b1', 'b5', 'c2', 'c4', 'e2', 'e4', 'f1', 'f5', 'g6', 'h7']
    ],
    [
      'd3',
      ['c4'],
      ['b1', 'c2', 'c4', 'e2', 'e4', 'f1', 'f5', 'g6', 'h7']
    ],
    [
      'd3',
      ['c4', 'f3', 'f5'],
      ['b1', 'c2', 'c4', 'e2', 'e4', 'f1', 'f5']
    ]
  ]
  for (const [bishopLoc, otherPieceLocations, expected] of expectations) {
    const boardState = new Chess('') // completely blank board
    otherPieceLocations.forEach((loc) => boardState.put({ type: 'q', color: 'w' }, loc))

    const actual = board.squaresPieceCanAccess('b', bishopLoc, 'w', boardState)
    actual.sort()

    expect(actual).toEqual(expected)
  }
})

test('squaresPieceCanAccess | queen', () => {
  const expectations = [
    [
      'd3',
      [],
      ['a3', 'a6', 'b1', 'b3', 'b5', 'c2', 'c3', 'c4', 'd1', 'd2', 'd4', 'd5', 'd6', 'd7', 'd8', 'e2', 'e3', 'e4', 'f1', 'f3', 'f5', 'g3', 'g6', 'h3', 'h7']
    ],
    [
      'd3',
      ['d4'],
      ['a3', 'a6', 'b1', 'b3', 'b5', 'c2', 'c3', 'c4', 'd1', 'd2', 'd4', 'e2', 'e3', 'e4', 'f1', 'f3', 'f5', 'g3', 'g6', 'h3', 'h7']
    ],
    [
      'd3',
      ['d4', 'e4', 'f2'],
      ['a3', 'a6', 'b1', 'b3', 'b5', 'c2', 'c3', 'c4', 'd1', 'd2', 'd4', 'e2', 'e3', 'e4', 'f1', 'f3', 'g3', 'h3']
    ]
  ]
  for (const [queenLoc, otherPieceLocations, expected] of expectations) {
    const boardState = new Chess('') // completely blank board
    otherPieceLocations.forEach((loc) => boardState.put({ type: 'r', color: 'w' }, loc))

    const actual = board.squaresPieceCanAccess('q', queenLoc, 'w', boardState)
    actual.sort()

    expect(actual).toEqual(expected)
  }
})
