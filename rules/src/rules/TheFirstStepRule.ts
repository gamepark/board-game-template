import { PlayerTurnRule } from '@gamepark/rules-api'

export class TheFirstStepRule extends PlayerTurnRule {
  getPlayerMoves() {
    return []
  }
}
