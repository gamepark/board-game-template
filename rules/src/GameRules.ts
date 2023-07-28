import { MaterialRules } from '@gamepark/rules-api'
import { PlayerColor } from './PlayerColor'
import { MaterialType } from './material/MaterialType'
import { LocationType } from './material/LocationType'
import { RuleId } from './rules/RuleId'
import { PlayerTurn } from './rules/PlayerTurn'


/**
 * This class implements the rules of the board game.
 * It must follow Game Park "Rules" API so that the Game Park server can enforce the rules.
 */
export class GameRules extends MaterialRules<PlayerColor, MaterialType, LocationType> {
  rules = {
    [RuleId.PlayerTurn]: PlayerTurn
  }
}