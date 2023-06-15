import { ItemLocator } from '@gamepark/react-game'
import { PlayerColor } from '@gamepark/board-game-template/PlayerColor'
import { MaterialType } from '@gamepark/board-game-template/material/MaterialType'
import { LocationType } from '@gamepark/board-game-template/material/LocationType'

export const Locators: Record<LocationType, ItemLocator<PlayerColor, MaterialType, LocationType>> = {}
