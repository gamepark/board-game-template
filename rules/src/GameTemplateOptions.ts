import { getEnumValues, OptionsSpec } from '@gamepark/rules-api'
import { PlayerColor } from './PlayerColor'

/**
 * This is the options for each player in the game.
 */
type PlayerOptions = { id: PlayerColor }

/**
 * This is the type of object that the game receives when a new game is started.
 * The first generic parameter, "{}", can be changed to include game options like variants or expansions.
 */
export type GameTemplateOptions = {
  players: PlayerOptions[]
}

/**
 * This object describes all the options a game can have, and will be used by GamePark website to create automatically forms for you game
 * (forms for friendly games, or forms for matchmaking preferences, for instance).
 */
export const GameTemplateOptionsSpec: OptionsSpec<GameTemplateOptions> = {
  players: {
    id: {
      label: (t) => t('player.id'),
      values: getEnumValues(PlayerColor),
      valueSpec: (id) => ({ label: (t) => t(`player.${id}`) })
    }
  }
}
