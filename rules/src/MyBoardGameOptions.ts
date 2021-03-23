import {GameOptions, OptionsDescription, OptionType} from '@gamepark/rules-api'
import {TFunction} from 'i18next'
import GameState from './GameState'
import PlayerColor from './PlayerColor'

/**
 * This is the options for each players in the game.
 */
type MyBoardGamePlayerOptions = { id: PlayerColor }

/**
 * This is the type of object that the game receives when a new game is started.
 * The first generic parameter, "{}", can be changed to include game options like variants or expansions.
 */
export type MyBoardGameOptions = GameOptions<{}, MyBoardGamePlayerOptions>

/**
 * Typeguard to help Typescript distinguish between a GameState and new game's options, for you main class constructor.
 * @param arg GameState or Game options
 * @return true if arg is a Game options
 */
export function isGameOptions(arg: GameState | MyBoardGameOptions): arg is MyBoardGameOptions {
  return typeof (arg as GameState).deck === 'undefined'
}

/**
 * This object describes all the options a game can have, and will be used by GamePark website to create automatically forms for you game
 * (forms for friendly games, or forms for matchmaking preferences, for instance).
 */
export const MyBoardGameOptionsDescription: OptionsDescription<{}, MyBoardGamePlayerOptions> = {
  players: {
    id: {
      type: OptionType.LIST,
      getLabel: (t: TFunction) => t('Empire'),
      values: Object.values(PlayerColor),
      getValueLabel: (empire: PlayerColor, t: TFunction) => {
        switch (empire) {
          case PlayerColor.Red:
            return t('Red player')
          case PlayerColor.Blue:
            return t('Blue player')
          case PlayerColor.Green:
            return t('Green player')
          case PlayerColor.Yellow:
            return t('Yellow player')
        }
      }
    }
  }
}
