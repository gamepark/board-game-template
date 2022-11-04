import Player from './Player'

/**
 * This type describe the data structure representing the state of a game, in the database
 */
type Game = {
  players: Player[]
  round: number // example
  /*
  phase: Phase
  cards: Card[]
  ...
  */
}

export default Game