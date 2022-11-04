import {isEnumValue} from '@gamepark/rules-api'

enum Color {
  Blue = 1, Red, Green, Yellow
}

export default Color

export const playerColors = Object.values(Color).filter(isEnumValue)
