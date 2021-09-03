/** @jsxImportSource @emotion/react */
import GameView from '@gamepark/board-game-template/GameView'
import {getPlayerName} from '@gamepark/board-game-template/MyBoardGameOptions'
import {usePlayerId} from '@gamepark/react-client'
import {useTranslation} from 'react-i18next'

type Props = {
  loading: boolean
  game?: GameView
}

export default function HeaderText({loading}: Props) {
  const {t} = useTranslation()
  const playerId = usePlayerId()
  if (loading) return <>{t('Game loading...')}</>
  return <>Loaded! Now what? Your player id is {getPlayerName(playerId, t)}</>
}