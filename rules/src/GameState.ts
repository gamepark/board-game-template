import PlayerState from './PlayerState'

export default interface GameState {
  players: PlayerState[]
  round: number
  deck: number[]
}