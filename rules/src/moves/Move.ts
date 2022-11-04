/**
 * A Move in a game is an operation that change the state of the game.
 * The moves are serialized using JSON, so you must use plain objects (or strings).
 * The moves are saved in the database, so you must keep them as light as you can.
 * Finally, the moves are used to animate the game on the front end. It is highly recommended to create very small moves,
 * each representing a simple move of material, or a simple change in the state of the game (change game phase, change active player...)
 *
 * Recommended structure: Move = Move1 | Move2 | Move3... Each move as a type, using an enum, so that each move type can easily be identified.
 */
type Move = any // replace by: MoveCard | ShuffleCards | AddGold ...

export default Move