import {Rules} from '@gamepark/rules-api'
import Game from './Game'
import Move from './moves/Move'
import {isGameOptions, MyBoardGameOptions} from './MyBoardGameOptions'
import Color from './Color'


/**
 * This class implements the rules of the board game.
 * It must follow Game Park "Rules" API so that the Game Park server can enforce the rules.
 */
export default class MyBoardGame extends Rules<Game, Move, Color> {
  /**
   * This constructor is called when the game "restarts" from a previously saved state.
   * @param state The state of the game
   */
  constructor(state: Game)
  /**
   * This constructor is called when a new game is created. If your game has options, or a variable number of players, it will be provided here.
   * @param options The options of the new game
   */
  constructor(options: MyBoardGameOptions)
  /**
   * In here you must code the construction of your class. Use a "typeguard" to distinguish a new game from a restored game.
   * @param arg The state of the game, or the options when starting a new game
   */
  constructor(arg: Game | MyBoardGameOptions) {
    if (isGameOptions(arg)) {
      const newGame = {players: arg.players, round: 1} // complete with everything you need when a new game starts
      super(newGame)
      // You can also play moves here if it is convenient: this.play(shuffleCards) It will alter the initial game state, it won't be in the game moves history.
    } else {
      super(arg)
    }
  }

  /**
   * Return the exhaustive list of moves that can be played.
   * This is used for 2 features:
   * - security (preventing unauthorized moves from being played);
   * - "Dummy players": when a player leaves a game, it is replaced by a "Dummy" that plays random moves, allowing the other players to finish the game.
   * If the game allows a very large (or infinite) number of moves, instead of implementing this method, you can implement instead:
   * - isLegal(move: Move):boolean, for security; and
   * - A class that implements "Dummy" to provide a custom Dummy player.
   */
  getLegalMoves(_playerId: Color): Move[] {
    return []
  }

  /**
   * This is the one and only play where you will update the game's state, depending on the move that has been played.
   *
   * @param move The move that should be applied to current state.
   */
  play(move: Move): void {
    /*switch (move.type) {
      case MoveType.SpendGold:
        return spendGold(this.state, move)
      case MoveType.DrawCard:
        return drawCard(this.state, move)
    }*/
    super.play(move)
  }

  /**
   * Here you can return the moves that should be automatically played when the game is in a specific state.
   * Here is an example from monopoly: you roll a dice, then move you pawn accordingly.
   * A first solution would be to do both state updates at once, in a "complex move" (RollDiceAndMovePawn).
   * However, this first solution won't allow you to animate step by step what happened: the roll, then the pawn movement.
   * "getAutomaticMoves" is the solution to trigger multiple moves in a single action, and still allow for step by step animations.
   * => in that case, "RollDice" could set "pawnMovement = x" somewhere in the game state. Then getAutomaticMove will return "MovePawn" when
   * "pawnMovement" is defined in the state.
   * Of course, you must return nothing once all the consequences triggered by a decision are completed.
   * VERY IMPORTANT: you should never change the game state in here. Indeed, getAutomaticMove will never be called in replays, for example.
   *
   * @return The next automatic consequence that should be played in current game state.
   */
  getAutomaticMoves(): Move[] {
    return super.getAutomaticMoves()
  }
}