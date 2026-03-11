import { css } from '@emotion/react'
import { DevToolsHub, GameTable, GameTableNavigation } from '@gamepark/react-game'
import { PlayerPanels } from './panels/PlayerPanels'

export function GameDisplay() {
  const margin = { top: 7, left: 0, right: 30, bottom: 0 }
  return (
    <>
      <GameTable xMin={-50} xMax={50} yMin={-30} yMax={30} margin={margin} css={process.env.NODE_ENV === 'development' && tableBorder}>
        <GameTableNavigation />
        <PlayerPanels />
        {process.env.NODE_ENV === 'development' && <DevToolsHub />}
      </GameTable>
    </>
  )
}

const tableBorder = css`
  border: 1px solid white;
`
