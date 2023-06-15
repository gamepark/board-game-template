import { isEnumValue } from '@gamepark/rules-api'

export enum PlayerColor {
  Blue = 1, Red, Green, Yellow
}

export const playerColors = Object.values(PlayerColor).filter(isEnumValue)
