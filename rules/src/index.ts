import {SequentialGame} from '@gamepark/rules-api'
import GameState from './GameState'
import Move from './moves/Move'
import MoveType from './moves/MoveType'
import PlayerColor from './PlayerColor'

export default class MyBoardGame extends SequentialGame<GameState, Move, PlayerColor> {
  constructor() // new game
  constructor(state: GameState) // from saved state
  constructor(arg?: GameState) {
    if (arg) {
      super(arg)
    } else {
      super({players: [{color: PlayerColor.Blue}, {color: PlayerColor.Red}], round: 1, deck: []})
    }
  }

  getPlayerIds(): PlayerColor[] {
    return this.state.players.map(player => player.color)
  }

  getActivePlayer(): PlayerColor | undefined {
    return undefined // Undefined = end of the game. Return the id of current active player depending on this.state otherwise
  }

  getLegalMoves(): Move[] {
    return [{type: MoveType.DoStuff}] // return all the moves that active player is allowed to play depending on current this.state
  }

  play(move: Move): void {
    // Here change this.state based on what move is being applied
    console.log(move)
  }
}