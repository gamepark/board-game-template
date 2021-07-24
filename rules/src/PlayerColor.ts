import {isEnumValue} from '@gamepark/rules-api'

enum PlayerColor {
  Blue = 1, Red, Green, Yellow
}

export default PlayerColor

export const playerColors = Object.values(PlayerColor).filter(isEnumValue)
