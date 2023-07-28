import { MaterialGameSetup } from '@gamepark/rules-api'
import { PlayerColor } from './PlayerColor'
import { MaterialType } from './material/MaterialType'
import { LocationType } from './material/LocationType'
import { GameOptions } from './GameOptions'
import { RuleId } from './rules/RuleId'

/**
 * This class creates a new Game based on the game options
 */
export class GameSetup extends MaterialGameSetup<PlayerColor, MaterialType, LocationType, GameOptions> {
  setupMaterial(_options: GameOptions) {
  }

  start() {
    return { id: RuleId.PlayerTurn, player: this.game.players[0] }
  }
}