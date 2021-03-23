import GameState from '../GameState'
import GameView from '../GameView'
import PlayerColor from '../PlayerColor'
import MoveType from './MoveType'

/**
 * Here is a example a of move involving hidden information
 * On the backend side, there is no need to put the card inside the move. We know what it will be (first card on top of the deck)
 */
type DrawCard = {
  type: MoveType.DrawCard
  playerId: PlayerColor
}

export default DrawCard

/**
 * On the frontend side, the player that draws need to know what it is. For him, we need a "move view" that includes the id of the card that was drawn
 */
export type DrawCardView = DrawCard & {
  card: number
}

export function isDrawCardView(move: DrawCard | DrawCardView): move is DrawCardView {
  return (move as DrawCardView).card !== undefined
}

export function drawCard(state: GameState, move: DrawCard) {
  console.log(`${move.playerId} is drawing a card in ${state}`)
  /* That's executed on backend side. Example:
  const player = state.players.find(player => player.id === move.playerId)
  if (!player) return console.error(`Unexpected player id: ${move.playerId} inside ${state}`)
  player.hand.push(game.deck.shift())
   */
}

export function drawCardInView(state: GameView, move: DrawCard) {
  console.log(`${move.playerId} is drawing a card in ${state}`)
  /* That's executed on frontend side, for other viewers than the player which draws the card. Example:
  const player = state.players.find(player => player.id === move.playerId)
  if (!player) return console.error(`Unexpected player id: ${move.playerId} inside ${state}`)
  player.hand++
  game.deck--
   */
}

export function drawCardInPlayerView(state: GameView, move: DrawCard) {
  console.log(`${move.playerId} is drawing a card in ${state}`)
  /* That's executed on frontend side, for the player which draws the card. Example:
  const player = state.players.find(player => player.id === move.playerId)
  if (!player) return console.error(`Unexpected player id: ${move.playerId} inside ${state}`)
  player.hand.push(move.card)
  game.deck--
   */
}