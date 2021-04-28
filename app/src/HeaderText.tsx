/** @jsxImportSource @emotion/react */
import GameView from '@gamepark/board-game-template/GameView'
import {useTranslation} from 'react-i18next'

type Props = {
  loading: boolean
  game?: GameView
}

export default function HeaderText({loading, game}: Props) {
  const {t} = useTranslation()
  if (loading) return <>{t('Game loading...')}</>
  return <>Loaded! Now what? Your player id is {game?.players[0].color}</>
}