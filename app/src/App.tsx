import GameState from '@gamepark/board-game-template/GameState'
import {useGame} from '@gamepark/react-client'
import {useEffect, useState} from 'react'
import {DndProvider} from 'react-dnd-multi-backend'
import HTML5ToTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch'
import GameDisplay from './GameDisplay'
import Header from './Header'

export default function App() {
  const game = useGame<GameState>()
  const [isJustDisplayed, setJustDisplayed] = useState(true)
  useEffect(() => {
    setTimeout(() => setJustDisplayed(false), 2000)
  }, [])
  const loading = !game || isJustDisplayed
  return (
    <DndProvider options={HTML5ToTouch}>
      {game && <GameDisplay game={game}/>}
      <Header loading={loading} game={game}/>
    </DndProvider>
  )
}