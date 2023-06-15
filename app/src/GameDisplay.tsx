/** @jsxImportSource @emotion/react */
import { GameTable } from '@gamepark/react-game'
import { PlayerPanels } from './panels/PlayerPanels'

export default function GameDisplay() {
  return <>
    <GameTable xMin={-50} xMax={50} yMin={-30} yMax={30}
               zoomMin={1.5} zoomMax={4} margin={{ top: 7, left: 0, right: 20, bottom: 0 }}/>
    <PlayerPanels/>
  </>
}
