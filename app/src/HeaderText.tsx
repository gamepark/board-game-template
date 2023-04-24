/** @jsxImportSource @emotion/react */
import {getPlayerName} from '@gamepark/board-game-template/MyBoardGameOptions'
import {usePlayerId} from '@gamepark/react-client'
import {Trans, useTranslation} from 'react-i18next'
import Game from '@gamepark/board-game-template/Game'

type Props = {
  loading: boolean
  game?: Game
}

export default function HeaderText({loading}: Props) {
  const {t} = useTranslation()
  const playerId = usePlayerId()
  if (loading) return <>{t('Game loading...')}</>
  return <Trans defaults="Hello <0>{player}</0>" components={[<strong/>]} values={{player: getPlayerName(playerId, t)}}/>
}