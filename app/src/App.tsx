/** @jsxImportSource @emotion/react */
import { FailuresDialog, FullscreenDialog, LoadingScreen, MaterialHeader, Menu, useGame } from '@gamepark/react-game'
import { useEffect, useState } from 'react'
import GameDisplay from './GameDisplay'
import { MaterialGame } from '@gamepark/rules-api'
import { RuleId } from '@gamepark/board-game-template/rules/RuleId'
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import { GameOverHeader } from './headers/GameOverHeader'

export default function App() {
  const game = useGame<MaterialGame>()
  const [isJustDisplayed, setJustDisplayed] = useState(true)
  useEffect(() => {
    setTimeout(() => setJustDisplayed(false), 2000)
  }, [])
  const loading = !game || isJustDisplayed
  return (
    <>
      {!loading && <GameDisplay/>}
      <LoadingScreen display={loading} author="Someone" artist="Somebody" publisher="Nobody" developer="You"/>
      <MaterialHeader rulesStepsHeaders={RulesHeaders} GameOver={GameOverHeader}/>
      <Menu/>
      <FailuresDialog/>
      <FullscreenDialog/>
    </>
  )
}

const RulesHeaders: Record<RuleId, () => ReactJSXElement> = {
}