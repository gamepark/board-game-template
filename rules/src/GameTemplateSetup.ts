import { MaterialGameSetup } from '@gamepark/rules-api'
import { GameTemplateOptions } from './GameTemplateOptions'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PlayerColor } from './PlayerColor'
import { RuleId } from './rules/RuleId'

/**
 * This class creates a new Game based on the game options
 */
export class GameTemplateSetup extends MaterialGameSetup<PlayerColor, MaterialType, LocationType, GameTemplateOptions> {
  setupMaterial(_options: GameTemplateOptions) {
  }

  start() {
    return { id: RuleId.PlayerTurn, player: this.game.players[0] }
  }
}