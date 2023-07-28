/** @jsxImportSource @emotion/react */
import { GameRules } from '@gamepark/game-template/GameRules'
import { GameOptionsSpec } from '@gamepark/game-template/GameOptions'
import { GameSetup } from '@gamepark/game-template/GameSetup'
import { GameProvider, MaterialGameAnimations, setupTranslation } from '@gamepark/react-game'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import translations from './translations.json'
import { Material } from './material/Material'
import { Locators } from './locators/Locators'

setupTranslation(translations, { debug: false })

ReactDOM.render(
  <StrictMode>
    <GameProvider game="game-template" Rules={GameRules} optionsSpec={GameOptionsSpec} GameSetup={GameSetup}
                  material={Material} locators={Locators} animations={new MaterialGameAnimations()}>
      <App/>
    </GameProvider>
  </StrictMode>,
  document.getElementById('root')
)
