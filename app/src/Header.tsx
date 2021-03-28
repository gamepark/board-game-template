/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import GameView from '@gamepark/board-game-template/GameView'
import {useTranslation} from 'react-i18next'

type Props = {
  loading: boolean
  game?: GameView
}

export default function Header({loading, game}: Props) {
  const {t} = useTranslation()
  const text = loading ? t('Game loading…') : `Loaded! Now what? Your player id is ${game?.players[0].color}`
  return (
    <header css={style}>
      <h1 css={titleStyle}>{text}</h1>
    </header>
  )
}

const style = css`
  position: absolute;
  display: flex;
  width: 100%;
  height: 7em;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
  transition: background-color 1s ease-in;
`

const titleStyle = css`
  flex-grow: 1;
  flex-shrink: 0;
  transition: color 1s ease-in;
  padding: 0.25em;
  margin: 0;
  line-height: 1.25;
  font-size: 4em;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`