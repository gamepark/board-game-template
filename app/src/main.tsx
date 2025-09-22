import { GameTemplateOptionsSpec } from '@gamepark/game-template/GameTemplateOptions'
import { GameTemplateRules } from '@gamepark/game-template/GameTemplateRules'
import { GameTemplateSetup } from '@gamepark/game-template/GameTemplateSetup'
import { GameProvider, setupTranslation } from '@gamepark/react-game'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { gameAnimations } from './animations/GameAnimations'
import { App } from './App'
import { Locators } from './locators/Locators'
import { Material } from './material/Material'
import translations from './translations.json'

setupTranslation(translations, { debug: false })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider
      game="game-template"
      Rules={GameTemplateRules}
      optionsSpec={GameTemplateOptionsSpec}
      GameSetup={GameTemplateSetup}
      material={Material}
      locators={Locators}
      animations={gameAnimations}
    >
      <App />
    </GameProvider>
  </StrictMode>
)
