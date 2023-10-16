import { MaterialGameSetup } from '@gamepark/rules-api'
import { GameTemplateOptions } from './GameTemplateOptions'
import { GameTemplateRules } from './GameTemplateRules'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PlayerColor } from './PlayerColor'
import { RuleId } from './rules/RuleId'

/**
 * This class creates a new Game based on the game options
 */
export class GameTemplateSetup extends MaterialGameSetup<PlayerColor, MaterialType, LocationType, GameTemplateOptions> {
  Rules = GameTemplateRules

  setupMaterial(_options: GameTemplateOptions) {
  }

  start() {
    this.startPlayerTurn(RuleId.PlayerTurn, this.game.players[0])
  }
}