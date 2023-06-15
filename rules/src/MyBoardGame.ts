import { MaterialRules } from '@gamepark/rules-api'
import { PlayerColor } from './PlayerColor'
import { MaterialType } from './material/MaterialType'
import { LocationType } from './material/LocationType'


/**
 * This class implements the rules of the board game.
 * It must follow Game Park "Rules" API so that the Game Park server can enforce the rules.
 */
export class MyBoardGame extends MaterialRules<PlayerColor, MaterialType, LocationType> {
  setup() {
  }

  get rules() {
    return {}
  }
}