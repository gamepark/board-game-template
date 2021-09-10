/** @jsxImportSource @emotion/react */
import GameView from '@gamepark/board-game-template/GameView'
import {FailuresDialog, FullscreenDialog, Menu, useGame} from '@gamepark/react-client'
import {Header, ImagesLoader, LoadingScreen} from '@gamepark/react-components'
import {useEffect, useState} from 'react'
import {DndProvider} from 'react-dnd-multi-backend'
import HTML5ToTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch'
import GameDisplay from './GameDisplay'
import HeaderText from './HeaderText'
import box from './box.png'
import Images from './images/Images'

export default function App() {
  const game = useGame<GameView>()
  const [imagesLoading, setImagesLoading] = useState(true)
  const [isJustDisplayed, setJustDisplayed] = useState(true)
  useEffect(() => {
    setTimeout(() => setJustDisplayed(false), 2000)
  }, [])
  const loading = !game || imagesLoading || isJustDisplayed
  return (
    <DndProvider options={HTML5ToTouch}>
      {game && <GameDisplay game={game}/>}
      <LoadingScreen display={loading} gameBox={box} author="Someone" artist="Somebody" publisher="Nobody" developer="You"/>
      <Header><HeaderText loading={loading} game={game}/></Header>
      <Menu/>
      <FailuresDialog/>
      <FullscreenDialog/>
      <ImagesLoader images={Object.values(Images)} onImagesLoad={() => setImagesLoading(false)}/>
    </DndProvider>
  )
}