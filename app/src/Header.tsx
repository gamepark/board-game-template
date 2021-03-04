import GameState from '@gamepark/board-game-template/GameState'
import {useTranslation} from 'react-i18next'

type Props = {
  loading: boolean
  game?: GameState
}

export default function Header({loading, game}: Props) {
  const {t} = useTranslation()
  const text = loading ? t('Game loading…') : `Loaded! Now what? Your player id is ${game?.players[0].color}`
  return (
    <header>
      <h1>{text}</h1>
    </header>
  )
}