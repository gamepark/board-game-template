import GameState from '@gamepark/board-game-template/GameState'

type Props = {
  game: GameState
}

export default function GameDisplay({game}: Props) {
  return <div>{JSON.stringify(game)}</div>
}