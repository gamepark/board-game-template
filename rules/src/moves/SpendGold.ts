import GameState from '../GameState'
import GameView from '../GameView'
import PlayerColor from '../PlayerColor'
import MoveType from './MoveType'

/**
 * An example of a simple move: one player returns a quantity of gold to the bank
 */
type SpendGold = {
  type: MoveType.SpendGold
  playerId: PlayerColor
  quantity: number
}

export default SpendGold

export function spendGold(state: GameState | GameView, move: SpendGold) {
  console.log(`${move.playerId} is spending ${move.quantity} gold in this game: ${state}`)
  /**
   * For example:
   * const player = state.players.find(player => player.id === move.playerId)
   * if (!player) return console.error(`Unexpected player id: ${move.playerId} inside ${state}`)
   * player.gold -= move.quantity
  */
}